import Customer from "../models/customer";
import { ICustomer } from "../types/index";

//Create a new customer
const createCustomer = async (customerData: Partial<ICustomer>) => {
  const customer = await Customer.create(customerData);
  return customer;
};

//Check customer exists
const checkExistCustomer = async (phone: string) => {
  const customer = await Customer.exists({ phone });
  return customer;
};

//Get customer by id
const getCustomerById = async (customerId: string) => {
  const customer = await Customer.findById(customerId);
  return customer;
};

//Add saved address
const addSavedAddress = async (customerId: string, location: any) => {
  const customer = await Customer.findByIdAndUpdate(
    customerId,
    { $push: { savedAddresses: location } },
    { returnDocument: "after" },
  );
  return customer;
};

//check if saved address exists
const checkSavedAddressExists = async (customerId: string, location: any) => {
  const savedAddressExists = await Customer.exists({
    _id: customerId,
    savedAddresses: { $elemMatch: location },
  });

  return savedAddressExists;
};

//add restaurant to saved restaurants
const addSavedRestaurant = async (customerId: string, restaurantId: string) => {
  await Customer.findByIdAndUpdate(
    customerId,
    { $push: { savedRestaurants: restaurantId } },
    { returnDocument: "after" },
  );
};

const checkSavedRestaurantExists = async (customerId: string,restaurantId: string) => {
  const savedRestaurantExists = await Customer.exists({
    _id: customerId,
    savedRestaurants: { $elemMatch: { $eq: restaurantId } },
  });

  return savedRestaurantExists;
};

//Get saved restaurants
const getSavedRestaurants = async (customerId: string) => {
  const customer = await Customer.findById(customerId).populate("savedRestaurants","name logo coverImage isOpen");
  return customer?.savedRestaurants;
}

export default {
  createCustomer,
  checkExistCustomer,
  getCustomerById,
  addSavedAddress,
  addSavedRestaurant,
  checkSavedAddressExists,
  checkSavedRestaurantExists,
  getSavedRestaurants,
};
