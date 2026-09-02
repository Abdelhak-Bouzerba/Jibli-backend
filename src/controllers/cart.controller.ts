import { Request, Response } from "express";
import cartService from "../services/cart.service";

//Create new cart controller
export const createCart = async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;

    //check if customerId is provided
    if(!customerId) {
        res.status(400).json({ message: "Customer ID is required" });
        return;
    }

    //Call service to create the new cart
    const cart = await cartService.createCart(customerId);

    //send response
    res.status(201).json(cart);

};

//Get cart controller
export const getCart = async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;

    //check if customerId is provided
    if (!customerId) {
        res.status(400).json({ message: "Customer ID is required" });
        return;
    }

    //Call service to get the cart
    const cart = await cartService.getCart(customerId);

    //send response
    res.status(200).json(cart);
};

//Add item to cart controller
export const addToCart = async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;
    const { productId, quantity, variant } = req.body;

    //check if req.body is provided
    if (!productId || !quantity || !variant) {
        res.status(400).json({ message: "Product ID, quantity, and variant are required" });
        return;
    }

    //Call service to add item to the cart
    await cartService.addToCart(customerId, productId, quantity, variant);

    //send response
    res.status(200).json({ message: "Item added to cart successfully" });

};

//Delete item from cart controller
export const deleteItemFromCart = async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;
    const { productId } = req.body;

    //check if req.body is provided
    if (!productId) {
        res.status(400).json({ message: "Product ID is required" });
        return;
    }

    //Call service to delete item from the cart
    await cartService.deleteItemFromCart(customerId, productId);

    //send response
    res.status(200).json({ message: "Item deleted from cart successfully" });

};

//Clear cart controller
export const clearCart = async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;

    //Call service to clear the cart
    await cartService.clearCart(customerId);

    //send response
    res.status(200).json({ message: "Cart cleared successfully" });

};