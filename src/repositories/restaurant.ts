import mongoose from "mongoose";
import { IRestaurant } from "../types/restaurant";
import Restaurant from "../models/restaurant";


//create new Restaurant operation
const createNewRestaurant = async (restaurantData: IRestaurant) => {
    try {
        const restaurant = await Restaurant.create(restaurantData);
        return restaurant;
    } catch (error) {
        throw error;
    }
};

//check if restaurant exists
const checkRestaurantExists = async (restaurantPhone: string) => { 
    try { 
        const rs = await Restaurant.findOne({ phone: restaurantPhone });
        if(rs) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
};


export default { createNewRestaurant, checkRestaurantExists };