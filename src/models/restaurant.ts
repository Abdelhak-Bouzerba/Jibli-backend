import mongoose from "mongoose";
import { IRestaurant } from "../types/index.js";

const workingDaysSchema = new mongoose.Schema({
    sunday: { open: { type: String, required: true }, close: { type: String, required: true } },
    monday: { open: { type: String, required: true }, close: { type: String, required: true } },
    tuesday: { open: { type: String, required: true }, close: { type: String, required: true } },
    wednesday: { open: { type: String, required: true }, close: { type: String, required: true } },
    thursday: { open: { type: String, required: true }, close: { type: String, required: true } },
    friday: { open: { type: String, required: true }, close: { type: String, required: true } },
    saturday: { open: { type: String, required: true }, close: { type: String, required: true } },
});

const restaurantSchema = new mongoose.Schema<IRestaurant>({
    name: { type: String, required: true, index: true },
    description: { type: String, required: false },
    phone: { type: String, required: true },
    logo: {
        url: { type: String, required: false },
        publicId: { type: String, required: false }
    },
    coverPhoto: {
        url: { type: String, required: false },
        publicId: { type: String, required: false }
    },
    isOpen: { type: Boolean, required: true, default: true },
    isActive: { type: Boolean, required: true, default: true },
    tags: { type: [String], enum: ['fast-food', 'restaurant', 'traditional', 'healthy', 'pizzeria', 'desserts', 'barbcue', 'sandwiches'], required: true },
    email: { type: String, required: false },
    workingDays: { type: workingDaysSchema, required: false },
    rating: { type: Number, required: true  , default: 0},
    ratingCount: { type: Number, required: true , default: 0},
    location: {
        city: { type: String, required: true },
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