"use client";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
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
interface NewTaskForm {
  title: string;
  description: string;
  milestoneId: string;
  assignee: string;
  dueDate: string;
  priority: "rendah" | "sedang" | "tinggi";
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
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [targetStatus, setTargertStatus] = useState<
    "todo" | "inprogress" | "done"
  >("todo");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    milestoneId: "",
    assignee: "",
    dueDate: "",
    priority: "sedang" as "rendah" | "sedang" | "tinggi",
  });
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
  const COLUMNS = [
    { id: "todo", title: "Daftar Tugas", color: "bg-blue-500" },
    { id: "inprogress", title: "Sedang Dikerjakan", color: "bg-orange-400" },
    { id: "done", title: "Selesai", color: "bg-green-500" },
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggableId
          ? { ...task, status: destination.droppableId as any }
          : task,
      ),
    );
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
          <div className="bg-white dark:bg-muted rounded-xl border shadow-sm overflow-hidden">
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
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 overflow-x-auto items-start">
              {COLUMNS.map((col) => (
                <Droppable key={col.id} droppableId={col.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-w-[300px] bg-[#F7F9FC] dark:bg-zinc-900 rounded-2xl p-4 flex flex-col border border-transparent dark:border-zinc-800"
                    >
                      <div
                        className={`${col.color} dark:opacity-90 text-white rounded-full px-4 py-2 mb-4 flex justify-between items-center shrink-0`}
                      >
                        <span className="font-medium">
                          {tasks.filter((t) => t.status === col.id).length}{" "}
                          {col.title}
                        </span>
                        <button
                          onClick={() => {
                            setTargertStatus(col.id as any);
                            setShowTaskModal(true);
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1 scrollbar-hide">
                        {tasks
                          .filter((t) => t.status === col.id)
                          .map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 shadow-sm"
                                >
                                  <span
                                    className={`inline-block text-xs rounded px-2 py-0.5 mb-2 ${
                                      task.priority === "tinggi"
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                        : task.priority === "sedang"
                                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                          : "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300"
                                    }`}
                                  >
                                    {task.priority.charAt(0).toUpperCase() +
                                      task.priority.slice(1)}
                                  </span>

                                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {task.title}
                                  </h4>

                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    {task.description || "-"}
                                  </p>

                                  <p className="text-xs mt-2 text-zinc-600 dark:text-zinc-400">
                                    Milestone
                                  </p>

                                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {
                                      milestones.find(
                                        (m) => m.id === task.milestoneId,
                                      )?.title
                                    }
                                  </p>

                                  <div className="flex justify-between items-center mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                                    <span>{task.assignee}</span>
                                    <span>{task.dueDate || "DD MM"}</span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}

                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 space-y-4 border dark:border-zinc-800">
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                Tambah Task
              </h3>

              {[
                {
                  value: newTask.title,
                  placeholder: "Judul",
                  onChange: (v: string) => setNewTask({ ...newTask, title: v }),
                },
              ].map((f, i) => (
                <input
                  key={i}
                  value={f.value}
                  placeholder={f.placeholder}
                  onChange={(e) => f.onChange(e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                />
              ))}

              <textarea
                placeholder="Deskripsi"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
              />

              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value as any })
                }
                className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
              >
                <option value="rendah">Rendah</option>
                <option value="sedang">Sedang</option>
                <option value="tinggi">Tinggi</option>
              </select>

              <select
                value={newTask.milestoneId}
                onChange={(e) =>
                  setNewTask({ ...newTask, milestoneId: e.target.value })
                }
                className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
              >
                <option value="">Pilih Milestone</option>
                {milestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>

              <input
                placeholder="Tim Pengembang"
                value={newTask.assignee}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignee: e.target.value })
                }
                className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
              />

              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Batal
                </button>

                <button
                  onClick={() => {
                    setTasks((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        title: newTask.title,
                        description: newTask.description,
                        milestoneId: newTask.milestoneId,
                        assignee: newTask.assignee,
                        dueDate: newTask.dueDate,
                        priority: newTask.priority,
                        status: targetStatus,
                      },
                    ]);

                    setNewTask({
                      title: "",
                      description: "",
                      milestoneId: "",
                      assignee: "",
                      dueDate: "",
                      priority: "sedang",
                    });

                    setShowTaskModal(false);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
