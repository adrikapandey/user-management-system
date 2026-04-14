import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/user-management-system",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "change-me-too",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || "Admin@123",
  seedManagerPassword: process.env.SEED_MANAGER_PASSWORD || "Manager@123",
  seedUserPassword: process.env.SEED_USER_PASSWORD || "User@123"
};
