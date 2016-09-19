import DS from 'ember-data';

export default DS.Model.extend({
	channel_name: DS.attr('string'),
	//members: DS.hasMany('user'),
	current_track_start_ts: DS.attr('number'),
	//playlist: DS.attr('playlist')
	tracks: DS.hasMany('track'),
	current_track_id: DS.attr('string')
});
