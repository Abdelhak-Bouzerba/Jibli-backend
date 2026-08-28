import JWT, { JwtPayload} from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
        user?: {
            id: string;
            role: string;
      }
    }
  }
}

interface jwtPayload { 
    id: string;
    role: string;
}

//Middleware to validate JWT token
export const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    //check if token is present
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }

    //verify the token
    const decoded = JWT.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as jwtPayload;
    if(!decoded || typeof decoded === "string") {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
        return
    }       
    req.user = decoded;
    next();
    
};