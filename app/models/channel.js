import DS from 'ember-data';

export default DS.Model.extend({
	channel_name: DS.attr('string'),
	//members: DS.hasMany('user'),
	tracks: DS.hasMany('track'),
	current_track: DS.belongsTo('current-track')
});
