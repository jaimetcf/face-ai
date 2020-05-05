import React, { useContext } from 'react';

import { AppContext }  from '../../AppContext';
import PersonItem from './PersonItem';
import './PeopleList.css';


const PeopleList = props => {
  
  // Needed for recovering domain name to render person photo
  const appContext = useContext(AppContext);

  return (
    <ul className='people-list'>
      {props.items.map( person => {
        return(
          <PersonItem
            key={person.id}
            id={person.id}
            name={person.name}
            photo={appContext.backendDomain + person.photos[0]}    // Gets the first photo of each person
//            photo={person.photos[0].url}                         // Gets the first photo of each person
            num_photos={person.photos.length}
          />
        )
      })}
    </ul>
  );
};

export default PeopleList;
