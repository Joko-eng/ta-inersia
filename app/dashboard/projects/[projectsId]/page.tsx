"use client";

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
  status: "todo" | "inprogress" | "done";
  assignee?: string;
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [activeTab, setActiveTab] = useState<"milestone" | "kanban">(
    "milestone",
  );
  const [projectName, setProjectName] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Fetch project data
    fetchProjectData(projectId);
  }, [projectId]);

  const fetchProjectData = async (id: string) => {
    // Contoh data - ganti dengan API call
    setProjectName("Manajamen Toko ABC");
    setMilestones([
      {
        id: "1",
        title: "Analisis Kebutuhan Sistem",
        deadline: "23 Maret",
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
        deadline: "28 April",
        isCompleted: false,
      },
      {
        id: "5",
        title: "Pengujian Sistem",
        deadline: "-",
        isCompleted: false,
      },
    ]);

    setTasks([
      { id: "1", title: "Design Database", status: "done", assignee: "John" },
      { id: "2", title: "Create API", status: "inprogress", assignee: "Jane" },
      { id: "3", title: "UI Design", status: "todo" },
    ]);
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{projectName}</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("milestone")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "milestone"
                  ? "bg-primary text-primary-foreground border shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              Milestone
            </button>
            <button
              onClick={() => setActiveTab("kanban")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "kanban"
                  ? "bg-primary text-primary-foreground border shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              </svg>
              Kanban
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Milestone
          </button>
        </div>
      </div>
    </div>
  );
}
