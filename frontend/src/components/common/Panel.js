import React from 'react';

import './Panel.css';

const Panel = (props) => {
    return (
      <div className={`panel ${props.className}`} style={props.style}>
        {props.children}
      </div>
    );
};
  

export default  Panel;
