import React from 'react';
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import SvgLogo from './graphics/SvgLogo';

export default () => (
  <Flex
    align='center'
    justify='center'
    m={[1]}
  >
    <Box
      width={[1]}
    >
      <Flex
        align='center'
        justify='center'
      >
        <SvgLogo />
      </Flex>
    </Box>
  </Flex>
);
