import express from "express";
import asyncHandler from "express-async-handler";
import {
  createOrder,
} from "../../controllers/order.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import requireRole from "../../middlewares/requireRole";


const v1router = express.Router();

//@desc Create a new order
//@route POST /api/v1/orders/create
//@access Private
v1router.post("/create", validateJWT, requireRole("customer"), asyncHandler(createOrder));



export default v1router;