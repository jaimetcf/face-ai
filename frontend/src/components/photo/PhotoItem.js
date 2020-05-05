import React             from 'react';

import ListItem          from '../common/ListItem';
import Button            from '../common/Button';
import './PhotoItem.css';


const PhotoItem = (props) => {

  // ---------------------------- RENDERING -------------------------------
  return (
    <React.Fragment>
        <li className="photo-item">
          <ListItem className="photo-item__content">
            <div className="photo-item__image">
              <img
                src={props.photo}
                alt={props.id}
              />
            </div>
            <div className="photo-item__buttons">
              <Button onClick={ () => {props.deleteFun(props.id)} }>Delete photo</Button>
            </div>
          </ListItem>
        </li>
    </React.Fragment>
  );
};

export default  PhotoItem;
