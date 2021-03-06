import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Icon from '../graphics/Icon'

const Comp = ({ className, text = 'Download', url = '/' }) => (
  <div className={className}>
    <a href={url} rel="noopener noreferrer" target="_blank" download>
      <div>
        {text}
        <Icon type="download" />
      </div>
    </a>
  </div>
)

const Download = styled(Comp)`
  margin-top: 2em;
  padding: 1em;
  float: right;
  div & a {
    font-family: Source Sans Pro, sans-serif;
    text-transform: uppercase;
    font-weight: 200;
    font-size: 0.8em;
    color: black;
    &:hover {
      text-decoration: none;
    }
    & div:hover {
      border-bottom: 1px solid rgb(150, 150, 150);
    }
    & div img {
      position: relative;
      top: 2px;
      padding-left: 5px;
    }
  }
`

Download.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  url: PropTypes.string,
}

export default Download
