import zod from "zod";
import mongoose from "mongoose";


//create new restaurant schema
export const createRestaurantSchema = zod.object({
    _id: zod.string().optional(),
    name: zod.string().min(4, "Restaurant name must be at least 4 characters long"),
    phone: zod.string().min(10, "Restaurant phone number must be at least 10 characters long"),
    logoUrl: zod.string().url("Invalid logo URL").optional(),
    rating: zod.number().min(0).max(5).optional(),
    ratingCount: zod.number().min(0).optional(),
    isOpen: zod.boolean(),
    workingHours: zod.object({
        open: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid opening time format (HH:mm)"),
        close: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid closing time format (HH:mm)"),
    }),
    location: zod.object({
        address: zod.string().min(5, "Address must be at least 5 characters long"),
        coordinates: zod.object({
            type: zod.literal("Point"),
            coordinates: zod.array(zod.number()).max(2).refine((coords) => coords.length === 2, {
                message: "Coordinates must be an array of two numbers [lng, lat]",
            }),
        }),
    })

});


//create new product schema
export const createProductSchema = zod.object({
    restaurantId: zod.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid restaurant ID",
    }),
    name: zod.string().min(4, "Product name must be at least 4 characters long"),
    category: zod.enum(['sandwich', 'burger', 'pizza', 'taco', 'dishes', 'dessert', 'drinks', 'other']),
    price: zod.number().min(0, "Price must be a positive number"),
    preparationTime: zod.number().min(0, "Preparation time must be a positive number"),
    imageUrl: zod.string().url("Invalid image URL"),
    description: zod.string().max(200, "Description must be at most 200 characters long").optional(),
    isAvailable: zod.boolean(),
});