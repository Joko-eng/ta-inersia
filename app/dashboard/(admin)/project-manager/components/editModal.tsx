"use client";

import { useState } from "react";
import { updateProjectManager } from "../projectManagerAction";
import { ProjectManagerData } from "@/types/IProjectManager";
import {
  BottomSheetHandle,
  ConfirmDialog,
  INPUT_CLS,
  LABEL_CLS,
  ModalHeader,
  ModalOverlay,
} from "@/components/ui/props";

interface Props {
  manager: ProjectManagerData;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditProjectManagerModal({ manager, onClose, onSaved }: Props) {
  const [name,     setName]     = useState(manager.name);
  const [email,    setEmail]    = useState(manager.email);
  const [username, setUsername] = useState(manager.username);
  const [password, setPassword] = useState("");
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isDirty =
    name     !== manager.name     ||
    email    !== manager.email    ||
    username !== manager.username ||
    password.length > 0;

  const canSave =
    name.trim().length > 0     &&
    email.trim().length > 0    &&
    username.trim().length > 0 &&
    (password.length === 0 || password.length >= 8);

  function handleClose() {
    if (isDirty) { setConfirmOpen(true); return; }
    onClose();
  }

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);

    const payload: Record<string, string> = {
      name:     name.trim(),
      email:    email.trim(),
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
        onConfirm={() => { setConfirmOpen(false); onClose(); }}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="relative w-full sm:max-w-sm bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <BottomSheetHandle />
        <ModalHeader title="Edit Project Manager" onClose={handleClose} />

        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
          {error && (
            <p className="text-[12px] text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className={LABEL_CLS}>Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              <p className="mt-1 text-[11px] text-rose-400">Password minimal 8 karakter.</p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2 shrink-0">
          <button
            onClick={handleClose}
            className="h-9 px-5 text-[13px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !canSave}
            className="h-9 px-5 text-[13px] font-semibold rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}