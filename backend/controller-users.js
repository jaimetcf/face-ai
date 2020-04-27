////////////////////////////////////////////////////////////////////////////////////////
// This file contains the functions that treat endpoints associated with the User model
////////////////////////////////////////////////////////////////////////////////////////

//--------------------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const faceapi = require('face-api.js');
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const { Canvas, createCanvas, Image, ImageData, loadImage } = require('canvas');

// Patch nodejs environment, something needed to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
const HttpError = require('./http-error');
const User      = require('./model-user');
const Person    = require('./model-person');
const Photo     = require('./model-photo');
//--------------------------------------------------------------------------------------


// Creates a new user in the database,  with the name, email, 
// and password passed as parameters in the message body
const signup = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next( new HttpError('Invalid inputs passed, please check your data.', 422) );
    }

    const { name, email, password } = req.body;  // Gets params from the post message
    
    // tries to find this email in the database
    User.findOne({ email: email }).then( (existingUser) => {

        if (existingUser) {
            // the email already exists
            return next( new HttpError('User already exists, please login instead.',  422 ) );
        }

        const createdUser = new User({
            name: name,
            email: email,
            password: password,
            persons: []
        });

        // Adds the new User document to database
        createdUser.save().then( (result) => {
            res.status(201).json({ user_id: createdUser.id, name: createdUser.name, email: createdUser.email });
        }).catch( (err) => {
            return next( new HttpError('Signing up failed, please try again later.', 500) );
        });
  
    }).catch( (err) => {
        // Problems in database access
        return next( new HttpError('Signing up failed, please try again later.', 422) );
    });

};

// Tries to login the user which email and password are 
// passed as parameters in the message body
const login = async (req, res, next) => {

    const { email, password } = req.body;

    let existingUser;
    try {
        // tries to find this email in the database
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        // Problems accessing the database
        return next( new HttpError('Logging in failed, please try again later.', 500) );
    }

    if (!existingUser) {
        // The email does not exists in the database
        return next( new HttpError('Invalid email, could not log you in.', 403) );
    }

    if ( password != existingUser.password ) {
        // Password entered and user password do not match
        return next( new HttpError('Invalid password, could not log you in.', 403) );
    }

    console.log('User ' + currentUserId + ' login was successful' );

    // Replies user information
    res.json({ userId: existingUser.id, email: existingUser.email, });
};

// Returns all users in the database, if any
const readAll = async (req, res, next) => {
    
    // Reads all users from database, without reading the passwords
    User.find({}, '-password').then( (users) => {

        if(users) {
            // Replies with the list of users
            res.json({ users: users.map(user => user.toObject({ getters: true })) });
        }
        else {
            return next( new HttpError('Found no user in database.', 500) );
        }
    }).catch( (err) => {
        return next( new HttpError('Accessing database failed, please try again.', 500) );
    });
};

// Recognizes known faces on the image passed as parameter (imageUrl)
// Known faces means: the faces extracted from the photos under the people 
// associated to the userId, also passed here as a parameter, in the message body.
// *** THIS FUNCTION REQUIRES FACTORING -> For now, it's well explained in comments
const recognizeFaces = async (req, res, next) => {

    const numbersFlag = req.params.numbers;   // Extracts param numbers from the message
    const { userId, imageUrl } = req.body;    // Extracts parameters from message body

    // -------------------------------------------------------------------------------------------
    // FIRST PART: DATABASE, recovering all face descriptors, under the User, userId -------------
    
    console.log('Reading database, please wait...');
    // Reads the specified User document
    var user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        return next(new HttpError('Problem accessing database, please try again.', 500) );
    }

    if (!user || (user.persons.length == 0)) {
        // Found no user, or user.persons list is empty
        return next( new HttpError('User not found, or user has no person associated.', 404) );
    }
    
    var  labeledDescriptors = [];  var  descriptorsList;   var  person;   var  photo;
    console.log('user.persons => ' + user.persons );
    // Populates the 'labeledDescriptors' list that will be used to create a faceMatcher object, below
    for(let i=0; i<user.persons.length; i++) {

        // Reads each Person document (under the specified user above)
        try {
            person = await Person.findById(user.persons[i]);    
        } catch (err) {
            return next( new HttpError('Problem accessing database, reading Person.', 404) );
        }
            
        if(!person) { return next( new HttpError('Person not found', 404) ); }

//        console.log('person.name => ' + person.name );

        descriptorsList = [];
        for(let j=0; j<person.photos.length; j++)  {

            // Reads each Photo document (under each Person read in the outer for loop)
            try {
                photo = await Photo.findById(person.photos[j]);
            } catch (err) {
                return next( new HttpError('Problem accessing database, reading Photo.', 404) ); 
            }
            if(!photo) { return next( new HttpError('Photo not found.', 404) ); }

            console.log('photo.person_id: ' + photo.person_id + '  photo.url: ' + photo.url );

            // Pushes the face_descriptor of each Photo into descriptorsList.
            // The Object.values method is needed to convert the object read from the db
            // into a real array of values. 
            // The Float32Array cast is a requirement of faceapi.LabeledFaceDescriptors method,
            // that follows below
            descriptorsList.push( new Float32Array(Object.values(photo.face_descriptor[0])) );
        }

//        console.log('Number of descriptors for ' + person.name + ' = ' + descriptorsList.length );

        // Adds person.name and its descriptors in the labeledDescriptors list
        if( descriptorsList.length>0) {
            labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(person.name, descriptorsList) );
        }
    }

