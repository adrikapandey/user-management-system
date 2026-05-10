import { z } from "zod";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "../data/roles.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user id");
const emailSchema = z.email("A valid email is required").transform((value) => value.toLowerCase().trim());
const passwordSchema = z.string().min(8, "Password must be at least 8 characters");
const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters");

export const updateMyProfileSchema = z.object({
  body: z
    .object({
      name: nameSchema.optional(),
      password: passwordSchema.optional()
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
      path: ["name"]
    })
});

export const getUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1, "Page must be a positive integer").optional(),
    limit: z.coerce.number().int().min(1).max(50, "Limit must be between 1 and 50").optional(),
    search: z.string().optional(),
    role: z.enum(ROLE_OPTIONS).optional(),
    status: z.enum(STATUS_OPTIONS).optional()
  })
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: objectIdSchema
  })
});

export const createUserSchema = z.object({
  body: z.object({
    name: nameSchema,
    email: emailSchema,
    role: z.enum(ROLE_OPTIONS),
    status: z.enum(STATUS_OPTIONS).optional(),
    password: passwordSchema.optional()
  })
});

export const updateUserSchema = z.object({
  params: z.object({
    userId: objectIdSchema
  }),
  body: z
    .object({
      name: nameSchema.optional(),
      email: emailSchema.optional(),
      role: z.enum(ROLE_OPTIONS).optional(),
      status: z.enum(STATUS_OPTIONS).optional(),
      password: passwordSchema.optional()
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
      path: ["name"]
    })
});
