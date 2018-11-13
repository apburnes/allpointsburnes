import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const LinkComp = ({ className, to, text }) => {
  return (
    <Link to={to} className={className}>
      {text}
    </Link>
  )
}

LinkComp.propTypes = {
  to: PropTypes.string,
  text: PropTypes.string,
}

const PageLink = styled(LinkComp)`
  text-decoration: none;
  font-weight: 200;
  font-family: ${props =>
    props.fontFamily ? props.fontFamily : `Sutro, Arial, Sans Serif`};
  color: ${props => (props.color ? props.color : `rgb(50,50,50)`)};
  &:hover {
    text-decoration: none;
    color: ${props => (props.hoverColor ? props.hoverColor : `#000`)};
  }
`

export default PageLink
