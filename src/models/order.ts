import mongoose, { Types} from "mongoose";
import { IOrder } from "../types/index";

const itemSchema = new mongoose.Schema({
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    variant: {
        size: { type: String, required: true },
        price: { type: Number, required: true },
    },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema<IOrder>({
    orderNumber: { type: String, required: true, unique: true , index: true },
    customerId: { type: Types.ObjectId, ref: "Customer", required: true },
    restaurantId: { type: Types.ObjectId, ref: "Restaurant", required: true },
    riderId: { type: Types.ObjectId, ref: "Rider", default: null },
    items: [itemSchema],
    subtotal: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    preparationTime: { type: Number, required: false , default: 0},
    status: {
        type: String,
        enum: ["pending", "accepted", "preparing", "ready-to-pickup", "out-for-delivery", "at-door", "delivered", "cancelled"],
        required: true,
    },
    deliveryDetails: {
        fee: { type: Number, required: true },
        type: { type: String, enum: ["delivery", "pickup"], required: true },
        location: {
            city: { type: String },
            coordinates: {
                type: { type: String, enum: ["Point"] },
                coordinates: { type: [Number] }, // [lng, lat]
            },
        },
    },
}, { timestamps: true });

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;