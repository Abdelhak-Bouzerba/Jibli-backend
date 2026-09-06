import express from "express";
import asyncHandler from "express-async-handler";
import { createOtp, verifyOtp } from "../../controllers/auth.controller";
import { sendOtpLimiter, verifyOtpLimiter } from "../../middlewares/rateLimiter";

const v1router = express.Router();

//@desc Create OTP route
//@route POST /api/v1/auth/send-otp
//Access Public
v1router.post("/send-otp", sendOtpLimiter, asyncHandler(createOtp));


//@desc Verify OTP route
//@route POST /api/v1/auth/verify-otp
//Access Public
v1router.post("/verify-otp", verifyOtpLimiter, asyncHandler(verifyOtp));


export default v1router;