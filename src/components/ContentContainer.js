import React from 'react';
import { Box } from 'grid-styled';

export default ({children}) => (
  <Box
    width={[3/4, 2/3]}
  >
    {children}
  </Box>
);
