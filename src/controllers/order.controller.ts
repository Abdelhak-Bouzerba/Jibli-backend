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
  const order = await orderService.createOrder(orderData);

  //return response
  res.status(201).json({
    message: "Order created successfully",
    order,
  });
};

//Get order by id controller
export const getOrderById = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const orderId = req.params.orderId as string;

  //check if orderId & customerId are provided
  if (!orderId || !customerId) {
    throw new ApiError(400, "Order ID and Customer ID are required");
  }

  //call get order by id service
  const order = await orderService.getOrderById(customerId, orderId);

  //send response
  res.status(200).json({
    message: "Order retrieved successfully",
    order,
  });
};

//Get all orders controller
export const getOrders = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  //check if customerId is provided
  if (!customerId) {
    throw new ApiError(400, "Customer ID is required");
  }

  //call get all orders service
  const orders = await orderService.getOrders(customerId);

  //send response
  res.status(200).json({
    message: "Orders retrieved successfully",
    orders,
  });
};
