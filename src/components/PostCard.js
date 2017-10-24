import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import Link from 'gatsby-link';
import { rhythm, scale } from '../utils/typography';
import formatDate from '../utils/formatDate';

const Comp = ({className, frontmatter}) => {
  const { date, description, path, title } = frontmatter;

  return (
    <Box
      width={[1]}
    >
      <Link
        to={path}
        className={className}
      >
        <Flex
          align='center'
          column
          className='post-flex'
          px={1}
          my={1}
        >
          <Box
            width={[1]}
            px={[1,2]}
          >
            <Flex
              align='center'
              justify='space-between'
            >
              <h4
                style={{
                  ...scale(-1 / 4)
                }}
              >
                {title}
              </h4>
              <p
                style={{
                  ...scale(-.75),
                  marginBottom: rhythm(0),
                  marginTop: rhythm(0),
                  color: 'rgb(150,150,150)'
                }}
              >
                {formatDate(date)}
              </p>
            </Flex>
          </Box>
          <Box
            width={[1]}
            px={[1,2]}
            pb={1}
          >
            <p
              style={{
                ...scale(-1 / 3),
                lineHeight: rhythm(.8)
              }}
            >
              {description}
            </p>
          </Box>
        </Flex>
    </Link>
  </Box>
)};

Comp.propTypes = {
  className: PropTypes.string,
  date: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  to: PropTypes.string
}

const PostCard = styled(Comp)`
  color: black;
  :hover {
    text-decoration: none;
  }
  :hover .post-flex {
    border: 1px solid rgb(150,150,150);
  }
  .post-flex {
    border: 1px dashed rgb(200,200,200);
    height: 100px;
    background-color: #fff;
    box-shadow: 10px 10px 0px rgb(240,240,240);
  }
  div > h4,h5,p {
    margin: 0;
    padding: 0;
  }
`;

export default PostCard;
