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

type Tab = "lead" | "manual";

interface Props {
  onClose:   () => void;
  onCreated: () => void;
}

interface LeadForm {
  leadId:    string;
  name:      string;
  pic:       string;
  phone:    string;
  managerId: string;
}

interface ManualForm {
  name:      string;
  business:  string;
  pic:       string;
  phone:     string;
  managerId: string;
}

const INITIAL_LEAD_FORM: LeadForm = { leadId: "", name: "", pic: "", phone: "", managerId: "" };
const INITIAL_MANUAL_FORM: ManualForm = { name: "", business: "", pic: "", phone:"", managerId: "" };

function ManagerSelect({
  managers,
  loading,
  value,
  onChange,
}: {
  managers: ProjectManagerOption[];
  loading:  boolean;
  value:    string;
  onChange: (id: string) => void;
}) {
  if (loading)
    return <div className="h-9 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />;

  if (managers.length === 0)
    return <p className="text-[12px] text-zinc-400 dark:text-zinc-600 py-2">Tidak ada project manager tersedia.</p>;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${INPUT_CLS} cursor-pointer`}
    >
      <option value="">-- Pilih project manager --</option>
      {managers.map((m) => (
        <option key={m.id} value={m.id}>{m.name}</option>
      ))}
    </select>
  );
}

function LeadPreview({ lead }: { lead: LeadData }) {
  return (
    <div className="mt-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex flex-col gap-1">
      <p className="text-[12px] font-medium text-zinc-800 dark:text-zinc-100">{lead.nama}</p>
      {lead.noTelp && <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">{lead.noTelp}</p>}
      {lead.alamat && <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">{lead.alamat}</p>}
    </div>
  );
}

function TrackerCodeInfo() {
  return (
    <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex flex-col gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600">Tracker Code</p>
      <p className="text-[12px] font-mono text-zinc-400 dark:text-zinc-500">Akan digenerate otomatis saat project dibuat</p>
      <p className="text-[10px] text-zinc-300 dark:text-zinc-700">contoh: 0001-20250504-A3B9C2</p>
    </div>
  );
}

export default function CreateProjectModal({ onClose, onCreated }: Props) {
  const [tab,          setTab]          = useState<Tab>("lead");
  const [leads,        setLeads]        = useState<LeadData[]>([]);
  const [managers,     setManagers]     = useState<ProjectManagerOption[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingMgr,   setLoadingMgr]   = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const [leadForm,   setLeadForm]   = useState<LeadForm>(INITIAL_LEAD_FORM);
  const [manualForm, setManualForm] = useState<ManualForm>(INITIAL_MANUAL_FORM);

  const selectedLead = leads.find((l) => l.id === leadForm.leadId) ?? null;

  useEffect(() => {
    getProspekLeads().then((data)    => { setLeads(data);    setLoadingLeads(false); });
    getProjectManagers().then((data) => { setManagers(data); setLoadingMgr(false);   });
  }, []);

  function handleTabChange(next: Tab) {
    setTab(next);
    setError(null);
  }

  const canSave = tab === "lead"
    ? !!selectedLead && leadForm.name.trim().length > 0 && leadForm.pic.trim().length > 0 && leadForm.managerId.length > 0
    : manualForm.name.trim().length > 0 && manualForm.business.trim().length > 0 &&
      manualForm.pic.trim().length > 0  && manualForm.managerId.length > 0;

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);

    const payload = tab === "lead"
      ? {
          name:             leadForm.name.trim(),
          projectManagerId: leadForm.managerId,
          clientName:       leadForm.pic.trim(),
          clientBusiness:   selectedLead!.nama,
        }
      : {
          name:             manualForm.name.trim(),
          projectManagerId: manualForm.managerId,
          clientName:       manualForm.pic.trim(),
          clientBusiness:   manualForm.business.trim(),
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
    { key: "lead",   label: "Dari Lead Prospek" },
    { key: "manual", label: "Input Manual"       },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <ModalOverlay onClick={onClose} />

      <div className="relative w-full sm:max-w-sm bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <BottomSheetHandle />
        <ModalHeader title="Buat Project" onClose={onClose} />

        <div className="flex shrink-0 mx-6 mt-4 mb-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex-1 h-8 text-[12px] font-medium rounded-md transition-all duration-200 ${
                tab === key
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="px-6 py-4 flex flex-col gap-4 overflow-y-auto">
          {error && (
            <p className="text-[12px] text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {tab === "lead" ? (
            <>
              <div>
                <label className={LABEL_CLS}>Pilih Lead</label>
                {loadingLeads ? (
                  <div className="h-9 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                ) : leads.length === 0 ? (
                  <p className="text-[12px] text-zinc-400 dark:text-zinc-600 py-2">Tidak ada lead dengan status Prospek.</p>
                ) : (
                  <select
                    value={leadForm.leadId}
                    onChange={(e) => setLeadForm({ ...leadForm, leadId: e.target.value, pic: "", name: "" })}
                    className={`${INPUT_CLS} cursor-pointer`}
                  >
                    <option value="">-- Pilih lead --</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>{l.nama}</option>
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
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="cth: Project Website 1 Halaman..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Nama Klien / PIC</label>
                <input
                  type="text"
                  value={leadForm.pic}
                  onChange={(e) => setLeadForm({ ...leadForm, pic: e.target.value })}
                  placeholder="Nama orang yang bertanggung jawab..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Nomor Telepon</label>
                <input
                  type="text"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
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
                  onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                  placeholder="cth: Project Website 1 Halaman..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Nama Perusahaan / Toko</label>
                <input
                  type="text"
                  value={manualForm.business}
                  onChange={(e) => setManualForm({ ...manualForm, business: e.target.value })}
                  placeholder="cth: CV Maju Bersama..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Nama Klien / PIC</label>
                <input
                  type="text"
                  value={manualForm.pic}
                  onChange={(e) => setManualForm({ ...manualForm, pic: e.target.value })}
                  placeholder="Nama orang yang bertanggung jawab..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Nomor Telepon</label>
                <input
                  type="text"
                  value={manualForm.phone}
                  onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
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
                  onChange={(id) => setManualForm({ ...manualForm, managerId: id })}
                />
              </div>
            </>
          )}

          <TrackerCodeInfo />
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