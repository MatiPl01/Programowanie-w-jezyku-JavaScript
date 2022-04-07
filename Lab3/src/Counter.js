import { Component, Fragment } from "react";
import CounterDisplay from "./CounterDisplay";


class Counter extends Component {
  constructor() {
    super()
    this.state = {
      count: 10,
      input: 10
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.count > 0) {
        const count = this.state.count - 1
        this.setState({
          count: count,
          input: count === 0 ? 0 : this.state.input
        })
      }
    }, 1000)
  }

  updateCounter(e) {
    e.preventDefault()
    const val = e.target.elements['number-input'].value
    this.setState({
      count: val,
      input: val
    })
  }

  changeInput(e) {
    const val = +e.target.value
    this.setState({
      count: val,
      input: val
    })
  }

  render() {
    return (
      <Fragment>
        <form onSubmit={this.updateCounter.bind(this)}>
        <input type="number" name="number" id="number-input" min="0" max="1000" value={this.state.input} onChange={this.changeInput.bind(this)} />
        </form>
        <ul>
          {
            [...Array(10)].map((_, i) => {
              return <li key={i}><CounterDisplay value={this.state.count} /></li>
            })
          }
        </ul>
      </Fragment>
    )
  }
}

export default Counter;
