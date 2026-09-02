import customerRepository from "../repositories/customer";
import restaurantRepository from "../repositories/restaurant";
import { ICustomer } from "../types";
import { generateJWTtoken } from "../utils/generateJWTtoken";
import {
  createCustomerSchema,
  addSavedAddressSchema,
} from "../validators/customer.validator";

//Create a new customer
const createCustomer = async (customerData: ICustomer) => {
  //check if customer already exists
  const existingCustomer = await customerRepository.checkExistCustomer(
    customerData?.phone,
  );
  if (existingCustomer) {
    throw new Error("Customer already exists");
  }

  //Validate customer data
  const parseResult = createCustomerSchema.safeParse(customerData);
  if (parseResult.error) {
    throw new Error(`Validation error: ${parseResult.error.message}`);
  }

  //create new customer
  const customer = await customerRepository.createCustomer(parseResult.data);

  //generate JWTtoken for the customer
  const token = generateJWTtoken({ id: customer._id, role: customer.role });

  return { customer, token };
};

//Get customer profile
const getCustomerProfile = async (customerId: string) => {
  //check if customer exists
  const customer = await customerRepository.getCustomerById(customerId);
  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

//Add saved Address
const addSavedAddress = async (customerId: string, location: any) => {
  //check if customer exists
  const customer = await customerRepository.getCustomerById(customerId);
  if (!customer) {
    throw new Error("Customer not found");
  }

  //check if saved address already exists
  const savedAddressExists = await customerRepository.checkSavedAddressExists(
    customerId,
    location,
  );
  if (savedAddressExists) {
    throw new Error("Saved address already exists");
  }

  //validate location object
  const parseResult = addSavedAddressSchema.safeParse(location);
  if (parseResult.error) {
    throw new Error(`Validation error: ${parseResult.error.message}`);
  }

  //Add saved address
  const updatedCustomer = await customerRepository.addSavedAddress(
    customerId,
    parseResult.data,
  );
  return updatedCustomer;
};

//Add saved restaurant
const addSavedRestaurant = async (customerId: string, restaurantId: string) => {
  //check if customer exists
  const customer = await customerRepository.getCustomerById(customerId);
  if (!customer) {
    throw new Error("Customer not found");
  }

  //check if restaurant exists
  const restaurantExists = await restaurantRepository.checkRestaurantExistsById(restaurantId);
  if (!restaurantExists) {
    throw new Error("Restaurant not found");
  }

  //check if restaurant is already saved
  const savedRestaurantExists = await customerRepository.checkSavedRestaurantExists(
      customerId,
      restaurantId,
    );
  if (savedRestaurantExists) {
    throw new Error("Restaurant already saved");
  }

  //Add saved restaurant
  await customerRepository.addSavedRestaurant(customerId, restaurantId);

};

//Get saved restaurants
const getSavedRestaurants = async (customerId: string) => {
  const savedRestaurants = await customerRepository.getSavedRestaurants(customerId);
  return savedRestaurants;
};

export default {
  createCustomer,
  getCustomerProfile,
  addSavedAddress,
  addSavedRestaurant,
  getSavedRestaurants,
};
