import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id,
      role: user.role,
      status: user.status
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id,
      role: user.role
    },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );
}
