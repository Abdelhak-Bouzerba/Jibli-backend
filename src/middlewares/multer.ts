import multer from "multer";
import cloudinary from "../config/cloudinary";



// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "src/uploads/products");
//   },

//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });


//for cloudinary storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});


export default upload;