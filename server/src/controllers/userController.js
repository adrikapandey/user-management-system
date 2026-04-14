import crypto from "node:crypto";
import { User } from "../models/User.js";
import { ROLES, USER_STATUSES } from "../data/roles.js";
import { AppError } from "../utils/appError.js";
import { getPagination } from "../utils/pagination.js";

function canManageTarget(actor, target) {
  if (actor.role === ROLES.ADMIN) {
    return true;
  }

  if (actor.role === ROLES.MANAGER) {
    return target.role !== ROLES.ADMIN;
  }

  return String(actor._id) === String(target._id);
}

async function findUserOrThrow(userId) {
  const user = await User.findById(userId)
    .populate("createdBy", "name email role")
    .populate("updatedBy", "name email role");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function getUsers(req, res) {
  const { search = "", role, status } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const filters = {};

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  if (role) {
    filters.role = role;
  }

  if (status) {
    filters.status = status;
  }

  if (req.user.role === ROLES.MANAGER) {
    filters.role = { $ne: ROLES.ADMIN };
  }

  const [users, total] = await Promise.all([
    User.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email"),
    User.countDocuments(filters)
  ]);

  res.json({
    items: users.map((user) => user.toSafeObject()),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

export async function getUserById(req, res) {
  const user = await findUserOrThrow(req.params.userId);

  if (!canManageTarget(req.user, user)) {
    throw new AppError("You cannot view this user", 403);
  }

  res.json({
    user: user.toSafeObject()
  });
}

export async function createUser(req, res) {
  const password = req.body.password || crypto.randomBytes(6).toString("base64url");
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password,
    role: req.body.role,
    status: req.body.status || USER_STATUSES.ACTIVE,
    createdBy: req.user._id,
    updatedBy: req.user._id
  });

  res.status(201).json({
    user: user.toSafeObject(),
    generatedPassword: req.body.password ? undefined : password
  });
}

export async function updateUser(req, res) {
  const user = await findUserOrThrow(req.params.userId);

  if (!canManageTarget(req.user, user)) {
    throw new AppError("You cannot update this user", 403);
  }

  if (req.user.role !== ROLES.ADMIN && req.body.role && req.body.role !== user.role) {
    throw new AppError("Only admins can change roles", 403);
  }

  if (req.user.role === ROLES.USER && req.body.role) {
    throw new AppError("You cannot change your role", 403);
  }

  user.name = req.body.name ?? user.name;
  user.email = req.body.email?.toLowerCase() ?? user.email;
  user.status = req.body.status ?? user.status;
  user.role = req.body.role ?? user.role;
  user.updatedBy = req.user._id;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.json({
    user: user.toSafeObject()
  });
}

export async function deactivateUser(req, res) {
  const user = await findUserOrThrow(req.params.userId);

  if (!canManageTarget(req.user, user)) {
    throw new AppError("You cannot deactivate this user", 403);
  }

  user.status = USER_STATUSES.INACTIVE;
  user.updatedBy = req.user._id;
  await user.save();

  res.json({
    message: "User deactivated successfully"
  });
}

export async function getMyProfile(req, res) {
  const user = await findUserOrThrow(req.user._id);

  res.json({
    user: user.toSafeObject()
  });
}

export async function updateMyProfile(req, res) {
  const user = await User.findById(req.user._id).select("+password");

  user.name = req.body.name ?? user.name;
  user.updatedBy = req.user._id;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.json({
    user: user.toSafeObject()
  });
}
