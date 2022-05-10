//================================================================================
//  Multer
//================================================================================

// Required module
const multer = require('multer');

// object containing the possible mime types of the image file
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//------------------------------------
//  Multer configuration
//------------------------------------
const storage = multer.diskStorage({
  // the destination function instructs multer to save the files in the 'images' folder
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // the filename function instructs multer to rename the file
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');