//    console.log('No. of labeledDescriptors => ' + labeledDescriptors.length );
    // -------------------------------------------------------------------------------------------
    // SECOND PART: IMAGE PROCESSING, reading image and matching face descriptors ----------------
    
    // Creates a faceMatcher with the list of all labeled face descriptors, populated above
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)    

    // Reads file as a bitmap object
    console.log('Loading image...pls, wait');
    const imageBitmap = await loadImage(imageUrl);
    if(!imageBitmap) {
        return next( new HttpError('Failure reading the image file.', 422) );
    }
        
    // Creates a canvas, named image, with the bitmap dimensions
    const image = createCanvas( imageBitmap.width, imageBitmap.height );
    // Draws the bitmap on a canvas
    const ctx = image.getContext('2d')
    ctx.drawImage( imageBitmap, 0, 0 );
  
    // Detecs faces, and associated face descriptors on target image
    console.log('Detecting faces...pls, wait');
    const descriptors = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceDescriptors();

    if( descriptors.length > 0) {   // If any faces detected...
     
        // Runs the faceMatcher against each face descriptor detected in image, 
        // saves match information in a list of best matches, and draws bboxes 
        // and labels on image
        var bestMatches = [];
        var faceMatch;
        var bestMatch;
        var drawBox;
        var label;
        descriptors.forEach( (faceDescriptor) => { 
            // Finds the best match (the one that minimizes distance between face descriptors)
            faceMatch = faceMatcher.findBestMatch(faceDescriptor.descriptor);
            bestMatch = {
                detectionScore: faceDescriptor.detection._score,
                matchDistance:  faceMatch._distance,
                label:          faceMatch._label,
                bbox: {
                    x:      faceDescriptor.detection._box.x,
                    y:      faceDescriptor.detection._box.y,
                    width:  faceDescriptor.detection._box.width,
                    height: faceDescriptor.detection._box.height
                }
            }

            // Draws bounding boxes and labels on image (canvas)
            // Shows detection score and match distance if numbersFlag == 'true'
            if( numbersFlag == 'true') {
                label = bestMatch.label + ' ' + bestMatch.detectionScore.toFixed(2) + ' ' + bestMatch.matchDistance.toFixed(2)
            }
            else {
                label = bestMatch.label;
            }
            drawBox = new faceapi.draw.DrawBox( bestMatch.bbox, {label: label, lineWidth: 2});
            drawBox.draw(image);

            // Puts each bestMatch on a list to send back to Client
            bestMatches.push(bestMatch); 
        });

//        faceapi.draw.drawDetections(image, descriptors)

        // Saves image canvas as a file
        // Extracts file name from the imageUrl parameter
        const urlArray = imageUrl.split('/');
        const fileName = urlArray[urlArray.length - 1];

        // Writes the drwan canvas back to a file
        const out = fs.createWriteStream('./images/recognized/' + fileName);
        const stream = image.createJPEGStream({
            // Disable 2x2 chromaSubsampling for deeper colors and use a higher quality
            quality: 0.95,
            chromaSubsampling: false
        });
        stream.pipe(out);
        out.on('finish', () => {
            console.log('The file  /images/recognized/' + fileName + ' was created!');
        });

        // Finalizes assembling the results json object to be sent back to Client
        results = {
            bestMatches: bestMatches,
            imageUrl: 'http://localhost:5000/recognized/' + fileName
        }

        // Sends results back to Client
        console.log(results)
        res.json(results);
    }
    else {
        res.json({ message: 'Found no faces in image' });
    }
}


exports.signup = signup;
exports.login = login;
exports.readAll = readAll;
exports.recognizeFaces = recognizeFaces;
