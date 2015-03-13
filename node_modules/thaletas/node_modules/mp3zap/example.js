var http = require('http'),
    fs = require('fs'),
    mp3zap =  require('./');

mp3zap("The Beatles Something", function (err, tracks) {
  if (err) throw err;

  var file = fs.createWriteStream(tracks[0].name + '.mp3');
  http.get(tracks[0].direct, function (res) {
    res.pipe(file);
  });
});
