import restaurantService from "../services/restaurant.service";
import { Request, Response } from "express";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import restaurantRepository from "../repositories/restaurant";
import { ApiError } from "../utils/apiError";
import { IRestaurant } from "../types";

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

  const body = req.body as Record<string, unknown>;
  const nestedPayload = body.restaurant ?? body.restaurantData ?? body.data;
  const restaurantData = normalizeRestaurantData(
    nestedPayload && typeof nestedPayload === "object"
      ? (nestedPayload as Record<string, unknown>)
      : typeof nestedPayload === "string"
        ? parseJsonObject(nestedPayload)
        : body,
  );

  const files = req.files as
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined;

  const logo = files?.logo?.[0];
  const coverPhoto = files?.coverPhoto?.[0];

  //Call service to create new restaurant
  const { token, newRestaurant } = await restaurantService.createRestaurant(
    restaurantData,
    logo,
    coverPhoto,
  );

  //send response
  res.status(201).send({
    restaurant: newRestaurant,
    token,
    message: "Restaurant created successfully",
  });
};

//for parsing formData into json
const parseJsonObject = (value: string): Record<string, unknown> => {
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
};
const parseJsonValue = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return value;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};
const normalizeRestaurantData = (
  data: Record<string, unknown>,
): Record<string, unknown> => {
  const normalized = { ...data };

  for (const field of ["tags", "location", "workingDays"]) {
    if (field in normalized) {
      normalized[field] = parseJsonValue(normalized[field]);
    }
  }

  for (const field of ["isOpen", "isActive"]) {
    if (normalized[field] === "true") {
      normalized[field] = true;
    } else if (normalized[field] === "false") {
      normalized[field] = false;
    }
  }

  for (const field of ["rating", "ratingCount"]) {
    if (
      typeof normalized[field] === "string" &&
      normalized[field].trim() !== ""
    ) {
      normalized[field] = Number(normalized[field]);
    }
  }

  return normalized;
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

  const rawSettings = req.body.settings;
  const settingsData =
    rawSettings === undefined
      ? req.body
      : typeof rawSettings === "string"
        ? parseJsonObject(rawSettings)
        : rawSettings && typeof rawSettings === "object"
          ? (rawSettings as Record<string, unknown>)
          : {};
  const settings = normalizeRestaurantData(settingsData);

  const updatedRestaurant = await restaurantService.updateRestaurantSettings(
    restaurantId,
    settings as Partial<IRestaurant>,
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
    message: "Restaurants fetched successfully",
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

//Get restaurant orders controller
export const getRestaurantOrders = async (req: Request, res: Response) => {
  const restaurantId = req.user?.id as string;

  //check if restaurantId is provided
  if (!restaurantId) {
    throw new ApiError(400, "restaurantId is required");
  }

  //Call service to get restaurant orders
  const orders = await restaurantService.getRestaurantOrders(restaurantId);

  //send response
  res.status(200).json({
    orders,
    message: "Orders fetched successfully",
  });

};

//Get restaurant order by id controller
export const getRestaurantOrderById = async (req: Request, res: Response) => {
  const restaurantId = req.user?.id as string;
  const orderId = req.params.orderId as string;

  //check if restaurantId and orderId are provided
  if (!restaurantId || !orderId) {
    throw new ApiError(400, "restaurantId and orderId are required");
  }

  //Call service to get restaurant order by id
  const order = await restaurantService.getRestaurantOrderById(restaurantId, orderId);

  //send response
  res.status(200).json({
    order,
    message: "Order fetched successfully",
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
