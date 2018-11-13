import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@rebass/grid'
import ContentContainer from './ContentContainer'
import HeaderLink from './elements/HeaderLink'
import MiniLogo from './graphics/MiniLogo'

const Link = styled(HeaderLink)`
  border-bottom: ${props => {
    const toPath = props.to.replace('/', '')
    const current = props.pathname.replace('/', '').replace('/', '')

    return toPath === current ? '2px solid black' : 'none'
  }};
`

export default ({ pathname }) => (
  <ContentContainer>
    <Flex
      alignItems="flex-start"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <Box p={[1 / 2]}>
        <MiniLogo />
      </Box>
      <Box p={[1]}>
        <Flex width={1} alignItems="flex-end">
          <Box m="auto" p={1}>
            <Link pathname={pathname} to="/posts" text="posts" />
          </Box>
        </Flex>
      </Box>
    </Flex>
  </ContentContainer>
)
