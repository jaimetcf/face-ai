////////////////////////////////////////////////////////////////////////////////////////
// Imports section 
////////////////////////////////////////////////////////////////////////////////////////
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { check } = require('express-validator');

const HttpError    = require('./http-error');
const userRoutes   = require('./controller-users');
const personRoutes = require('./controller-persons');
const photoRoutes  = require('./controller-photos');

// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
console.log('Importing tfjs-node... this may take a few ... pls wait')
const tfjs = require('@tensorflow/tfjs-node');

// Imports face-api module
const faceapi = require('face-api.js');

global.PORT = 5000;


////////////////////////////////////////////////////////////////////////////////////////
// Web Server Initializations
////////////////////////////////////////////////////////////////////////////////////////
const webServer = express();

webServer.use(bodyParser.json());

// This webserver serves static files in the paths below
webServer.use(express.static(path.join(__dirname, './public')))
webServer.use(express.static(path.join(__dirname, './images')))

// CORS Headers => Required for cross-origin/ cross-server communication
webServer.use((req, res, next) => {
  // Here we specify:

  //Which domains can send requests to this webserver: '*' -> all
  res.setHeader('Access-Control-Allow-Origin', '*');
  // The headers accepted in the requests sent to this webserver
  res.setHeader( 
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  // The methods accepted in the requests sent to this webserver
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS');
  next();
});


///////////////////////////////////////////////////////////////////////////////////////
// Endpoints definition
///////////////////////////////////////////////////////////////////////////////////////

// User endpoints --------------------------------------------------------------------
webServer.post('/user/signup',                                 // body = { name, email, password }
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 4 })
  ]                         ,     userRoutes.signup
);
webServer.post('/user/login',     userRoutes.login );          // body = { email, password }

webServer.get('/user/readall',    userRoutes.readAll );        // no body 

webServer.get('/user/recognizefaces/:numbers',                 // numbers should be 'true' or 'false'
                                  userRoutes.recognizeFaces ); // body = { userId, imageUrl }
// ------------------------------------------------------------------------------------


// Person endpoints -------------------------------------------------------------------
webServer.post('/person/create',                               // body = { userId, personName }
  [ 
    check('userId').not().isEmpty(), 
    check('personName').not().isEmpty()
  ],
                                  personRoutes.createPerson 
);

webServer.get('/person/read',     personRoutes.readPerson );    // body = { personId }

webServer.get('/person/readuserpersons',                        // body = { userId }
                                  personRoutes.readUserPersons );

webServer.delete('/person/delete',                              // body = { personId }
                                  personRoutes.deletePerson );
// ------------------------------------------------------------------------------------


// Photo endpoints --------------------------------------------------------------------
webServer.post('/photo/create',   photoRoutes.createPhoto );    // body = { personId, url }

webServer.get( '/photo/readpersonphotos', 
                                  photoRoutes.readPersonPhotos ); // body = { personId }

webServer.delete('/photo/delete', photoRoutes.deletePhoto );    // body = { photoId }


////////////////////////////////////////////////////////////////////////////////////////
// General Error treatment
////////////////////////////////////////////////////////////////////////////////////////
webServer.use((req, res, next) => {
  // When the route in the call does not exist
  next( new HttpError('Could not find this route.', 404) );
});

/*
webServer.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});
*/


////////////////////////////////////////////////////////////////////////////////////////
// Connects to mongodb, loads recognition models, and then starts listening to port 5000
////////////////////////////////////////////////////////////////////////////////////////
const mongodbUrl = 
    'mongodb+srv://jmres:BdpmykRFZHi1ncqq@cluster0-g7x23.mongodb.net/faceai?retryWrites=true&w=majority';

console.log('Connecting to database...pls wait');
mongoose.connect(mongodbUrl,{ useNewUrlParser: true }).then(() => {

    console.log('Loading SSD-MobilenetV1 model ...pls wait');
    faceapi.nets.ssdMobilenetv1.loadFromDisk('./models').then( () => {
      console.log('Loading Landmark68Net model ...pls wait');
      faceapi.nets.faceLandmark68Net.loadFromDisk('./models').then( () => {
        console.log('Loading RecognitionNet model ...pls wait');
        faceapi.nets.faceRecognitionNet.loadFromDisk('./models').then( () => {
          console.log('Models loaded!');
          webServer.listen(PORT, () => console.log('Listening on port ' + PORT));
        });
      });
    });    

}).catch(err => {
    console.log(err);
});
