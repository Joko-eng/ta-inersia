"use client";

import { BottomSheetHandle, ModalOverlay } from "@/components/ui/props";
import { LeadData } from "@/types/ILead";
import { ProjectManagerOption } from "@/types/IProject";
import { useEffect, useState } from "react";
import {
  createProject,
  getProjectManagers,
  getProspekLeads,
} from "../projectAction";

type Tab = "lead" | "manual";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

interface LeadForm {
  leadId: string;
  name: string;
  pic: string;
  phone: string;
  managerId: string;
}

interface ManualForm {
  name: string;
  business: string;
  pic: string;
  phone: string;
  managerId: string;
}

const INITIAL_LEAD_FORM: LeadForm = {
  leadId: "",
  name: "",
  pic: "",
  phone: "",
  managerId: "",
};
const INITIAL_MANUAL_FORM: ManualForm = {
  name: "",
  business: "",
  pic: "",
  phone: "",
  managerId: "",
};

const INPUT_CLS =
  "w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const LABEL_CLS =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5";

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
      <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
    );

  if (managers.length === 0)
    return (
      <p className="text-sm text-zinc-400 dark:text-zinc-600 py-2">
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

function LeadPreview({ lead }: { lead: LeadData }) {
  return (
    <div className="mt-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col gap-1">
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
        {lead.nama}
      </p>
      {lead.noTelp && (
        <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
          {lead.noTelp}
        </p>
      )}
      {lead.alamat && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
          {lead.alamat}
        </p>
      )}
    </div>
  );
}

function TrackerCodeInfo() {
  return (
    <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col gap-1">
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Tracker Code
      </p>
      <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
        Akan digenerate otomatis saat project dibuat
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-600">
        contoh: 0001-20250504-A3B9C2
      </p>
    </div>
  );
}

export default function CreateProjectModal({ onClose, onCreated }: Props) {
  const [tab, setTab] = useState<Tab>("lead");
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [managers, setManagers] = useState<ProjectManagerOption[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingMgr, setLoadingMgr] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [leadForm, setLeadForm] = useState<LeadForm>(INITIAL_LEAD_FORM);
  const [manualForm, setManualForm] = useState<ManualForm>(INITIAL_MANUAL_FORM);

  const selectedLead = leads.find((l) => l.id === leadForm.leadId) ?? null;

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

  function handleTabChange(next: Tab) {
    setTab(next);
    setError(null);
  }

  const canSave =
    tab === "lead"
      ? !!selectedLead &&
        leadForm.name.trim().length > 0 &&
        leadForm.pic.trim().length > 0 &&
        leadForm.managerId.length > 0
      : manualForm.name.trim().length > 0 &&
        manualForm.business.trim().length > 0 &&
        manualForm.pic.trim().length > 0 &&
        manualForm.managerId.length > 0;

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);

    const payload =
      tab === "lead"
        ? {
            name: leadForm.name.trim(),
            projectManagerId: leadForm.managerId,
            clientName: leadForm.pic.trim(),
            clientBusiness: selectedLead!.nama,
          }
        : {
            name: manualForm.name.trim(),
            projectManagerId: manualForm.managerId,
            clientName: manualForm.pic.trim(),
            clientBusiness: manualForm.business.trim(),
          };

    const result = await createProject(payload);

    if (!result.ok) {
      setError(result.error ?? "Gagal membuat project.");
      setSaving(false);
      return;
    }

    onCreated();
    onClose();
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "lead", label: "Dari Lead Prospek" },
    { key: "manual", label: "Input Manual" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <ModalOverlay onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <BottomSheetHandle />

        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Buat Project
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Form pembuatan project baru
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex shrink-0 mx-6 mt-4 mb-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex-1 h-8 text-sm font-medium rounded-md transition-all duration-200 ${
                tab === key
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="px-6 py-4 flex flex-col gap-4 overflow-y-auto">
          {error && (
            <p className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {tab === "lead" ? (
            <>
              <div>
                <label className={LABEL_CLS}>Pilih Lead</label>
                {loadingLeads ? (
                  <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                ) : leads.length === 0 ? (
                  <p className="text-sm text-zinc-400 dark:text-zinc-600 py-2">
                    Tidak ada lead dengan status Prospek.
                  </p>
                ) : (
                  <select
                    value={leadForm.leadId}
                    onChange={(e) =>
                      setLeadForm({
                        ...leadForm,
                        leadId: e.target.value,
                        pic: "",
                        name: "",
                      })
                    }
                    className={`${INPUT_CLS} cursor-pointer`}
                  >
                    <option value="">-- Pilih lead --</option>
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
                <label className={LABEL_CLS}>Nama Project</label>
                <input
                  type="text"
                  value={leadForm.name}
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, name: e.target.value })
                  }
                  placeholder="cth: Project Website 1 Halaman..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Nama Klien / PIC</label>
                <input
                  type="text"
                  value={leadForm.pic}
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, pic: e.target.value })
                  }
                  placeholder="Nama orang yang bertanggung jawab..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Nomor Telepon</label>
                <input
                  type="text"
                  value={leadForm.phone}
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, phone: e.target.value })
                  }
                  placeholder="Nomor telepon klien..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Project Manager</label>
                <ManagerSelect
                  managers={managers}
                  loading={loadingMgr}
                  value={leadForm.managerId}
                  onChange={(id) => setLeadForm({ ...leadForm, managerId: id })}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={LABEL_CLS}>Nama Project</label>
                <input
                  type="text"
                  value={manualForm.name}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, name: e.target.value })
                  }
                  placeholder="cth: Project Website 1 Halaman..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Nama Perusahaan / Toko</label>
                <input
                  type="text"
                  value={manualForm.business}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, business: e.target.value })
                  }
                  placeholder="cth: CV Maju Bersama..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Nama Klien / PIC</label>
                <input
                  type="text"
                  value={manualForm.pic}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, pic: e.target.value })
                  }
                  placeholder="Nama orang yang bertanggung jawab..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Nomor Telepon</label>
                <input
                  type="text"
                  value={manualForm.phone}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, phone: e.target.value })
                  }
                  placeholder="Nomor telepon klien..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Project Manager</label>
                <ManagerSelect
                  managers={managers}
                  loading={loadingMgr}
                  value={manualForm.managerId}
                  onChange={(id) =>
                    setManualForm({ ...manualForm, managerId: id })
                  }
                />
              </div>
            </>
          )}

          <TrackerCodeInfo />
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="h-9 px-5 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !canSave}
            className="h-9 px-5 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Membuat..." : "Buat Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
