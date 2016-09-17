import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('channels');
  this.route('channels/new');
  this.route('channel', {path: '/channels/:channel_id'});
  this.route('login');
});

export default Router;
