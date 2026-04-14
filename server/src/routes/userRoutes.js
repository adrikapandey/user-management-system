import { Router } from "express";
import { body, param, query } from "express-validator";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validateRequest } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createUser,
  deactivateUser,
  getMyProfile,
  getUserById,
  getUsers,
  updateMyProfile,
  updateUser
} from "../controllers/userController.js";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "../data/roles.js";

const router = Router();

router.use(authenticate);

router.get("/me", asyncHandler(getMyProfile));

router.patch(
  "/me",
  [
    body("name").optional().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    validateRequest
  ],
  asyncHandler(updateMyProfile)
);

router.get(
  "/",
  authorize("admin", "manager"),
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
    query("search").optional().isString(),
    validateRequest
  ],
  asyncHandler(getUsers)
);

router.get(
  "/:userId",
  [param("userId").isMongoId().withMessage("Invalid user id"), validateRequest],
  asyncHandler(getUserById)
);

router.post(
  "/",
  authorize("admin"),
  [
    body("name").isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("role").isIn(ROLE_OPTIONS).withMessage("Role is invalid"),
    body("status").optional().isIn(STATUS_OPTIONS).withMessage("Status is invalid"),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    validateRequest
  ],
  asyncHandler(createUser)
);

router.patch(
  "/:userId",
  [
    param("userId").isMongoId().withMessage("Invalid user id"),
    body("name").optional().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").optional().isEmail().withMessage("A valid email is required"),
    body("role").optional().isIn(ROLE_OPTIONS).withMessage("Role is invalid"),
    body("status").optional().isIn(STATUS_OPTIONS).withMessage("Status is invalid"),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    validateRequest
  ],
  asyncHandler(updateUser)
);

router.delete(
  "/:userId",
  [param("userId").isMongoId().withMessage("Invalid user id"), validateRequest],
  asyncHandler(deactivateUser)
);

export default router;
