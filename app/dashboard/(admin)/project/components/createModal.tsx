"use client";

import { useState, useEffect } from "react";
import {
  createProject,
  getProspekLeads,
  getProjectManagers,
} from "../projectAction";
import { ProjectManagerOption } from "@/types/IProject";
import { LeadData } from "@/types/ILead";
import {
  BottomSheetHandle,
  INPUT_CLS,
  LABEL_CLS,
  ModalHeader,
  ModalOverlay,
} from "@/components/ui/props";

type ClientMode = "lead" | "manual";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

function ManagerSelect({
  managers,
  loading,
  value,
  onChange,
}: {
  managers: ProjectManagerOption[];
  loading: boolean;
  value: string;
  onChange: (id: string) => void;
}) {
  if (loading)
    return (
      <div className="h-9 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
    );
  if (managers.length === 0)
    return (
      <p className="text-[12px] text-zinc-400 dark:text-zinc-600 py-2">
        Tidak ada project manager tersedia.
      </p>
    );
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${INPUT_CLS} cursor-pointer`}
    >
      <option value="">-- Pilih project manager --</option>
      {managers.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </select>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-300 dark:text-zinc-700 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
    </div>
  );
}

function LeadPreview({ lead }: { lead: LeadData }) {
  return (
    <div className="mt-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex flex-col gap-1">
      <p className="text-[12px] font-medium text-zinc-800 dark:text-zinc-100">
        {lead.nama}
      </p>
      {lead.noTelp && (
        <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          {lead.noTelp}
        </p>
      )}
      {lead.alamat && (
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
          {lead.alamat}
        </p>
      )}
    </div>
  );
}

export default function CreateProjectModal({ onClose, onCreated }: Props) {
  const [clientMode, setClientMode] = useState<ClientMode>("lead");
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [managers, setManagers] = useState<ProjectManagerOption[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingMgr, setLoadingMgr] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [leadPic, setLeadPic] = useState("");
  const [manualBusiness, setManualBusiness] = useState("");
  const [manualPic, setManualPic] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProspekLeads().then((data) => {
      setLeads(data);
      setLoadingLeads(false);
    });
    getProjectManagers().then((data) => {
      setManagers(data);
      setLoadingMgr(false);
    });
  }, []);

  const clientBusiness =
    clientMode === "lead" ? (selectedLead?.nama ?? "") : manualBusiness;
  const clientName = clientMode === "lead" ? leadPic : manualPic;

  const canSave =
    projectName.trim().length > 0 &&
    managerId.length > 0 &&
    clientBusiness.trim().length > 0 &&
    clientName.trim().length > 0;

  function handleModeChange(mode: ClientMode) {
    setClientMode(mode);
    setSelectedLead(null);
    setLeadPic("");
    setManualBusiness("");
    setManualPic("");
  }

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);

    const result = await createProject({
      name: projectName.trim(),
      projectManagerId: managerId,
      clientName: clientName.trim(),
      clientBusiness: clientBusiness.trim(),
    });

    if (!result.ok) {
      setError(result.error ?? "Gagal membuat project.");
      setSaving(false);
      return;
    }

    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <ModalOverlay onClick={onClose} />

      <div className="relative w-full sm:max-w-sm bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <BottomSheetHandle />
        <ModalHeader title="Buat Project" onClose={onClose} />

        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">
          {error && (
            <p className="text-[12px] text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className={LABEL_CLS}>Nama Project</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="cth: Project Website 1 Halaman..."
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Project Manager</label>
            <ManagerSelect
              managers={managers}
              loading={loadingMgr}
              value={managerId}
              onChange={setManagerId}
            />
          </div>

          <SectionDivider label="Data Klien" />

          <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden -mt-2">
            {(["lead", "manual"] as ClientMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`flex-1 h-9 text-[12px] font-medium transition-colors ${
                  clientMode === m
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {m === "lead" ? "Dari Lead Prospek" : "Input Manual"}
              </button>
            ))}
          </div>

          {clientMode === "lead" ? (
            <>
              <div>
                <label className={LABEL_CLS}>
                  Perusahaan / Toko (dari Lead)
                </label>
                {loadingLeads ? (
                  <div className="h-9 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                ) : leads.length === 0 ? (
                  <p className="text-[12px] text-zinc-400 dark:text-zinc-600 py-2">
                    Tidak ada lead dengan status Prospek.
                  </p>
                ) : (
                  <select
                    value={selectedLead?.id ?? ""}
                    onChange={(e) => {
                      setSelectedLead(
                        leads.find((l) => l.id === e.target.value) ?? null,
                      );
                      setLeadPic("");
                    }}
                    className={`${INPUT_CLS} cursor-pointer`}
                  >
                    <option value="">— Pilih lead —</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nama}
                      </option>
                    ))}
                  </select>
                )}
                {selectedLead && <LeadPreview lead={selectedLead} />}
              </div>

              <div>
                <label className={LABEL_CLS}>
                  Nama Klien
                </label>
                <input
                  type="text"
                  value={leadPic}
                  onChange={(e) => setLeadPic(e.target.value)}
                  placeholder="Nama orang yang bertanggung jawab..."
                  className={INPUT_CLS}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={LABEL_CLS}>Nama Perusahaan / Toko</label>
                <input
                  type="text"
                  value={manualBusiness}
                  onChange={(e) => setManualBusiness(e.target.value)}
                  placeholder="cth: CV Maju Bersama..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>
                  Nama PIC / Penanggung Jawab Klien
                </label>
                <input
                  type="text"
                  value={manualPic}
                  onChange={(e) => setManualPic(e.target.value)}
                  placeholder="Nama orang yang bertanggung jawab..."
                  className={INPUT_CLS}
                />
              </div>
            </>
          )}

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex flex-col gap-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600">
              Tracker Code
            </p>
            <p className="text-[12px] font-mono text-zinc-400 dark:text-zinc-500">
              Akan digenerate otomatis saat project dibuat
            </p>
            <p className="text-[10px] text-zinc-300 dark:text-zinc-700">
              contoh: 0001-20250504-A3B9C2
            </p>
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
            {saving ? "Membuat..." : "Buat Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
