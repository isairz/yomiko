
/**
 * Module dependencies.
 */

var express = require('express');
var compress = require('compression');

var request = require('request').defaults({
  jar: true,
  headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
  }
});
var maru = require('./scraper/marumaru');

// all environments
var app = express();
app.set('port', process.env.PORT || 2643);
app.set('view engine', 'jade');
app.use(compress());
app.use(express.static('public'));
app.use(express.static('build'));

// development only
if ('development' == app.get('env')) {
}

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/image-proxy', function (req, res) {
  request(req.query.src)
  .on('error', function (err) {
    res.sendStatus(404);
  })
  .pipe(res)
});

app.get('/api/*', function (req, res) {
  if (!req.query.link) {
    res.json(require('./scraper/main.json'));
    return;
  }

  maru.scrap(req.query.link, res.json.bind(res));
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
