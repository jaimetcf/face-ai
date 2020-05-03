import React from 'react';

import './WaitingSpinner.css';


const WaitingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay && 'waiting-spinner__overlay'}`}>
      <div className="ws-dual-ring"></div>
    </div>
  );
};

export default  WaitingSpinner;
