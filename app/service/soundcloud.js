import Ember from 'ember';

export default Ember.Service.extend({
  init() {},
  search(query) {
    console.log(Ember.$.ajax('https://api.soundcloud.com/tracks?client_id=4963dd1155eaea4e29b885d7ee1422ce&q=' + query));
  }
});