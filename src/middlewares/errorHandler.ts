import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import { ApiError } from "../utils/apiError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ status: "error", message: err.message });
  }

  if (
    err instanceof JWT.TokenExpiredError ||
    err instanceof JWT.JsonWebTokenError
  ) {
    return res
      .status(401)
      .json({ status: "error", message: "Unauthorized: Invalid token" });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid resource identifier" });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res
      .status(400)
      .json({ status: "error", message: "Validation failed" });
  }

  if (isDuplicateKeyError(err)) {
    return res
      .status(409)
      .json({
        status: "error",
        message: "A resource with the same value already exists",
      });
  }

  return res
    .status(500)
    .json({ status: "error", message: "Internal server error" });
};

const isDuplicateKeyError = (err: unknown): err is { code: number } => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === 11000
  );
};
