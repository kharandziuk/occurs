import _ from 'underscore';
import {Component} from 'base'
import store from './store'
import {Paper} from 'material-ui'
import Dispatcher from 'utils/dispatcher'

export {store}

export class EventButton extends Component {
  handleClick() {
    Dispatcher.dispatch({
      action: 'app:events:add'
    })
  }

  render() {
    return <button onClick={this.handleClick}>PUSH ME</button>
  }
}

class Event extends Component {
  render() {
    return <Paper zDepth={2} className={'event-item'}>
              {this.props.name}
           </Paper>
  }
}

class Events extends Component {
  getStores() {
    return [store]
  }

  buildState() {
    return {
      list: store.toJSON()
    }
  }

  render() {
    var nodes = _(this.state.list).map(function(item, i) {
      return <Event {...item} key={i}/>
    })

    return <div>{nodes}</div>
  }
}

