import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../services/tokenService.js";
import { AppError } from "../utils/appError.js";
import { env } from "../config/env.js";

function buildAuthResponse(user) {
  return {
    user: user.toSafeObject(),
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user)
  };
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status !== "active") {
    throw new AppError("Your account is inactive", 403);
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  res.json(buildAuthResponse(user));
}

export async function refreshToken(req, res) {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError("Refresh token is required", 400);
  }

  const payload = jwt.verify(token, env.jwtRefreshSecret);
  const user = await User.findById(payload.sub);

  if (!user || user.status !== "active") {
    throw new AppError("Unable to refresh session", 401);
  }

  res.json(buildAuthResponse(user));
}

export async function getCurrentUser(req, res) {
  res.json({
    user: req.user.toSafeObject()
  });
}
