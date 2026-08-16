import express from "express";
import asyncHandler from "express-async-handler";
import upload from "../../middlewares/multer";
import { createProduct } from "../../controllers/product.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import requireRole from "../../middlewares/requireRole";


const v1router = express.Router();

//@desc Create a new product
// @route POST /api/v1/products
// @access Private
v1router.post("/products" ,validateJWT , requireRole("restaurant"), upload.single("image"), asyncHandler(createProduct));


export default v1router;
