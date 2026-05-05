"use client";

import {
  BottomSheetHandle,
  ConfirmDialog,
  ModalOverlay,
} from "@/components/ui/props";
import { ProjectData, ProjectManagerOption } from "@/types/IProject";
import { useEffect, useState } from "react";
import { getProjectManagers, updateProject } from "../projectAction";

interface Props {
  project: ProjectData;
  onClose: () => void;
  onSaved: () => void;
}

const INPUT_CLS =
  "w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const LABEL_CLS =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
      <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

export default function EditProjectModal({ project, onClose, onSaved }: Props) {
  const [name, setName] = useState(project.name);
  const [managerId, setManagerId] = useState(project.projectManagerId);
  const [clientName, setClientName] = useState(project.clientName);
  const [clientBusiness, setClientBusiness] = useState(project.clientBusiness);
  const [managers, setManagers] = useState<ProjectManagerOption[]>([]);
  const [loadingMgr, setLoadingMgr] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    getProjectManagers().then((data) => {
      setManagers(data);
      setLoadingMgr(false);
    });
  }, []);

  const isDirty =
    name !== project.name ||
    managerId !== project.projectManagerId ||
    clientName !== project.clientName ||
    clientBusiness !== project.clientBusiness;

  const canSave =
    name.trim().length > 0 &&
    managerId.length > 0 &&
    clientName.trim().length > 0 &&
    clientBusiness.trim().length > 0;

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

    const result = await updateProject(project.id, {
      name: name.trim(),
      projectManagerId: managerId,
      clientName: clientName.trim(),
      clientBusiness: clientBusiness.trim(),
    });

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
            Edit Project
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
            {project.trackerCode}
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
          {error && (
            <p className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className={LABEL_CLS}>Nama Project</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Tracker Code</label>
            <input
              type="text"
              value={project.trackerCode}
              disabled
              className={`${INPUT_CLS} opacity-40 cursor-not-allowed font-mono`}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Project Manager</label>
            {loadingMgr ? (
              <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ) : managers.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-600 py-2">
                Tidak ada project manager tersedia.
              </p>
            ) : (
              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className={`${INPUT_CLS} cursor-pointer`}
              >
                <option value="">-- Pilih project manager --</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <SectionDivider label="Data Klien" />

          <div>
            <label className={LABEL_CLS}>Nama Perusahaan / Toko</label>
            <input
              type="text"
              value={clientBusiness}
              onChange={(e) => setClientBusiness(e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Nama Klien</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={INPUT_CLS}
            />
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
