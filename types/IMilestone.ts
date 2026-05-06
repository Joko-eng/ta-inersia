export type MilestoneStatus = "menunggu" | "sedang_dikerjakan" | "selesai";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: MilestoneStatus;
}
export const COLUMNS = [
  { id: "todo", title: "Daftar Tugas", color: "bg-blue-500" },
  { id: "inprogress", title: "Sedang Dikerjakan", color: "bg-orange-400" },
  { id: "done", title: "Selesai", color: "bg-green-500" },
] as const;

export const formatTanggalID = (date?: string) => {
  if (!date || date === "-") return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export interface MilestoneTim {
  id: string;
  title: string;
}
