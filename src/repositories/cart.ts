import Cart from "../models/cart";
import { ApiError } from "../utils/apiError";

//Create new cart
const createCart = async (customerId: string) => {
  const cart = await Cart.create({ customerId });
  return cart;
};

//check if cart exists
const checkCartExists = async (customerId: string) => {
  const cart = await Cart.exists({ customerId });
  return cart;
};

//Get cart
const getCart = async (customerId: string) => {
  const cart = await Cart
    .findOne({ customerId })
    .populate("items.productId", 'name image description');
  if (!cart) {
    throw new ApiError(404, "Cart does not exist for this customer");
  }
  return cart;
};

//Add item to cart
const addToCart = async (customerId: string,productId: string,quantity: number,variant: any) => {
  const cart = await Cart.findOne({ customerId });
  if (!cart) {
    throw new ApiError(404, "Cart does not exist for this customer");
  }

  //calculate total price & unit price for the item
  const unitPrice = variant.price;
  const totalPrice = unitPrice * quantity;

  //add new item to cart
  cart.items.push({ productId, quantity, variant, unitPrice, totalPrice });
  
  //set deliveryFee to 150DA
  if(cart.deliveryFee ===0 ){
    cart.deliveryFee = 150;
  }
  //update subTotal AND totalPrice
  cart.subTotal += quantity * variant.price;
  cart.totalPrice += cart.subTotal + cart.deliveryFee;

  //save the changes to the cart
  await cart.save();
};

const existsInCart = async (customerId: string, productId: string) => {
  const cart = await Cart.findOne({ customerId });
  if (!cart) {
    throw new ApiError(404, "Cart does not exist for this customer");
  }

  //check if item exists in cart
  const itemExists = cart.items.find(
    (item) => item.productId.toString() === productId,
  );

  //increase the quantity of the item if it exists
  if (itemExists) {
    itemExists.quantity += 1;
    cart.totalPrice += itemExists.variant.price;
    await cart.save();
    return true;
  }
  return false;
};

//Delete item from cart
const deleteItemFromCart = async (customerId: string, productId: string) => {
  const cart = await Cart.findOne({ customerId });
  if (!cart) {
    throw new ApiError(404, "Cart does not exist for this customer");
  }

  //find the item
  const itemToDelete = cart.items.find(
    (item) => item.productId.toString() === productId,
  );
  if (!itemToDelete) {
    throw new ApiError(404, "Item does not exist in the cart");
  }

  //get item price
  const itemPrice = itemToDelete.variant.price * itemToDelete.quantity;

  //remove item from cart
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  //update totalPrice
  cart.totalPrice -= itemPrice;
  cart.subTotal -= itemPrice;

  //save the changes to the cart
  await cart.save();
};

//Clear cart
const clearCart = async (customerId: string) => {
  const cart = await Cart.findOne({ customerId });
  if (!cart) {
    throw new ApiError(404, "Cart does not exist for this customer");
  }

  //delete all items and reset totalPrice
  cart.items = [];
  cart.subTotal = 0;
  cart.totalPrice = 0;

  //save the changes to the cart
  await cart.save();
};

export default {
  createCart,
  checkCartExists,
  getCart,
  addToCart,
  deleteItemFromCart,
  clearCart,
  existsInCart,
};
