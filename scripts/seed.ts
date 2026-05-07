import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import bcrypt from "bcryptjs";

const email    = process.env.SEED_ADMIN_EMAIL    ?? "admin@inersia.com";
const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
const password = process.env.SEED_ADMIN_PASSWORD;

async function seed() {
  if (!password) {
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email });

  if (existing) {
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 12);

  await User.create({
    name:     "Admin",
    email,
    username,
    password: hashed,
    role:     "admin",
  });

  process.exit(0);
}

seed().catch((err) => {
  process.exit(1);
});