import React from 'react';
import { Box, Flex } from 'grid-styled';
import styled from 'styled-components';
import { rhythm } from '../utils/typography';

const Comp = ({className}) => (
    <Flex
    className={className}
    justify='justify-start'
    my={4}
    wrap
  >
    <hr
      style={{
        marginBottom: rhythm(1),
      }} />
    <Box
      width={[1/2]}
    >
      <Flex
        column
      >
        <h4>Built thanks to...</h4>
        <a
          href='https://facebook.github.io/react/'
          rel='noopener noreferrer'
          target='_blank'
        >ReactJS</a>
        <a
          href='https://www.gatsbyjs.org/'
          rel='noopener noreferrer'
          target='_blank'
        >GatsbyJS</a>
        <a
          href='https://www.netlify.com/'
          rel='noopener noreferrer'
          target='_blank'
        >Netlify</a>
      </Flex>
    </Box>
    <Box
      width={[1/2]}
    >
      <Flex
        column
      >
        <h4>Site source code at...</h4>
        <a
          href='https://github.com/apburnes/allpointsburnes'
          rel='noopener noreferrer'
          target='_blank'
        >Github</a>
      </Flex>
    </Box>
  </Flex>
)

const Footer = styled(Comp)`
  border-top: 1px solid
`;

export default Footer;
