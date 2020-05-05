////////////////////////////////////////////////////////////////////////////////////////
// Imports section 
////////////////////////////////////////////////////////////////////////////////////////
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { check } = require('express-validator');
const fileUpload = require('./file-upload');

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


////////////////////////////////////////////////////////////////////////////////////////
// Web Server Initializations
////////////////////////////////////////////////////////////////////////////////////////

// Defines global variables
global.PORT = 5000;
global.FACES_PATH = 'images/faces/';  // WARNING: if defined like '/images/faces', multer will not work !!!
global.LANDMARKED_PATH = 'images/landmarked/';

// Creates express webserver
const webServer = express();

// body content is mostly in json format (except in image uploads)
webServer.use(bodyParser.json()); 

// This webserver serves static files in the paths below
webServer.use(express.static(path.join(__dirname, './public')))
webServer.use(express.static(path.join(__dirname, './images')))

// CORS Headers => Required for cross-origin/ cross-server communication
webServer.use( (req, res, next) => {
  // Here we specify:

  //Which domains can send requests to this webserver: '*' -> all
  res.setHeader("Access-Control-Allow-Origin", "*" );

  // The headers accepted in the requests sent to this webserver
  res.setHeader( 
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // The methods accepted in the requests sent to this webserver
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");

  next();
});


///////////////////////////////////////////////////////////////////////////////////////
// Endpoints definition
///////////////////////////////////////////////////////////////////////////////////////

const router = express.Router();

// User endpoints --------------------------------------------------------------------
router.post('/user/signup',                                       // body = { name, email, password }
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 4 })
  ]                         ,     userRoutes.signup
);
router.post('/user/login',        userRoutes.login );             // body = { email, password }

router.get('/user/readall',       userRoutes.readAll );           // no body              NOT USED

router.post('/user/recognizefaces', fileUpload.single('image'),                             
                                  userRoutes.recognizeFaces );    // body = { userId, numbers, image }
// ------------------------------------------------------------------------------------


// Person endpoints -------------------------------------------------------------------
router.post('/person/create',                                     // body = { userId, personName }
  [ 
    check('userId').not().isEmpty(), 
    check('personName').not().isEmpty()
  ],
                                  personRoutes.createPerson 
);

router.post('/person/read',       personRoutes.readPerson );      // body = { personId }   NOT USED

router.post('/person/readuserpeople',                             // body = { userId }
                                  personRoutes.readUserPeople );

router.delete('/person/delete',                                   // body = { personId }
                                  personRoutes.deletePerson );
// ------------------------------------------------------------------------------------


// Photo endpoints --------------------------------------------------------------------
router.post('/photo/create', fileUpload.single('image'), 
                                  photoRoutes.createPhoto );      // body = { personId, image }

router.post( '/photo/readpersonphotos', 
                                  photoRoutes.readPersonPhotos ); // body = { personId }

router.delete('/photo/delete',    photoRoutes.deletePhoto );      // body = { photoId }


// The use of a Router object may seem unnecessary here, but it is needed so that the routes
// above can be registered using webServer.use(...), here, what ensures they are registered 
// BEFORE general error treatment routes, that follow below.
// If we simply register these routes with webServer.get, post, etc., these routes end up
// being registered AFTER error treatment routes
webServer.use('/', router);   // Registers router in webserver


////////////////////////////////////////////////////////////////////////////////////////
// General Error treatment
////////////////////////////////////////////////////////////////////////////////////////

// Treats a route not serviced by this web server
webServer.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});


webServer.use((error, req, res, next) => {
  
  // Deletes the file from the folder, in case an upload has been canceled
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }

  if (res.headerSent) {
     return next(error);
  }
  
  // Sends the error occurred to the frontend
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


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
