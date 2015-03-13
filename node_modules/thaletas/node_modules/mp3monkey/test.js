var isMp3 = require('is-mp3'),
    tap = require('tap').test,
    mp3skull = require('./');

tap('searching', function (test) {
    test.plan(3);

    mp3skull('low roar', function (err, tracks) {
        test.notOk(err, 'no errors');
        test.ok(tracks.length, 'tracks present');
        test.notOk(tracks.filter(function (track) {
            var valid =
                track.duration > 1 && track.title && track.artist &&
                /\.mp3$/.test(track.direct);

            return !valid;
        }).length, 'populated tracks');
    });
});

tap('song', function (test) {
    test.plan(3);

    mp3skull('chad vangaalen', function (err, tracks) {
        test.notOk(err, 'no errors');
        test.ok(tracks, 'tracks present');

        tracks[0].song.once('data', function (data) {
            test.ok(isMp3(data), 'song found and is mp3');
        });
    });
});

