import customerRepository from "../repositories/customer";
import restaurantRepository from "../repositories/restaurant";
import orderRepository from "../repositories/order";
import { Types } from "mongoose";
import { ICustomer } from "../types";
import { generateJWTtoken } from "../utils/generateJWTtoken";
import {
  createCustomerSchema,
  addSavedAddressSchema,
} from "../validators/customer.validator";
import { ApiError } from "../utils/apiError";

//Create a new customer
const createCustomer = async (customerData: ICustomer) => {
  //check if customer already exists
  const existingCustomer = await customerRepository.checkExistCustomer(
    customerData?.phone,
  );
  if (existingCustomer) {
    throw new ApiError(409, "Customer already exists");
  }

  //Validate customer data
  const parseResult = createCustomerSchema.safeParse(customerData);
  if (parseResult.error) {
    throw new ApiError(400, `Validation error: ${parseResult.error.message}`);
  }

  const customerDataForPersistence: Partial<ICustomer> = {
    ...parseResult.data,
    savedRestaurants: parseResult.data.savedRestaurants?.map(
      (restaurantId) => new Types.ObjectId(restaurantId),
    ),
  };

  //create new customer
  const customer = await customerRepository.createCustomer(
    customerDataForPersistence,
  );

  //generate JWTtoken for the customer
  const token = generateJWTtoken({ id: customer._id, role: customer.role });

  return { customer, token };
};

//Get customer profile
const getCustomerProfile = async (customerId: string) => {
  //check if customer exists
  const customer = await customerRepository.getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return customer;
};

//Add saved Address
const addSavedAddress = async (customerId: string, location: any) => {
  //check if customer exists
  const customer = await customerRepository.getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  //check if saved address already exists
  const savedAddressExists = await customerRepository.checkSavedAddressExists(
    customerId,
    location,
  );
  if (savedAddressExists) {
    throw new ApiError(409, "Saved address already exists");
  }

  //validate location object
  const parseResult = addSavedAddressSchema.safeParse(location);
  if (parseResult.error) {
    throw new ApiError(400, `Validation error: ${parseResult.error.message}`);
  }

  //Add saved address
  const updatedCustomer = await customerRepository.addSavedAddress(
    customerId,
    parseResult.data,
  );
  return updatedCustomer;
};

//Remove saved address
const removeSavedAddress = async (customerId: string, label: string) => {

  //check if customer exists
  const customer = await customerRepository.getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  //check if saved address exists
  const savedAddressExists = await customerRepository.checkSavedAddressExists(customerId, label);
  if (!savedAddressExists) {
    throw new ApiError(404, "Saved address not found");
  }

  //Remove saved address
  await customerRepository.removeSavedAddress(customerId, label);

};

//Add saved restaurant
const addSavedRestaurant = async (customerId: string, restaurantId: string) => {
  //check if customer exists
  const customer = await customerRepository.getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  //check if restaurant exists
  const restaurantExists =
    await restaurantRepository.checkRestaurantExistsById(restaurantId);
  if (!restaurantExists) {
    throw new ApiError(404, "Restaurant not found");
  }

  //check if restaurant is already saved
  const savedRestaurantExists =
    await customerRepository.checkSavedRestaurantExists(
      customerId,
      restaurantId,
    );
  if (savedRestaurantExists) {
    throw new ApiError(409, "Restaurant already saved");
  }

  //Add saved restaurant
  await customerRepository.addSavedRestaurant(customerId, restaurantId);
};

//Remove saved restaurant
const removeSavedRestaurant = async (customerId: string, restaurantId: string) => {
  //check if customer exists
  const customer = await customerRepository.getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  //check if saved restaurant exists
  const savedRestaurantExists = await customerRepository.checkSavedRestaurantExists(customerId,restaurantId);
  if (!savedRestaurantExists) {
    throw new ApiError(404, "Saved restaurant not found");
  }

  //Remove saved restaurant
  await customerRepository.removeSavedRestaurant(customerId, restaurantId);
  
};

//Get saved restaurants
const getSavedRestaurants = async (customerId: string) => {
  const savedRestaurants =
    await customerRepository.getSavedRestaurants(customerId);
  return savedRestaurants;
};

//Get all orders
const getOrders = async (customerId: string) => {
  const orders = await orderRepository.getOrders(customerId);
  return orders;
};

//Get order by id service
const getOrderById = async (customerId: string, orderId: string) => {
  const order = await orderRepository.getOrderById(customerId, orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return order;
};


//cancel order by customer
const cancelOrderByCustomer = async (customerId: string, orderId: string) => {
  //check if customer exists
  const customer = await customerRepository.getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  //cancel order
  const cancelledOrder = await customerRepository.cancelOrderByCustomer(
    orderId,
    customerId,
  );
  return cancelledOrder;
};

export default {
  createCustomer,
  getCustomerProfile,
  addSavedAddress,
  addSavedRestaurant,
  getSavedRestaurants,
  cancelOrderByCustomer,
  getOrderById,
  getOrders,
  removeSavedAddress,
  removeSavedRestaurant,
};
