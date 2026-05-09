"use client";

import { Briefcase, User2, Users } from "lucide-react";
import { DashboardStats as Stats } from "@/lib/services/dashboardService";

const statConfig = [
  {
    key: "totalProjects" as keyof Stats,
    icon: <Briefcase size={28} strokeWidth={1.8} />,
    label: "Total Proyek",
    gradient:
      "from-amber-500/10 to-amber-500/0 dark:from-amber-500/15 dark:to-amber-500/0",
    iconBg: "bg-amber-100 dark:bg-amber-500/20",
    iconText: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "totalClients" as keyof Stats,
    icon: <User2 size={28} strokeWidth={1.8} />,
    label: "Total Klien",
    gradient:
      "from-pink-500/10 to-pink-500/0 dark:from-pink-500/15 dark:to-pink-500/0",
    iconBg: "bg-pink-100 dark:bg-pink-500/20",
    iconText: "text-pink-500 dark:text-pink-400",
  },
  {
    key: "totalMembers" as keyof Stats,
    icon: <Users size={28} strokeWidth={1.8} />,
    label: "Total Tim Pengembang",
    gradient:
      "from-purple-500/10 to-purple-500/0 dark:from-purple-500/15 dark:to-purple-500/0",
    iconBg: "bg-purple-100 dark:bg-purple-500/20",
    iconText: "text-purple-600 dark:text-purple-400",
  },
];

interface Props {
  stats: Stats;
}

export default function DashboardStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {statConfig.map((s, i) => (
        <div
          key={i}
          className={`relative rounded-2xl p-5 bg-gradient-to-br ${s.gradient} backdrop-blur-sm border border-white/40 dark:border-zinc-700/60 shadow-sm hover:shadow-md dark:hover:shadow-zinc-800/60 transition bg-white dark:bg-zinc-900`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.iconBg} ${s.iconText}`}>
              {s.icon}
            </div>
            <div>
              <p className={`text-3xl font-semibold ${s.iconText}`}>
                {stats[s.key]}
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                {s.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}