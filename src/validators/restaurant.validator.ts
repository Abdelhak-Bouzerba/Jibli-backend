import zod from "zod";


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
    workingDays: zod.object({
        sunday: zod.object({
            open: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid opening time format (HH:mm)"),
            close: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid closing time format (HH:mm)"),
        }),
        monday: zod.object({
            open: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid opening time format (HH:mm)"),
            close: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid closing time format (HH:mm)"),
        }),
        tuesday: zod.object({
            open: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid opening time format (HH:mm)"),
            close: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid closing time format (HH:mm)"),
        }),
        wednesday: zod.object({
            open: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid opening time format (HH:mm)"),
            close: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid closing time format (HH:mm)"),
        }),
        thursday: zod.object({
            open: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid opening time format (HH:mm)"),
            close: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid closing time format (HH:mm)"),
        }),
        friday: zod.object({
            open: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid opening time format (HH:mm)"),
            close: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid closing time format (HH:mm)"),
        }),
        saturday: zod.object({
            open: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid opening time format (HH:mm)"),
            close: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid closing time format (HH:mm)"),
        }),
    }).optional(),
    coverPhoto: zod.object({
        url: zod.string().url("Invalid URL"),
        publicId: zod.string().optional()
    }).optional(),
    description: zod.string().max(500, "Description must be at most 500 characters long").optional(),
    location: zod.object({
        city: zod.string().min(5, "Address must be at least 5 characters long"),
        coordinates: zod.object({
            type: zod.literal("Point"),
            coordinates: zod.array(zod.number()).max(2).refine((coords) => coords.length === 2, {
                message: "Coordinates must be an array of two numbers [lng, lat]",
            }),
        }),
    })

});