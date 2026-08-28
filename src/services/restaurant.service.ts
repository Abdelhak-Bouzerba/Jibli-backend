import restaurantRepository from "../repositories/restaurant";
import { IRestaurant } from "../types";
import { createRestaurantSchema } from "../validators/restaurant.validator";
import { generateJWTtoken } from "../utils/generateJWTtoken";

//Restaurant login service
const restaurantLogin = async (phone: string) => {

    //check if restaurant exists
    const restaurantExists = await restaurantRepository.checkRestaurantExists(phone);
    if (!restaurantExists) {
        throw new Error("Restaurant does not exist");
    }

    //Login restaurant
    const restaurant = await restaurantRepository.restaurantLogin(phone);
    if(!restaurant) {
        throw new Error("Restaurant not found");
    }

    //generate token
    const token = generateJWTtoken({ id: restaurant.id, role: restaurant.role });

    return { restaurant, token };

};

//Create new Restaurant service
const createRestaurant = async (restaurantData: IRestaurant) => {

    //Check if restaurant already exists
    const existingRestaurant = await restaurantRepository.checkRestaurantExists(restaurantData.phone);
    if (existingRestaurant) {
        throw new Error("Restaurant already exists");
    }

    //validate restaurant data through zod schema
    const parseResult = createRestaurantSchema.safeParse(restaurantData);
    if (!parseResult.success) {
        throw new Error(`Validation error: ${parseResult.error.message}`);
    }

    //Create new restaurant
    const newRestaurant = await restaurantRepository.createNewRestaurant(restaurantData);

    //generate JWT token 
    const token = generateJWTtoken({ id: newRestaurant.id, role: newRestaurant.role });

    return { newRestaurant, token };

};

//Get products by category service
const getProductsByCategory = async (restaurantId: string, category: string) => {

    //check if restaurant exists
    const restaurantExists = await restaurantRepository.checkRestaurantExistsById(restaurantId);
    if (!restaurantExists) {
        throw new Error("Restaurant does not exist");
    }

    //Get products by category
    const products = await restaurantRepository.getProducts(restaurantId, category);
    return products;

}

//Manage restauarnt status service
const manageRestaurantStatus = async (restaurantId: string, status: boolean) => {

    //check if restaurant exists
    const restaurantExists = await restaurantRepository.checkRestaurantExistsById(restaurantId);
    if (!restaurantExists) {
        throw new Error("Restaurant does not exist");
    }

    //Update restaurant status
    const updatedRestaurant = await restaurantRepository.manageRestaurantStatus(
      restaurantId,
      status,
    );
    return updatedRestaurant;
    
}

//Update restaurant settings service
const updateRestaurantSettings = async (restaurantId: string, settings: Partial<IRestaurant>) => {

    //check if resturant exists 
    const existingRestaurant = await restaurantRepository.checkRestaurantExistsById(restaurantId);
    if (!existingRestaurant) {
        throw new Error("Restaurant does not exist");
    }

    //Update restaurant settings
    const updatedRestaurant = await restaurantRepository.updateRestaurantSettings(restaurantId, settings);
    return updatedRestaurant;
    
}

export default {
  createRestaurant,
  getProductsByCategory,
  manageRestaurantStatus,
    updateRestaurantSettings,
    restaurantLogin,
};
