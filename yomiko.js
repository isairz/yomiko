'use strict';
var cheerio = require('cheerio');
var request = require('request');

var async = require('async');
var archiver = require('archiver');
var path = require('path');

var config;

try {
  config = require('./config.json');
} catch (e) {
  console.log(e);
  console.warn("config isn't exist.\nRunning as default settings");
  config = require('./config.sample.json');
}

var marumaru = module.exports = {};

var req = function () {
  var jar = request.jar();
  var requestBase = request.defaults({
    jar: jar,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
    }
  });
  var requestLogin = request.defaults({
    jar: jar,
    headers: {
      'Referer': 'http://www.mangaumaru.com/archives/114053',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36',
      'Origin': 'http://www.mangaumaru.com'
    }
  });
  var loginTryed = false;

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
        } else if (body.indexOf('http://www.mangaumaru.com/wp-login.php?action=postpass') != -1) {
          // login for protected manga.
          _req.login(function (){
            tryRequest(url, callback);
          })
        } else {
          callback(err, res, body);
        }
      });
    }

    tryRequest(url, callback);
  }

  _req.login = function(callback) {
    if (loginTryed) {
      // Because of sucuri brute-force protector, retrying could cause ip ban. (30 times for 1 hour)
      var e = new Error('Login Failed!');
      callback(e);
      return;
    }

    loginTryed = true;
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
    var list = $('#widget_bbs_review01');
    if (!list.length) {
      callback(undefined);
      return;
    }
    callback({
      type: 'list',
      title: 'marumaru',
      data: [].map.call(list.find('li'), function (li) {
        var link = 'http://marumaru.in' + $(li).find('a').attr('href');

        return {
          thumbnail: $(li).find('img').attr('src'),
          title: $(li).find('strong').text().trim(),
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
    content.children('.snsbox').remove();
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
        return parent.name === 'a' ? parent.attribs['href']
          : img.attribs['data-lazy-src'] || img.attribs['src'];
        })
    });
  }
];

marumaru.scrap = function (link, callback) {
  link = decodeURIComponent(link);
  link = link.replace("www.umaumaru.com", "www.mangaumaru.com");
  req(link, function (err, res, body) {
    if (err) {
      console.error(err);
      callback(undefined);
    }
    var $ = cheerio.load(body);
    function next(idx) {
      scrapers[idx]($, function (result) {
        if (result === undefined && idx+1 < scrapers.length) {
          next(idx+1);
        } else {
          callback(result);
        }
      });
    }
    next(0);
  });
};

marumaru.episodeToZip = function (link, callback) {
  var archive = archiver('zip');
  marumaru.episode(link, function(episode) {
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
      archive.append(imageStream, { name: padZeros(-~i) + path.extname(images[i]) });
    }
    archive.finalize();
    callback(dirName(episode.title || encodeURIComponent(link)) + '.zip', archive);
  });
  return this;
}
