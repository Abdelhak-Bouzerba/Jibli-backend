import productRepository from "../repositories/product";
import restaurantRepository from "../repositories/restaurant";
import { IProduct } from "../types/index";
import { createProductSchema } from "../utils/zod";


//Create a new product service
const createProduct = async (productData: IProduct) => {

    //check if the product already exists
    const productExists = await productRepository.checkProductExists(productData.restaurantId, productData.name);
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


export default {
    createProduct,
}