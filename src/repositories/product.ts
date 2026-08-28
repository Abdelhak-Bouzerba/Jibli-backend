import Product from "../models/product";
import { IProduct } from "../types/index";
import { Types } from "mongoose";

//Check if a product exists
const checkProductExists = async (productName: string,restaurantId: Types.ObjectId,) => {
    const product = await Product.findOne({
      restaurantId: restaurantId,
      name: productName,
    });
    return product;
};

//Create a new product operation
const createProduct = async (productData: IProduct) => {
    const product = await Product.create(productData);
    return product;
};

//Get all products
const getAllProducts = async () => {
      const products = await Product
          .find()
          .select("-createdAt -updatedAt -__v")
          .lean();
    return products;
};

//Get single product by ID
const getProductById = async (productId: string) => {
      const product = await Product
          .findById(productId)
          .select("name price category preparationTime isAvailable image restaurantId");
    return product;
};

//Update product
const updateProduct = async (productId: string, data: Partial<IProduct>) => {
    const product = await Product.findByIdAndUpdate(productId, data, {
      returnDocument: "after",
      runValidators: true,
    }).select("name price category preparationTime isAvailable image");
    return product;
};

//Delete a product
const deleteProduct = async (productId: string) => {
    await Product.findByIdAndDelete(productId);
};

export default {
  createProduct,
  checkProductExists,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
