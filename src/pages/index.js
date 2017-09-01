import React from 'react';
import ContentContainer from '../components/ContentContainer';
import Section from '../components/Section';
import CardsSection from '../components/CardsSection';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import ProjectCard from '../components/ProjectCard';
import ResumeCard from '../components/ResumeCard';

const IndexPage = (props) => {
  const { allMarkdownRemark, allProjectsJson, allResumeJson } = props.data;
  const Posts = CardsSection(PostCard);
  const Projects = CardsSection(ProjectCard);
  const Resume = CardsSection(ResumeCard);

  return (
    <ContentContainer>
      <Section
        name='about'
      >
        <p>
          Originally from the Sonoran Desert, I currently reside along the eastern slope of the Rocky Mountains.
          I studied urban planning as an undergraduate and geographic information systems in graduate work.
          Currently, I work for the US Geologic Survey working on the National Map as a GIS Architect.
        </p>
        <p>
          I focus on helping move the organization to Amazon Web Services and building tools with open source software.
          My life goals are to be a life long learner, become fluent in Portuguese (my wife is a brasileira),
          become an amateur architect, and live by the ocean.
        </p>
      </Section>
      <Section
        name='latest posts'
        to='/posts/'
      >
        <Posts data={allMarkdownRemark} length={4} />
      </Section>
      <Section
        name='projects'
      >
        <Projects data={allProjectsJson} />
      </Section>
      <Section
        name='resume'
      >
        <Resume data={allResumeJson} />
      </Section>
      <Footer />
    </ContentContainer>
  );
}

export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
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
    allProjectsJson {
      edges {
        node {
          name
          link
          description
          type
        }
      }
    }
    allResumeJson {
      edges {
        node {
          start
          school
          type
          end
          degree
          employer
          position
        }
      }
    }
  }
`;
