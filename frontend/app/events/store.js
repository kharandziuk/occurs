import {Store as BaseStore} from 'base';
import Backbone from 'backbone'

class Event extends Backbone.Model {
  get urlRoot() { return '/events' }
}

class EventsStore extends BaseStore.Collection {

  get actionsGroup() { return 'app:events' }
  get changeEvents() { return 'reset' }

  get url() { return '/events' }

  parse(data) {
    return data.events;
  }

  handleAdd() {
    var e = new Event();
    e.save().done( ()=> this.fetch() )
  }

  fetch() {
    return super.fetch({silent: true}).then( ()=> this.trigger('reset') )
  }
}

var store = new EventsStore();
store.fetch()

export default store;
