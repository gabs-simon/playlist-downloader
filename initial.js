var fs = require('fs'),
    thaletas = require('thaletas'),
    spotify = require('spotify-playlist'),
    progress = require('progress'),
    sanitize_filename = require('sanitize-filename');

    thaletas.sources = ['mp3monkey', 'grooveshark','allmuz', 'mp3zap', 'music163', 'mp3skull','youtube'];

var spdw = {};

    var callback = function(err, result) {
    	var thaletas_track_list = [];
    	for (var i = 0; i < result.playlist.tracks.length; i++) {
    		thaletas_track_list.push({
    			artist : result.playlist.tracks[i].artists[0],
    			name : result.playlist.tracks[i].name,
    			file : sanitize_filename(result.playlist.tracks[i].artists[0] + ' - ' + result.playlist.tracks[i].name + '.mp3')
    		});
    	};

    	for (var i = 0; i < thaletas_track_list.length; i++) {


    		thaletas_track_list[i].readable = thaletas({
			    artist: thaletas_track_list[i].artist,
			    title: thaletas_track_list[i].name
			});

			thaletas_track_list[i].readable.pipe(fs.createWriteStream("tracks/" + thaletas_track_list[i].file));

			(function(readable_stream, title){
				readable_stream.on('end', function(){
	    			spdw.bar.tick(1, {last_file : title});
	    		});


			})(thaletas_track_list[i].readable, thaletas_track_list[i].file);
    		
    	};

    	spdw.bar = new progress('  downloading [:bar] :percent :etas :last_file', {
		    complete: '=',
		    incomplete: ' ',
		    width: 20,
		    total: thaletas_track_list.length
		  });

    	
	}
 
	spotify.lookup('spotify:user:spotifybrazilian:playlist:1ZRkRyUZCb3KxdNOdoH3aJ', callback); //Normal spotify URI.