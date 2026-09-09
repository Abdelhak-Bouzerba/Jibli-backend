import orderRepository from "../repositories/order";
import restaurantRepository from "../repositories/restaurant";
import { CreateOrderData } from "../types/index";
import { createOrderSchema } from "../validators/order.validator";
import { ApiError } from "../utils/apiError";

//Create order service
const createOrder = async (orderData: CreateOrderData) => {
  //check if restaurant still exists and if open
  const restaurant = await restaurantRepository.getRestaurantById(
    orderData.restaurantId as string,
  );
  if (!restaurant || !restaurant.isOpen) {
    throw new ApiError(404, "Restaurant not found or not open");
  }

  //validate create order data
  const parseResult = createOrderSchema.safeParse(orderData);
  if (!parseResult.success) {
    throw new ApiError(400, `Validation error: ${parseResult.error.message}`);
  }

  //create order
  const newOrder = await orderRepository.createOrder(orderData);
  return newOrder;
};
export default {
  createOrder,
};
