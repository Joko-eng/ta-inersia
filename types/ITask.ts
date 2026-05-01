export interface Task {
  id: string;
  title: string;
  description?: string;
  milestoneId: string;
  assigneeName: string | null;
  priority: "rendah" | "sedang" | "tinggi";
  status: "todo" | "inprogress" | "done";
  statusUpdatedAt?: string;
}
