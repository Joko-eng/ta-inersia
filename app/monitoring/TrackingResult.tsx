import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { IMilestone, TrackResult } from "./Types";

type Status = "menunggu" | "sedang_dikerjakan" | "selesai";

const format = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "-";

const calcProgress = (m: IMilestone[]) =>
  m.length
    ? Math.round(
        (m.filter((x) => x.status === "selesai").length / m.length) * 100,
      )
    : 0;

const getDone = (m: IMilestone[]) =>
  m.filter((x) => x.status === "selesai").length;

const getCurrent = (m: IMilestone[]) =>
  m.find((x) => x.status === "sedang_dikerjakan");

function StatusDot({ status }: { status: Status }) {
  if (status === "selesai") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
        <Check
          className="h-3 w-3 text-emerald-600 dark:text-emerald-400"
          strokeWidth={3}
        />
      </span>
    );
  }
  if (status === "sedang_dikerjakan") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-600 shrink-0">
        <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 dark:border-neutral-700 shrink-0">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-neutral-600" />
    </span>
  );
}

export default function TrackingResult({ result }: { result: TrackResult }) {
  const { project, milestones } = result;
  const progress = calcProgress(milestones);
  const done = getDone(milestones);
  const current = getCurrent(milestones);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mt-6 space-y-4">
      <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 p-6">
        <p className="text-xs font-semibold text-primary dark:text-white tracking-widest uppercase mb-1">
          {project.trackerCode}
        </p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {project.name}
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
          Dibuat · {format(project.createdAt)}
        </p>

        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Progress Keseluruhan
          </span>
          <span className="text-sm font-bold text-primary dark:text-white">
            {progress}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-primary dark:bg-white/90 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Tanggal Dimulai", value: format(project.createdAt) },
            {
              label: "Estimasi Selesai",
              value: milestones.at(-1)?.dueDate
                ? format(milestones.at(-1)!.dueDate)
                : "-",
            },
            {
              label: "Terakhir Diperbarui",
              value: format(
                milestones
                  .filter((m) => m.completedAt)
                  .sort(
                    (a, b) =>
                      new Date(b.completedAt!).getTime() -
                      new Date(a.completedAt!).getTime(),
                  )
                  .at(0)?.completedAt ?? project.createdAt,
              ),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white dark:bg-neutral-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-neutral-700"
            >
              <p className="text-[8px] text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">
                {label}
              </p>
              <p className="text-[10px] font-semibold text-gray-800 dark:text-gray-200 leading-snug">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {current && (
        <div className="bg-primary dark:bg-primary/90 rounded-2xl px-6 py-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          </div>
          <div>
            <p className="text-xs text-white/60 font-medium uppercase tracking-wide">
              Fase Saat Ini
            </p>
            <p className="text-sm font-bold text-white">{current.name}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Tahapan Proyek
          </h3>
          <span className="text-xs font-semibold text-primary bg-primary/10 dark:bg-white px-3 py-1 rounded-full">
            {done} / {milestones.length} selesai
          </span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-neutral-700">
          {milestones.map((m) => {
            const isOpen = openId === m._id;
            return (
              <div key={m._id}>
                <div className="flex items-center gap-3 px-6 py-4">
                  <StatusDot status={m.status} />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        m.status === "menunggu"
                          ? "text-gray-400 dark:text-neutral-600"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {m.name}
                    </p>
                    {m.status === "sedang_dikerjakan" && (
                      <p className="text-[11px] text-amber-500 mt-0.5 font-medium">
                        Sedang dikerjakan
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs whitespace-nowrap ${
                      m.status === "menunggu"
                        ? "text-gray-300 dark:text-neutral-700"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {format(m.completedAt || m.dueDate)}
                  </span>
                  <button
                    onClick={() => setOpenId(isOpen ? null : m._id)}
                    className="ml-1 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                {isOpen && (
                  <div className="px-6 pb-4 pl-[60px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl px-4 py-3">
                      {m.description || "Tidak ada deskripsi tersedia."}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
