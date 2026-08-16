import multer from "multer";
import cloudinary from "../config/cloudinary";



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/products");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


export default upload;