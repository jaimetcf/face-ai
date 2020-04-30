import '../../App.css';
import React, { Component } from 'react';
import FaceRecognition      from './FaceRecognition';

const IMAGE_HEIGHT = 400; // Image target size for both width and height
const IMAGE_WIDTH = 600;  // Matches the input size of MobileNet  224px x 224px.


class Findinimage extends Component {

  	constructor(props) {
    	super(props);

      // Gets parameter p1, which is the faceRecognition object, from the App object
      this.faceRecognition = props.match.params.p1;

    	this.renderCurrentImage   = this.renderCurrentImage.bind(this);
    	this.buttonFind           = this.buttonFind.bind(this);
    	this.printDetectedFaces   = this.printDetectedFaces.bind(this);
  	}

	  async renderCurrentImage() {

      	// Gets the array of image files selected
    	  const fileList = document.getElementById('select_image').files;
    	  const nImages = fileList.length;

    	  if( nImages > 0 ) {
      
      		  // Creates a bitmap for current image
		        const imageBitmap = await createImageBitmap(fileList[0]);

      		  // Draws image in document.canvas with size 
      		  var canvas = document.getElementById('canvas');
      		  var ctx = canvas.getContext('2d')
      		  ctx.drawImage( imageBitmap, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT );

   
      		  // Displays image file name on screen
      		  document.getElementById('file_name').innerHTML = fileList[0].name;
    	  }
	  }

	  async buttonFind() {

		    //  if( faceRecognition.model == null )    return;

  		  const canvas = document.getElementById('canvas');
  		  const results = await this.faceRecognition.findFaces(canvas);
  		  this.printDetectedObjects(results);
  		  //drawBBoxes(results);
	  }

    printDetectedFaces(results) {
    
    	  console.log('Detection results => '); 

	      const  nresults = results.length;
    	  if( nresults <= 0 ) {
	  		    console.log('No faces detected!');
      		  return;
    	  }

    	  for( var i=0; i<nresults; i++) {
        	  console.log('\nresults[', i, '].class = ', results[i].class,
              	        '\nresults[', i, '].score = ', results[i].score,
                  	    '\nresults[', i, '].bbox  = ', Math.round(results[i].bbox[0]), 
                      	                               Math.round(results[i].bbox[1]),
                          	                           Math.round(results[i].bbox[2]), 
                              	                       Math.round(results[i].bbox[3])
                   		  );
    	  } 
	  }

  	render() {

    	return (
        	<div>
			        <div className='app-display'>
      				    <canvas id="canvas" width="600" height="400"></canvas>
    			    </div>
    			    <div className='app-text'>
      				    <h4 id='file_name'> </h4>
    			    </div>
    			    <div className='app-buttons-bar'>
      				    <input id='select_image' type='file' accept='.jpg, .jpeg, .png' onChange={this.renderCurrentImage}/>    
      				    <button id='button_find' onClick={this.buttonFind}>Find faces</button>
    			    </div>
        	</div>
    	);
  	}

}


export default  Findinimage;