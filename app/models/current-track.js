import DS from 'ember-data';
import Track from './track';

export default Track.extend({
	channel: DS.belongsTo('channel'),
	start_stream_ts: DS.attr('number')
});
