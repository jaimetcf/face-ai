////////////////////////////////////////////////////////////////////////////////////////
// This file contains the functions that treat endpoints associated with the Photo model
////////////////////////////////////////////////////////////////////////////////////////

//--------------------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const faceapi = require('face-api.js');
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const { Canvas, createCanvas, Image, ImageData, loadImage } = require('canvas');

// Patch nodejs environment, something needed to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

const HttpError = require('./http-error');
const Person    = require('./model-person');
const Photo     = require('./model-photo');
//--------------------------------------------------------------------------------------


// Creates a new Photo document in the database, with pesronId,
// and image url passed as parameters in the message body.
// Also, after reading the image file, detects the face on it,
// and calculates the face descriptor, so it can be persisted inside
// the Photo document, for future use. 
const createPhoto = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next( new HttpError('Invalid inputs passed, please check your data.', 422) );
    }

    const { personId, url } = req.body; // Gets params from the post message

    // Extracts file name from the url parameter
    const urlArray = url.split('/');
    const fileName = urlArray[urlArray.length - 1];
    console.log('fileName => ' + fileName );

    //----------------------------------------------------------------------
    // START OF IMAGE PROCESSING PART
    //----------------------------------------------------------------------
    // Reads file as a bitmap object
    loadImage(url).then( (imageBitmap) => {
  
      console.log('Processing the file' + url + '. Please, wait!');
  
      // Creates a canvas, named input, with the bitmap dimensions
      const input = createCanvas( imageBitmap.width, imageBitmap.height );
  
      // Draws the bitmap on a canvas
      const ctx = input.getContext('2d')
      ctx.drawImage( imageBitmap, 0, 0 );
  
      // detects faces and landmarks on image
      faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors().then( (descriptors) => {
  
        if( descriptors.length > 0) {
  
//          console.log(descriptors[0].descriptor);
  
          // draw detections and landmarks on the canvas
          faceapi.draw.drawDetections(input, descriptors)
          faceapi.draw.drawFaceLandmarks(input, descriptors)
              
          // Writes the canvas back to a file
          const out = fs.createWriteStream('./images/landmarked/' + fileName);
          const stream = input.createJPEGStream({
            // Disable 2x2 chromaSubsampling for deeper colors and use a higher quality
            quality: 0.95,
            chromaSubsampling: false
          });
          stream.pipe(out);
          out.on('finish', () => {
            console.log('The file  /images/landmarked/' + fileName + ' was created!');
          });

          //----------------------------------------------------------------------
          // END OF IMAGE PROCESSING PART. START OF DATABASE PART
          //----------------------------------------------------------------------
          // Reads the specified User document
          Person.findById(personId).then( async (person) => {

            if (!person) {
              // currentUser was not found in database
              return next( new HttpError('Specified person not found in database.',  422 ) );
            }

            // Creates a new Photo document
            const createdPhoto = new Photo({ 
              person_id: personId,
              url: url,
              face_descriptor: descriptors[0].descriptor
            });
            
            // Adds the new Photo document to database
            try {
              const sess = await mongoose.startSession();
              sess.startTransaction();
              // ATENTION: ENSURE THERE IS A COLLECTION NAMED 'photos' in mongodb.
              // Otherwise, the line immediately bellow will throw an error
              await createdPhoto.save({ session: sess });
              person.photos.push(createdPhoto);
              await person.save({ session: sess });
              await sess.commitTransaction();
            } catch (err) {
              return next( new HttpError('Database error when adding new Photo. Please try again.', 422) );
            }

            res.status(201).json(createdPhoto);
          
          }).catch( (err) => {
            return next( new HttpError('Database error when adding new Photo. Please try again.', 422) );
          });

        }
        else {
          res.json({ message: 'Found no faces in photo' });
        }

      }).catch( (err) => {
        return next( new HttpError('Failure detecting face descriptors in photo.', 422) );
      });

    }).catch( (err) => {
      return next( new HttpError('Failure reading the image file.', 422) );
    });
  
}

// Returns all Person documents associated with the personId
// passed as parameter in the message body
const readPersonPhotos = async (req, res, next) => {

  const { personId } = req.body; // Gets personId from the post message

  // Reads the Person document personId in the database, 
  // and also the Photo documents in the list person.photos
  Person.findById(personId).populate('photos').then( (person) => {
      
      if(person) {
        // Replies with the list of photos
        res.json( person.photos.map( photo => photo.toObject({ getters: true })) );
      }
      else {
        return next( new HttpError('Could not find the person specified.', 500) );
      }

  }).catch( (err) => {
      return next( new HttpError('Accessing database failed, please try again.', 500) );
  });
}

// TEST
// Deletes the Photo document referenced by the
// photoId passed as parameter in the message body
const deletePhoto = async (req, res, next) => {
    
  const { photoId } = req.body; // Gets photoId from the post message

    // Reads photoId document from the database. We need that the Person 
    // document, referenced by person_id, be also read from the database.
    Photo.findById(photoId).then( async (photo) => {
      
      if (!photo) {
          return next( new HttpError('Could not find the photo with the specified id.', 404) );
      }

      try {
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await photo.remove({ session: sess });
          const person = await Person.findById(photo.person_id);
          if(!person) { return next( new HttpError('Could not delete photo. Problem accessing database.', 500) ); }
          person.photos.pull(photo); // Removes this photo from person.photos list
          await person.save({ session: sess });
          await sess.commitTransaction();

      } catch (err) {
          return next( new HttpError('Could not delete photo. Problem accessing database.', 500) );
      }

      res.status(200).json({ message: 'Deleted photo.' });

  }).catch( (err) => {
      return next( new HttpError('Problem accessing database. Please try again.', 500) );
  });      
}


exports.createPhoto      = createPhoto;
exports.readPersonPhotos = readPersonPhotos;
exports.deletePhoto      = deletePhoto;
