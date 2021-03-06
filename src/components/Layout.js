import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Container from './Container'
import Header from './Header'
import HomeBanner from './HomeBanner'
import Footer from './Footer'
import 'prismjs/themes/prism.css'
import '../styles.css'

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
      <>
        <Helmet
          title="All points Burnes. Andrew Burnes"
          meta={[
            {
              name: 'description',
              content: 'personal website, portfolio, thoughts',
            },
            {
              name: 'keywords',
              content:
                'blog, technology, data, web development, product, geography, mapping',
            },
          ]}
        />
        <Container>
          {this.getHeader()}
          {this.props.children}
        </Container>
        <Footer />
      </>
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
}

export default TemplateWrapper
