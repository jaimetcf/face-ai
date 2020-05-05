import React, { useContext } from 'react';

import { AppContext }  from '../../AppContext';
import PhotoItem from './PhotoItem';
import './PhotosList.css';


const PhotosList = props => {
  
  // Needed for recovering domain name to render person photo
  const appContext = useContext(AppContext);

  return (
    <ul className='photos-list'>
      {props.items.map( photo => {
        return(
          <PhotoItem
            key={photo.id}
            id={photo.id}
            photo={appContext.backendDomain + photo.url} 
            deleteFun={props.deleteFun}
          />
        )
      })}
    </ul>
  );
};

export default PhotosList;
