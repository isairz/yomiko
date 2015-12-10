'use strict';
var cheerio = require('cheerio');
var request = require('request');

var async = require('async');
var archiver = require('archiver');
var path = require('path');
var url = require('url');
var vm = require('vm');

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
      requestBase(url, function(err, res, body) {
        if (err) {
          callback(err, res, body);
        } else if (body.indexOf('document.cookie=\'sucuri_uidc=') != -1) {
          // sucuri ddos protector
          var cookieRegex = /document\.cookie\.indexOf\('(sucuri_uidc=\w+)'\)/.exec(body);
          jar.setCookie(cookieRegex[1], url);
          tryRequest(url, callback);
        } else if (body.indexOf('sucuri_cloudproxy_js=') != -1) {
          // sucuri ddos protector
          var script = /<script>([\s\S]*?)<\/script>/.exec(body)[1];
          var sandbox = {
            document: {},
            location: {reload: function() {}},
          };

          var script = vm.runInNewContext(script, sandbox);
          jar.setCookie(sandbox.document.cookie, url);
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
      {form: {post_password: 'qndxkr', Submit: 'Submit'}},
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
      list: [].map.call(list.find('li'), function (li) {
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
    var list = $('#gall_ul');
    if (!list.length) {
      callback(undefined);
      return;
    }

    list.children().first().remove(); // Remove Notice

    callback({
      type: 'manga list',
      // FIXME: cheerio bug https://github.com/w3c/specberus/pull/278
      // title: '미니툰 - ' + $('#container_title').text().trim(),
      title: '미니툰 - ' + $('h2').eq(2).text().trim(),
      list: [].map.call(list.find('.gall_li'), function (li) {
        return {
          thumbnail: $(li).find('img').attr('src'),
          title: $(li).text().trim(),
          link: $(li).find('a').attr('href'),
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
      list: [].map.call(content.find('a'), function (link) {
        return {
          thumbnail: thumbnail,
          title: $(link).text().trim(),
          link: $(link).attr('href')
        }
      }).filter(function (episode) { return episode.title; }).reverse()
    });
  },
  function ($, callback) {
    var content = $('#bo_v_atc');
    if (!content.length) {
      callback(undefined);
      return;
    }

    // FIXME: thumbnail.
    var image = content.find('img')[0];
    var thumbnail = image ? image.attribs['src'] : '';

    callback({
      type: 'list',
      title: $('article > header').first().text().trim(),
      list: [].map.call(content.find('a'), function (link) {
        return {
          thumbnail: thumbnail,
          title: $(link).text().trim(),
          link: $(link).attr('href')
        }
      }).filter(function (episode) { return episode.title; }).reverse()
    });
  },
  function ($, callback) {
    // http://marumaru.in/?m=bbs&bid=mangaup&sort=gid&p=
    var articles = $('#bbslist .list').not('.notice');
    if (!articles.length) {
      callback(undefined);
      return;
    }
    var list = [].map.call(articles, function (article) {
      var ar = $(article);
      return {
        thumbnail: ar.find('.image-thumb').css('background-image').replace(/^url\((.+)\)/, '$1'),
        title: ar.find('.subject').text().trim(),
        link: ar.attr('onclick').replace(/goHref\(\'(.+)\'\);/, '$1'),
      }
    }).filter(function (episode) { return episode.title; })

    var prev = $('.page .selected').prev().prev('.notselected').attr('href');
    var next = $('.page .selected').next().next('.notselected').attr('href');

    if (prev) {
      list.push({
        title: 'Prev Page',
        link: prev
      });
    }
    if (next) {
      list.push({
        title: 'Next Page',
        link: next
      });
    }

    callback({
      type: 'list',
      title: $("head title").text().trim(),
      list: list
    });
  },
  function ($, callback) {
    var articles = $('#post_list2 article');
    if (!articles.length) {
      callback(undefined);
      return;
    }
    var list = [].map.call(articles, function (article) {
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
      list.push({
        title: 'Prev Page',
        link: prev
      });
    }
    if (next) {
      list.push({
        title: 'Next Page',
        link: next
      });
    }

    callback({
      type: 'list',
      title: $("head title").text().trim(),
      list: list
    });
  },
  function ($, callback) {
    var articles = $('.upload-list');
    if (!articles.length) {
      callback(undefined);
      return;
    }
    var list = [].map.call(articles, function (article) {
      var ar = $(article);
      return {
        thumbnail: ar.find('.thumbnail').css('background-image').replace(/^url\((.+)\)/, '$1'),
        title: ar.find('.title').text().trim(),
        link: ar.find('a').attr('href').replace('./view.php', './postview.php')
      }
    }).filter(function (episode) { return episode.title; })

    var prev = $('.pq_now').prev('.page').attr('href');
    var next = $('.pq_now').next('.page').attr('href');
    var more = $('.more').attr('href');

    if (prev) {
      list.push({
        title: 'Prev Page',
        link: prev
      });
    }
    if (next) {
      list.push({
        title: 'Next Page',
        link: next
      });
    }
    if (more) {
      list.push({
        title: 'More Page',
        link: more
      });
    }

    callback({
      type: 'manga list',
      title: $("head title").text().trim(),
      list: list
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
      list: [].map.call(content.find('a'), function (link) {
        return {
          thumbnail: thumbnail,
          title: $(link).text().trim(),
          link: $(link).attr('href')
        }
      }).filter(function (episode) { return episode.title; })
    });
  },
  function ($, callback) {
    let article = $('article');
    if (!article.length) {
      callback(undefined);
      return;
    }

    let attr = 'data-lazy-src';
    let list = $(article).find('img[' + attr + ']');
    if (!list || !list.length) {
      attr = 'src';
      list = $(article).find('img[' + attr + ']');
    }


    let images = list.map(function () {
      return $(this).attr(attr);
    }).get();

    callback({
      type: 'manga',
      title: $('#content .entry-title').text().trim(),
      images: images,
    });
  },
  function ($, callback) {
    let article = $('#view');
    if (!article.length) {
      callback(undefined);
      return;
    }

    let attr = 'data-lazy-src';
    let list = $(article).children('img[' + attr + ']');
    if (!list || !list.length) {
      attr = 'src';
      list = $(article).children('img[' + attr + ']');
    }


    let images = list.map(function () {
      return $(this).attr(attr);
    }).get();

    callback({
      type: 'manga',
      title: $('head title').text().replace(' - Fuwarinn', '').trim(),
      images: images,
    });
  },
];

function resolveLinks(baseUri, data) {
  if (data.type === 'list' || data.type === 'manga list') {
    [].map.call(data.list, function (linkInfo) {
      if (linkInfo.thumbnail) {
        linkInfo.thumbnail = url.resolve(baseUri, linkInfo.thumbnail);
      }
      linkInfo.link = url.resolve(baseUri, linkInfo.link);
      return linkInfo;
    });
  } else if (data.type === 'manga') {
    data.images = [].map.call(data.images, function (image) {
      return url.resolve(baseUri, image);
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
        if (result === undefined
          || (result.list && !result.list.length)
          || (result.images && !result.images.length)) {
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
