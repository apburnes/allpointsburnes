const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const blogPost = path.resolve('./src/templates/posts.js')

  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.forEach((edge) => {
    createPage({
      path: edge.node.frontmatter.path,
      component: blogPost,
      context: {
        slug: edge.node.frontmatter.path,
      },
    })
  })
}
