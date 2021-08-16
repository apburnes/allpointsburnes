import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Layout from '../components/Layout'
import ContentContainer from '../components/ContentContainer'
import Section from '../components/Section'
import CardsSection from '../components/CardsSection'
import Download from '../components/elements/Download'
import Resume from '../components/Resume'
import PostCard from '../components/PostCard'
import ProjectCard from '../components/ProjectCard'

const Posts = ({ data }) => {
  const PostsComponent = CardsSection(PostCard)
  return <PostsComponent data={data.allMarkdownRemark} length={4} />
}

const Projects = ({ data }) => {
  const ProjectsComponent = CardsSection(ProjectCard)

  return <ProjectsComponent data={data.allProjectsJson} />
}

export default (props) => (
  <StaticQuery
    query={graphql`
      query IndexQuery {
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
    `}
    render={(data) => (
      <Layout location={props.location}>
        <ContentContainer>
          <Section name="latest posts" to="/posts/">
            <Posts data={data} />
          </Section>
          <Section name="projects">
            <Projects data={data} />
          </Section>
          <Section name="resume">
            <Resume edges={data.allResumeJson.edges} />
            <Download
              url="http://yadayadayadadocs.s3-us-west-2.amazonaws.com/resume/burnes_resume.pdf"
              text="Download resume pdf"
            />
          </Section>
        </ContentContainer>
      </Layout>
    )}
  />
)
