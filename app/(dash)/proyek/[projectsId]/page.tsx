"use client";
import { BarChart2Icon, KanbanSquare, Plus } from "lucide-react";
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
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    fetchProjectData(projectId);
  }, [projectId]);

  const fetchProjectData = async (id: string) => {
    setProjectName("Manajamen Toko ABC");
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{projectName}</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-muted/50 dark:bg-muted/20 rounded-full p-1">
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
            onClick={() =>
              activeTab === "kanban"
                ? setShowTaskModal(true)
                : alert("Tambah Milestone")
            }
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
          >
            <Plus className="h-4 w-4" />
            {activeTab === "kanban" ? "Tugas" : "Milestone"}
          </button>
        </div>
      </div>
    </div>
  );
}
