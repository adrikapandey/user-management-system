import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCurrentUser, login, refreshToken } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { loginSchema, refreshTokenSchema } from "../validation/authSchemas.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/login", authRateLimiter, validate(loginSchema), asyncHandler(login));

router.post("/refresh", validate(refreshTokenSchema), asyncHandler(refreshToken));

router.get("/me", authenticate, asyncHandler(getCurrentUser));

export default router;
