import Ember from 'ember';

export default Ember.Controller.extend({

	init: function () {
	    this._super();
	    Ember.run.schedule("afterRender", this, function() {
	    	var current_track = this.get('model.current_track');
	    	if (current_track.id != null) {
		    	this.selectTrack(current_track, true);
	    	}
	    });
	},
	searchResults: [],
	sortBy: ['votes:desc'],
	sortedTracks: Ember.computed.sort('model.tracks', 'sortBy'),
	selectTrack: function(track, play, seek = 0) {

		if (track != null) {

			console.log('playing: ' + track.get('name') + ' at ' + seek + 'ms');
			var self = this;

			var channel = this.get('model');

			channel.get('current_track').then(function(_track) {
				if (_track == null) {
					var current_track = self.store.createRecord('current-track', {
						id: channel.get('id'),
						start_stream_ts: new Date().getTime(),
						name: track.get('name'),
						stream_id: track.get('stream_id'),
						artist: track.get('artist'),
						album: track.get('album'),
						album_art_url: track.get('album_art_url'),
						votes: track.get('votes')
					});
				} else {
					_track.set('start_stream_ts', new Date().getTime()),
					_track.set('name', track.get('name'));
					_track.set('stream_id', track.get('stream_id'));
					_track.set('artist', track.get('artist'));
					_track.set('album', track.get('album_art_url'));
					_track.set('album_art_url', track.get('album_art_url'));
					_track.set('votes', track.get('votes'));
					current_track = _track;
				}

				channel.set('current_track', current_track);
				current_track.save();
				channel.save();
			});

			self.store.find('track', track.get('id')).then(function (_track) {
  				_track.destroyRecord();
			});

			SC.streamStopAll();
			var self = this;
			if (play == null) {
				play = true;
			}

		    SC.initialize({
		      client_id: '4963dd1155eaea4e29b885d7ee1422ce',
		      redirect_uri: '#'
		    });

			return SC.stream('/tracks/' + track.get('stream_id'), {
			    whileplaying: function() {
			    	//return self.set('currentTrackPosition', this.position);
			    },
			    onbufferchange: function() {
			        //return self.set('isBuffering', this.isBuffering);
			    },
			    onfinish: function() {
			      	// TODO: remove current song
			      	// TODO: set current
			      	console.log('COMPLETE 1');
			        var tracks = self.get('model.tracks');
				    var nextTrack = tracks.objectAt(0);
			        console.log("nextTrack: " + nextTrack);
			        if (nextTrack != null) {
			        	return self.selectTrack(nextTrack, true);
			        }
			    }
			}, function(sound) {
				//sound.seek(seek);
			    sound.play();
			});

		}

	},
	actions: {
		search: function() {
			var query = this.get('searchBox');

			if (query !== "") {
				var results = Ember.$.ajax({type: "GET", url:'https://api.soundcloud.com/tracks?client_id=4963dd1155eaea4e29b885d7ee1422ce&q=' + query, async:false}).responseJSON;
				this.set('searchResults', results);
			} else {
				this.set('searchResults', []);
			}
		},
		playTrack: function(song) {
			this.selectTrack(song, true);
		},
		addToQueue: function(song) {
			var channel = this.get('model');
      		var splitURL = song.artwork_url.split('-large');
			var artwork_url = splitURL[0] + '-t500x500' + splitURL[1];
			var track_id = sha256(channel.id + '-' + song.id);

			let track = this.store.createRecord('track', {
				id: track_id,
				stream_id: song.id,
				name: song.title,
				artist: song.user.username,
				album_art_url: artwork_url,
				votes: 1
			});

			channel.get('tracks').pushObject(track);
			channel.save();
			track.save();

			if (this.get('nextTrack') == null) {
				this.set('nextTrack', track);
			}
		},
		upVote: function(song) {
			this.store.findRecord('track', song.id).then(function(track) {
				var previous = track.get('votes');
				var v = (previous != null ? previous : 0) + 1;
				track.set('votes', v);
				track.save();
			});
		},  
	}
});

/*
	channel: function(params) {
		var join_ts = new Date().getTime();
		var channel = this.store.findRecord('channel', params.channel_id);
		var response_delta = new Date().getTime() - join_ts;

		console.log("seconds:" + response_delta / 1000);

		var current_song_ts = channel.current_song_ts;
		var offset = response_delta + (join_ts - current_song_ts);

		return channel;
	}
*/