import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Flex } from 'reflexbox'
import ResumeCard from './ResumeCard'

const FilterComp = (Comp) => ({ data, k, v }) => {
  const comps = data
    .filter((i) => i.node[k] === v)
    .map((item, idx) => <Comp key={idx} {...item.node} />)

  return <div>{comps}</div>
}

const Comp = ({ className, edges }) => {
  const Cards = FilterComp(ResumeCard)

  return (
    <Flex className={className} flexWrap="wrap">
      <Box width={[1, 1, 1 / 2]} p={2}>
        <Flex alignItems="center" justifyContent="center">
          Education
        </Flex>
        <Cards data={edges} k="type" v="academic" />
      </Box>
      <Box width={[1, 1, 1 / 2]} p={2}>
        <Flex alignItems="center" justifyContent="center">
          Professional
        </Flex>
        <Cards data={edges} k="type" v="work" />
      </Box>
    </Flex>
  )
}

const Resume = styled(Comp)`
  width: 100%;
`

Resume.propTypes = {
  className: PropTypes.string,
  edges: PropTypes.array.isRequired,
}

export default Resume
