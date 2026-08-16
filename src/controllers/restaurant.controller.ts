import restaurantService from "../services/restaurant.service";
import { Request, Response } from "express";


//Create new Restaurant controller
export const createRestaurant = async (req: Request, res: Response) => {

    //check if request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "Request body is empty" });
        return;
    }

    //Call service to create new restaurant
    const { token , newRestaurant} = await restaurantService.createRestaurant(req.body);

    //send response
    res.status(201).send({ restaurant: newRestaurant, token, message: "Restaurant created successfully" });

}; 