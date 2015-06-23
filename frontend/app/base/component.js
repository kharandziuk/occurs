
import {Component, PropTypes} from 'react'
import {fail} from 'assert'
import _ from 'underscore'
import {Styles} from 'material-ui'
var ThemeManager = new Styles.ThemeManager();

export default class BaseComponent extends Component {
  constructor() {
    super(...arguments)
    // FIME auto-bind?
    this._onChange = this._onChange.bind(this)
    if(this.getStores().length > 0) {
      this.state = this.buildState()
    }
  }

  render() {
    fail('render isn\'t implemented for ', this)
  }

  buildState() {
    fail('buildState isn\'t implemented for ', this)
  }

  getStores() {
    return []
  }

  componentDidMount() {
    _(this.getStores()).each( (store)=> {
      store.on(store.changeEvents, this._onChange)
    })
  }

  componentWillUnmount() {
    _(this.getStores()).each( (store)=> {
      store.off(store.changeEvents, this._onChange)
    })
  }

  _onChange() {
    // FIXME don't call setState on unmounted components
    this.setState( this.buildState() )
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }
}

BaseComponent.childContextTypes = {
  muiTheme: PropTypes.object
};
