import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		newChannel: function() {

			var name = this.get('channel_name');
			var time = new Date().getTime();
			var user_id = 'anonymous';
			var channel_id = sha256(name + '-' + time + '-' + user_id);

			var channel = this.store.createRecord('channel', {
				// TODO: add time & user into hash
				id: channel_id,
				channel_name: name,
				timestamp: time,
				members: [],
				tracks: []
			});

			channel.save();
			this.setProperties({channel_name: ''});
			this.transitionToRoute("/channels/" + channel_id);
		}
	}
});
