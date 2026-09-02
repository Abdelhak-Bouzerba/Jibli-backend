import customerService from "../services/customer.service";
import { Request, Response } from "express";


//Create new customer controller 
export const createCustomer = async (req: Request, res: Response) => {
    const customerData = req.body;

    //check if req body is provided
    if (!req.body) {
        res.status(400).send("customer data is required");
        return;
    }

    //Call service to create customer
    const { customer, token } = await customerService.createCustomer(customerData);

    //send response
    res.status(200).send({
        customer,
        token,
        message: "Customer created successfully"
    });

};

//Get customer profile controller
export const getCustomerProfile = async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;

    //check if customerId is provided
    if (!customerId) {
        res.status(400).send("customer id is required");
        return;
    }

    //Call service to get customer profile
    const customer = await customerService.getCustomerProfile(customerId);

    //send response
    res.status(200).send({
        customer,
        message: "Customer profile fetched successfully"
    });

};

//Add saved address controller
export const addSavedAddress = async (req: Request, res: Response) => {
    const data = req.body;
    const customerId = req.user?.id as string;

    //check if customerId and data are provided
    if (!customerId || !data) {
        res.status(400).send("customer id and location data are required");
        return;
    }

    //Call service to add saved address
    const customer = await customerService.addSavedAddress(customerId, data);

    //send response
    res.status(200).send({
        customer,
        message: "Saved address added successfully"
    });
};

//Add saved restaurant controller
export const addSavedRestaurant = async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;
    const restaurantId = req.body.restaurantId as string;

    //check if customerId and restaurantId are provided
    if (!customerId || !restaurantId) {
        res.status(400).send("customer id and restaurant id are required");
        return;
    }

    //Call service to add saved restaurant
    await customerService.addSavedRestaurant(customerId, restaurantId);

    //send response
    res.status(200).send({
        message: "restaurant added to saved successfully"
    });

};

//Get saved restaurants controller
export const getSavedRestaurants = async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;

    //check if customerId is provided
    if (!customerId) {
        res.status(400).send("customer id is required");
        return;
    }

    //Call service to get saved restaurants
    const savedRestaurants = await customerService.getSavedRestaurants(customerId);

    //send response
    res.status(200).send({
        savedRestaurants,
        message: "Saved restaurants fetched successfully"
    });

};