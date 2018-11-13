import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from '@rebass/grid'

const CardSection = Comp => ({ data, length }) => {
  const { edges } = data
  const len = length ? length : edges.length
  const comps = edges
    .slice(0, len)
    .map((edge, idx) => <Comp key={idx} {...edge.node} />)

  return (
    <Flex justifyContent="justify-start" flexWrap="wrap">
      {comps}
    </Flex>
  )
}

CardSection.propTypes = {
  data: PropTypes.shape({
    edge: PropTypes.object,
  }),
  length: PropTypes.number,
}

export default CardSection
