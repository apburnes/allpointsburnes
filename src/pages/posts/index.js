import React from 'react';
import ContentContainer from '../../components/ContentContainer';
import Section from '../../components/Section';
import CardsSection from '../../components/CardsSection';
import PostCard from '../../components/PostCard';

const PostPage = (props) => {
  const { allMarkdownRemark } = props.data;
  const Posts = CardsSection(PostCard);

  return (
    <ContentContainer>
      <Section
        name='posts'
        to='/posts/'
      >
        <Posts data={allMarkdownRemark} />
      </Section>
    </ContentContainer>
  );
}

export default PostPage;

export const pageQuery = graphql`
  query PostsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
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
