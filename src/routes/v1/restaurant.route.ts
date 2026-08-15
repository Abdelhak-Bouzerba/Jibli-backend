import express from "express";
import asyncHandler from "express-async-handler";
import { createRestaurant } from "../../controllers/restaurant.controller";

const v1router = express.Router();

//@desc Create new Restaurant
//@route POST /api/v1/restaurant/create
//access Public
v1router.post("/create", asyncHandler(createRestaurant));

export default v1router;