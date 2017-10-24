import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import { rhythm, scale } from '../utils/typography';
import Icon from './graphics/Icon';

const Comp = ({
    className,
    employer,
    end,
    degree,
    position,
    school,
    start,
    type
  }) => {

  const title = position ? position : degree;
  const place = employer ? employer : school;

  return (
    <Box
      className={className}
      width={[1,1/2]}
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
              {title.toUpperCase()}
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
            {place}
          </p>
        </Box>
        <Box
          pt={1}
          width={[1]}
        >
          <Flex
            align='center'
            justify='flex-end'
            wrap
          >
            <Box>
              <h6
                style={{
                  ...scale(-1 / 3),
                  lineHeight: rhythm(1/2),
                  margin: 0,
                  padding: 0,
                  float: 'right'
                }}
              >
                {start}
              </h6>
            </Box>
            <Box
              px={1}
            >
              <p
                style={{
                  ...scale(-1 / 2),
                  lineHeight: rhythm(1/2),
                  margin: 0,
                  padding: 0
                }}
              >
                to
              </p>
            </Box>
            <Box>
              <h6
                style={{
                  ...scale(-1 / 3),
                  lineHeight: rhythm(1/2),
                  margin: 0,
                  padding: 0,
                  float: 'right'
                }}
              >
                {end}
              </h6>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>);
};

const ResumeCard = styled(Comp)`
  color: black;
  background-color: #fff;
  box-shadow: 10px 10px 0px rgb(240,240,240);
  .post-flex {
    border: 1px solid rgb(200,200,200);
    height: 125px;
  }
  div > h4,h5,p {
    margin: 0;
    padding: 0;
    line-height:
  }
`;

export default ResumeCard;
