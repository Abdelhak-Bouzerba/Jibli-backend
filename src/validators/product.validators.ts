import zod from "zod";
import mongoose from "mongoose";


//create new product schema
export const createProductSchema = zod.object({
    restaurantId: zod.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid restaurant ID",
    }),
    name: zod.string().min(4, "Product name must be at least 4 characters long"),
    category: zod.enum(['sandwich', 'burger', 'pizza', 'taco', 'dishes', 'dessert', 'drinks', 'other']),
    price: zod.number().min(0, "Price must be a positive number"),
    preparationTime: zod.number().min(0, "Preparation time must be a positive number"),
    image: zod.object({
        url: zod.string().url("Invalid image URL"),
        publicId: zod.string().optional()
    }),
    description: zod.string().max(200, "Description must be at most 200 characters long").optional(),
    isAvailable: zod.boolean(),
});