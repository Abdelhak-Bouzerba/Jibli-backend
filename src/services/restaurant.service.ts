import restaurantRepository from "../repositories/restaurant";
import { IRestaurant } from "../types";
import { createRestaurantSchema } from "../utils/zod";
import { generateJWTtoken } from "../utils/generateJWTtoken";



//Create new Restaurant service
const createRestaurant = async (restaurantData: IRestaurant) => {

    //Check if restaurant already exists
    const existingRestaurant = await restaurantRepository.checkRestaurantExists(restaurantData.phone);
    if (existingRestaurant) {
        throw new Error("Restaurant already exists");
    }

    //validate restaurant data through zod schema
    const result = createRestaurantSchema.safeParse(restaurantData);
    if (!result.success) {
        throw new Error(`Validation error: ${result.error.message}`);
    }

    //Create new restaurant
    const newRestaurant = await restaurantRepository.createNewRestaurant(restaurantData);

    //generate JWT token 
    const token = generateJWTtoken({ id: newRestaurant.id, role: newRestaurant.role });

    return { newRestaurant, token };

};


export default { createRestaurant };
