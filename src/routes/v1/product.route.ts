import express from "express";
import asyncHandler from "express-async-handler";
import upload from "../../middlewares/multer";
import { createProduct , deleteProduct, getAllProducts , getProductById , updateProduct } from "../../controllers/product.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { authorizeRestaurant } from "../../middlewares/authorizeRestaurant";
import requireRole from "../../middlewares/requireRole";


const v1router = express.Router();

//@desc Create a new product
// @route POST /api/v1/products
// @access Private
v1router.post("/products", validateJWT, requireRole("restaurant"), upload.single("image"), asyncHandler(createProduct));


//desc Get all product for a restaurant
// @route GET /api/v1/products
// @access Public
v1router.get("/products", asyncHandler(getAllProducts));


//desc Get single product by ID
// @route GET /api/v1/products/:productId
// @access Public
v1router.get("/products/:productId", asyncHandler(getProductById));


//desc Update a product
// @route PUT /api/v1/products/:productId
// @access Private
v1router.put("/products/:productId", validateJWT, requireRole("restaurant"),authorizeRestaurant, upload.single("image"), asyncHandler(updateProduct));


//desc Delete a product
// @route DELETE /api/v1/products/:productId
// @access Private
v1router.delete("/products/:productId", validateJWT, requireRole("restaurant"), authorizeRestaurant, asyncHandler(deleteProduct));


export default v1router;
