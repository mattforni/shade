import DS from 'ember-data';

export default DS.Model.extend({
	
	name: DS.attr('string'),
	artist: DS.attr('string'),
	album: DS.attr('string'),
	album_art_url: DS.attr('string')
});