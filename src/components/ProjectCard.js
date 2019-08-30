import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Flex } from 'reflexbox'
import { rhythm, scale } from '../utils/typography'
import Icon from './graphics/Icon'

const Comp = ({ className, description, link, name, type }) => {
  return (
    <Box width={[1, 1 / 2]} p={[2, 3]}>
      <a
        href={link}
        className={className}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Flex
          alignItems="center"
          flexDirection="column"
          className="post-flex"
          p={1}
        >
          <Box width={[1]}>
            <Flex alignItems="center" justifyContent="flex-end">
              <Icon type={type} />
            </Flex>
          </Box>
          <Box width={[1]} px={[2, 3]} pt={2} pb={2}>
            <Flex alignItems="center" justifyContent="flex-start">
              <h4
                style={{
                  ...scale(-1 / 4),
                  lineHeight: rhythm(1 / 2),
                  marginBottom: rhythm(1 / 8),
                }}
              >
                {name.toUpperCase()}
              </h4>
            </Flex>
          </Box>
          <Box width={[1]} px={[2, 3]} pb={2}>
            <p
              style={{
                ...scale(-1 / 3),
                lineHeight: rhythm(1 / 2),
              }}
            >
              {description}
            </p>
          </Box>
        </Flex>
      </a>
    </Box>
  )
}

Comp.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  link: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
}

const ProjectCard = styled(Comp)`
  color: black;
  :hover {
    text-decoration: none;
  }
  :hover .post-flex {
    border: 1px solid rgb(150, 150, 150);
    box-shadow: 10px 10px 0px rgb(220, 220, 220);
  }
  .post-flex {
    border: 1px dashed rgb(200, 200, 200);
    height: 150px;
    background-color: #fff;
    box-shadow: 10px 10px 0px rgb(240, 240, 240);
  }
  div > h4,
  h5,
  p {
    margin: 0;
    padding: 0;
  }
`

export default ProjectCard
