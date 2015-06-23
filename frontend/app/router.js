
import {Router, history} from 'backbone'
import state from 'state'

class AppRouter extends Router {
  get routes() {
    return {
      'event/:id': 'event',
      'event/:id/': 'event',
      ':page': 'page',
      '': 'page'
    }
  }

  event(id) {
    console.log('event id', id)
    state.set({
      page: 'event',
      eventId: id
    })
  }

  page(page) {
    console.log('page', page)
    if(!page) {
      page = 'main'
    }
    state.set({page})
  }
}

var router = new AppRouter()

history.start({
  pushState: true,
  trigger: true
})

export default router
