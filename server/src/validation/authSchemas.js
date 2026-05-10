import { z } from "zod";

const emailSchema = z.email("A valid email is required").transform((value) => value.toLowerCase().trim());

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(8, "Password must be at least 8 characters")
  })
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required")
  })
});
