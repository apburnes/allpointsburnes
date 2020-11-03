import React from 'react'
import { Flex } from 'reflexbox'
import styled from 'styled-components'
import { color, space, typography } from 'styled-system'

const H4 = styled.h4`
  ${color}
  ${space}
  ${typography}
  ${{
    color: 'rgb(255,255,255)',
    fontSize: '16px',
    margin: '.1rem',
  }}
`

const A = styled.a`
  ${typography}
  ${{
    fontFamily: 'sans-serif',
    fontSize: '16px',
    lineHeight: 1.2,
    margin: '.1rem',
  }}
`

const Copy = styled.p`
  ${typography}
  ${{
    color: 'rgb(200,200,200)',
    fontFamily: 'sans-serif',
    lineHeight: 1.2,
    margin: '.1rem',
  }}
`

const FooterComponent = ({ className }) => (
  <Flex
    className={className}
    color="rgb(255,255,255)"
    flexWrap="wrap"
    mt={4}
    py={[2, 3]}
    px={[2, 3]}
  >
    <Flex flexDirection="column" width={[1, 1, 3 / 4]} mt={[2, 2, 1]}>
      <Flex flexWrap="wrap" justifyContent="flex-start">
        <H4>Built with</H4>
        <A
          href="https://facebook.github.io/react/"
          rel="noopener noreferrer"
          target="_blank"
        >
          ReactJS
        </A>
        <A
          href="https://www.gatsbyjs.org/"
          rel="noopener noreferrer"
          target="_blank"
        >
          GatsbyJS
        </A>
        <A
          href="https://www.netlify.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Netlify
        </A>
      </Flex>
      <Flex flexWrap="wrap" justifyContent="flex-start">
        <H4>Source code</H4>
        <A
          href="https://github.com/apburnes/allpointsburnes"
          rel="noopener noreferrer"
          target="_blank"
        >
          Github
        </A>
      </Flex>
    </Flex>
    <Flex
      flexDirection="column"
      alignItems="flex-end"
      width={[1, 1, 1 / 4]}
      mt={[2, 2, 1]}
    >
      <Copy fontSize={[14, 16]}>© Andrew Burnes 2020</Copy>
    </Flex>
  </Flex>
)

const Footer = styled(FooterComponent)`
  border-top: 1px solid;
  background-color: rgb(44, 44, 44);
`

export default Footer
