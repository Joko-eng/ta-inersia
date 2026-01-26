"use client";
import {
  AlignLeft,
  BarChart2Icon,
  Calendar,
  KanbanSquare,
  Plus,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Milestone {
  id: string;
  title: string;
  deadline: string;
  isCompleted: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  milestoneId: string;
  assignee: string;
  dueDate: string;
  priority: "rendah" | "sedang" | "tinggi";
  status: "todo" | "inprogress" | "done";
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [activeTab, setActiveTab] = useState<"milestone" | "kanban">(
    "milestone",
  );
  const [projectName, setProjectName] = useState("");
  const [setShowTaskModal] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  useEffect(() => {
    fetchProjectData(projectId);
  }, [projectId]);

  const fetchProjectData = async (id: string) => {
    setProjectName("Inventaris PT XYZ");
    setMilestones([
      {
        id: "1",
        title: "Analisis Kebutuhan Sistem",
        deadline: "23 Maret, 2025",
        isCompleted: true,
      },
      {
        id: "2",
        title: "Perancangan Desain Arsitektur Sistem",
        deadline: "9 Mei, 2025",
        isCompleted: true,
      },
      {
        id: "3",
        title: "Pembuatan Fitur Fitur Utama Sistem",
        deadline: "20 Mei, 2025",
        isCompleted: true,
      },
      {
        id: "4",
        title: "Pengembangan Fitur Tambahan",
        deadline: "28 April, 2025",
        isCompleted: false,
      },
      {
        id: "5",
        title: "Pengujian Sistem",
        deadline: "-",
        isCompleted: false,
      },
      {
        id: "6",
        title: "Peluncuran Sistem Dan Pemeliharaan",
        deadline: "-",
        isCompleted: false,
      },
    ]);
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{projectName}</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("milestone")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
                activeTab === "milestone"
                  ? "bg-background dark:bg-muted shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart2Icon className="h-4 w-4" />
              Milestone
            </button>

            <button
              onClick={() => setActiveTab("kanban")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
                activeTab === "kanban"
                  ? "bg-background dark:bg-muted shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <KanbanSquare className="h-4 w-4" />
              Kanban
            </button>
          </div>
          <button
            onClick={() => activeTab === "kanban"}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
          >
            <Plus className="h-4 w-4" />
            {activeTab === "kanban" ? "Tugas" : "Milestone"}
          </button>
        </div>
        {activeTab === "milestone" && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 px-6 py-3 text-sm text-foreground border-b">
              <div className="flex items-center gap-2">
                <AlignLeft size={16} /> <span>Milestone</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} /> <span>Tanggal</span>
              </div>
              <div className="flex items-center gap-2">
                <AlignLeft size={16} /> <span>Status</span>
              </div>
            </div>

            {milestones.map((item) => {
              const status = item.isCompleted
                ? "Selesai"
                : item.deadline === "-"
                  ? "Menunggu"
                  : "Sedang Dikerjakan";

              const statusStyle =
                status === "Selesai"
                  ? "bg-green-100 text-green-700"
                  : status === "Menunggu"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700";

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-3 items-center px-6 py-4 border-b last:border-b-0 text-sm"
                >
                  <div className="font-medium">{item.title}</div>
                  <div className="text-muted-foreground">{item.deadline}</div>
                  <div>
                    <span
                      className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${statusStyle}`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "kanban" && (
          <div className="mt-8 text-muted-foreground">
            Kanban view coming soon…
          </div>
        )}
      </div>
    </div>
  );
}
