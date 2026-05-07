import { connectDB } from "../lib/mongodb";
import User from "../models/User";

const email    = process.env.SEED_ADMIN_EMAIL;
const username = process.env.SEED_ADMIN_USERNAME;
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

  await User.create({
    name:     "Admin",
    email,
    username,
    password,
    role:     "admin",
  });

  process.exit(0);
}

seed().catch(() => {
  process.exit(1);
});