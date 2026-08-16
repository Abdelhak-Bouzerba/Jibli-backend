import Product from "../models/product";
import { IProduct } from "../types/index";
import { Types } from "mongoose";

//Check if a product exists
const checkProductExists = async (restaurantId: Types.ObjectId, productName: string) => {
  try {
    const product = await Product.findOne({
      restaurantId: restaurantId,
      name: productName,
    });
    return product;
  } catch (error) {
    throw new Error(`Error checking product existence: ${error}`);
  }
};


//Create a new product operation
const createProduct = async (productData: IProduct) => {
    try {
        const product = await Product.create(productData);
        return product;
    } catch (error) {
        throw new Error(`Error creating product: ${error}`);
    }
};


export default {
    createProduct,
    checkProductExists
}