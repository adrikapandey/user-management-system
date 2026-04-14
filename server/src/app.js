import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { connectDatabase } from "./config/db.js";

const app = express();
const apiRouter = express.Router();
let databaseConnectionPromise;

async function ensureDatabaseConnection() {
  if (!databaseConnectionPromise) {
    databaseConnectionPromise = connectDatabase();
  }

  await databaseConnectionPromise;
}

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = [env.clientUrl, "http://127.0.0.1:5173", "http://localhost:5173"].filter(Boolean);
      const isTrustedVercelFrontend =
        typeof origin === "string" &&
        origin.startsWith("https://user-management-system-client-") &&
        origin.endsWith(".vercel.app");

      if (!origin || allowedOrigins.includes(origin) || isTrustedVercelFrontend) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(async (_req, _res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);

app.use("/api", apiRouter);
app.use("/", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
