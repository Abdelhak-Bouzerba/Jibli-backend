import restaurantRepository from "../repositories/restaurant";
import { IRestaurant } from "../types";
import { createRestaurantSchema } from "../validators/restaurant.validator";
import { generateJWTtoken } from "../utils/generateJWTtoken";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";

//Restaurant login service
const restaurantLogin = async (phone: string) => {
  //check if restaurant exists
  const restaurantExists =
    await restaurantRepository.checkRestaurantExists(phone);
  if (!restaurantExists) {
    throw new Error("Restaurant does not exist");
  }

  //Login restaurant
  const restaurant = await restaurantRepository.restaurantLogin(phone);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  //generate token
  const token = generateJWTtoken({ id: restaurant.id, role: restaurant.role });

  return { restaurant, token };
};

//Create new Restaurant service
const createRestaurant = async (restaurantData: IRestaurant) => {
  //Check if restaurant already exists
  const existingRestaurant = await restaurantRepository.checkRestaurantExists(
    restaurantData.phone,
  );
  if (existingRestaurant) {
    throw new Error("Restaurant already exists");
  }

  //validate restaurant data through zod schema
  const parseResult = createRestaurantSchema.safeParse(restaurantData);
  if (!parseResult.success) {
    throw new Error(`Validation error: ${parseResult.error.message}`);
  }

  //Create new restaurant
  const newRestaurant =
    await restaurantRepository.createNewRestaurant(restaurantData);

  //generate JWT token
  const token = generateJWTtoken({
    id: newRestaurant.id,
    role: newRestaurant.role,
  });

  return { newRestaurant, token };
};

//Get products by category service
const getProductsByCategory = async (restaurantId: string,category: string) => {
  //check if restaurant exists
  const restaurantExists =
    await restaurantRepository.checkRestaurantExistsById(restaurantId);
  if (!restaurantExists) {
    throw new Error("Restaurant does not exist");
  }

  //Get products by category
  const products = await restaurantRepository.getProducts(
    restaurantId,
    category,
  );
  return products;
};

//Manage restauarnt status service
const manageRestaurantStatus = async (restaurantId: string,status: boolean,) => {
  //check if restaurant exists
  const restaurantExists =
    await restaurantRepository.checkRestaurantExistsById(restaurantId);
  if (!restaurantExists) {
    throw new Error("Restaurant does not exist");
  }

  //Update restaurant status
  const updatedRestaurant = await restaurantRepository.manageRestaurantStatus(
    restaurantId,
    status,
  );
  return updatedRestaurant;
};

//Update restaurant settings service
const updateRestaurantSettings = async (restaurantId: string,settings: Partial<IRestaurant>,logo?: Express.Multer.File,coverPhoto?: Express.Multer.File) => {
  //check if restaurant exists
  const existingRestaurant =await restaurantRepository.checkRestaurantExistsById(restaurantId);
  if (!existingRestaurant) {
    throw new Error("Restaurant does not exist");
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

//Get all restaurants service
const getAllRestaurants = async () => {
    const restaurants = await restaurantRepository.getAllRestaurants();
    return restaurants;

};

//Get single restaurant
const getSingleRestaurant = async(restaurantId: string) => {
    const restaurant = await restaurantRepository.getRestaurantById(restaurantId);
    return restaurant;
};

export default {
  createRestaurant,
  getProductsByCategory,
  manageRestaurantStatus,
  updateRestaurantSettings,
  restaurantLogin,
  getAllRestaurants,
  getSingleRestaurant,
};
