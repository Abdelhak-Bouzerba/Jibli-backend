import zod from "zod";

export const orderSchema = zod.object({
    orderNumber: zod.string().min(5, "Order number is required"),
    customerId: zod.string().min(1, "Customer ID is required"),
    restaurantId: zod.string().min(1, "Restaurant ID is required"),
    riderId: zod.string().optional(),
    items: zod.array(
        zod.object({
            productId: zod.string().min(1, "Product ID is required"),
            variant: zod.object({
                size: zod.string().min(1, "Size is required"),
                price: zod.number().min(0, "Price must be a positive number"),
            }),
            quantity: zod.number().min(1, "Quantity must be at least 1"),
            unitPrice: zod.number().min(0, "Unit price must be a positive number"),
            totalPrice: zod.number().min(0, "Total price must be a positive number"),
        })
    ),
    subtotal: zod.number().min(0, "Subtotal must be a positive number"),
    totalPrice: zod.number().min(0, "Total price must be a positive number"),
    status: zod.enum(["pending", "accepted", "preparing", "ready-to-pickup", "out-for-delivery", "at-door", "delivered", "cancelled"]),
    deliveryDetails: zod.object({
        fee: zod.number().min(0, "Delivery fee must be a positive number"),
        type: zod.enum(["delivery", "pickup"]),
        location: zod.object({
            city: zod.string().optional(),
            coordinates: zod.object({
                type: zod.literal("Point"),
                coordinates: zod.array(zod.number()).max(2).min(2),
            }),
        }),
    }),
});

export const createOrderSchema = zod.object({
    customerId: zod.string().min(1, "Customer ID is required"),
    restaurantId: zod.string().min(1, "Restaurant ID is required"),
    deliveryDetails: zod.object({
        type: zod.enum(["delivery", "pickup"]),
        location: zod.object({
            city: zod.string().optional(),
            coordinates: zod.object({
                type: zod.literal("Point"),
                coordinates: zod.array(zod.number()).max(2).min(2),
            }),
        }),
    }),
});