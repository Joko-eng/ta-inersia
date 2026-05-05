"use client";

import { Task } from "@/types/ITask";
import { TeamMember } from "@/types/ITeamMember";
interface TaskEditModalProps {
  task: Task & {
    assignee: string | null | { id: string; name: string; division: string };
  };
  teamMembers: TeamMember[];
  onChange: (updated: any) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function TaskEditModal({
  task,
  teamMembers,
  onChange,
  onClose,
  onSave,
}: TaskEditModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 space-y-3 border dark:border-zinc-800">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
          Edit Task
        </h3>

        <input
          value={task.title}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
          className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
        />

        <textarea
          value={task.description}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
          className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
        />

        <select
          value={task.priority}
          onChange={(e) => onChange({ ...task, priority: e.target.value })}
          className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
        >
          <option value="rendah">Rendah</option>
          <option value="sedang">Sedang</option>
          <option value="tinggi">Tinggi</option>
        </select>

        <select
          value={
            typeof task.assignee === "object"
              ? (task.assignee?.id ?? "")
              : (task.assignee ?? "")
          }
          onChange={(e) => onChange({ ...task, assignee: e.target.value })}
          className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
        >
          <option value="" disabled>
            Pilih Tim Pengembang
          </option>
          {teamMembers.map((m) => (
            <option key={m._id} value={m._id}>
              {m.userId.name} — {m.division}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="text-zinc-600 dark:text-zinc-400"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-primary dark:bg-white text-primary-foreground rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
