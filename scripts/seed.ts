import { connectDB } from "@/lib/mongodb";
import TeamMember from "../models/TeamMember";
import User from "../models/User";

const users = [
  {
    name: "Admin",
    email: "admin@gmail.com",
    username: "admin",
    password: "admin12345",
    role: "admin",
  },
  {
    name: "Project Manager",
    email: "projectmanager@gmail.com",
    username: "projectmanager",
    password: "pm12345",
    role: "project_manager",
  },
  {
    name: "Member",
    email: "member@gmail.com",
    username: "member",
    password: "member12345",
    role: "member",
  },
];

async function seed() {
  await connectDB();
  console.log("✅ Connected to MongoDB");

  // Seed Users
  for (const userData of users) {
    const existing = await User.findOne({ email: userData.email });

    if (existing) {
      console.log(`⚠️  User ${userData.email} sudah ada, dilewati.`);
      continue;
    }

    await User.create(userData);
    console.log(`✅ User ${userData.role} berhasil dibuat!`);
    console.log(`   📧 Email    : ${userData.email}`);
    console.log(`   🔑 Password : ${userData.password}`);
    console.log(`   👤 Role     : ${userData.role}`);
  }

  // Seed TeamMember — hanya untuk user dengan role member
  const memberUser = await User.findOne({ email: "member@gmail.com" });

  if (!memberUser) {
    console.log("❌ User member tidak ditemukan");
    process.exit(1);
  }

  const existingTeamMember = await TeamMember.findOne({
    userId: memberUser._id,
  });

  if (existingTeamMember) {
    console.log("⚠️  TeamMember sudah ada, dilewati.");
  } else {
    await TeamMember.create({
      userId: memberUser._id,
      division: "QA",
    });

    console.log("✅ TeamMember berhasil dibuat!");
    console.log(`   👤 User  : ${memberUser.email}`);
    console.log(`   🏢 Divisi: QA`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding gagal:", err);
  process.exit(1);
});
