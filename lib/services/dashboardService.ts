import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";

export interface DashboardStats {
  totalProjects: number;
  totalClients: number;
  totalMembers: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectDB();

  const [totalProjects, clientNames, totalMembers] = await Promise.all([
    Project.countDocuments({ isArchived: false }),
    Project.distinct("clientName", { isArchived: false }),
    User.countDocuments({ role: "member" }),
  ]);

  return {
    totalProjects,
    totalClients: clientNames.length,
    totalMembers,
  };
}
