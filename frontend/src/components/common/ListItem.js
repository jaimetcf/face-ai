import React from 'react';

import './ListItem.css';

const ListItem = (props) => {
  return (
    <div className={`list-item ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default  ListItem;
