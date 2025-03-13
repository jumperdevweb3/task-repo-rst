import { z } from "zod";

const BASE_ADDRESS_SCHEMA = z
  .object({
    address_type: z.enum(["HOME", "INVOICE", "POST", "WORK"], {
      message: "Invalid address type",
    }),
    valid_from: z
      .date()
      .refine(
        (date) => new Date(date).getTime() <= new Date().getTime(),
        "Valid from cannot be in the future",
      ),
    street: z
      .string()
      .min(1, "Street is required")
      .max(100, "Street cannot exceed 100 characters"),
    building_number: z
      .string()
      .min(1, "Building number is required")
      .max(60, "Building number cannot exceed 60 characters"),
    post_code: z
      .string()
      .min(1, "Post code is required")
      .max(6, "Post code cannot exceed 6 characters"),
    city: z
      .string()
      .min(1, "City is required")
      .max(60, "City cannot exceed 60 characters"),
    country_code: z
      .string()
      .length(3, "Country code must be 3 characters")
      .regex(/^[A-Z]{3}$/, "Invalid ISO 3166-1 alpha-3 format"),
  })
  .strict();

export const createAddressSchema = BASE_ADDRESS_SCHEMA.refine(
  (data) => data.valid_from <= new Date(),
  {
    message: "Valid from cannot be in the future",
    path: ["valid_from"],
  },
);

export const editAddressSchema = BASE_ADDRESS_SCHEMA;
