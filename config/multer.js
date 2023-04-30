import multer from 'multer'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadPath = '../client/public/safad';
    console.log("multer here")
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
      console.log('new folder added');
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // date = Date.now();
    const{ name } = req.body 
    cb(null,file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  console.log('multer started')
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png" ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
  
});

//exporting multer

export default upload;
