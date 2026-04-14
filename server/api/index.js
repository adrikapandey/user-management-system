import app from "../src/app.js";
import { connectDatabase } from "../src/config/db.js";

let isConnected = false;

async function ensureDatabaseConnection() {
  if (isConnected) {
    return;
  }

  await connectDatabase();
  isConnected = true;
}

export default async function handler(req, res) {
  await ensureDatabaseConnection();
  return app(req, res);
}
