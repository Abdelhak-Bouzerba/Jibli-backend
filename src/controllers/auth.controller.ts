import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import authService from "../services/auth.service";

//Create OTP controller
export const createOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;

  //check if otpData is empty
  if (!phone) {
    throw new ApiError(400, "Phone is required.");
  }

  //Call create OTP service
  await authService.createOtp(phone);

  //send response
  res.status(201).json({ message: "OTP created successfully." });
};

//Verify OTP controller
export const verifyOtp = async (req: Request, res: Response) => {
  const { phone, code, role } = req.body;

  //check if otpData is empty
  if (!phone || !code || !role) {
    throw new ApiError(400, "Phone, code and role are required.");
  }

  //Call verify OTP service
  const result = await authService.verifyOtp(phone, code, role);

  //send response
  res.status(200).json(result);
};
