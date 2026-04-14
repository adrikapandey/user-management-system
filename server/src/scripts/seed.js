import { connectDatabase } from "../config/db.js";
import { User } from "../models/User.js";
import { ROLES, USER_STATUSES } from "../data/roles.js";
import { env } from "../config/env.js";

async function seed() {
  await connectDatabase();
  await User.deleteMany({});

  const admin = await User.create({
    name: "System Admin",
    email: "admin@example.com",
    password: env.seedAdminPassword,
    role: ROLES.ADMIN,
    status: USER_STATUSES.ACTIVE
  });

  const manager = await User.create({
    name: "Operations Manager",
    email: "manager@example.com",
    password: env.seedManagerPassword,
    role: ROLES.MANAGER,
    status: USER_STATUSES.ACTIVE,
    createdBy: admin._id,
    updatedBy: admin._id
  });

  await User.create({
    name: "Regular User",
    email: "user@example.com",
    password: env.seedUserPassword,
    role: ROLES.USER,
    status: USER_STATUSES.ACTIVE,
    createdBy: admin._id,
    updatedBy: manager._id
  });

  console.log("Seed complete");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
