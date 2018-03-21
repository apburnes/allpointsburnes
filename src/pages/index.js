import React from 'react';
import { rhythm, scale } from '../utils/typography';
import ContentContainer from '../components/ContentContainer';
import Section from '../components/Section';
import CardsSection from '../components/CardsSection';
import Download from '../components/elements/Download';
import Footer from '../components/Footer';
import Resume from '../components/Resume';
import PostCard from '../components/PostCard';
import ProjectCard from '../components/ProjectCard';

const IndexPage = (props) => {
  const { allMarkdownRemark, allProjectsJson, allResumeJson } = props.data;
  const Posts = CardsSection(PostCard);
  const Projects = CardsSection(ProjectCard);

  return (
    <ContentContainer>
      <Section
        name='about'
      >
        <p
          style={{
            ...scale(0),
            marginTop: rhythm(0),
            lineHeight: rhythm(.9)
          }}
        >
          After a good stint along the Front Range, I am back residing in my Sonoran Desert homeland.
          I studied urban planning and geographic information systems but have parlayed my experiences from
          natural resource geography into engineering. Currently, you can call me an Innovations Specialist
          with 18F.
        </p>
        <p
          style={{
            ...scale(0),
            marginTop: rhythm(0),
            lineHeight: rhythm(.9)
          }}
        >
          I focus on helping government organizations build better tools for the public with open source
          software and transparent workflows.  Some life goals are to continually learn, become fluent in
          Portuguese (minha esposa é brasileira), build cool things, and live by the ocean.
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
        <Resume edges={allResumeJson.edges} />
        <Download
          url='http://yadayadayadadocs.s3-us-west-2.amazonaws.com/resume/burnes-resume.pdf'
          text='Download resume pdf'
        />
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
