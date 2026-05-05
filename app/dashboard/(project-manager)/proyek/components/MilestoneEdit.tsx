"use client";
import { Milestone } from "@/types/IMilestone";
import { useState } from "react";
import { updateMilestone } from "../[id]/action";

interface MilestoneEditModalProps {
  milestone: Milestone;
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MilestoneEditModal({
  milestone,
  projectId,
  onClose,
  onSuccess,
}: MilestoneEditModalProps) {
  const [errors, setErrors] = useState<any>({});

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 border dark:border-zinc-800">
        <h3 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-zinc-100">
          Edit Milestone
        </h3>

        <form
          action={async (formData) => {
            setErrors({});
            const result = await updateMilestone(
              milestone.id,
              projectId,
              formData,
            );
            if (result?.error) {
              setErrors(result.error);
              return;
            }
            onSuccess();
          }}
        >
          <input
            name="name"
            defaultValue={milestone.title}
            className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
          />

          <div className="space-y-1 mt-3">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Deskripsi
            </p>
            <textarea
              name="description"
              defaultValue={milestone.description || ""}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-100"
            />
          </div>

          <input
            type="date"
            name="dueDate"
            defaultValue={milestone.deadline?.slice(0, 10) || ""}
            className="w-full border dark:border-zinc-700 rounded px-3 py-2 mt-3 dark:bg-zinc-950 dark:text-zinc-100"
          />

          {errors?.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-600 dark:text-zinc-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary dark:bg-white text-primary-foreground rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
