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
  const data = req.body;

  //check if restaurantId and settings are provided
  if (!restaurantId || !data) {
    res.status(400).json({ message: "restaurantId and settings are required" });
    return;
  }

  //check if a new image is provided and upload it to cloudinary
  if (req.file) {
    //Delete the old image from cloudinary
    const existingRestaurant = await restaurantRepository.getRestaurantById(restaurantId);
    if (existingRestaurant?.logo && existingRestaurant.logo.publicId) {
      const publicId = existingRestaurant.logo.publicId;
      await deleteFromCloudinary(publicId);
    }

    //Upload the new image to cloudinary
    const result = await uploadToCloudinary(req.file?.buffer, "jibli/restaurants");
    
    //Add the new image details to the data object
    data.logo = {
      url: result.secure_url,
      publicId: result.public_id,
    }
  }

  //prepare the updated data (settings)
  const settings = {
    ...data,
  };

  //Call service to update restaurant settings
  const updatedRestaurant = await restaurantService.updateRestaurantSettings(
    restaurantId,
    settings,
  );

  //send response
  res.status(200).json({
    restaurant: updatedRestaurant,
    message: "Restaurant settings updated successfully",
  });
};;
