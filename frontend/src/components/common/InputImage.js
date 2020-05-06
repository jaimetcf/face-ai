// This component is a reusable image upload input element
import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './InputImage.css';


const InputImage = (props) => {
  
  // ------------------------------ STATE ---------------------------------
  const [file, setFile] = useState('');               // A UTF-16 String with the path to the selected image file
  const [previewUrl, setPreviewUrl] = useState(null); // Will contain the preview image bytes
  const [isValid, setIsValid] = useState(true);

  const filePreviewRef = useRef();

  
  // ---------------------------- FUNCTIONS -------------------------------
  // This function gets executed first, as the user clicks on the Select Image button
  // It sends a click event to the file input
  const selectImage = () => {
    filePreviewRef.current.click(); // Sends a click event to the file input
  };

  // This is the 2nd function to be executed, as the input receives the click event
  const getSelectedFile = (event) => {
    let selectedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length > 0) {
      selectedFile = event.target.files[0];   // Gets the first file selected by the user (UTF-16 String)
      setFile(selectedFile);  // Updates ImageInput file state
      setIsValid(true);       // Updates ImageInput isValid state
      fileIsValid = true;
    } else {
      setIsValid(false);      // Updates ImageInput isValid state
      fileIsValid = false;
    }

    // Returns the selected file back to the component where this 
    // ImageInput component is inserted. The function getState must
    // be passed as a parameter to this component
    props.getState(props.id, selectedFile, fileIsValid);
  };

  // This is the 3rd function that executes, when the file state updates, and it reads 
  // the image file so it can be shown in the screen, inside the input element
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);


  // ---------------------------- RENDERING -------------------------------
  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePreviewRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={getSelectedFile}
      />
      <div className={`input-image ${props.center && 'center'}`}>
        <div className="input-image__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please select a file.</p>}
        </div>
        <Button type="button" onClick={selectImage}>
          Select Image
        </Button>
      </div>
      {!isValid && <p>{props.errorMsg}</p>}
    </div>
  );
};

export default InputImage;
