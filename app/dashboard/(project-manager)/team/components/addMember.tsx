"use client";

import { X } from "lucide-react";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  form: any;
  setForm: any;
  errors: any;
  onSubmit: () => Promise<void>;
}

export default function AddMemberModal({
  open,
  onClose,
  form,
  setForm,
  errors,
  onSubmit,
}: AddMemberModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400"
        >
          <X size={18} />
        </button>

        <h3 className="font-semibold text-lg mb-1">Tambah Tim Pengembang</h3>

        <p className="text-sm text-zinc-500 mb-4">
          Tambahkan tim pengembang untuk melakukan pekerjaan proyek
        </p>

        {errors.general && (
          <p className="text-sm text-red-500 mb-2">{errors.general[0]}</p>
        )}

        <div className="space-y-3">
          <div>
            <input
              placeholder="Nama"
              value={form.name}
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            {errors?.name && (
              <p className="text-xs text-red-500">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Email"
              value={form.email}
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {errors?.email && (
              <p className="text-xs text-red-500">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Username"
              value={form.username}
              className="w-full border rounded px-3 py-2"
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
            />

            {errors?.username && (
              <p className="text-xs text-red-500">{errors.username[0]}</p>
            )}
          </div>

          <div>
            <select
              value={form.division}
              className="w-full border rounded px-3 py-2"
              onChange={(e) =>
                setForm({
                  ...form,
                  division: e.target.value,
                })
              }
            >
              <option value="">Pilih Role</option>
              <option>Front End</option>
              <option>Back End</option>
              <option>QA</option>
              <option>UI/UX</option>
            </select>

            {errors?.division && (
              <p className="text-xs text-red-500">{errors.division[0]}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded"
          >
            Batal
          </button>

          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-primary dark:bg-black/70 text-white rounded text-sm"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
