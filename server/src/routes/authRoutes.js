import { Router } from "express";
import { body } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCurrentUser, login, refreshToken } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    validateRequest
  ],
  asyncHandler(login)
);

router.post(
  "/refresh",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required"), validateRequest],
  asyncHandler(refreshToken)
);

router.get("/me", authenticate, asyncHandler(getCurrentUser));

export default router;
