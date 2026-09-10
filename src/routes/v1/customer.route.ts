import express from "express";
import asyncHandler from "express-async-handler";
import {
  createCustomer,
  getCustomerProfile,
  addSavedAddress,
  addSavedRestaurant,
  getSavedRestaurants,
  cancelOrderByCustomer,
  getOrders,
  getOrderById,
  removeSavedAddress,
  removeSavedRestaurant,
} from "../../controllers/customer.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import  requireRole  from "../../middlewares/requireRole";

const v1router = express.Router();

//@desc Create new customer
//@route POST /api/v1/customer
//Access Public
v1router.post("/register" , asyncHandler(createCustomer)); 


//@desc Get customer profile
//@route GET /api/v1/customer/:customerId
//Access Public
v1router.get("/profile" ,validateJWT, asyncHandler(getCustomerProfile));


//@desc Add saved address
//@route POST /api/v1/customer/saved-address
//Access Private
v1router.post("/saved-address", validateJWT, requireRole("customer"), asyncHandler(addSavedAddress));


//@desc remove saved address
//@route DELETE /api/v1/customer/saved-address
//Access Private
v1router.delete("/saved-address", validateJWT, requireRole("customer"), asyncHandler(removeSavedAddress));
 

//@desc Add saved restaurant
//@route POST /api/v1/customer/saved-restaurant
//Access Private
v1router.post("/saved-restaurant", validateJWT, requireRole("customer"), asyncHandler(addSavedRestaurant));


//@desc Remove saved restaurant
//@route DELETE /api/v1/customer/saved-restaurant
//Access Private
v1router.delete("/saved-restaurant", validateJWT, requireRole("customer"), asyncHandler(removeSavedRestaurant));


//@desc Get saved restaurants
//@route GET /api/v1/customer/saved-restaurant
//Access Private
v1router.get("/saved-restaurant", validateJWT, requireRole("customer"), asyncHandler(getSavedRestaurants));


//@desc Get all orders
//@route GET /api/v1/customer/orders
//@access Private
v1router.get("/orders", validateJWT, requireRole("customer"), asyncHandler(getOrders));


//@desc Get order by id
//@route GET /api/v1/customer/orders/:orderId
//@access Private
v1router.get("/orders/:orderId", validateJWT, requireRole("customer"), asyncHandler(getOrderById));


//@desc Cancel order by customer
//@route POST /api/v1/customer/orders/:orderId/cancel
//Access Private
v1router.post("/orders/:orderId/cancel", validateJWT, requireRole("customer"), asyncHandler(cancelOrderByCustomer));

export default v1router;