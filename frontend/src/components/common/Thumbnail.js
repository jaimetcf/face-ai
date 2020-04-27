import React from 'react';

import './Thumbnail.css';

const Thumbnail = (props) => {
  return (
    <div className={`thumbnail ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default  Thumbnail;
