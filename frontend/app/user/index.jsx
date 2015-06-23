import store from './store'
import {Component} from 'base'
import Dispatcher from 'utils/dispatcher'

export default class User extends Component {
  getStores() {
    return [store]
  }

  buildState() {
    return store.bulk()
  }

  doLogin() {
    Dispatcher.dispatch({
      action: 'app:user:login'
    })
  }

  doRegister() {
    Dispatcher.dispatch({
      action: 'app:user:register'
    })
  }

  changeUsername(e) {
    Dispatcher.dispatch({
      action: 'app:user:change',
      username: e.target.value
    })
  }

  changePassword(e) {
    Dispatcher.dispatch({
      action: 'app:user:change',
      password: e.target.value
    })
  }

  render() {
    var {username, password, token, socket} = this.state;
    if(token) {
      return <div>{'username:'} {username}</div>
    }
    return <div ref="formDiv">
              <p>{'Not authorized'}</p>
              <input type="text" value={username} onChange={this.changeUsername} />
              <input type="password" value={password} onChange={this.changePassword} />
              <input type="button" onClick={this.doLogin} value="login" />
              <input type="button" onClick={this.doRegister} value="register" />
           </div>
  }
}
