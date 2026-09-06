import { Request, Response } from "express";
import authService from "../services/auth.service";


//Create OTP controller
export const createOtp = async (req: Request, res: Response) => {
    const {phone} = req.body;

    //check if otpData is empty
    if (!phone) {
        res.status(400).json({ message: "Phone is required." });
        return;
    }

    //Call create OTP service
    await authService.createOtp(phone);

    //send response
    res.status(201).json({ message: "OTP created successfully."});

};

//Verify OTP controller
export const verifyOtp = async (req: Request, res: Response) => {
    const { phone, code, role } = req.body;

    //check if otpData is empty
    if (!phone || !code || !role) {
        res.status(400).json({ message: "Phone, code and role are required." });
        return;
    }

    //Call verify OTP service
    const result = await authService.verifyOtp(phone, code, role);

    //send response
    res.status(200).json({ message: result?.message, ...result });

};