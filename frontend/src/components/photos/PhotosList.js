import React from 'react';

import PhotoItem from './PhotoItem';
import './PhotosList.css';


const PhotosList = props => {
  
  return (
    <ul className='photos-list'>
      {props.items.map( photo => {
        return(
          <PhotoItem
            key={photo.id}
            id={photo.id}
            photo={photo.url} 
          />
        )
      })}
    </ul>
  );
};

export default PhotosList;
