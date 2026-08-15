import restaurantRepository from "../repositories/restaurant";
import { IRestaurant } from "../types/restaurant";
import { createRestaurantSchema } from "../utils/zod";



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
    return newRestaurant;

}


export default { createRestaurant };
