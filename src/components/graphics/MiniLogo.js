import React, { Component } from 'react'
import Link from 'gatsby-link'
import logoIcon from '../../static/mini-logo.svg'

export default class MiniLogo extends Component {
  render() {
    return (
      <Link to="/" style={{ display: 'inline-block' }}>
        <img
          alt="mini-logo"
          src={logoIcon}
          style={{
            width: '100%',
            height: 'auto',
            position: 'relative',
            overflow: 'hidden',
            zIndex: '-99',
            margin: 0,
          }}
        />
      </Link>
    )
  }
}
