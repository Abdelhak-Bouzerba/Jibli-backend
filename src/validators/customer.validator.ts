import zod from "zod";

//Schema for create customer
export const createCustomerSchema = zod.object({
  fullName: zod.string().min(3).trim(),
  phone: zod.string().min(10).max(15),
  email: zod.string().email().optional(),
  role: zod.literal("customer").default("customer"),
  savedRestaurants: zod.array(zod.string()).optional(),

  location: zod.object({
    city: zod.string().min(2).trim(),

    coordinates: zod.object({
      type: zod.literal("Point"),

      coordinates: zod
        .tuple([zod.number(), zod.number()])
        .refine(
          (coords) =>
            coords[0] >= -180 &&
            coords[0] <= 180 &&
            coords[1] >= -90 &&
            coords[1] <= 90,
          {
            message: "Invalid coordinates. Expected [longitude, latitude].",
          },
        ),
    }),
  }),

  savedAddresses: zod
    .array(
      zod.object({
        label: zod.string().min(2).trim(),

        city: zod.string().min(2).trim(),

        coordinates: zod.object({
          type: zod.literal("Point"),

          coordinates: zod
            .tuple([zod.number(), zod.number()])
            .refine(
              (coords) =>
                coords[0] >= -180 &&
                coords[0] <= 180 &&
                coords[1] >= -90 &&
                coords[1] <= 90,
              {
                message: "Invalid coordinates. Expected [longitude, latitude].",
              },
            ),
        }),
      }),
    )
    .optional(),
});

//Validate schema for add new saved address
export const addSavedAddressSchema = zod.object({
  label: zod.string().min(2).trim(),
  city: zod.string().min(2).trim(),
  coordinates: zod.object({
    type: zod.literal("Point"),
    coordinates: zod
      .tuple([zod.number(), zod.number()])
      .refine(
        (coords) =>
          coords[0] >= -180 &&
          coords[0] <= 180 &&
          coords[1] >= -90 &&
          coords[1] <= 90,
        {
          message: "Invalid coordinates. Expected [longitude, latitude].",
        },
      ),
  }),
});
