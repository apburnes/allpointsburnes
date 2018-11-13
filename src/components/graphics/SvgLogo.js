import React, { Component } from 'react'
import Vivus from 'vivus'
import svgLink from '../../static/logo.svg'

export default class SvgLogo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      svg: null,
    }
  }

  componentDidMount() {
    const logo = new Vivus(
      'svg-logo',
      {
        duration: 120,
        file: svgLink,
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
      <div
        id="svg-logo"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '350px',
          position: 'relative',
          overflow: 'hidden',
        }}
      />
    )
  }
}
