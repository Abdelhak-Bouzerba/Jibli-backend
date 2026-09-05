import restaurantService from "../services/restaurant.service";
import { Request, Response } from "express";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import restaurantRepository from "../repositories/restaurant";

//Restaurant login controller
export const restaurantLogin = async (req: Request, res: Response) => {
  const { phone } = req.body;

  //check if phone is provided
  if (!phone) {
    res.status(400).json({ message: "Phone number is required" });
    return;
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
    res.status(400).json({ message: "Request body is empty" });
    return;
  }

  //Call service to create new restaurant
  const { token, newRestaurant } = await restaurantService.createRestaurant(
    req.body,
  );

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
    res.status(400).json({ message: "restaurantId and category are required" });
    return;
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
    res.status(400).json({ message: "restaurantId and status are required" });
    return;
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
    res.status(400).json({
      message: "restaurantId is required",
    });
    return;
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

//Get all restaurants controller
export const getAllRestaurants = async (req: Request, res: Response) => {
  //Call service to get all restaurants
  const restaurants = await restaurantService.getAllRestaurants();

  //send response
  res
    .status(200)
    .json({ restaurants, message: "Restaurants fetched successfully" });
};

//Get single restaurant controller
export const getSingleRestaurant = async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId as string;

  if (!restaurantId) {
    res.status(400).json({
      message: "restaurantId is required",
    });
    return;
  }

  //Call service to get single restaurant
  const restaurant = await restaurantService.getSingleRestaurant(restaurantId);

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
    res.status(400).json({
      message: "name is required",
    });
    return;
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
    res.status(400).json({message: "orderId, restaurantId and status are required"});
    return;
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


