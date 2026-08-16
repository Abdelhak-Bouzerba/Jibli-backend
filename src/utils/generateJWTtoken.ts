import JWT from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();


export const generateJWTtoken = (data: any) => { 
    const token = JWT.sign(data, process.env.JWT_SECRET as string, { expiresIn: '30d' });
    return token
}