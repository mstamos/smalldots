import { Component, PropTypes } from 'react'
import Evee from 'evee'

const evee = new Evee()

export default class Storage extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    driver: PropTypes.shape({
      getItem: PropTypes.func.isRequired,
      setItem: PropTypes.func.isRequired
    })
  }

  static defaultProps = { driver: localStorage }

  state = this.props.items.reduce((result, key) => {
    return { ...result, [key]: this.props.driver.getItem(key) || null }
  }, {})

  componentDidMount() {
    this.subscriptions = this.props.items.map(key => (
      evee.on(key, event => this.setState({ [key]: event.data }))
    ))
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => evee.drop(subscription))
  }

  setItem = (key, value) => {
    this.props.driver.setItem(key, value)
    evee.emit(key, value)
  }

  render() {
    return this.props.children({ ...this.state, setItem: this.setItem })
  }
}
