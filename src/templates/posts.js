import React from 'react';
import Helmet from 'react-helmet';
import get from 'lodash/get';
import styled from 'styled-components';
import ContentContainer from '../components/ContentContainer';
import { Box } from 'grid-styled';
import { rhythm, scale } from '../utils/typography';
import formatDate from '../utils/formatDate';

const Content = styled(ContentContainer)`
  .gatsby-highlight {
    padding: 2em 0 2em 0;
  }
`;

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');

    return (
      <Content>
        <Helmet title={`${post.frontmatter.title}| ${siteTitle}`} />
        <Box width={[1]}>
          <h1
            style={{
              marginBottom: rhythm(0)
            }}
          >
            {post.frontmatter.title}
          </h1>
        </Box>
        <Box mb={1} pb={1} width={[1]}>
          <p
            style={{
              ...scale(-.75),
              marginTop: rhythm(0),
              color: 'rgb(150,150,150)'
            }}
          >
            {formatDate(post.frontmatter.date)}
          </p>
        </Box>
        <Box my={1} py={1} width={[1]}>
          <div
            style={{
              ...scale(0),
              display: 'block',
              marginBottom: rhythm(1),
              marginTop: rhythm(-1),
              lineHeight: rhythm(.75)
            }}
            dangerouslySetInnerHTML={{ __html: post.html }} />
        </Box>
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
      </Content>
    )
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        title
      }
      frontmatter {
        date
      }
    }
  }
`;
