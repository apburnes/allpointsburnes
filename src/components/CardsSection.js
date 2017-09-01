import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex } from 'grid-styled';
import ProjectCard from './ProjectCard';

const CardSection = (Comp) => ({data, length}) => {
  const { edges } = data;
  const len = length ? length : edges.length;
  const comps = edges.slice(0,len).map((edge, idx) => (
    <Comp
      key={idx}
      {...edge.node} />
  ));

  return (
    <Flex
      justify='justify-start'
      wrap
    >
      {comps}
    </Flex>
  );
}

export default CardSection;
