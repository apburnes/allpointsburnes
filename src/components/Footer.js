import React from 'react'
import { Box, Flex } from 'reflexbox'
import styled from 'styled-components'
import ContentContainer from './ContentContainer'

const FooterComponent = ({ className }) => (
  <Flex className={className} mt={4} pb={4} justifyContent="center">
    <ContentContainer>
      <Flex flexWrap="wrap" justifyContent="space-between" width={1}>
        <Box>
          <Flex flexDirection="column">
            <h4>Built with</h4>
            <a
              href="https://facebook.github.io/react/"
              rel="noopener noreferrer"
              target="_blank"
            >
              ReactJS
            </a>
            <a
              href="https://www.gatsbyjs.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              GatsbyJS
            </a>
            <a
              href="https://www.netlify.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Netlify
            </a>
          </Flex>
        </Box>
        <Box>
          <Flex flexDirection="column">
            <h4>Source code</h4>
            <a
              href="https://github.com/apburnes/allpointsburnes"
              rel="noopener noreferrer"
              target="_blank"
            >
              Github
            </a>
          </Flex>
        </Box>
      </Flex>
    </ContentContainer>
  </Flex>
)

const Footer = styled(FooterComponent)`
  border-top: 1px solid;
  background-color: #4a4a4a;
  & h4 {
    color: #ffffff;
    margin-bottom: 0.3em;
  }
`

export default Footer
