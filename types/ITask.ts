export interface Task {
  id: string;
  title: string;
  description?: string;
  milestoneId: string;
  assigneeName: string | null;
  assignee: {
    id: string;
    name: string;
    division: string;
  } | null;
  priority: "rendah" | "sedang" | "tinggi";
  status: "todo" | "inprogress" | "done";
  statusUpdatedAt?: string;
}
