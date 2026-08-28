import zod from "zod";
import mongoose from "mongoose";


//create new restaurant schema
export const createRestaurantSchema = zod.object({
    _id: zod.string().optional(),
    name: zod.string().min(4, "Restaurant name must be at least 4 characters long"),
    phone: zod.string().min(10, "Restaurant phone number must be at least 10 characters long"),
    logo: zod.object({
        url: zod.string().url("Invalid logo URL"),
        publicId: zod.string().optional()
    }).optional(),
    rating: zod.number().min(0).max(5).optional(),
    ratingCount: zod.number().min(0).optional(),
    isOpen: zod.boolean().optional().default(true),
    isActive: zod.boolean().optional().default(true),
    tags: zod.array(zod.enum(['fast-food', 'restaurant', 'traditional', 'healthy', 'pizzeria', 'desserts', 'barbcue', 'sandwiches'])).min(1, "At least one tag is required").max(4),
    email: zod.string().email("Invalid email address").optional(),
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