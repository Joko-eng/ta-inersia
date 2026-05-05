"use client";
import {
  BottomSheetHandle,
  ConfirmDialog,
  ModalOverlay,
} from "@/components/ui/props";
import { ProjectManagerData } from "@/types/IProjectManager";
import { useState } from "react";
import { updateProjectManager } from "../projectManagerAction";

interface Props {
  manager: ProjectManagerData;
  onClose: () => void;
  onSaved: () => void;
}

const INPUT_CLS =
  "w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const LABEL_CLS =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5";

export default function EditProjectManagerModal({
  manager,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState(manager.name);
  const [email, setEmail] = useState(manager.email);
  const [username, setUsername] = useState(manager.username);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isDirty =
    name !== manager.name ||
    email !== manager.email ||
    username !== manager.username ||
    password.length > 0;

  const canSave =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    username.trim().length > 0 &&
    (password.length === 0 || password.length >= 8);

  function handleClose() {
    if (isDirty) {
      setConfirmOpen(true);
      return;
    }
    onClose();
  }

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);

    const payload: Record<string, string> = {
      name: name.trim(),
      email: email.trim(),
      username: username.trim(),
    };
    if (password.length > 0) payload.password = password;

    const result = await updateProjectManager(manager.id, payload);

    if (!result.ok) {
      setError(result.error ?? "Gagal menyimpan perubahan.");
      setSaving(false);
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <ModalOverlay onClick={handleClose} />

      <ConfirmDialog
        open={confirmOpen}
        title="Tutup tanpa menyimpan?"
        description="Perubahan yang belum disimpan akan hilang."
        confirmLabel="Lanjutkan"
        onConfirm={() => {
          setConfirmOpen(false);
          onClose();
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <BottomSheetHandle />

        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Edit Project Manager
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Form edit data project manager
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
          {error && (
            <p className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className={LABEL_CLS}>Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Isi nama lengkap disini"
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Isi email disini"
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Isi username disini"
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Password Baru</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kosongkan jika tidak diganti"
              className={INPUT_CLS}
            />
            {password.length > 0 && password.length < 8 && (
              <p className="mt-1.5 text-xs text-rose-500">
                Password minimal 8 karakter.
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2 shrink-0">
          <button
            onClick={handleClose}
            className="h-9 px-5 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !canSave}
            className="h-9 px-5 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
