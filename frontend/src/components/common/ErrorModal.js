import React from 'react';

import Modal  from './Modal';
import Button from './Button';


const ErrorModal = props => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Ok</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};


export default ErrorModal;