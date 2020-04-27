import React  from 'react';

import FaceRecognition  from './FaceRecognition';
import ListItem         from '../common/ListItem';
import Button           from '../common/Button';
import './PhotoItem.css';

const PhotoItem = (props) => {

  const  findFaces = () => {

    var faceRecognition = new FaceRecognition();
    faceRecognition.findFaces(props.photo);

  }

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
            <Button onClick={findFaces}>Find face</Button>
            <Button >Landmarks</Button>
            <Button >Clear</Button>
          </div>
        </ListItem>
      </li>
    </React.Fragment>
  );
};

export default  PhotoItem;
