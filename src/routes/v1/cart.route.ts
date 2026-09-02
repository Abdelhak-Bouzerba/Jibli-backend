import express from "express";
import asyncHandler from "express-async-handler";
import {
  createCart,
  getCart,
  addToCart,
  deleteItemFromCart,
  clearCart,
} from "../../controllers/cart.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import requireRole from "../../middlewares/requireRole";

const v1router = express.Router();

//@desc Create new cart
//@route POST /api/v1/cart
//@access Public
v1router.post("/",validateJWT, asyncHandler(createCart));


//@desc Get cart
//@route GET /api/v1/cart
//@access Public
v1router.get("/",validateJWT, asyncHandler(getCart));

//@desc Add item to cart
//@route POST /api/v1/cart/items
//@access Public
v1router.post("/items", validateJWT, requireRole("customer"), asyncHandler(addToCart));


//@desc Delete item from cart
//@route DELETE /api/v1/cart/items
//@access Public
v1router.delete("/items", validateJWT, requireRole("customer"), asyncHandler(deleteItemFromCart));


//@desc Clear cart
//@route DELETE /api/v1/cart/clear
//@access Public
v1router.delete("/clear", validateJWT, requireRole("customer"), asyncHandler(clearCart));

export default v1router;