import React, { Component } from 'react';
import Vivus from 'vivus';
import Link from 'gatsby-link';
const logoIcon = require('../../static/mini-logo.svg');

export default class MiniLogo extends Component {
  render() {
    return (
        <Link
          to='/'
          style={{display: 'inline-block'}}
        >
        <img
          src={logoIcon}
          style={{
            width: '100%',
            height:'auto',
            position: 'relative',
            overflow: 'hidden',
            zIndex: '-99',
            margin: 0
          }}
        >
        </img>
        </Link>
    )
  }
}
