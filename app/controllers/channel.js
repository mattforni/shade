import Ember from 'ember';

export default Ember.Controller.extend({

	searchResults:[],
	currentTrack:null,
	isPlaying:true,
	init: function () {
	    this._super();
	    Ember.run.schedule("afterRender", this, function() {
	    	var channel = this.get('model');
	    	var current_track_id = channel.get('current_track_id');
	    	var current_track_start_ts = channel.get('current_track_start_ts');
	    	var self = this;
	    	if (current_track_id != null) {
	    		var track = this.store.findRecord('track', current_track_id).then(function(track) {
		    		self.selectTrack(track, true, current_track_start_ts);
	    		});
	    	}
	    });
	},
	selectTrack: function(track, play, seek = 0) {

		if (track != null) {

			console.log('playing: ' + track.get('name') + ' at ' + seek + 'ms');

			var current_track_id = track.get('id');
			var channel = this.get('model');
			channel.set('current_track_id', current_track_id);
			channel.save();

			/*
			this.store.findRecord('channel', this.get('model.id')).then(function(channel) {
			var current_track_id = track.get('id');
			channel.set('current_track_id', current_track_id);
			channel.save();
			});
			*/

			SC.streamStopAll();
			this.set('currentTrack', track);
			var self = this;
			if (play == null) {
				play = true;
			}
		    //self.get('model.tracks').setEach('playingTrack', false);
		    //self.set('isBuffering', true);
		    //track.set('playingTrack', true);
		    //trackIndex = this.get('sortedTracks').indexOf(track);
		    //nextTrack = self.get('sortedTracks').objectAt(trackIndex + 1);
		    //prevTrack = self.get('sortedTracks').objectAt(trackIndex - 1);
		    /*
		    this.setProperties({
		      prevTrack: prevTrack,
		      nextTrack: nextTrack
		    });
		    */
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
				console.log(track);
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
