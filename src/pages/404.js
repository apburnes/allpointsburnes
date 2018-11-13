import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'

export default ({ location }) => (
  <Layout location={location}>
    <Link to="/">
      <h1>NOT FOUND</h1>
    </Link>
  </Layout>
)
