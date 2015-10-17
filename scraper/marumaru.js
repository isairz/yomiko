'use strict';
var cheerio = require('cheerio');
var request = require('request');

var async = require('async');
var archiver = require('archiver');
var path = require('path');
var url = require('url');

var config;

try {
  config = require('../config.json');
} catch (e) {
  console.log(e);
  console.warn("config isn't exist.\nRunning as default settings");
  config = require('../config.sample.json');
}

var marumaru = module.exports = {};

var req = function () {
  var jar = request.jar();
  var requestBase = request.defaults({
    jar: jar,
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5'
    }
  });
  var requestLogin = request.defaults({
    jar: jar,
    headers: {
      'Referer': 'http://www.mangaumaru.com/archives/114053',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
      'Origin': 'http://www.mangaumaru.com'
    }
  });

  var _req = function (url, callback) {
    function tryRequest(url, callback) {
      var getOrPost = url.indexOf('http://www.mangaumaru.com/archives/') == 0 ? requestBase.post : requestBase;
      getOrPost(url, function(err, res, body) {
        if (err) {
          callback(err, res, body);
        } else if (body.indexOf('document.cookie=\'sucuri_uidc=') != -1) {
          // sucuri ddos protector
          var cookieRegex = /document\.cookie\.indexOf\('(sucuri_uidc=\w+)'\)/.exec(body);
          jar.setCookie(cookieRegex[1], url);
          tryRequest(url, callback);
        } else if (body.indexOf('http://www.mangaumaru.com/wp-login.php?action=postpass') != -1) {
          // login for protected manga.
          _req.login(function (err){
            if (err) {
              callback(err);
              return;
            }
            tryRequest(url, callback);
          })
        } else {
          callback(err, res, body);
        }
      });
    }

    tryRequest(url, callback);
  }

  var loginTryedTime;
  _req.login = function(callback) {
    if (loginTryedTime && new Date().getTime() - loginTryedTime <= 120000) {
      // Because of sucuri brute-force protector, retrying could cause ip ban. (30 times for 1 hour)
      console.error('Login Failed!');
      var e = new Error('Login Failed!');
      callback(e);
      return;
    }

    loginTryedTime = new Date().getTime();
    console.log('Login Try!');
    requestLogin.post(
      'http://www.mangaumaru.com/wp-login.php?action=postpass',
      {form: {post_password: config.wp_password, Submit: 'Submit'}},
      callback
    );
  }

  _req.requestBase = requestBase;

  return _req;
}();

var scrapers = [
  function ($, callback) {
    var list = $('.widget_review01');
    if (!list.length) {
      callback(undefined);
      return;
    }
    callback({
      type: 'manga list',
      title: 'marumaru',
      data: [].map.call(list.find('li'), function (li) {
        var link = 'http://marumaru.in' + $(li).find('a').attr('href');

        return {
          thumbnail: $(li).find('img').attr('data-original'),
          title: $(li).text().trim(),
          link: link
        };
      })
    })
  },
  function ($, callback) {
    var content = $('#vContent');
    if (!content.length) {
      callback(undefined);
      return;
    }
    // manipulate
    content.children('.tag').remove();
    content.children('.attach').remove();
    content.children('.center').remove();
    content.children('.snsbox').remove();
    content.children().last().remove();
    content.children().last().remove();
    content.children().last().remove();
    content.children().last().remove();

    // FIXME: thumbnail.
    var image = content.find('img')[0];
    var thumbnail = image ? image.attribs['src'] : '';

    callback({
      type: 'list',
      title: '[' + $("head meta[name=classification]").attr('content') + '] ' + $("head meta[name=subject]").attr('content'),
      data: [].map.call(content.find('a'), function (link) {
        return {
          thumbnail: thumbnail,
          title: $(link).text().trim(),
          link: $(link).attr('href')
        }
      }).filter(function (episode) { return episode.title; }).reverse()
    });
  },
  function ($, callback) {
    var articles = $('#post_list2 article');
    if (!articles.length) {
      callback(undefined);
      return;
    }
    var data = [].map.call(articles, function (article) {
      var ar = $(article);
      return {
        thumbnail: ar.find('img').attr('src'),
        title: ar.find('.entry-title').text().trim(),
        link: ar.find('a').attr('href')
      }
    }).filter(function (episode) { return episode.title; })

    var prev = $('.prev.page-numbers').attr('href');
    var next = $('.next.page-numbers').attr('href');

    if (prev) {
      data.push({
        title: 'Prev Page',
        link: prev
      });
    }
    if (next) {
      data.push({
        title: 'Next Page',
        link: next
      });
    }

    callback({
      type: 'list',
      title: $("head title").text().trim(),
      data: data
    });
  },
  function ($, callback) {
    var content = $('article .post_content p');
    if (!content.length) {
      callback(undefined);
      return;
    }
    // FIXME: thumbnail.
    var image = content.find('img')[0];
    var thumbnail = image ? image.attribs['src'] : '';

    callback({
      type: 'list',
      title: $("article #post_title").text(),
      data: [].map.call(content.find('a'), function (link) {
        return {
          thumbnail: thumbnail,
          title: $(link).text().trim(),
          link: $(link).attr('href')
        }
      }).filter(function (episode) { return episode.title; })
    });
  },
  function ($, callback) {
    var content = $('article p');
    if (!content.length) {
      callback(undefined);
      return;
    }

    callback({
      type: 'manga',
      title: $('#content .entry-title').text().trim(),
      images: [].map.call(content.find('img'), function (img) {
        var parent = $(img).parent().get(0);
        return parent.name === 'a' && parent.attribs['href'].indexOf('imgur.com/') === -1 ? parent.attribs['href']
          : img.attribs['data-lazy-src'] || img.attribs['src'];
        })
    });
  }
];

