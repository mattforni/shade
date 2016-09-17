import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		var join_ts = new Date().getTime();
		var channel = this.store.findRecord('channel', params.channel_id);
		var response_delta = new Date().getTime() - join_ts;

		console.log("seconds:" + response_delta / 1000);

		var current_song_ts = channel.current_song_ts;
		var offset = response_delta + (join_ts - current_song_ts);

		return channel;
	}
});