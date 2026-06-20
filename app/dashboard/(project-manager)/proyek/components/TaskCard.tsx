"use client";

import { isImageUrl } from "@/lib/uploadAttachment";
import { Milestone, formatTanggalID } from "@/types/IMilestone";
import { Task } from "@/types/ITask";
import { Link2, MoreVertical, Paperclip } from "lucide-react";

interface TaskCardProps {
  task: Task & {
    attachmentUrl?: string | null;
    link?: string | null;
  };
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

  const handleCardClick = () => {
    onEdit({
      ...task,
      assignee: typeof task.assignee === "object" ? task.assignee : null,
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 transition"
    >
      <div className="flex justify-between items-start">
        <span
          className={`inline-block text-xs rounded px-2 py-0.5 mb-2 ${priorityStyle}`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
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
                  handleCardClick();
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

      <h4 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
        {task.title}
      </h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        {task.description || "-"}
      </p>
      <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">Milestone</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {milestoneName}
      </p>

      {/* Bukti pengerjaan */}
      {task.attachmentUrl && (
        <a
          href={task.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex items-center gap-2 group"
        >
          {isImageUrl(task.attachmentUrl) ? (
            <img
              src={task.attachmentUrl}
              alt="bukti pengerjaan"
              className="w-full h-44 object-cover rounded-lg border dark:border-zinc-800"
            />
          ) : (
            <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 group-hover:underline">
              <Paperclip size={12} />
              Lihat bukti pengerjaan
            </span>
          )}
        </a>
      )}

      {/* Link referensi */}
      {task.link && (
        <a
          href={task.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline truncate"
        >
          <Link2 size={12} className="shrink-0" />
          <span className="truncate">{task.link}</span>
        </a>
      )}

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
