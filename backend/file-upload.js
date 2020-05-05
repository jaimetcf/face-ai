const multer = require('multer');
const uuid = require('uuidv1');

// This object is just to translate from multer extension 
// names to common file extension names
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

// Configures and instantiates the multer object that will
// receive the file transmitted from the frontend
const fileUpload = multer({
  // Configures maximum file size in bytes (5Mb, here)
  limits: { fileSize: 5 * 1024 * 1024 },
  storage: multer.diskStorage({         
    // Configures the destination folder
    destination: (req, file, cb) => {
      cb(null, FACES_PATH ); 
//      cb(null, 'images/faces/'); // WARNING: if defined like '/images/faces' it doesn't work !!!
    },
    // Configures the file name
    filename: (req, file, cb) => {      
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, file.originalname);              // Original file name
//      cb(null, uuid() + '.' + ext);       // Random file name + the correct extension 
    }
  }),
  // Configures acceptable file types (extensions)
  fileFilter: (req, file, cb) => {      
    const isValid = !!MIME_TYPE_MAP[file.mimetype];  // Gets true if any of the extensions above, false otherwise
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});


module.exports = fileUpload;
