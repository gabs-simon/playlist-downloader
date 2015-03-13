var format = require('util').format,
    cheerio = require('cheerio'),
    needle = require('needle');

const URL = "http://mp3zap.com/?query=%s";

function parseDuration (time) {
  var seconds;

  time = time.split(':');

  if (time.length !== 2) {
    return 0;
  }

  seconds = (+time[0] || 0) * 60;
  seconds += +time[1] || 0;

  return seconds;
}

function search (terms, done) {
  var url = format(URL, terms);

  needle.get(url, function (err, res, body) {
    var $, tracks = [];

    if (err) return done(err);

    try {
      $ = cheerio.load(body);
    } catch (e) {
      return done(e);
    }

    $('#content p').each(function (i, data) {
      var str = $(data).text();

      // recuperando o nome da faixa
      var name = str.split('-')[1];
          name = name.substring(0, name.length - 8);

      // recuperando o nome do artista
      var artist = str.split('-')[0];
          artist = artist.substring(3, artist.length - 1);

      // recuperando a duração da musica em s
      var time = str.substring(str.length - 6, str.length - 1);

      // recuperando a url para download
      var direct = $(data).find('a').attr('href');

      tracks.push({
        name: name.toString(),
        artist: artist,
        duration: parseDuration(time),
        direct: direct
      });
    });

    done(null, tracks);
  }); // needle.get();

}

module.exports = search;
