"use client";

import { useState } from "react";
import { updateLead, LeadData } from "./leadAction";

interface EditModalProps {
  lead:    LeadData;
  onClose: () => void;
  onSaved: () => void;
}

const STATUS_OPTIONS = ["Belum Diproses", "Prospek", "Belum Prospek", "Tidak Prospek"] as const;

export default function EditModal({ lead, onClose, onSaved }: EditModalProps) {
  const [form,   setForm]   = useState<LeadData>({ ...lead });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof Omit<LeadData, "id">, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isTidakProspek    = form.status === "Tidak Prospek";
  const keteranganMissing = isTidakProspek && (form.keterangan ?? "").trim().length === 0;
  const canSave           = !keteranganMissing;

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    const { id, ...payload } = form;
    await updateLead(id, payload);
    setSaving(false);
    onSaved();
  };

  const inputCls =
    "w-full h-9 px-3 text-[13px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";

  const labelCls =
    "block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-600 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[3px]" onClick={onClose} />

      <div className="relative w-full sm:max-w-sm bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight">Edit Lead</h2>
            <p className="text-[12px] text-zinc-400 dark:text-zinc-600 mt-0.5 truncate max-w-[200px]">{lead.nama}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-[12px] text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            x
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
          <div>
            <label className={labelCls}>Nama</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => set("nama", e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Rating</label>
              <input
                type="number"
                value={form.rating}
                onChange={(e) => set("rating", parseFloat(e.target.value) || 0)}
                className={inputCls}
                step="0.1" min="0" max="5"
              />
            </div>
            <div>
              <label className={labelCls}>Jumlah Ulasan</label>
              <input
                type="number"
                value={form.jumlahUlasan}
                onChange={(e) => set("jumlahUlasan", parseInt(e.target.value) || 0)}
                className={inputCls}
                min="0"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>No. Telepon</label>
            <input
              type="text"
              value={form.noTelp}
              onChange={(e) => set("noTelp", e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Alamat</label>
            <input
              type="text"
              value={form.alamat}
              onChange={(e) => set("alamat", e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Link Google Maps</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.mapsUrl ?? ""}
                onChange={(e) => set("mapsUrl", e.target.value)}
                placeholder="https://maps.google.com/..."
                className={`${inputCls} flex-1`}
              />
              {form.mapsUrl && (
                <a
                  href={form.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 h-9 px-3 flex items-center text-[12px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  Buka
                </a>
              )}
            </div>
          </div>

          <div>
            <label className={labelCls}>Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={`${inputCls} cursor-pointer`}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>
              Keterangan
              {!isTidakProspek && (
                <span className="ml-1.5 font-normal normal-case tracking-normal text-zinc-300 dark:text-zinc-700">— opsional</span>
              )}
              {isTidakProspek && (
                <span className="text-rose-400 ml-1 normal-case tracking-normal font-normal">— wajib diisi</span>
              )}
            </label>
            <textarea
              value={form.keterangan ?? ""}
              onChange={(e) => set("keterangan", e.target.value)}
              rows={3}
              placeholder={isTidakProspek ? "Jelaskan alasan tidak prospek..." : "Catatan tambahan..."}
              className={`w-full px-3 py-2.5 text-[13px] rounded-lg border bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-600 focus:outline-none transition-colors resize-none ${
                keteranganMissing
                  ? "border-rose-300 dark:border-rose-800 focus:border-rose-400"
                  : "border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500"
              }`}
            />
            {keteranganMissing && (
              <p className="text-[11px] text-rose-500 mt-1.5">
                Keterangan wajib diisi untuk status Tidak Prospek.
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
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