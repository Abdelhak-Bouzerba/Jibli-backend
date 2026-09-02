import cartRepository from "../repositories/cart";



//Create new cart
const createCart = async (customerId: string) => {

    //check if cart already exists
    const cartExists = await cartRepository.checkCartExists(customerId);
    if(cartExists) {
        throw new Error("Cart already exists for this customer");
    }

    //Create new cart
    const cart = await cartRepository.createCart(customerId);
    return cart;
};

//Get cart 
const getCart = async (customerId: string) => {

    //check if customer has a cart
    const cartExists = await cartRepository.checkCartExists(customerId);
    if (!cartExists) {
        throw new Error("Cart does not exist for this customer");
    }

    //Get cart
    const cart = await cartRepository.getCart(customerId);
    return cart;
};

//Add item to cart
const addToCart = async (customerId: string, productId: string, quantity: number, variant: string) => {
    //check if customer has a cart
    const cartExists = await cartRepository.checkCartExists(customerId);
    if (!cartExists) {
        throw new Error("Cart does not exist for this customer");
    }

    //check if item already exists in cart
    const itemExists = await cartRepository.existsInCart(customerId, productId);
    if(itemExists) {
        throw new Error("Item already exists in cart");
    }

    //Add item to cart
    await cartRepository.addToCart(customerId, productId, quantity, variant);
};

//Delete item from cart
const deleteItemFromCart = async (customerId: string, productId: string) => {
    //check if customer has a cart
    const cartExists = await cartRepository.checkCartExists(customerId);
    if (!cartExists) {
        throw new Error("Cart does not exist for this customer");
    }

    //Delete item from cart
    await cartRepository.deleteItemFromCart(customerId, productId);

};

//Clear cart
const clearCart = async (customerId: string) => {
    
    //check if customer has a cart
    const cartExists = await cartRepository.checkCartExists(customerId);
    if (!cartExists) {
        throw new Error("Cart does not exist for this customer");
    }

    //Clear cart
    await cartRepository.clearCart(customerId);
};

export default {
    createCart,
    getCart,
    addToCart,
    deleteItemFromCart,
    clearCart,
};