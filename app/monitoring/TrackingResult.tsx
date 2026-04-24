import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { IMilestone, TrackResult } from "./Types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

/* ── milestone icon ── */
function Dot({ status }: { status: Status }) {
  const base = "flex h-5 w-5 items-center justify-center rounded-full shrink-0";

  if (status === "selesai") {
    return (
      <span className={`${base} bg-green-100`}>
        <Check className="h-3 w-3 text-green-600" strokeWidth={3} />
      </span>
    );
  }

  if (status === "sedang_dikerjakan") {
    return (
      <span className={`${base} bg-orange-50 border border-orange-300`}>
        <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
      </span>
    );
  }

  return (
    <span className={`${base} border border-slate-200`}>
      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
    </span>
  );
}

/* ── main ── */
export default function TrackingResult({ result }: { result: TrackResult }) {
  const { project, milestones } = result;

  const progress = calcProgress(milestones);
  const done = getDone(milestones);
  const current = getCurrent(milestones);

  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mt-6 space-y-3">
      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              {project.trackerCode}
            </p>

            <h2 className="text-lg font-bold text-slate-900">{project.name}</h2>

            <p className="text-xs text-slate-400">
              Dibuat · {format(project.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 whitespace-nowrap">
              Overall Progress
            </span>

            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="text-sm font-bold text-blue-700">{progress}%</span>
          </div>

          <div className="grid grid-cols-3 divide-x border-t border-slate-100 pt-4">
            {[
              ["Tanggal Di Mulai", format(project.createdAt)],
              [
                "Estimasi Selesai",
                milestones.at(-1)?.dueDate
                  ? format(milestones.at(-1)!.dueDate)
                  : "-",
              ],
              [
                "Terakhir Diperbarui",
                format(
                  milestones
                    .filter((m) => m.completedAt)
                    .sort(
                      (a, b) =>
                        new Date(b.completedAt!).getTime() -
                        new Date(a.completedAt!).getTime(),
                    )
                    .at(0)?.completedAt ?? project.createdAt,
                ),
              ],
            ].map(([label, value]) => (
              <div key={label} className="px-4 first:pl-0 last:pr-0">
                <p className="text-[10px] text-slate-400 mb-1">{label}</p>
                <p className="text-[12px] font-medium text-slate-700">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {current && (
        <Card className="bg-blue-600 text-white">
          <CardContent className="p-5">
            <p className="text-xs text-white/60">Current Phase</p>
            <p className="font-bold">{current.name}</p>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-200">
          <CardTitle className="text-base font-semibold text-slate-800">
            Project Milestones
          </CardTitle>

          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {done} out of {milestones.length}
          </span>
        </CardHeader>

        <CardContent className="p-0">
          {milestones.map((m, i) => {
            const isOpen = openId === m._id;

            return (
              <div
                key={m._id}
                className={`px-5 ${
                  i !== milestones.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="flex items-center gap-3 py-3">
                  <Dot status={m.status} />

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        m.status === "menunggu"
                          ? "text-slate-400"
                          : "text-slate-800"
                      }`}
                    >
                      {m.name}
                    </p>

                    {m.status === "sedang_dikerjakan" && (
                      <p className="text-[11px] text-orange-500 mt-0.5">
                        Currently in progress
                      </p>
                    )}
                  </div>

                  <span
                    className={`text-xs whitespace-nowrap ${
                      m.status === "menunggu"
                        ? "text-slate-300"
                        : "text-slate-400"
                    }`}
                  >
                    {format(m.completedAt || m.dueDate)}
                  </span>

                  <button
                    onClick={() => setOpenId(isOpen ? null : m._id)}
                    className="ml-2 p-1 rounded-md hover:bg-slate-100"
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {isOpen && (
                  <div className="pb-3 pl-7 pr-2">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {m.description || "No description available."}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
