import JWT, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

interface jwtPayload {
  id: string;
  role: string;
}

//Middleware to validate JWT token
export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  //check if token is present
  if (!token) {
    return next(new ApiError(401, "Unauthorized: No token provided"));
  }

  //verify the token
  const decoded = JWT.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as jwtPayload;
  if (!decoded || typeof decoded === "string") {
    return next(new ApiError(401, "Unauthorized: Invalid token"));
  }
  req.user = decoded;
  next();
};
