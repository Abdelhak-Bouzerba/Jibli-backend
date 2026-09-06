import mongoose from "mongoose";
import { IOtp } from "../types/index";

const otpSchema = new mongoose.Schema<IOtp>({
    phone: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isChecked: { type: Boolean, default: false },
    attempts: {type: Number , default: 0},
},
    { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;