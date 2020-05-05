import React from 'react';
import { Link } from 'react-router-dom';

import Thumbnail from '../common/Thumbnail';
import ListItem  from '../common/ListItem';
import './PersonItem.css';


const PersonItem = (props) => {
  return (
    <li className="person-item">
      <ListItem className="person-item__content">
        <Link to={`/person/update/${props.id}/${props.name}`}>
          <div className="person-item__image">
            <Thumbnail image={props.photo} alt={props.name} />
          </div>
          <div className="person-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.num_photos} {props.num_photos === 1 ? 'Photo' : 'Photos'}
            </h3>
          </div>
        </Link>
      </ListItem>
    </li>
  );
};

export default PersonItem;
