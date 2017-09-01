import React from 'react';
import { Box, Flex } from 'grid-styled';

export default ({children}) => (
  <Box
    p={[1,2]}
    width={[1]}
  >
    <Flex
      column
      align='center'
    >
      {children}
    </Flex>
  </Box>
);
