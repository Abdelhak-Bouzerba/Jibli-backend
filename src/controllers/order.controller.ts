import { Request, Response } from "express";
import orderService from "../services/order.service";
import { ApiError } from "../utils/apiError";

//Create order controller
export const createOrder = async (req: Request, res: Response) => {
  const orderData = req.body;

  //check if order data is provided
  if (!orderData) {
    throw new ApiError(400, "Order data is required");
  }

  //call create order service
  const newOrder = await orderService.createOrder(orderData);

  //return response
  res.status(201).json({
    message: "Order created successfully",
    order: newOrder,
  });
};