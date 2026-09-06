import zod from "zod";

export const otpSchema = zod.object({
    phone: zod.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    code: zod.string().min(6, "Hash code must be at least 6 characters"),
    role: zod.enum(["customer", "restaurant", "rider"], "Role must be either customer, restaurant or rider"),
});