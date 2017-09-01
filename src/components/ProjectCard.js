import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import { rhythm, scale } from '../utils/typography';
import Icon from './graphics/Icon';

const Comp = ({className, description, link, name, type}) => {

  return (
  <Box
    width={[1,1/2]}
  >
    <a
      href={link}
      className={className}
      target='_blank'
    >
      <Flex
        align='center'
        column
        className='post-flex'
        p={1}
      >
        <Box
          width={[1]}
        >
          <Flex
            align='center'
            justify='flex-end'
          >
           <Icon type={type} />
          </Flex>
        </Box>
        <Box
          width={[1]}
        >
          <Flex
            align='center'
            justify='flex-start'
          >
            <h4
              style={{
                ...scale(-1 / 4),
                lineHeight: rhythm(1/2),
                marginBottom: rhythm(1/8)
              }}
            >
              {name.toUpperCase()}
            </h4>
          </Flex>
        </Box>
        <Box
          width={[1]}
        >
          <p
            style={{
              ...scale(-1 / 3),
              lineHeight: rhythm(1/2)
            }}
          >
            {description}
          </p>
        </Box>
      </Flex>
    </a>
  </Box>
)};

Comp.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  link: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string
}

const ProjectCard = styled(Comp)`
  color: black;
  :hover {
    text-decoration: none;
  }
  :hover .post-flex {
    border: 1px solid rgb(150,150,150);
  }
  .post-flex {
    border: 1px dashed rgb(200,200,200);
    height: 150px;
  }
  div > .post-date {
    font-size: .7em;
    color: rgb(100,100,100);
  }
  div > h4,h5,p {
    margin: 0;
    padding: 0;
    line-height:
  }
`;

export default ProjectCard;
