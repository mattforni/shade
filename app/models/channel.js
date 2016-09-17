import DS from 'ember-data';

export default DS.Model.extend({
	channel_name: DS.attr('string'),
	//members: DS.hasMany('user'),
	timestamp: DS.attr('number'),
	//playlist: DS.attr('playlist')
	tracks: DS.hasMany('track')
});
