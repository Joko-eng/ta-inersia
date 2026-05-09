import { getDashboardStats } from "@/lib/services/dashboardService";
import DashboardStats from "./components/DashboardStats";
import ProjectDonut from "./components/ProjectDonut";
import VisitorChart from "./components/VisitorChart";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-zinc-100">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-500">
            Selamat datang kembali,{" "}
          </p>
        </div>

        {/* Stat Cards */}
        <DashboardStats stats={stats} />

        {/* Chart + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <VisitorChart />
          <ProjectDonut />
        </div>
      </div>
    </div>
  );
}
