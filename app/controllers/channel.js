import Ember from 'ember';

export default Ember.Controller.extend({
	searchResults:[],
	currentTrack:null,
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
		play: function(song) {
			SC.initialize({
				client_id: '4963dd1155eaea4e29b885d7ee1422ce',
				redirect_uri: '#'
			});

			this.set('currentTrack', song);
		    SC.streamStopAll();
		    return SC.stream('/tracks/' + song.id, {
		    	whileplaying: function() {
			        return self.set('currentTrackPosition', this.position);
			    },
			    onbufferchange: function() {
			    	return self.set('isBuffering', this.isBuffering);
			    },
			    onfinish: function() {
			    	self.set('isPlaying', false);
			    	nextTrack = self.get('nextTrack');
			    	if (nextTrack != null) {
			    		return self.selectTrack(nextTrack, true);
			        }
			    }
		    }, function(sound) {
		    	sound.play();
		    });
		},
		addToQueue: function(song) {
			var channel = this.get('model');
			let track = this.store.createRecord('track', {
				id: song.id,
				name: song.title,
				artist: song.user.username,
				album_art_url: song.artwork_url
			});
			console.log(track);
			channel.get('tracks').pushObject(track);
			channel.save();
			track.save();
		}
	}
});
