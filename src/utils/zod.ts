import zod from "zod";


//create restaurant schema
export const createRestaurantSchema = zod.object({
    _id: zod.string().optional(),
    name: zod.string().min(4, "Restaurant name must be at least 4 characters long"),
    phone: zod.string().min(10, "Restaurant phone number must be at least 10 characters long"),
    logoUrl: zod.string().url("Invalid logo URL").optional(),
    rating: zod.number().min(0).max(5).optional(),
    ratingCount: zod.number().min(0).optional(),
    isOpen: zod.boolean(),
    location: zod.object({
        address: zod.string().min(5, "Address must be at least 5 characters long"),
        coordinates: zod.object({
            type: zod.literal("Point"),
            coordinates: zod.tuple([zod.number(), zod.number()]).refine((coords) => coords.length === 2, {
                message: "Coordinates must be an array of two numbers [lng, lat]",
            }),
        }),
    })

});