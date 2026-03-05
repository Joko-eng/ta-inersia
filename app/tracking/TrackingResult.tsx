import { Calendar, CheckCircle, TrendingUp } from "lucide-react";
import { IMilestone, TrackResult } from "./Types";
type MilestoneStatus = "menunggu" | "sedang_dikerjakan" | "selesai";

const statusConfig: Record<
  MilestoneStatus,
  {
    label: string;
    dotBg: string;
    dotBorder: string;
    dotText: string;
    badge: string;
    cardBorderLeft: string;
    lineBg: string;
    completedText: string;
  }
> = {
  selesai: {
    label: "Selesai",
    dotBg: "bg-emerald-500",
    dotBorder: "border-emerald-500",
    dotText: "text-white",
    badge:
      "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30",
    cardBorderLeft: "border-l-emerald-400",
    lineBg: "bg-emerald-300 dark:bg-emerald-700",
    completedText: "text-emerald-600 dark:text-emerald-400",
  },
  sedang_dikerjakan: {
    label: "Sedang Dikerjakan",
    dotBg: "bg-blue-500",
    dotBorder: "border-blue-500",
    dotText: "text-white",
    badge:
      "bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30",
    cardBorderLeft: "border-l-blue-400",
    lineBg: "bg-slate-200 dark:bg-slate-700",
    completedText: "text-yellow-600 dark:text-yellow-400",
  },
  menunggu: {
    label: "Menunggu",
    dotBg: "bg-white dark:bg-slate-800",
    dotBorder: "border-slate-300 dark:border-slate-600",
    dotText: "text-slate-400",
    badge:
      "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600/50",
    cardBorderLeft: "border-l-slate-300 dark:border-l-slate-600",
    lineBg: "bg-slate-200 dark:bg-slate-700",
    completedText: "text-slate-400",
  },
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getProgress(milestones: IMilestone[]) {
  if (!milestones.length) return 0;
  const done = milestones.filter((m) => m.status === "selesai").length;
  return Math.round((done / milestones.length) * 100);
}

function CircleProgress({ percent }: { percent: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-slate-100 dark:text-slate-700"
        />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="#2563eb"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  );
}

export default function TrackingResult({ result }: { result: TrackResult }) {
  const progress = getProgress(result.milestones);

  return (
    <div className="mt-6 space-y-5">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
              {result.project.name}
            </h2>
            <div className="text-xs text-slate-400">
              Dibuat {formatDate(result.project.createdAt)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CircleProgress percent={progress} />
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <div className="text-2xl font-extrabold text-primary">
                  {progress}%
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Progress Keseluruhan
              </div>
            </div>
          </div>
        </div>
      </div>

      {result.milestones.map((m, i) => {
        const cfg = statusConfig[m.status];
        const isLast = i === result.milestones.length - 1;

        return (
          <div key={m._id} className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${cfg.dotBg} ${cfg.dotBorder} ${cfg.dotText}`}
              >
                {m.status === "selesai" ? "✓" : ""}
              </div>
              {!isLast && <div className={`w-0.5 flex-1 my-1 ${cfg.lineBg}`} />}
            </div>

            <div
              className={`flex-1 mb-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 border-l-4 p-4 ${cfg.cardBorderLeft}`}
            >
              <div className="flex justify-between mb-1">
                <h4 className="text-sm font-semibold">{m.name}</h4>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${cfg.badge}`}
                >
                  {cfg.label}
                </span>
              </div>

              {m.description && (
                <p className="text-xs text-slate-400 mb-3">{m.description}</p>
              )}

              <div className="flex justify-between text-xs text-slate-400">
                {m.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(m.dueDate)}
                  </span>
                )}

                {m.status === "selesai" && m.completedAt && (
                  <span
                    className={`flex items-center gap-1 ${cfg.completedText}`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Selesai {formatDate(m.completedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
