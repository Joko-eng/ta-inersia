"use client";

import { Milestone } from "@/types/IMilestone";
import { TeamMember } from "@/types/ITeamMember";
import { useState } from "react";

interface TaskModalProps {
  milestones: Milestone[];
  teamMembers: TeamMember[];
  defaultStatus: "todo" | "inprogress" | "done";
  showStatusSelect: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export default function TaskModal({
  milestones,
  teamMembers,
  defaultStatus,
  showStatusSelect,
  onClose,
  onSuccess,
  onError,
}: TaskModalProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    milestoneId: "",
    assignee: "",
    priority: "sedang" as "rendah" | "sedang" | "tinggi",
  });
  const [targetStatus, setTargetStatus] = useState<
    "todo" | "inprogress" | "done"
  >(defaultStatus);
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const errs: any = {};
    if (!newTask.title.trim()) errs.title = ["Judul task wajib diisi"];
    if (!newTask.milestoneId) errs.milestoneId = ["Milestone wajib dipilih"];
    return Object.keys(errs).length ? errs : null;
  };

  const handleSubmit = async () => {
    setErrors({});
    const clientError = validate();
    if (clientError) {
      setErrors(clientError);
      return;
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTask.title,
        description: newTask.description,
        milestoneId: newTask.milestoneId,
        assignee: newTask.assignee || null,
        priority: newTask.priority,
        status: targetStatus,
      }),
    });

    if (!res.ok) {
      onError("Gagal menambahkan task");
      return;
    }

    setNewTask({
      title: "",
      description: "",
      milestoneId: "",
      assignee: "",
      priority: "sedang",
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 space-y-4 border dark:border-zinc-800">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-0">
          Tambah Task
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Form tambah task project
        </p>

        <input
          value={newTask.title}
          placeholder="Judul"
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
        />
        {errors?.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title[0]}</p>
        )}

        <textarea
          placeholder="Deskripsi"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
        />

        {showStatusSelect && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Pilih Status
            </p>
            <select
              value={targetStatus}
              onChange={(e) =>
                setTargetStatus(
                  e.target.value as "todo" | "inprogress" | "done",
                )
              }
              className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
            >
              <option value="todo">Daftar Tugas</option>
              <option value="inprogress">Sedang Dikerjakan</option>
              <option value="done">Selesai</option>
            </select>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Pilih Prioritas
          </p>
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value as any })
            }
            className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
          >
            <option value="rendah">Rendah</option>
            <option value="sedang">Sedang</option>
            <option value="tinggi">Tinggi</option>
          </select>
        </div>

        <select
          value={newTask.milestoneId}
          onChange={(e) =>
            setNewTask({ ...newTask, milestoneId: e.target.value })
          }
          className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
        >
          <option value="">Pilih Milestone</option>
          {milestones.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
        {errors?.milestoneId && (
          <p className="text-xs text-red-500 mt-1">{errors.milestoneId[0]}</p>
        )}

        <div className="space-y-1">
          <select
            value={newTask.assignee}
            onChange={(e) =>
              setNewTask({ ...newTask, assignee: e.target.value })
            }
            className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
          >
            <option value="">Pilih Tim Pengembang</option>
            {teamMembers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.userId?.name || "-"} — {m.division}
              </option>
            ))}
          </select>
          {errors?.assignee && (
            <p className="text-xs text-red-500 mt-1">{errors.assignee[0]}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              setErrors({});
            }}
            className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary dark:bg-white text-primary-foreground rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
