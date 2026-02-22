"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { updateLead, LeadData } from "./leadAction";

interface EditModalProps {
  lead:    LeadData;
  onClose: () => void;
  onSaved: () => void;
}

const STATUS_OPTIONS = ["Prospek", "Belum Prospek", "Belum Diproses"] as const;

interface FieldProps {
  label:    string;
  value:    string | number;
  type?:    string;
  onChange: (value: string | number) => void;
}

function Field({ label, value, type = "text", onChange }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
        }
        className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  );
}

export default function EditModal({ lead, onClose, onSaved }: EditModalProps) {
  const [form,   setForm]   = useState<LeadData>({ ...lead });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof Omit<LeadData, "id">, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { id, ...payload } = form;
    await updateLead(id, payload);
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Edit Lead</h2>
            <p className="text-xs text-gray-400 mt-0.5">{lead.nama}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3">
          <Field label="Nama"          value={form.nama}         onChange={(v) => set("nama", v)} />
          <Field label="Rating"        value={form.rating}       onChange={(v) => set("rating", v)}       type="number" />
          <Field label="Jumlah Ulasan" value={form.jumlahUlasan} onChange={(v) => set("jumlahUlasan", v)} type="number" />
          <Field label="No. Telepon"   value={form.noTelp}       onChange={(v) => set("noTelp", v)} />
          <Field label="Alamat"        value={form.alamat}       onChange={(v) => set("alamat", v)} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
          >
            {saving ? (
              <><Loader2 size={13} className="animate-spin" /> Menyimpan...</>
            ) : (
              <><Save size={13} /> Simpan Perubahan</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}