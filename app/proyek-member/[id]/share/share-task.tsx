"use client";

import ProjectSidebar from "@/components/layout/sidebar-member";
import { Milestone } from "@/types/IMilestone";
import { Task } from "@/types/ITask";
import { KanbanSquare } from "lucide-react";

const COLUMNS = [
  { id: "todo", title: "Daftar Tugas", color: "bg-blue-500" },
  { id: "inprogress", title: "Sedang Dikerjakan", color: "bg-orange-400" },
  { id: "done", title: "Selesai", color: "bg-green-500" },
];

const formatTanggalID = (date?: string) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const priorityStyle = (priority: Task["priority"]) => {
  if (priority === "tinggi")
    return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  if (priority === "sedang")
    return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
  return "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300";
};

export default function ShareTaskView({
  projectName,
  tasks,
  milestones,
}: {
  projectName: string;
  tasks: Task[];
  milestones: Milestone[];
}) {
  return (
    <div className="flex h-screen bg-background">
      <ProjectSidebar projectName={projectName} />

      <div className="flex-1 flex flex-col">
        <div className="h-16 px-8 flex items-center border-b bg-background shrink-0">
          <div className="flex items-center gap-3">
            <KanbanSquare className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Tugas Proyek</p>
              <h1 className="text-lg font-semibold leading-tight">
                {projectName}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-hidden">
          {tasks.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 text-sm">
              Belum ada task untuk proyek ini.
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto items-start">
              {COLUMNS.map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.id);

                return (
                  <div
                    key={col.id}
                    className="min-w-[300px] h-full bg-slate-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col"
                  >
                    <div
                      className={`${col.color} text-white rounded-full px-4 py-2 mb-4 shrink-0`}
                    >
                      <span className="font-medium text-sm">
                        {colTasks.length} {col.title}
                      </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1 scrollbar-hide">
                      {colTasks.length === 0 && (
                        <p className="text-xs text-zinc-400 text-center py-6">
                          Tidak ada task
                        </p>
                      )}

                      {colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4"
                        >
                          <span
                            className={`inline-block text-xs rounded px-2 py-0.5 mb-2 ${priorityStyle(task.priority)} capitalize`}
                          >
                            {task.priority}
                          </span>

                          <h4 className="font-medium text-sm">{task.title}</h4>

                          <p className="text-xs text-muted-foreground mt-1">
                            {task.description || "-"}
                          </p>

                          <p className="text-xs mt-3 text-zinc-500">
                            Milestone
                          </p>

                          <p className="text-xs text-zinc-400">
                            {milestones.find((m) => m.id === task.milestoneId)
                              ?.title || "-"}
                          </p>

                          <div className="my-3 h-px bg-zinc-200 dark:bg-zinc-800" />

                          <div className="flex justify-between text-xs text-zinc-500">
                            <span>
                              {task.assigneeName || "Belum ditugaskan"}
                            </span>
                            <span>
                              {task.statusUpdatedAt
                                ? formatTanggalID(task.statusUpdatedAt)
                                : "-"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
