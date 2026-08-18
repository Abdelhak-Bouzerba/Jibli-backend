import Product from "../models/product";
import { IProduct } from "../types/index";
import { Types } from "mongoose";

//Check if a product exists
const checkProductExists = async (
  restaurantId: Types.ObjectId,
  productName: string,
) => {
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

//Get all products
const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error(`Error retrieving products: ${error}`);
  }
};

//Get single product by ID
const getProductById = async (productId: string) => {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    throw new Error(`Error retrieving product: ${error}`);
  }
};

//Update product
const updateProduct = async (productId: string, data: Partial<IProduct>) => {
  try {
    const product = await Product.findByIdAndUpdate(productId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    return product;
  } catch (error) {
    throw new Error(`Error updating product: ${error}`);
  }
};

//Delete a product
const deleteProduct = async (productId: string) => {
  try {
    await Product.findByIdAndDelete(productId);
  } catch (error) {
    throw new Error(`Error deleting product: ${error}`);
  }

};

export default {
  createProduct,
  checkProductExists,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
