import authRepository from "../repositories/auth";
import customerRepository from "../repositories/customer";
import restaurantRepository from "../repositories/restaurant";
import { otpSchema } from "../validators/auth.validator";
import { IOtp } from "../types";
import { sendOTP } from "../utils/sms";
import { generateJWTtoken } from "../utils/generateJWTtoken";
import bcrypt from "bcrypt";

//Create OTP service
const createOtp = async (phone: string) => {
  //generate OTP code & expiration date
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = await bcrypt.hash(otpCode, 10);
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 5);

  //prepare OTP data
  const otpData: IOtp = {
    phone,
    code: hash,
    expiresAt: expirationDate,
    isChecked: false,
    attempts: 0,
  };

  // Create OTP in the database
  await authRepository.createOtp(otpData);

  //send OTP via SMS
  await sendOTP(phone, otpCode);

};

//Verify OTP service
const verifyOtp = async (phone: string, code: string, role: string) => {
  //vlidate otpData
  const parseResult = otpSchema.safeParse({ phone, code, role });
  if (!parseResult.success) {
    throw new Error(`Validation failed: ${parseResult.error.message}`);
  }

  //verify OTP
  const otp = await authRepository.verifyOtp(phone, code);

  //check if the user exists in the database based on the role
  if (otp.isChecked === true && role === "customer") {
    const customerExists = await customerRepository.checkExistCustomer(phone);
    if (!customerExists) {
      //this is new customer
      return {
        isNewCustomer: true,
        message: "OTP verified successfully. New customer.",
      };
    } else {
      //this is existing customer
      const token = generateJWTtoken({
        id: customerExists._id,
        role: "customer",
      });
      return {
        isNewCustomer: false,
        message: "OTP verified successfully. Existing customer.",
        token,
      };
    }
  } else if (otp.isChecked === true && role === "restaurant") {
    const existingRestaurant =
      await restaurantRepository.checkRestaurantExists(phone);
    if (!existingRestaurant) {
      //this is new restaurant
      return {
        isNewRestaurant: true,
        message: "OTP verified successfully. New restaurant.",
      };
    } else {
      //this is existing restaurant
      const token = generateJWTtoken({
        id: existingRestaurant._id,
        role: "restaurant",
      });
      return {
        isNewRestaurant: false,
        message: "OTP verified successfully. Existing restaurant.",
        token,
      };
    }
  }
  //rider case included here later
};

export default {
  createOtp,
  verifyOtp,
};
