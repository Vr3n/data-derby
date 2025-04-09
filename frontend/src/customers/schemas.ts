import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  date_of_birth: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Invalid date format (expected yyyy-MM-dd)"
    ),
  gender: z.enum(["male", "female", "OTHER"]),
  email: z.string().email("Invalid email format").nullable().or(z.literal("")),
  alternate_email: z
    .string()
    .email("Invalid email format")
    .nullable()
    .or(z.literal("")),
  mobile_number: z
    .string()
    .regex(/^\d{10}$/, "Mobile Number must be 10 digits"),
  alternate_mobile_number: z
    .string()
    .regex(/^\d{10}$/, "Mobile Number must be 10 digits")
    .nullable()
    .or(z.literal("")),
  allergies: z.object({}),
  preferences: z.object({}),
});
