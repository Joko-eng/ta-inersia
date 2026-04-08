"use client";

import { KanbanSquare } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  milestoneId: string;
  assigneeName: string | null;
  dueDate: string;
  priority: "rendah" | "sedang" | "tinggi";
  status: "todo" | "inprogress" | "done";
  statusUpdatedAt?: string;
}

interface Milestone {
  id: string;
  title: string;
}

export default function ShareTaskView({
  projectName,
  tasks,
  milestones,
}: {
  projectName: string;
  tasks: Task[];
  milestones: Milestone[];
}) {
  const COLUMNS = [
    { id: "todo", title: "Daftar Tugas", color: "bg-blue-500" },
    { id: "inprogress", title: "Sedang Dikerjakan", color: "bg-orange-400" },
    { id: "done", title: "Selesai", color: "bg-green-500" },
  ];

  const formatTanggalID = (date?: string) => {
    if (!date || date === "-") return "-";
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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b px-8 py-4 flex items-center gap-3">
        <KanbanSquare className="h-5 w-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Tugas Proyek</p>
          <h1 className="text-lg font-bold leading-tight">{projectName}</h1>
        </div>
      </div>

      <div className="p-8">
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
                  className="min-w-[300px] bg-slate-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col border border-transparent dark:border-zinc-800"
                >
                  <div
                    className={`${col.color} dark:opacity-90 text-white rounded-full px-4 py-2 mb-4 flex items-center shrink-0`}
                  >
                    <span className="font-medium">
                      {colTasks.length} {col.title}
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1">
                    {colTasks.length === 0 && (
                      <p className="text-xs text-zinc-400 text-center py-6">
                        Tidak ada task
                      </p>
                    )}
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 shadow-sm"
                      >
                        <span
                          className={`inline-block text-xs rounded px-2 py-0.5 mb-2 ${priorityStyle(task.priority)}`}
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </span>

                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                          {task.title}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {task.description || "-"}
                        </p>

                        <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">
                          Milestone
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {milestones.find((m) => m.id === task.milestoneId)
                            ?.title || "-"}
                        </p>

                        <div className="my-4 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

                        {/* Footer */}
                        <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{task.assigneeName || "Belum ditugaskan"}</span>
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
  );
}
