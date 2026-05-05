"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";
import { createMilestone } from "../[id]/action";

interface MilestoneCreateProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MilestoneCreate({
  projectId,
  onClose,
  onSuccess,
}: MilestoneCreateProps) {
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    if (!newMilestone.title) return { name: ["Nama milestone wajib diisi"] };
    if (!newMilestone.deadline) return { dueDate: ["Tanggal wajib diisi"] };
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 border dark:border-zinc-800">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
          Tambah Milestone
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0 mb-3">
          Form tambah milestone project
        </p>

        <form
          action={async (formData) => {
            setErrors({});
            const clientError = validate();
            if (clientError) {
              setErrors(clientError);
              return;
            }

            const result = await createMilestone(formData);
            if (result?.error) {
              setErrors(result.error);
              return;
            }

            setErrors({});
            setNewMilestone({ title: "", description: "", deadline: "" });
            onSuccess();
          }}
        >
          <input type="hidden" name="projectId" value={projectId} />

          <div className="space-y-1">
            <p className="text-xs font-medium">Milestone</p>
            <input
              name="name"
              placeholder="Isi nama milestone disini"
              value={newMilestone.title}
              onChange={(e) => {
                setNewMilestone({ ...newMilestone, title: e.target.value });
                setErrors((p: any) => ({ ...p, name: undefined }));
              }}
              className="w-full border rounded-lg px-3 py-2 dark:bg-zinc-950"
            />
            {errors?.name && (
              <p className="text-xs text-red-500">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-1 mt-3">
            <p className="text-xs font-medium">Deskripsi</p>
            <textarea
              name="description"
              placeholder="Isi deskripsi milestone"
              value={newMilestone.description || ""}
              onChange={(e) => {
                setNewMilestone({
                  ...newMilestone,
                  description: e.target.value,
                });
                setErrors((p: any) => ({ ...p, description: undefined }));
              }}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-zinc-950"
            />
            {errors?.description && (
              <p className="text-xs text-red-500">{errors.description[0]}</p>
            )}
          </div>

          <div className="space-y-1 mt-3">
            <p className="text-xs font-medium">Tanggal Deadline</p>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="date"
                name="dueDate"
                value={newMilestone.deadline}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewMilestone({ ...newMilestone, deadline: value });
                  const today = new Date().toISOString().split("T")[0];
                  if (value && value < today) {
                    setErrors({
                      dueDate: ["Tanggal tidak boleh sebelum hari ini"],
                    });
                  } else {
                    setErrors((p: any) => ({ ...p, dueDate: undefined }));
                  }
                }}
                className="w-full border rounded-lg pl-10 pr-3 py-2 dark:bg-zinc-950"
              />
            </div>
            {errors?.dueDate && (
              <p className="text-xs text-red-500">{errors.dueDate[0]}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => {
                onClose();
                setErrors({});
              }}
              className="px-4 py-2 rounded-lg border"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary dark:bg-white text-primary-foreground"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
