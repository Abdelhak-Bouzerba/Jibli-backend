import express from "express";
import asyncHandler from "express-async-handler";
import {
  createCustomer,
  getCustomerProfile,
  addSavedAddress,
  addSavedRestaurant,
  getSavedRestaurants,
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
 

//@desc Add saved restaurant
//@route POST /api/v1/customer/saved-restaurant
//Access Private
v1router.post("/saved-restaurant", validateJWT, requireRole("customer"), asyncHandler(addSavedRestaurant)); 


//@desc Get saved restaurants
//@route GET /api/v1/customer/saved-restaurant
//Access Private
v1router.get("/saved-restaurant", validateJWT, requireRole("customer"), asyncHandler(getSavedRestaurants));

export default v1router;