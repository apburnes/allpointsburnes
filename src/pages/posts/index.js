import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout'
import ContentContainer from '../../components/ContentContainer'
import Section from '../../components/Section'
import CardsSection from '../../components/CardsSection'
import PostCard from '../../components/PostCard'
import 'prismjs/themes/prism-solarizedlight.css'

const PostPage = (props) => {
  const { allMarkdownRemark } = props.data
  const Posts = CardsSection(PostCard)

  return (
    <Layout location={props.location}>
      <ContentContainer>
        <Section name="posts" to="/posts/">
          <Posts data={allMarkdownRemark} />
        </Section>
      </ContentContainer>
    </Layout>
  )
}

export default PostPage

export const pageQuery = graphql`
  query PostsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            path
            date
            description
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
