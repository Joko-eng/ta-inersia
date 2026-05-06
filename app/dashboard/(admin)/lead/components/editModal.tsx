"use client";

import {
  BottomSheetHandle,
  ConfirmDialog,
  ModalOverlay,
} from "@/components/ui/props";
import { LEAD_STATUSES, LeadData } from "@/types/ILead";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { updateLead } from "../leadAction";

interface EditModalProps {
  lead: LeadData;
  onClose: () => void;
  onSaved: () => void;
}

const INPUT_CLS =
  "w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const LABEL_CLS =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5";

export default function EditModal({ lead, onClose, onSaved }: EditModalProps) {
  const [form, setForm] = useState<LeadData>({ ...lead });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const set = (key: keyof Omit<LeadData, "id">, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isTidakProspek = form.status === "Tidak Prospek";
  const keteranganMissing =
    isTidakProspek && (form.keterangan ?? "").trim().length === 0;
  const isDirty = JSON.stringify(form) !== JSON.stringify(lead);
  const canSave = !keteranganMissing;

  const handleClose = () => {
    if (isDirty) {
      setConfirmOpen(true);
      return;
    }
    onClose();
  };

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);

    const { id, ...payload } = form;
    const result = await updateLead(id, payload);

    if (!result.ok) {
      setError(result.error ?? "Gagal menyimpan perubahan.");
      setSaving(false);
      return;
    }

    onSaved();
  };

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

        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Edit Lead
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
            {lead.nama}
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
          {error && (
            <p className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className={LABEL_CLS}>Nama</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => set("nama", e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Rating</label>
              <input
                type="number"
                value={form.rating}
                onChange={(e) => set("rating", parseFloat(e.target.value) || 0)}
                className={INPUT_CLS}
                step="0.1"
                min="0"
                max="5"
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Jumlah Ulasan</label>
              <input
                type="number"
                value={form.jumlahUlasan}
                onChange={(e) =>
                  set("jumlahUlasan", parseInt(e.target.value) || 0)
                }
                className={INPUT_CLS}
                min="0"
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>No. Telepon</label>
            <input
              type="text"
              value={form.noTelp}
              onChange={(e) => set("noTelp", e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Alamat</label>
            <input
              type="text"
              value={form.alamat}
              onChange={(e) => set("alamat", e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Link Google Maps</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.mapsUrl ?? ""}
                onChange={(e) => set("mapsUrl", e.target.value)}
                placeholder="https://maps.google.com/..."
                className={`${INPUT_CLS} flex-1`}
              />
              {form.mapsUrl && (
                <a
                  href={form.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 h-10 px-3 flex items-center gap-1.5 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <ExternalLink size={13} />
                  Buka
                </a>
              )}
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={`${INPUT_CLS} cursor-pointer`}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>
              Keterangan
              {!isTidakProspek && (
                <span className="ml-1.5 text-sm font-normal text-zinc-400 dark:text-zinc-600">
                  opsional
                </span>
              )}
              {isTidakProspek && (
                <span className="ml-1.5 text-sm font-normal text-rose-400">
                  wajib diisi
                </span>
              )}
            </label>
            <textarea
              value={form.keterangan ?? ""}
              onChange={(e) => set("keterangan", e.target.value)}
              rows={3}
              placeholder={
                isTidakProspek
                  ? "Jelaskan alasan tidak prospek..."
                  : "Catatan tambahan..."
              }
              className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                keteranganMissing
                  ? "border-rose-300 dark:border-rose-800"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            />
            {keteranganMissing && (
              <p className="text-xs text-rose-500 mt-1.5">
                Keterangan wajib diisi untuk status Tidak Prospek.
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
