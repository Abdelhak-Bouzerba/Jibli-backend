import express from "express";
import asyncHandler from "express-async-handler";
import {
  createRestaurant,
  getProductsByCategory,
  manageRestaurantStatus,
  updateRestaurantSettings,
  restaurantLogin,
  getAllRestaurants,
  getSingleRestaurant,
  searchRestaurantByName,
  manageOrderStatus,
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
v1router.put("/:restaurantId/settings", validateJWT, requireRole("restaurant"), authorizeRestaurant, upload.fields([{ name: "logo", maxCount: 1 }, { name: "coverPhoto", maxCount: 1 }]), asyncHandler(updateRestaurantSettings));


//@desc Get all restaurants
//@route GET /api/v1/restaurant/all
//access Public
v1router.get("/all", asyncHandler(getAllRestaurants));


//@desc Search restaurant by name
//@route GET /api/v1/restaurant/search?name=
//access Public
v1router.get("/search", asyncHandler(searchRestaurantByName));


//@desc Get single restaurant
//@route GET /api/v1/restaurant/:restaurantId
//access Public
v1router.get("/:restaurantId", asyncHandler(getSingleRestaurant));


//@desc Manage order status
//@route PUT /api/v1/restaurant/orders/:orderId/status
//access Private
v1router.put("/orders/:orderId/status", validateJWT, requireRole("restaurant"), asyncHandler(manageOrderStatus));


export default v1router;