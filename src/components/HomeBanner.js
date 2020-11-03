import React from 'react'
import { Box, Flex } from 'reflexbox'
import styled from 'styled-components'
import { color, typography } from 'styled-system'
import SvgLogo from './graphics/SvgLogo'

const Text = styled.p`
  ${typography}
`

const Span = styled.span`
  ${typography}
  ${color}
`

export default () => (
  <Flex
    alignItems="center"
    justifyContent="center"
    flexWrap="wrap"
    p={[1, 2]}
    m={[1, 2]}
  >
    <Box width={[1, 1, 1 / 2]}>
      <Flex alignItems="center" justifyContent="center">
        <Box width={[9 / 10, 3 / 4, 1]} maxWidth={678}>
          <SvgLogo />
        </Box>
      </Flex>
    </Box>
    <Box width={[1, 1, 1 / 2]}>
      <Flex alignItems="center" justifyContent="center">
        <Box width={[9 / 10, 3 / 4, 1]} maxWidth={678}>
          <Text
            lineHeight={'1.25'}
            fontFamily={'sans-serif'}
            fontSize={[24, 26, 28]}
          >
            I'm <Span fontWeight="bold">Andrew Burnes</Span> and I help the
            federal government build better technology with open source
            software.{' '}
            <Span
              color="rgb(130,130,130)"
              fontSize={[16, 18, 20]}
              fontStyle="italic"
            >
              (Tou aprendendo português também!{' '}
              <span role="img" aria-label="brasil flag">
                🇧🇷
              </span>
              )
            </Span>
          </Text>
        </Box>
      </Flex>
    </Box>
  </Flex>
)
