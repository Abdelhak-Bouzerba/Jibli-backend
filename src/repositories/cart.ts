import Cart from "../models/cart";

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
    const cart = await Cart.findOne({ customerId });
    if (!cart) {
        throw new Error("Cart does not exist for this customer");
    }
    return cart;
};

//Add item to cart
const addToCart = async (customerId: string, productId: string, quantity: number, variant: any) => {
    const cart = await Cart.findOne({ customerId });
    if (!cart) {
        throw new Error("Cart does not exist for this customer");
    }

    //add new item to cart
    cart.items.push({ productId, quantity, variant });

    //update totalPrice
    cart.totalPrice += quantity * variant.price; 

    //save the changes to the cart
    await cart.save();
};

const existsInCart = async (customerId: string, productId: string) => { 
    const cart = await Cart.findOne({ customerId });
    if (!cart) {
        throw new Error("Cart does not exist for this customer");
    }

    //check if item exists in cart
    const itemExists = cart.items.find((item)=> item.productId.toString() === productId);

    //increase the quantity of the item if it exists
    if(itemExists) {
        itemExists.quantity += 1;
        cart.totalPrice += itemExists.variant.price;
        await cart.save();
        return true;
    }
    return false;
}

//Delete item from cart
const deleteItemFromCart = async (customerId: string, productId: string) => {
    const cart = await Cart.findOne({ customerId });
    if (!cart) {
        throw new Error("Cart does not exist for this customer");
    }

    //find the item 
    const itemToDelete = cart.items.find((item)=> item.productId.toString() === productId);
    if(!itemToDelete) {
        throw new Error("Item does not exist in the cart");
    }

    //get item price
    const itemPrice = itemToDelete.variant.price * itemToDelete.quantity;

    //remove item from cart
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    //update totalPrice
    cart.totalPrice -= itemPrice;

    //save the changes to the cart
    await cart.save();
};

//Clear cart
const clearCart = async (customerId: string) => {
    const cart = await Cart.findOne({ customerId });
    if (!cart) {
        throw new Error("Cart does not exist for this customer");
    }

    //delete all items and reset totalPrice 
    cart.items = [];
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
