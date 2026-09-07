import zod from "zod";

export const otpSchema = zod.object({
    phone: zod.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
});