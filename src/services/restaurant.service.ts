import restaurantRepository from "../repositories/restaurant";
import { IRestaurant, Status } from "../types";
import { createRestaurantSchema } from "../validators/restaurant.validator";
import { generateJWTtoken } from "../utils/generateJWTtoken";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { ApiError } from "../utils/apiError";
import { ILocation } from "../types/index";

//Restaurant login service
const restaurantLogin = async (phone: string) => {
  //check if restaurant exists
  const restaurantExists =
    await restaurantRepository.checkRestaurantExists(phone);
  if (!restaurantExists) {
    throw new ApiError(404, "Restaurant does not exist");
  }

  //Login restaurant
  const restaurant = await restaurantRepository.restaurantLogin(phone);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  //generate token
  const token = generateJWTtoken({ id: restaurant.id, role: restaurant.role });

  return { restaurant, token };
};

//Create new Restaurant service
const createRestaurant = async (restaurantData: IRestaurant,logo?: Express.Multer.File,coverPhoto?: Express.Multer.File) => {
  //Check if restaurant already exists
  const existingRestaurant = await restaurantRepository.checkRestaurantExists(
    restaurantData.phone,
  );
  if (existingRestaurant) {
    throw new ApiError(409, "Restaurant already exists");
  }

  //validate restaurant data through zod schema
  const parseResult = createRestaurantSchema.safeParse(restaurantData);
  if (!parseResult.success) {
    throw new ApiError(400, `Validation error: ${parseResult.error.message}`);
  }

  //Create new restaurant
  const newRestaurant =
    await restaurantRepository.createNewRestaurant(restaurantData);

  // Upload logo to cloudinary and path at databse
  if (newRestaurant && logo) {
    const resultLogo = await uploadToCloudinary(
      logo.buffer,
      "jibli/restaurants",
    );
    newRestaurant.logo = {
      url: resultLogo.secure_url,
      publicId: resultLogo.public_id,
    };
  }
  // Upload CoverPhto to cloudinary and path at databse
  if (newRestaurant && coverPhoto) {
    const resultCover = await uploadToCloudinary(
      coverPhoto.buffer,
      "jibli/restaurants",
    );
    newRestaurant.coverPhoto = {
      url: resultCover.secure_url,
      publicId: resultCover.public_id,
    };
  }

  //save to database
  await newRestaurant.save();

  //generate JWT token
  const token = generateJWTtoken({
    id: newRestaurant.id,
    role: newRestaurant.role,
  });

  return { newRestaurant, token };
};

//Get products by category service
const getProductsByCategory = async (
  restaurantId: string,
  category: string,
) => {
  //check if restaurant exists
  const restaurantExists =
    await restaurantRepository.checkRestaurantExistsById(restaurantId);
  if (!restaurantExists) {
    throw new ApiError(404, "Restaurant does not exist");
  }

  //Get products by category
  const products = await restaurantRepository.getProducts(
    restaurantId,
    category,
  );
  return products;
};

//Manage restauarnt status service
const manageRestaurantStatus = async (
  restaurantId: string,
  status: boolean,
) => {
  //check if restaurant exists
  const restaurantExists =
    await restaurantRepository.checkRestaurantExistsById(restaurantId);
  if (!restaurantExists) {
    throw new ApiError(404, "Restaurant does not exist");
  }

  //Update restaurant status
  const updatedRestaurant = await restaurantRepository.manageRestaurantStatus(
    restaurantId,
    status,
  );
  return updatedRestaurant;
};

//Update restaurant settings service
const updateRestaurantSettings = async (
  restaurantId: string,
  settings: Partial<IRestaurant>,
  logo?: Express.Multer.File,
  coverPhoto?: Express.Multer.File,
) => {
  //check if restaurant exists
  const existingRestaurant =
    await restaurantRepository.checkRestaurantExistsById(restaurantId);
  if (!existingRestaurant) {
    throw new ApiError(404, "Restaurant does not exist");
  }
  //get settings data
  const updatedSettings: Partial<IRestaurant> = {
    ...settings,
  };

  const newImages: {
    logo?: {
      url: string;
      publicId: string;
    };
    coverPhoto?: {
      url: string;
      publicId: string;
    };
  } = {};

  try {
    // Upload new logo
    if (logo) {
      const result = await uploadToCloudinary(logo.buffer, "jibli/restaurants");

      newImages.logo = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      updatedSettings.logo = newImages.logo;
    }

    // Upload new cover
    if (coverPhoto) {
      const result = await uploadToCloudinary(
        coverPhoto.buffer,
        "jibli/restaurants",
      );

      newImages.coverPhoto = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      updatedSettings.coverPhoto = newImages.coverPhoto;
    }

    // Update database
    const updatedRestaurant =
      await restaurantRepository.updateRestaurantSettings(
        restaurantId,
        updatedSettings,
      );

    // Delete old logo AFTER successful DB update
    if (logo && existingRestaurant.logo?.publicId) {
      await deleteFromCloudinary(existingRestaurant.logo.publicId);
    }

    // Delete old cover AFTER successful DB update
    if (coverPhoto && existingRestaurant.coverPhoto?.publicId) {
      await deleteFromCloudinary(existingRestaurant.coverPhoto.publicId);
    }

    return updatedRestaurant;
  } catch (error) {
    // Only clean up newly uploaded images if the DB update failed.
    // If DB update succeeded, don't delete the new images.
    throw error;
  }
};

//Get nearby restaurants service
const getNearbyRestaurants = async (location: ILocation) => {
  const restaurants = await restaurantRepository.getNearbyRestaurants(location);
  return restaurants;
};

//Get restaurant Profile
const getRestaurantProfile = async (restaurantId: string) => {
  const restaurant = await restaurantRepository.getRestaurantById(restaurantId);
  return restaurant;
};

//Search restaurant by name service
const searchRestaurantByName = async (name: string) => {
  const restaurants = await restaurantRepository.searchRestaurantByName(name);
  return restaurants;
};

//order management service
const manageOrderStatus = async (
  orderId: string,
  restaurantId: string,
  status: Status,
  preparationTime?: number,
) => {
  const updatedOrder = await restaurantRepository.manageOrderStatus(
    orderId,
    restaurantId,
    status,
    preparationTime,
  );
  return updatedOrder;
};

export default {
  createRestaurant,
  getProductsByCategory,
  manageRestaurantStatus,
  updateRestaurantSettings,
  restaurantLogin,
  getNearbyRestaurants,
  getRestaurantProfile,
  searchRestaurantByName,
  manageOrderStatus,
};
