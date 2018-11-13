import React, { Component } from 'react'
import { Link } from 'gatsby'
import Vivus from 'vivus'
import miniLogo from '../../static/mini-logo.svg'

export default class MiniLogo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      svg: null,
    }
  }

  componentDidMount() {
    const logo = new Vivus(
      'mini-logo',
      {
        duration: 80,
        file: miniLogo,
        start: 'autostart',
      },
      () => {}
    )

    logo.play()
    logo.finish()
    this.setState({ svg: logo })
  }

  componentWillUnmount() {
    this.state.svg.destroy()
  }

  render() {
    return (
      <Link to="/" style={{ display: 'inline-block' }}>
        <div
          id="mini-logo"
          style={{
            width: '3.3rem',
            height: 'auto',
          }}
        />
      </Link>
    )
  }
}
