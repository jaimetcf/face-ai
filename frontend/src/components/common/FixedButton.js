import './FixedButton.css';
import React from 'react';


const Button = props => {
  if( props.position === 'right')  {
    return (
      <button className="fixed-button" style={{right:0}}>
        {props.children}
      </button>
    );
  }
  else  {
    return (
      <button className="fixed-button" style={{left:0}}>
        {props.children}
      </button>
    );
  }
};

export default Button;
