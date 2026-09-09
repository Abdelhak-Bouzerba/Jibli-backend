import Customer from "../models/customer";
import Order from "../models/order";
import { ICustomer } from "../types/index";
import { ApiError } from "../utils/apiError";

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

//remove saved Address
const removeSavedAddress = async (customerId: string, label: string) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }
  
  // Remove the savedAddress
  customer.savedAddresses = customer.savedAddresses?.filter((save) => save.label !== label);

  //save to database
  await customer.save();

};

//check if saved address exists
const checkSavedAddressExists = async (customerId: string, label: string) => {
  const savedAddressExists = await Customer.exists({
    _id: customerId,
    savedAddresses: { $elemMatch: { label } },
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

const checkSavedRestaurantExists = async (
  customerId: string,
  restaurantId: string,
) => {
  const savedRestaurantExists = await Customer.exists({
    _id: customerId,
    savedRestaurants: { $elemMatch: { $eq: restaurantId } },
  });

  return savedRestaurantExists;
};

//remove saved restaurant
const removeSavedRestaurant = async (customerId: string, restaurantId: string) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // Remove the restaurantId from the savedRestaurants array
  customer.savedRestaurants = customer.savedRestaurants?.filter((save) => save.toString() !== restaurantId);

  //save to database
  await customer.save();

};

//Get saved restaurants
const getSavedRestaurants = async (customerId: string) => {
  const customer = await Customer.findById(customerId).populate(
    "savedRestaurants",
    "name logo coverImage isOpen",
  );
  return customer?.savedRestaurants;
};

//Cancel order by customer
const cancelOrderByCustomer = async (orderId: string, customerId: string) => {
  const order = await Order.findOne({ _id: orderId, customerId });
  if (!order) {
    throw new ApiError(404, "Order not found for the customer.");
  }

  if (order.status === "cancelled") {
    throw new ApiError(409, "Order is already cancelled.");
  }

  if (order.status === "pending") {
    order.status = "cancelled";
    await order.save();
    return { message: "Order cancelled successfully" };
  }

  return { message: "cannot cancel order" };
};

export default {
  createCustomer,
  checkExistCustomer,
  getCustomerById,
  addSavedAddress,
  addSavedRestaurant,
  checkSavedAddressExists,
  checkSavedRestaurantExists,
  getSavedRestaurants,
  cancelOrderByCustomer,
  removeSavedAddress,
  removeSavedRestaurant,
};
