import mongoose , {Types} from "mongoose";
import { ICart } from "../types/index";

const itemSchema = new mongoose.Schema({
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 },
    variant: {
        size: { type: String, required: true },
        price: { type: Number, required: true }
    },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema<ICart>({
    customerId: { type: Types.ObjectId, ref: "Customer", required: true },
    items: [itemSchema, { type: [itemSchema], required: false, default: [] }],
    subTotal: { type: Number, required: true, default: 0 },
    deliveryFee: { type: Number, required: true, default: 150 },
    totalPrice: { type: Number, required: true, default: 0 },
},
    { timestamps: true }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;