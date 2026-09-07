import restaurantService from "../services/restaurant.service";
import { Request, Response } from "express";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import restaurantRepository from "../repositories/restaurant";
import { ApiError } from "../utils/apiError";

//Restaurant login controller
export const restaurantLogin = async (req: Request, res: Response) => {
  const { phone } = req.body;

  //check if phone is provided
  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  //Call service to login restaurant
  const { restaurant, token } = await restaurantService.restaurantLogin(phone);

  //send response
  res.status(200).json({
    restaurant,
    token,
    message: "Restaurant logged in successfully",
  });
};

//Create new Restaurant controller
export const createRestaurant = async (req: Request, res: Response) => {
  //check if request body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(400, "Request body is empty");
  }

  const files = req.files as
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined;

  const logo = files?.logo?.[0];
  const coverPhoto = files?.coverPhoto?.[0];

  //prepare restaurant data
  const restaurantData = {
    ...req.body,
    logo,
    coverPhoto,
  };

  //Call service to create new restaurant
  const { token, newRestaurant } = await restaurantService.createRestaurant(restaurantData , logo , coverPhoto);

  //send response
  res.status(201).send({
    restaurant: newRestaurant,
    token,
    message: "Restaurant created successfully",
  });
};

//Get products by category controller
export const getProductsByCategory = async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId as string;
  const category = req.query.category as string;

  //check if restaurantId and category are provided
  if (!restaurantId || !category) {
    throw new ApiError(400, "restaurantId and category are required");
  }

  //Call service to get products by category
  const products = await restaurantService.getProductsByCategory(
    restaurantId,
    category,
  );

  //send response
  res.status(200).json({ products, message: "Products fetched successfully" });
};

//Manage restaurant status controller
export const manageRestaurantStatus = async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId as string;
  const status = req.body.status as boolean;

  //check if restaurantId and status are provided
  if (!restaurantId || status === undefined) {
    throw new ApiError(400, "restaurantId and status are required");
  }

  //Call service to manage restaurant status
  const updatedRestaurant = await restaurantService.manageRestaurantStatus(
    restaurantId,
    status,
  );

  //send response
  res.status(200).json({
    restaurant: updatedRestaurant,
    message: "Restaurant status updated successfully",
  });
};

//Update restaurant settings controller
export const updateRestaurantSettings = async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId as string;

  if (!restaurantId) {
    throw new ApiError(400, "restaurantId is required");
  }

  const files = req.files as
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined;

  const logo = files?.logo?.[0];
  const coverPhoto = files?.coverPhoto?.[0];

  const updatedRestaurant = await restaurantService.updateRestaurantSettings(
    restaurantId,
    req.body,
    logo,
    coverPhoto,
  );

  res.status(200).json({
    restaurant: updatedRestaurant,
    message: "Restaurant settings updated successfully",
  });
};

//Get nearby restaurants controller
export const getNearbyRestaurants = async (req: Request, res: Response) => {
  const { location } = req.body;

  //check if location is provided
  if (!location || !location.coordinates) {
    throw new ApiError(400, "Location is required");
  }

  //Call service to get nearby restaurants
  const restaurants = await restaurantService.getNearbyRestaurants(location);

  //send response
  res.status(200).json({
    restaurants,
    message: "Restaurants fetched successfully"
  });
};

//Get restaurant Profile controller
export const getRestaurantProfile = async (req: Request, res: Response) => {
  const restaurantId = req.body.restaurantId as string;

  if (!restaurantId) {
    throw new ApiError(400, "restaurantId is required");
  }

  //Call service to get single restaurant
  const restaurant = await restaurantService.getRestaurantProfile(restaurantId);

  //send response
  res
    .status(200)
    .json({ restaurant, message: "Restaurant fetched successfully" });
};

//Search restaurant by name controller
export const searchRestaurantByName = async (req: Request, res: Response) => {
  const name = req.query.name as string;

  //check if name is provided
  if (!name) {
    throw new ApiError(400, "name is required");
  }

  //Call service to search restaurant by name
  const restaurants = await restaurantService.searchRestaurantByName(name);

  //send response
  res.status(200).json({
    restaurants,
    message: "Restaurants fetched successfully",
  });
};

//Order management controller
export const manageOrderStatus = async (req: Request, res: Response) => {
  const orderId = req.params.orderId as string;
  const restaurantId = req.user?.id as string;
  const { status, preparationTime } = req.body;

  //check if orderId, restaurantId and status are provided
  if (!orderId || !restaurantId || !status) {
    throw new ApiError(400, "orderId, restaurantId and status are required");
  }

  //Call service to manage order status
  const updatedOrder = await restaurantService.manageOrderStatus(
    orderId,
    restaurantId,
    status,
    preparationTime,
  );

  //send response
  res.status(200).json({
    order: updatedOrder,
    message: "Order status updated successfully",
  });
};
