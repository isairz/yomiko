
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var request = require('request');

// all environments
app.set('port', process.env.PORT || 2000);
app.set('view engine', 'jade');
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

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});