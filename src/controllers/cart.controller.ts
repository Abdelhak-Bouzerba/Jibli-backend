import { Request, Response } from "express";
import cartService from "../services/cart.service";
import { ApiError } from "../utils/apiError";

//Create new cart controller
export const createCart = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  //check if customerId is provided
  if (!customerId) {
    throw new ApiError(400, "Customer ID is required");
  }

  //Call service to create the new cart
  const cart = await cartService.createCart(customerId);

  //send response
  res.status(201).json(cart);
};

//Get cart controller
export const getCart = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  //check if customerId is provided
  if (!customerId) {
    throw new ApiError(400, "Customer ID is required");
  }

  //Call service to get the cart
  const cart = await cartService.getCart(customerId);

  //send response
  res.status(200).json(cart);
};

//Add item to cart controller
export const addToCart = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const { productId, quantity, variant } = req.body;

  //check if req.body is provided
  if (!productId || !quantity || !variant) {
    throw new ApiError(400, "Product ID, quantity, and variant are required");
  }

  //Call service to add item to the cart
  await cartService.addToCart(customerId, productId, quantity, variant);

  //send response
  res.status(200).json({ message: "Item added to cart successfully" });
};

//Delete item from cart controller
export const deleteItemFromCart = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const { productId } = req.body;

  //check if req.body is provided
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  //Call service to delete item from the cart
  await cartService.deleteItemFromCart(customerId, productId);

  //send response
  res.status(200).json({ message: "Item deleted from cart successfully" });
};

//Clear cart controller
export const clearCart = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  //Call service to clear the cart
  await cartService.clearCart(customerId);

  //send response
  res.status(200).json({ message: "Cart cleared successfully" });
};
