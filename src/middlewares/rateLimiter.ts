import { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { ApiError } from "../utils/apiError";

/**
 * Normalize phone number
 */
const normalizePhone = (phone: string): string => {
  let normalized = phone.trim().replace(/[\s()-]/g, "");

  if (normalized.startsWith("00")) {
    normalized = "+" + normalized.slice(2);
  }

  if (!normalized.startsWith("+")) {
    normalized = "+" + normalized;
  }

  return normalized;
};

/**
 * Get phone from request body
 */
const getPhone = (req: Request): string => {
  const phone = req.body?.phone;

  if (typeof phone !== "string" || !phone.trim()) {
    return "no-phone";
  }

  return normalizePhone(phone);
};

/**
 * OTP request rate limiter
 *
 * Maximum: 3 requests
 * Window: 15 minutes
 *
 * Key: IP + phone
 */
export const sendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  keyGenerator: (req: Request) => {
    const phone = getPhone(req);
    const ip = ipKeyGenerator(req.ip ?? "unknown");

    return `${ip}:${phone}`;
  },

  handler: (_req, _res, next) => {
    next(new ApiError(429, "Too many OTP requests. Please try again later."));
  },
});

/**
 * OTP verification rate limiter
 *
 * Maximum: 5 requests
 * Window: 5 minutes
 *
 * Key: IP + phone
 */
export const verifyOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  keyGenerator: (req: Request) => {
    const phone = getPhone(req);
    const ip = ipKeyGenerator(req.ip ?? "unknown");

    return `${ip}:${phone}`;
  },

  handler: (_req, _res, next) => {
    next(
      new ApiError(
        429,
        "Too many verification attempts. Please try again later.",
      ),
    );
  },
});
