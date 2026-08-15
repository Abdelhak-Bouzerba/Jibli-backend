import mongoose from "mongoose";
import { IRestaurant } from "../types/restaurant.js";

const restaurantSchema = new mongoose.Schema<IRestaurant>({
    name: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    logoUrl: { type: String, required: false },
    isOpen: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    ratingCount: { type: Number, required: true },
    location: {
        address: { type: String, required: true },
        coordinates: {
            type: { type: String, enum: ["Point"], required: true },
            coordinates: { type: [Number], required: true },
        },
    },
});

const Restaurant = mongoose.model<IRestaurant>("Restaurant", restaurantSchema);

export default Restaurant;