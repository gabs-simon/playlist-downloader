var cheerio = require('cheerio'),
    lazystream = require('lazystream'),
    needle = require('needle');

function parseDuration(duration) {
    var matches = duration.match(/(\d+):(\d+)/);

    try {
        return ((+matches[1] * 60) + (+matches[2])) || 0;
    } catch (e) {
        return 0;
    }
}

function search(terms, options, done) {
    var url;

    if (!done) {
        done = options;
        options = {};
    }

    options.host = options.host || 'https://mp3monkey.net';

    options.needle = options.needle || {};
    options.needle.headers = options.needle.headers || {};
    options.needle.headers['referer'] = options.host;

    url = options.host + '/mp3/' + terms + '.html';

    needle.get(url, options.needle, function (err, res, body) {
        var $, tracks;

        if (err) {
            return done(err);
        }

        try {
            $ = cheerio.load(body);
        } catch (e) {
            return done(e);
        }

        tracks = []

        $('.results h4').each(function () {
            var title = $('b', this).first().text().trim(),
                direct = $('#norber', this).text();

            title = title.slice(title.indexOf('-') + 2);

            tracks.push({
                artist: $('.artistLink', this).text().trim(),
                direct: direct,
                song: new lazystream.Readable(function () {
                    return needle.get(direct, options.needle);
                }),
                duration: parseDuration($('.floatRight', this).first().text()),
                title: title
            });
        });

        done(null, tracks);
    });
}

module.exports = search;
