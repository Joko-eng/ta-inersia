"use client";

import { useState, useEffect } from "react";
import { updateProject, getProjectManagers } from "../projectAction";
import { ProjectData, ProjectManagerOption } from "@/types/IProject";
import {
  BottomSheetHandle,
  ConfirmDialog,
  INPUT_CLS,
  LABEL_CLS,
  ModalHeader,
  ModalOverlay,
} from "@/components/ui/props";

interface Props {
  project: ProjectData;
  onClose: () => void;
  onSaved: () => void;
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-300 dark:text-zinc-700 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
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

      <div className="relative w-full sm:max-w-sm bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <BottomSheetHandle />
        <ModalHeader
          title="Edit Project"
          subtitle={project.trackerCode}
          onClose={handleClose}
        />

        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
          {error && (
            <p className="text-[12px] text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
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
              <div className="h-9 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ) : managers.length === 0 ? (
              <p className="text-[12px] text-zinc-400 dark:text-zinc-600 py-2">
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
            <label className={LABEL_CLS}>
              Nama Klien
            </label>
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
