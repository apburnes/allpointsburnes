import React from 'react'
import { Box, Flex } from '@rebass/grid'
import SvgLogo from './graphics/SvgLogo'

export default () => (
  <Flex alignItems="center" justifyContent="center" m={[1]}>
    <Box width={[1]}>
      <Flex alignItems="center" justifyContent="center">
        <SvgLogo />
      </Flex>
    </Box>
  </Flex>
)
