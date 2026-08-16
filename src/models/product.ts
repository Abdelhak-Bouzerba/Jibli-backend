import mongoose from "mongoose";
import { IProduct } from "../types/index";


const productSchema = new mongoose.Schema<IProduct>({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['sandwich', 'burger', 'pizza', 'taco', 'dishes', 'dessert', 'drinks', 'other'], required: true },
    price: { type: Number, required: true },
    preparationTime: { type: Number, required: true },
    imageUrl: { type: String, required: false },
    description: { type: String, required: false },
    isAvailable: { type: Boolean, required: false , default: true},
}, {
    timestamps: true,
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;