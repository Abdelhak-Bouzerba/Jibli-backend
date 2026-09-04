import mongoose from "mongoose";
import Order from "../models/order";
import Cart from "../models/cart";
import { CreateOrderData } from "../types/index";
import crypto from "crypto";

//Create order
const createOrder = async (orderData: CreateOrderData) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
        const cart = await Cart.findOne({ customerId: orderData.customerId, }).session(session);
      if (!cart) {
        throw new Error("Cart not found for the customer.");
      }

      //check if cart is empty
      if (cart.items.length === 0) {
        throw new Error("Cart is empty. Cannot create an order.");
      }

      //calculate subtotal and totalPrice & delivery fee
      const subTotal = cart.items.reduce(
        (acc, item) => item.totalPrice + acc,
        0,
      );
      const deliveryFee =orderData.deliveryDetails.type === "delivery" ? 200 : 0;
      const totalPrice = subTotal + deliveryFee;

      //generate order number
      const serial = crypto.randomBytes(3).toString("hex").toUpperCase(); // Generates a random 6-character hex string
      const orderNumber = `JIBLI-ORD-${serial}`;

      //prepare order data for creation
      const newOrderData = {
        orderNumber,
        customerId: orderData.customerId,
        restaurantId: orderData.restaurantId,
        riderId: null, // Initially, no rider is assigned
        items: cart.items,
        subtotal: subTotal,
        totalPrice: totalPrice,
        status: "pending",
          deliveryDetails: {
            fee: deliveryFee,
            type: orderData.deliveryDetails.type,
            location: orderData.deliveryDetails.location,
        },
      };

      //create order
      const newOrder = new Order(newOrderData);
      await newOrder.save({ session });

      //clear cart
      cart.items = [];
      cart.totalPrice = 0;

      //save the updated cart
      await cart.save({ session });

      return newOrder;
    });
  } finally {
    await session.endSession();
  }
};

//Get order by id
const getOrderById = async (customerId: string, orderId: string) => {
    const order = await Order.findOne({ _id: orderId, customerId });
    return order;
};

//Get all orders
const getOrders = async (customerId: string) => {
    const orders = await Order.find({ customerId });
    return orders;
}

export default {
    createOrder,
    getOrderById,
    getOrders,
}