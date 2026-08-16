import mongoose from "mongoose";
import { IRestaurant } from "../types/index.js";

const restaurantSchema = new mongoose.Schema<IRestaurant>({
    name: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    logoUrl: { type: String, required: false },
    isOpen: { type: Boolean, required: true, default: true },
    workingHours: {
        open: { type: String, required: true },
        close: { type: String, required: true },
    },
    rating: { type: Number, required: true  , default: 0},
    ratingCount: { type: Number, required: true , default: 0},
    location: {
        address: { type: String, required: true },
        coordinates: {
            type: { type: String, enum: ["Point"], required: true , default: "Point"},
            coordinates: { type: [Number], required: true },
        },
    },
    role: { type: String, required: true, default: "restaurant" },
}, {
    timestamps: true,
});

const Restaurant = mongoose.model<IRestaurant>("Restaurant", restaurantSchema);

export default Restaurant;