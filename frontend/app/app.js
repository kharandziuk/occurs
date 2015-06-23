import _ from 'underscore'
import React from 'react'
import {Component} from 'base'
import state from 'state'
import Chart from 'chart'
import {EventButton, store as EventsStore} from './events'
import User from 'user'
import userStore from 'user/store'
//import 'router'

class Application extends Component {

  getStores() {
    return [state, EventsStore]
  }

  buildState() {
    var page = state.get('page'),
        eventId = page != 'event'? null : state.get('eventId'),
        isAuthorized = userStore.isAuthorized,
        events = EventsStore.bulk()

    return { page, eventId, isAuthorized, events }
  }

  render() {
    var eventButton = '';
    if(this.state.isAuthorized) {
      eventButton = <EventButton />
    }

    return <div>
      <header>
        {this.state.page}
      </header>
      <div className="container">
        <User />
        <Chart data={this.state.events} />
        {eventButton}
      </div>
      <footer>
        <div>{'APPLICATION INIT'}</div>
      </footer>
    </div>
  }
}

React.render(<Application />, document.body)
