import React from 'react';

import PersonItem from './PersonItem';
import './PersonsList.css';


const PersonsList = props => {
  
  return (
    <ul className='persons-list'>
      {props.items.map( person => {
        return(
          <PersonItem
            key={person.id}
            id={person.id}
            name={person.name}
            photo={person.photos[0].url}               // Gets the first photo of each person
            num_photos={person.photos.length}
          />
        )
      })}
    </ul>
  );
};

export default PersonsList;
