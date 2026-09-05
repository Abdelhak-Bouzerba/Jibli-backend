import { IRestaurant , Status } from "../types";
import Restaurant from "../models/restaurant";
import Product from "../models/product";
import Order from "../models/order";

//Login restaurant
const restaurantLogin = async (phone: string) => {
    const restaurant = await Restaurant.findOne({ phone });
    return restaurant;
};

//create new Restaurant operation
const createNewRestaurant = async (restaurantData: IRestaurant) => {
    const restaurant = await Restaurant.create(restaurantData);
    return restaurant;
};

//check if restaurant exists by Id
const checkRestaurantExists = async (restaurantPhone: string) => {
    const rs = await Restaurant.findOne({ phone: restaurantPhone });
    if (rs) {
        return true;
    }
    return false;
};

//Get all restaurants
const getAllRestaurants = async () => {
    const restaurants = await Restaurant.find()
    .select("-phone -ratingCount -createdAt -updatedAt -role")
    .lean();
    return restaurants;
};

//Get restaurant by Id
const getRestaurantById = async (restaurantId: string) => {
    const rs = await Restaurant.findById(restaurantId)
    .select("-phone -ratingCount -createdAt -updatedAt -role")
    .lean();
    return rs;
};

//check if restaurant exists by phone
const checkRestaurantExistsById = async (restaurantId: string) => {
    const rs = await Restaurant.findById(restaurantId);
    return rs;
};

//Get Restaurant products by category
const getProducts = async (restaurantId: string, category: string) => {
    const products = await Product.find({ restaurantId, category } as any)
        .select("-restaurantId -__v -createdAt -updatedAt")
        .lean();
    return products;
};

//Update restaurant status
const manageRestaurantStatus = async (restaurantId: string,status: boolean) => {
    const rs = await Restaurant.findById(restaurantId);
    if (!rs) {
        throw new Error("Restaurant not found");
    }

    rs.isActive = status;
    await rs.save();
    return rs;
};

//Update restaurant settings
const updateRestaurantSettings = async (restaurantId: string,settings: Partial<IRestaurant>,) => {
    const rs = await Restaurant.findByIdAndUpdate(
        restaurantId,
        { $set: settings },
        { returnDocument: "after", runValidators: true },
    ).lean();
    return rs;
};

//Search for restaurnat by name
const searchRestaurantByName = async (name: string) => { 
    const restaurants = await Restaurant.find(
        {
            name: { $regex: new RegExp(name, "i") },
        }
    ).select("-phone -ratingCount -createdAt -updatedAt -role")
    .lean();

    return restaurants;
};

//check order belongs to restaurant
const checkOrderBelongsToRestaurant = async (orderId: string, restaurantId: string) => {
    const order = await Order.exists({ _id: orderId, restaurantId });
    return order;
};

//Manage order status
const manageOrderStatus = async (orderId: string,restaurantId: string, status: Status, preparationTime?: number) => {
    const order = await Order.findOne({ _id: orderId, restaurantId });
    if (!order) {
        throw new Error("Order not found for the restaurant.");
    }

    if (preparationTime) {
        order.preparationTime = preparationTime;
    }
    order.status = status;

    //save the updated order
    await order.save();
    return order;

};

export default {
  createNewRestaurant,
  getRestaurantById,
  checkRestaurantExistsById,
  checkRestaurantExists,
  getProducts,
  manageRestaurantStatus,
  updateRestaurantSettings,
  restaurantLogin,
  getAllRestaurants,
    searchRestaurantByName,
  checkOrderBelongsToRestaurant,
  manageOrderStatus,
};
