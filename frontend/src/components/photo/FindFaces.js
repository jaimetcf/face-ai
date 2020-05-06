// This component is a reusable image upload input element
import React, { useRef, useContext, useState, useEffect } from 'react';

import { AppContext }    from '../../AppContext';
import User              from '../user/User';
import Panel             from '../common/Panel';
import Button            from '../common/Button';
import WaitingSpinner    from '../common/WaitingSpinner';
import ErrorModal        from '../common/ErrorModal';

import '../photo/PhotoItem.css';
import './FindFaces.css';


// The current user id will be used for querying the database
const currentUser = new User();  


const  FindFaces = (props) => {
  
    // Needed for recovering domain name
    const appContext = useContext(AppContext);

    // ------------------------------ STATE ---------------------------------
    // This state goes true whenever a request was sent to the 
    // backend and the response was not received yet
    const [ waiting, setWaiting ] = useState(false);

    // This state saves any error ocurred when communicating with the backend
    const [ error, setError ] = useState(null);


    const [file, setFile] = useState('');               // A UTF-16 String with the path to the selected image file
    const [previewUrl, setPreviewUrl] = useState(null); // Will contain the preview image bytes
    const [isValid, setIsValid] = useState(false);

    const [imageUrl, setImageUrl] = useState(null);  // Image with faces recognized

    const filePreviewRef = useRef();

  
    // ---------------------------- FUNCTIONS -------------------------------

    // The next 3 functions take care of allowing the user to select a new
    // image file and show this selected image on screen.

    // This function gets executed first, as the user selects an image on the 
    // input control. It sends a click event to the file input
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
    }

    // This is the 3rd function that executes, when the 'file' state updates, and it reads 
    // the image file so it can be shown in the screen, inside the input element
    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result); // Assigns preview image to state
            setImageUrl(null); // Removes the previous image from state
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    // This function called when the user clicks the Find Faces button. 
    // It sends the userId and the image uploaded to the backend in 
    // a POST request to the /photo/create endpoint, and received back
    // an object with a url for the image with the recognized faces marked.
    // It also assigns the state 'image', so this received image is shown 
    const postFindFaces = async (event) => {
        
        event.preventDefault();  // Prevents browser from reloading the page
        setWaiting(true);        // Shows waiting spinner on screen

        // Prepares data to be sent using formData object
        const formData = new FormData();
        formData.append('userId' , currentUser.getId() );
        formData.append('numbers', 'false' );
        formData.append('image'  , file );

        // Sends the POST request to the '/user/recognizefaces' endpoint
        fetch( appContext.backendDomain + '/user/recognizefaces', { method: 'POST', body: formData } )
        .then( async (res) => {     // Received a response 2xx, 4xx, or 5xx
    
            const response = await res.json(); // Converts string to json object

            if(res.ok) {   // Status = 2xx
                setWaiting(false);      // Hides waiting spinner          
                console.log('Faces recognized:');
                console.log(response);

                // Removes the preview image from state
                setPreviewUrl(null);   
                // Assigns image with recognized faces to 'imageUrl' state
                setImageUrl(appContext.backendDomain + response.imageUrl);
            }
            else {         // Status IS NOT 2xx
         
                // Forwards error message comming from backend
                // to be treated in the catch block, below
                throw new Error(response.message);
            }

        }).catch( (err) => {  // Communication error or response status is not 2xx
            setWaiting(false);      // Hides waiting spinner
            setError(err.message);  // Shows error modal with error msg on screen  
        });
    }

    // Updates component error state
    const clearError = () => {
        setError(null);
    };


    // ---------------------------- RENDERING -------------------------------
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {waiting && <WaitingSpinner asOverlay/>}
            {!waiting && (
            <div>
                <div className='findfaces-form'>
                    <input
                        id={props.id}
                        ref={filePreviewRef}
                        style={{ display: 'none' }}
                        type="file"
                        accept=".jpg,.png,.jpeg"
                        onChange={getSelectedFile}
                    />
                    <div className='photo-item__image' style={{ height: '28rem' }}>
                        {previewUrl && <img src={previewUrl} alt="Preview" />}
                        {imageUrl   && <img src={imageUrl} alt={imageUrl} />}
                        {(!previewUrl && !imageUrl) && <p>Please select a file.</p>}
                    </div>
                </div>
                <Panel style={{bottom: 0}}>
                    <Button type="button" onClick={selectImage}>
                        Select Image
                    </Button>
                    <Button onClick={postFindFaces} disabled={!previewUrl}>
                        Find Faces
                    </Button>
                </Panel>
            </div>
            )}
        </React.Fragment>
    );
}


export default  FindFaces;
