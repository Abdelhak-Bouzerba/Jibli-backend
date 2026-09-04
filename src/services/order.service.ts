import orderRepository from "../repositories/order";
import restaurantRepository from "../repositories/restaurant";
import { CreateOrderData } from "../types/index";
import { createOrderSchema } from "../validators/order.validator";


//Create order service
const createOrder = async (orderData: CreateOrderData) => {
    //check if restaurant still exists and if open 
    const restaurant = await restaurantRepository.getRestaurantById(orderData.restaurantId as string);
    if (!restaurant || !restaurant.isOpen) {
        throw new Error("Restaurant not found or not open");
    }

    //validate create order data
    const parseResult = createOrderSchema.safeParse(orderData);
    if (!parseResult.success) {
        throw new Error(`Validation error: ${parseResult.error.message}`);
    }

    //create order
    const newOrder = await orderRepository.createOrder(orderData);
    return newOrder;

};

//Get order by id service
const getOrderById = async (customerId: string, orderId: string) => {
    const order = await orderRepository.getOrderById(customerId, orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    return order;

};

//Get all orders
const getOrders = async (customerId: string) => {
    const orders = await orderRepository.getOrders(customerId);
    return orders;
};

export default {
    createOrder,
    getOrderById,
    getOrders,
};