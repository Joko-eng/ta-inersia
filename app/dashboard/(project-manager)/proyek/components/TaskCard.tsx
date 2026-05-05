"use client";

import { Milestone, formatTanggalID } from "@/types/IMilestone";
import { Task } from "@/types/ITask";
import { MoreVertical } from "lucide-react";

interface TaskCardProps {
  task: Task;
  milestones: Milestone[];
  openMenuId: string | null;
  onToggleMenu: (id: string | null) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  milestones,
  openMenuId,
  onToggleMenu,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const priorityStyle =
    task.priority === "tinggi"
      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
      : task.priority === "sedang"
        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
        : "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300";

  const milestoneName = milestones.find(
    (m) => m.id === task.milestoneId,
  )?.title;

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <span
          className={`inline-block text-xs rounded px-2 py-0.5 mb-2 ${priorityStyle}`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        <div className="relative">
          <button
            onClick={() =>
              onToggleMenu(openMenuId === task.id ? null : task.id)
            }
            className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <MoreVertical size={16} />
          </button>

          {openMenuId === task.id && (
            <div className="absolute right-0 mt-1 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded shadow text-xs z-20">
              <button
                className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 w-full text-left"
                onClick={() => {
                  onEdit({
                    ...task,
                    assignee:
                      typeof task.assignee === "object" ? task.assignee : null,
                  });
                  onToggleMenu(null);
                }}
              >
                Edit
              </button>
              <button
                className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 w-full text-left text-red-500"
                onClick={() => {
                  onDelete(task.id);
                  onToggleMenu(null);
                }}
              >
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>

      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
        {task.title}
      </h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        {task.description || "-"}
      </p>
      <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">Milestone</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {milestoneName}
      </p>

      <div className="my-5 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

      <div className="flex justify-between items-center mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{task.assignee?.name || "Belum ditugaskan"}</span>
        <span>
          {task.statusUpdatedAt
            ? formatTanggalID(task.statusUpdatedAt)
            : "DD MM"}
        </span>
      </div>
    </div>
  );
}
