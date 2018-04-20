import React from 'react';
import styled from 'styled-components';

export default () => {
  const Spinner = styled.div`
    border-radius: 50%;
    width: 10em;
    height: 10em;
    margin: 60px auto;
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    border-top: 1.1em solid rgba(87, 194, 192, 0.2);
    border-right: 1.1em solid rgba(87, 194, 192, 0.2);
    border-bottom: 1.1em solid rgba(87, 194, 192, 0.2);
    border-left: 1.1em solid #57c2c0;
    transform: translateZ(0);
    animation: load8 1.1s infinite linear;

    &:after {
      border-radius: 50%;
      width: 10em;
      height: 10em;
    }

    @keyframes load8 {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;
  return <Spinner />;
};
