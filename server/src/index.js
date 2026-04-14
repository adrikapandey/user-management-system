import app from "./app.js";
import { connectDatabase } from "./config/db.js";

await connectDatabase();

export default app;
