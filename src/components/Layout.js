import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Container from './Container'
import Header from './Header'
import HomeBanner from './HomeBanner'

class TemplateWrapper extends Component {
  constructor(props) {
    super(props)

    this.getHeader = this.getHeader.bind(this)
  }

  getHeader() {
    const { pathname } = this.props.location

    if (pathname === '/') return <HomeBanner />
    return <Header pathname={pathname} />
  }

  render() {
    return (
      <div>
        <Helmet
          title="all points burnes"
          meta={[
            { name: 'description', content: 'personal website' },
            { name: 'keywords', content: 'blog, geography, mapping' },
          ]}
        />
        <Container>
          {this.getHeader()}
          {this.props.children}
        </Container>
      </div>
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
}

export default TemplateWrapper
