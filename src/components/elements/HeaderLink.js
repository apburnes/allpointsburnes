import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PageLink from './PageLink';

const Comp = ({className, text, to}) => (
    <PageLink
      color={'rgb(100,100,100)'}
      className={className}
      fontFamily={'Source Sans Pro,sans-serif'}
      text={text}
      to={to}
    />
  );

const HeaderLink = styled(Comp)`
  text-transform: uppercase;
  font-weight: 200;
  font-size: .8em;
`;

export default HeaderLink;
