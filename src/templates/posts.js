import React from 'react';
import Helmet from 'react-helmet';
import ContentContainer from '../components/ContentContainer';
import get from 'lodash/get';
import { rhythm, scale } from '../utils/typography';
import formatDate from '../utils/formatDate';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');

    return (
      <ContentContainer>
        <Helmet title={`${post.frontmatter.title}| ${siteTitle}`} />
        <h1>
          {post.frontmatter.title}
        </h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {formatDate(post.frontmatter.date)}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
      </ContentContainer>
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
