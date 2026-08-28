import productRepository from "../repositories/product";
import restaurantRepository from "../repositories/restaurant";
import { IProduct } from "../types/index";
import { createProductSchema } from "../validators/product.validators";
import { Types } from "mongoose";
import { deleteFromCloudinary } from "../utils/cloudinary";


//Create a new product service
const createProduct = async (productData: IProduct) => {

    //check if the product already exists
    const productExists = await productRepository.checkProductExists(productData.name, productData.restaurantId);
    if (productExists) {
        throw new Error(`${productData.name} already exists.`);
    }

    //check if the restaurant exists
    const restaurantExists = await restaurantRepository.checkRestaurantExistsById(productData.restaurantId.toString());
    if (!restaurantExists) {
        throw new Error(`Restaurant does not exist.`);
    }

    //Validate the product data
    const parseResult = createProductSchema.safeParse(productData);
    if (!parseResult.success) {
        throw new Error(`Validation error: ${parseResult.error.message}`);
    }

    //Create the product
    const product = await productRepository.createProduct(productData);
    return product;

};

//Get all products service
const getAllProducts = async () => {

    //Get all products
    const products = await productRepository.getAllProducts();
    return products;

};

//Get single product service
const getProductById = async (productId: string) => {

    //check if the productId is a valid ObjectId
    if (!Types.ObjectId.isValid(productId)) {
        throw new Error(`Invalid product ID.`);
    }

    //Get the product
    const product = await productRepository.getProductById(productId);
    if (!product) {
        throw new Error(`Product does not exist.`);
    }

    return product;

};

//update product service
const updateProduct = async (productId: string, data: IProduct) => {

    //validate the updated data
    // const parseResult = createProductSchema.safeParse(data);
    //  if (!parseResult.success) {
    //    throw new Error(`Validation error: ${parseResult.error.message}`);
    //  }

    //check if restaurant is exists
    const existingRestaurant = await restaurantRepository.checkRestaurantExistsById(data.restaurantId as unknown as string);
    if (!existingRestaurant) {
        throw new Error("Restaurant does not exists");
    }

    //check if product is exists
    const existingProduct = await productRepository.getProductById(productId);
    if (!existingProduct) {
        throw new Error("product does not exists");
    }

    //update product
    const updatedProduct = await productRepository.updateProduct(productId, data);

    //delete the old image from cloudinary if a new image is provided
    if (data.image && existingProduct.image && existingProduct.image.publicId) {
        const publicId = existingProduct.image.publicId;
        await deleteFromCloudinary(publicId);
    }

    return updatedProduct;

};

//Delete a product service
const deleteProduct = async (productId: string) => {

    //check if the product exists
    const productExists = await productRepository.getProductById(productId);
    if (!productExists) {
        throw new Error(`Product does not exist.`);
    }

    //Delete the product
    await productRepository.deleteProduct(productId);

};


export default {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
}