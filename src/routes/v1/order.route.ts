import express from "express";
import asyncHandler from "express-async-handler";
import {
  createOrder,
  getOrderById,
  getOrders,
} from "../../controllers/order.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import requireRole from "../../middlewares/requireRole";


const v1router = express.Router();

//@desc Create a new order
//@route POST /api/v1/orders
//@access Private
v1router.post("/", validateJWT, requireRole("customer"), asyncHandler(createOrder));


//@desc Get order by id
//@route GET /api/v1/orders/:orderId
//@access Private
v1router.get("/:orderId", validateJWT, requireRole("customer"), asyncHandler(getOrderById));


//@desc Get all orders
//@route GET /api/v1/orders
//@access Private
v1router.get("/", validateJWT, requireRole("customer"), asyncHandler(getOrders));



export default v1router;