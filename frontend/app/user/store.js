import {Store as BaseStore} from 'base'
import _ from 'underscore'
import $ from 'jquery'

class UserStore extends BaseStore.Model {
  get actionsGroup() { return 'app:user' }

  get urlRoot() { return '/users' }

  get defaults() {
    return {
      username: '',
      password: '',
      token: '',
      socket: ''
    }
  }

  get isAuthorized() {
    //return Boolean(this.get('token'))
    return true
  }

  // HANDLERS
  handleChange({username, password}) {
    if(username != null) { this.set({username}) }
    if(password != null) { this.set({password}) }
  }

  handleLogin(action) {
    console.log('LOGIN', action)
    this.fetch()
  }

  handleRegister(action) {
    console.log('REGISTER', action)
    this.save()
  }

  toJSON() {
    return _(this.attributes).pick('username', 'password')
  }
}

var store = new UserStore()
export default store;

$(document).ajaxSend((e, xhr)=> {
  if(store.isAuthorized) {
    xhr.setRequestHeader(
      'authorization', store.get('token')
    )
  }
})
