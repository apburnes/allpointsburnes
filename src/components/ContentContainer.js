import React from 'react';
import { Box } from 'grid-styled';

export default ({children}) => (
  <Box
    width={[9/10, 3/4, 2/3]}
  >
    {children}
  </Box>
);
