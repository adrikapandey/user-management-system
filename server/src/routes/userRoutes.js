import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
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
import {
  createUserSchema,
  getUsersSchema,
  updateMyProfileSchema,
  updateUserSchema,
  userIdParamSchema
} from "../validation/userSchemas.js";

const router = Router();

router.use(authenticate);

router.get("/me", asyncHandler(getMyProfile));

router.patch("/me", validate(updateMyProfileSchema), asyncHandler(updateMyProfile));

router.get("/", authorize("admin", "manager"), validate(getUsersSchema), asyncHandler(getUsers));

router.get("/:userId", validate(userIdParamSchema), asyncHandler(getUserById));

router.post("/", authorize("admin"), validate(createUserSchema), asyncHandler(createUser));

router.patch("/:userId", validate(updateUserSchema), asyncHandler(updateUser));

router.delete("/:userId", validate(userIdParamSchema), asyncHandler(deactivateUser));

export default router;
