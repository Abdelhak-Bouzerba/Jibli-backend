import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return next(new ApiError(403, "Forbidden"));
    }
    next();
  };
};

export default requireRole;
