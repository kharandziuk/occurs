var BaseStore = require('base').Store;

class BaseState extends BaseStore.Model {
  get defaults() {
    return {
      page: 'home'
    }
  }

  get actionsGroup() {
    return 'app'
  }

  handleRoute(page) {
    this.set('page', page)
  }
}

export default new BaseState();
