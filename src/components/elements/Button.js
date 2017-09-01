import React from 'react';
import styled from 'styled-components';

const Comp = ({children, className, onClick}) => {
  return (
    <div
      className={className}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

const Button = styled(Comp)`
  padding: ${props => props.padding ? props.padding : '10px'};
  border: ${props => props.border ? props.border : '1px solid black'};
  border-radius: ${props => props.borderRadius ? props.borderRadius : '5px'};
  :hover {
    transform: scale(1.1);
  }
`

export default Button;
