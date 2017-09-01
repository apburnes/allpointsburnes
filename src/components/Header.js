import React from 'react';
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import HeaderLink from './elements/HeaderLink';
import MiniLogo from './graphics/MiniLogo';

const Link = styled(HeaderLink)`
  border-bottom: ${props => {
    const toPath = props.to.replace('/','');
    const current = props.pathname.replace('/', '').replace('/', '');

    return toPath === current ? '2px solid black' : 'none'
  }};
`;

export default ({pathname}) => (
  <Box
    width={[1]}
  >
    <Flex
      align='center'
      justify='space-between'
      wrap
    >
      <Box
        p={[1/2]}
        m='auto'
      >
        <MiniLogo />
      </Box>
      <Box
        p={[1]}
        m='auto'
      >
        <Flex
          align='center'
          justify='space-between'
        >
          <Box
            m='auto'
            p={1}
          >
          </Box>
          <Box
            m='auto'
            p={1}
          >
            <Link
              pathname={pathname}
              to='/posts'
              text='posts' />
          </Box>
        </Flex>
      </Box>
    </Flex>
  </Box>
);
