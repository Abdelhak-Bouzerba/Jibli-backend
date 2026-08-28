import express from "express";
import asyncHandler from "express-async-handler";
import {
  createRestaurant,
  getProductsByCategory,
  manageRestaurantStatus,
  updateRestaurantSettings,
  restaurantLogin,
} from "../../controllers/restaurant.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import requireRole from "../../middlewares/requireRole";
import { authorizeRestaurant } from "../../middlewares/authorizeRestaurant";
import upload from "../../middlewares/multer";

const v1router = express.Router();


//@desc Login restaurant
//@route POST /api/v1/restaurant/login
//access Public
v1router.post("/login", asyncHandler(restaurantLogin));

//@desc Create new Restaurant
//@route POST /api/v1/restaurant/create
//access Public
v1router.post("/create", asyncHandler(createRestaurant));


//@desc Get product by category
//@route GET /api/v1/restaurant/:restaurantId/products?category=
//access Public
v1router.get("/:restaurantId/products", asyncHandler(getProductsByCategory));


//@desc Manage restaurant status
//@route PUT /api/v1/restaurant/:restaurantId/status
//access Private
v1router.put("/:restaurantId/status", validateJWT, requireRole("restaurant"),authorizeRestaurant, asyncHandler(manageRestaurantStatus));


//@desc Update restaurant settings
//@route PUT /api/v1/restaurant/:restaurantId/settings
//access Private
v1router.put("/:restaurantId/settings", validateJWT, requireRole("restaurant"), authorizeRestaurant, upload.single("image"), asyncHandler(updateRestaurantSettings));

export default v1router;