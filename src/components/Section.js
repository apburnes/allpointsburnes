import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'gatsby-link';
import { Box, Flex } from 'grid-styled';

const Comp = ({children, className, name, to}) => {
  const headerLink = () => {
    if (to) {
      return (
        <Link
          to={to}
        >
          <h2>{name.toUpperCase()}</h2>
        </Link>
      );
    }

    return (
      <h2>{name.toUpperCase()}</h2>
    );
  }

  return (
    <Flex
      align='center'
      column
    >
      <Box
        className={className}
        py={1}
        width={[1]}
      >
        {headerLink()}
      </Box>
      <Box
        py={1}
        width={[1]}
      >
        {children}
      </Box>
    </Flex>
)};

Comp.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  className: PropTypes.string,
  name: PropTypes.string,
  to: PropTypes.string
};

const Section = styled(Comp)`
  border-bottom: 2px solid black;
  h2 {
    margin: 0;
    padding: 0;
  }
  & a {
    margin: 0;
    padding: 0;
    text-decoration: none;
    color: rgb(55,55,55);
    & h2 {
      margin: 0;
      padding: 0;
    }
    :hover {
      text-decoration: none;
    }
  }
`;

export default Section;
