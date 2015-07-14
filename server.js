var express = require('express');
var compress = require('compression');
var config = require('./config');

// all environments
var app = express();
app.set('port', config.PORT || 2643);
app.use(compress());

app.use('/assets', express.static('dist'));

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html')
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
