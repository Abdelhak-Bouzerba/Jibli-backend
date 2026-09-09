import customerService from "../services/customer.service";
import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";

//Create new customer controller
export const createCustomer = async (req: Request, res: Response) => {
  const customerData = req.body;

  //check if req body is provided
  if (!req.body) {
    throw new ApiError(400, "customer data is required");
  }

  //Call service to create customer
  const { customer, token } =
    await customerService.createCustomer(customerData);

  //send response
  res.status(200).send({
    customer,
    token,
    message: "Customer created successfully",
  });
};

//Get customer profile controller
export const getCustomerProfile = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  //check if customerId is provided
  if (!customerId) {
    throw new ApiError(400, "customer id is required");
  }

  //Call service to get customer profile
  const customer = await customerService.getCustomerProfile(customerId);

  //send response
  res.status(200).send({
    customer,
    message: "Customer profile fetched successfully",
  });
};

//Add saved address controller
export const addSavedAddress = async (req: Request, res: Response) => {
  const data = req.body;
  const customerId = req.user?.id as string;

  //check if customerId and data are provided
  if (!customerId || !data) {
    throw new ApiError(400, "customer id and location data are required");
  }

  //Call service to add saved address
  const customer = await customerService.addSavedAddress(customerId, data);

  //send response
  res.status(200).send({
    customer,
    message: "Saved address added successfully",
  });
};

//Remove saved address controller
export const removeSavedAddress = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const { label } = req.body;

  //check if customerId and label are provided
  if (!customerId || !label) {
    throw new ApiError(400, "customer id and label are required");
  }
  
  //Call service to remove saved address
  await customerService.removeSavedAddress(customerId, label);

  //send response
  res.status(200).send({
    message: "Saved address removed successfully",
  });

};

//Add saved restaurant controller
export const addSavedRestaurant = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const restaurantId = req.body.restaurantId as string;

  //check if customerId and restaurantId are provided
  if (!customerId || !restaurantId) {
    throw new ApiError(400, "customer id and restaurant id are required");
  }

  //Call service to add saved restaurant
  await customerService.addSavedRestaurant(customerId, restaurantId);

  //send response
  res.status(200).send({
    message: "restaurant added to saved successfully",
  });
};

//Remove saved restaurant controller
export const removeSavedRestaurant = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const { restaurantId } = req.body;

  //check if customerId and restaurantId are provided
  if (!customerId || !restaurantId) {
    throw new ApiError(400, "customer id and restaurant id are required");
  }

  //Call service to remove saved restaurant
  await customerService.removeSavedRestaurant(customerId, restaurantId);

  //send response
  res.status(200).send({
    message: "restaurant removed from saved successfully",
  });

};

//Get saved restaurants controller
export const getSavedRestaurants = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  //check if customerId is provided
  if (!customerId) {
    throw new ApiError(400, "customer id is required");
  }

  //Call service to get saved restaurants
  const savedRestaurants =
    await customerService.getSavedRestaurants(customerId);

  //send response
  res.status(200).send({
    savedRestaurants,
    message: "Saved restaurants fetched successfully",
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
  const order = await customerService.getOrderById(customerId, orderId);

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
  const orders = await customerService.getOrders(customerId);

  //send response
  res.status(200).json({
    message: "Orders retrieved successfully",
    orders,
  });
};


//Cancel order by customer controller
export const cancelOrderByCustomer = async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const orderId = req.params.orderId as string;

  //check if customerId and orderId are provided
  if (!customerId || !orderId) {
    throw new ApiError(400, "customer id and order id are required");
  }

  //Call service to cancel order by customer
  const { message } = await customerService.cancelOrderByCustomer(
    customerId,
    orderId,
  );

  //send response
  res.status(200).send({ message });
};
