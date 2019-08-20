import React from 'react'
import { Box, Flex } from 'reflexbox'

export default ({ children }) => (
  <Box p={[1, 2]} width={1}>
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      {children}
    </Flex>
  </Box>
)
