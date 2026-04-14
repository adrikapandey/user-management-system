import app from "./app.js";
import { connectDatabase } from "./config/db.js";

let connectionPromise;

async function ensureDatabaseConnection() {
  if (!connectionPromise) {
    connectionPromise = connectDatabase();
  }

  await connectionPromise;
}

app.use(async (_req, _res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    next(error);
  }
});

export default app;
