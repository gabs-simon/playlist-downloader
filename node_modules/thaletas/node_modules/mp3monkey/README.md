# mp3monkey
Search, stream and download MP3s from MP3 Monkey.

## Installation

    $ npm install mp3monkey

## Example
```javascript
var fs = require('fs'),
    mp3monkey = require('mp3monkey');

mp3monkey('ty segall bag i\'m in', function (err, tracks) {
    if (!err && tracks.length) {
        tracks[0].song.pipe(fs.createWriteStream('./bag.mp3'));
    }
});
```

## API
### mp3monkey(terms, [options], done)
Search the MP3 Monkey website and return a list of tracks.

`terms` is expected to be a string of search terms.

`options` is an optional object with the following properties:

```javascript
{
    host: 'https://mp3monkey.net',
    needle: {} // options passed into needle requests
}
```

`done` returns an array of the following objects:

```javascript
{
    artist: String,
    direct: String, // a url of the mp3 track
    duration: Number,
    song: ReadableStream, // a lazy readable stream of the mp3 file
    title: String
}
```

Note that the *direct link will not work unless you set the referer header*. In
order to stream MP3s from MP3 Monkey, you must set the `'Referer'` header to the
host of the website. Using the `song` stream handles this automatically.

## License
MIT