function resolveLinks(baseUri, data) {
  if (data.type === 'link') {
    [].map.call(data.data, function (linkInfo) {
      linkInfo.link = url.resolve(baseUri, linkInfo.link);
      return linkInfo;
    });
  }
  return data;
}


marumaru.scrap = function (link, callback) {
  var cachedData = cachedPage(link);
  if (cachedData) {
    callback(cachedData);
    return;
  }

  link = decodeURIComponent(link);
  link = link.replace("www.umaumaru.com", "www.mangaumaru.com");
  req(link, function (err, res, body) {
    if (err) {
      callback({
        type: 'error',
        message: 'Cannot read page. Maybe wrong URL.'
      });
      return;
    }
    var $ = cheerio.load(body);
    function next(idx) {
      scrapers[idx]($, function (result) {
        if (result === undefined) {
          if (idx+1 < scrapers.length) {
            next(idx+1);
          } else {
            callback({
              type: 'error',
              message: 'Cannot parse page.'
            });
          }
        } else {
          callback(resolveLinks(link, result));
        }
      });
    }
    next(0);
  });
};

var cachedUrl = 'http://marumaru.in/p/mobilemangamain';
var cachedData;
var cachedTime;

function cachedPage(link) {
  if (link !== cachedUrl) {
    return;
  }

  if (!cachedData) {
    return;
  }

  return cachedData;
}

function cachePage() {
  marumaru.scrap(cachedUrl, function (data) {
    cachedTime = new Date().getTime();
    cachedData = data;
  });
}

cachePage();
setInterval(cachePage, 1200000); // for 20min


marumaru.episodeToZip = function (link, callback) {
  var archive = archiver('zip');
  marumaru.scrap(link, function(episode) {
    var images = episode.images;
    var pageLength = images.length.toString().length;
    var padZeros = function (idx) {
      var str = idx.toString();
      return str.length < pageLength ? padZeros("0" + str) : str;
    }
    var dirName = function (str) {
      return str
        .replace(/</g, '〈')
        .replace(/>/g, '〉')
        .replace(/\?/g, '？')
        .replace(/!/g, '！')
        .replace(/\"/g, '＂')
        .replace(/\'/g, '＇')
        .replace(/\*/g, '＊')
        .replace(/:/g, '：')
        .replace(/\//g, '／')
        .replace(/\\/g, '＼');
    }

    for(var i in images) {
      var imageStream = req.requestBase({url: images[i], encoding: null})
        .on('error', function (err) {
          archive.abort();
          archive.emit('error', err);
        });
      archive.append(imageStream, { name: padZeros(-~i) + path.extname(images[i]).split('?')[0] });
    }
    archive.finalize();
    callback(dirName(episode.title || encodeURIComponent(link)) + '.zip', archive);
  });
  return this;
}
