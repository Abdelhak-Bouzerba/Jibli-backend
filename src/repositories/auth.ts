import Otp from "../models/otp";
import { IOtp } from "../types/index";
import bcrypt from "bcrypt";

//Create OTP
const createOtp = async (otpData: IOtp) => {
    await Otp.deleteMany({ phone: otpData.phone });
    await Otp.create(otpData);
};

//Verify OTP
const verifyOtp = async (phone: string, code: string) => {
    const otp = await Otp.findOne({ phone });
    if (!otp) {
        throw new Error("OTP not found");
    }
    if (otp.expiresAt < new Date()) {
      throw new Error("OTP has expired , try again");
    }
    const isMatch = await bcrypt.compare(code, otp.code);
    if (!isMatch) {
        otp.attempts += 1;
        await otp.save();
        throw new Error("Invalid OTP");
    }
    if (otp.attempts >= 5) { 
        await Otp.deleteMany({ phone });
        throw new Error("Too many attempts, request a new OTP");
    }
    //mark OTP as checked
    otp.isChecked = true;
    await otp.save();
    return otp;
}


export default {
    createOtp,
    verifyOtp,
};