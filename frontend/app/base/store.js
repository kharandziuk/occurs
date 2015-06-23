import _ from 'underscore'
import Backbone from 'backbone'
import assert from 'assert'
import Dispatcher from 'utils/dispatcher'

// FIXME optimize
function camelize(str) {
  return str.replace(/(?:\s|-|_)\w/g, function(match) {
    return match.replace(/^(\s|-|_)/g, '').toUpperCase();
  });
}

function handle(store) {
  return function(action) {
    assert(
      action.group && action.type || action.action,
      'dispatch error: group and type or action should be defined', action
    )
    if(action.group == null) {
      var a = action.action.split(':');
      action.type = a.pop()
      action.group = a.join(':')
    }
    if(action.group == store.actionsGroup) {
      var handler = store[camelize('handle-' + action.type)]
      if(handler) handler.call(store, action)
    }
  }
}

export class Collection extends Backbone.Collection {
  constructor() {
    super(...arguments)
    Dispatcher.register( handle(this) )
  }

  get actionsGroup() {
    assert.fail('action group should be set for', this)
  }

  get changeEvents() { return 'all' }

  bulk() {
    return _(this.models).map(m => _(m.attributes).clone())
  }
}

export class Model extends Backbone.Model {
  constructor() {
    super(...arguments)
    Dispatcher.register( handle(this) )
  }

  get changeEvents() { return 'all' }

  get actionsGroup() {
    assert.fail('action group should be set for', this)
  }

  bulk() {
    return _(this.attributes).clone()
  }
}
