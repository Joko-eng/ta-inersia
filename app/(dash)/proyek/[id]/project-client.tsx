"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  AlignLeft,
  BarChart2Icon,
  Calendar,
  KanbanSquare,
  ListChecks,
  MoreVertical,
  NotepadText,
  PencilLine,
  Plus,
  Tag,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createMilestone, deleteMilestone, updateMilestone } from "./action";

type MilestoneStatus = "menunggu" | "sedang_dikerjakan" | "selesai";
interface Milestone {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: MilestoneStatus;
}

interface Task {
  id: string;
  title: string;
  description: string;
  milestoneId: string;
  assignee: {
    id: string;
    name: string;
    division: string;
  } | null;
  dueDate: string;
  priority: "rendah" | "sedang" | "tinggi";
  status: "todo" | "inprogress" | "done";
  statusUpdatedAt?: string;
}

export default function ProjectClient({
  projectId,
  initialMilestones,
  name,
}: {
  projectId: string;
  initialMilestones: Milestone[];
  name?: string;
}) {
  const [activeTab, setActiveTab] = useState<"milestone" | "kanban">(
    "milestone",
  );
  const router = useRouter();
  const milestones = initialMilestones;
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMilestone, setEditMilestone] = useState<Milestone | null>(null);
  const [showTaskEdit, setShowTaskEdit] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [targetStatus, setTargetStatus] = useState<
    "todo" | "inprogress" | "done"
  >("todo");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    milestoneId: "",
    assignee: "",
    priority: "sedang" as "rendah" | "sedang" | "tinggi",
  });
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const formatTanggalID = (date?: string) => {
    if (!date || date === "-") return "-";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  const fetchTasks = async () => {
    const res = await fetch(`/api/tasks?projectId=${projectId}`);
    const data = await res.json();
    setTasks(data);
  };
  const fetchTeam = async () => {
    const res = await fetch("/api/team");
    const data = await res.json();
    setTeamMembers(data);
  };
  useEffect(() => {
    if (!projectId) return;
    fetchTasks();
    fetchTeam();
  }, [projectId]);

  const COLUMNS = [
    { id: "todo", title: "Daftar Tugas", color: "bg-blue-500" },
    { id: "inprogress", title: "Sedang Dikerjakan", color: "bg-orange-400" },
    { id: "done", title: "Selesai", color: "bg-green-500" },
  ];

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    const newStatus = destination.droppableId;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggableId ? { ...task, status: newStatus as any } : task,
      ),
    );

    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: draggableId,
        status: newStatus,
      }),
    });
    toast.success("Status task diperbarui");
    router.refresh();
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{name}</h1>
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
            onClick={() => {
              if (activeTab === "kanban") {
                setTargetStatus("todo");
                setShowStatusSelect(true);
                setShowTaskModal(true);
              }
              if (activeTab === "milestone") {
                setShowMilestoneModal(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
          >
            <Plus className="h-4 w-4" />
            {activeTab === "kanban" ? "Tugas" : "Milestone"}
          </button>
        </div>
        {activeTab === "milestone" && (
          <div className="bg-white dark:bg-muted rounded-xl border shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 px-8 py-3 text-sm text-foreground border-b">
              <div className="flex items-center gap-2">
                <AlignLeft size={16} /> <span>Milestone</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} /> <span>Tanggal</span>
              </div>
              <div className="flex items-center gap-2">
                <NotepadText size={16} /> <span>Deskripsi</span>
              </div>

              <div className="flex items-center gap-2">
                <ListChecks size={16} /> <span>Status</span>
              </div>

              <div className="flex items-center gap-2">
                <Tag size={16} /> <span>Aksi</span>
              </div>
            </div>

            {milestones.map((item) => {
              const status =
                item.status === "selesai"
                  ? "Selesai"
                  : item.status === "menunggu"
                    ? "Menunggu"
                    : "Sedang Dikerjakan";

              const statusStyle =
                item.status === "selesai"
                  ? "bg-green-100 text-green-700"
                  : item.status === "menunggu"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700";

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-5 items-center px-8 py-4 border-b last:border-b-0 text-sm"
                >
                  <div className="font-medium pr-4">{item.title}</div>
                  <div className="text-muted-foreground">
                    {item.deadline ? formatTanggalID(item.deadline) : "-"}
                  </div>
                  <div className="font-medium pr-2">{item.description}</div>
                  <div>
                    <span
                      className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${statusStyle}`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMilestone(item);
                        setShowEditModal(true);
                      }}
                      className="text-blue-500 text-xs"
                    >
                      <PencilLine size={16} />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(item.id)}
                      className="text-red-500 text-xs"
                    >
                      <Trash size={16} />
                    </button>
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
                      className="min-w-[300px] bg-slate-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col border border-transparent dark:border-zinc-800"
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
                            setTargetStatus(col.id as any);
                            setShowTaskModal(true);
                            setShowStatusSelect(false);
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
                                  <div className="flex justify-between items-start">
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

                                    <div className="relative">
                                      <button
                                        onClick={() =>
                                          setOpenMenuId(
                                            openMenuId === task.id
                                              ? null
                                              : task.id,
                                          )
                                        }
                                        className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                      >
                                        <MoreVertical size={16} />
                                      </button>

                                      {openMenuId === task.id && (
                                        <div className="absolute right-0 mt-1 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded shadow text-xs z-20">
                                          <button
                                            className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 w-full text-left"
                                            onClick={() => {
                                              setEditTask({
                                                ...task,
                                                assignee:
                                                  typeof task.assignee ===
                                                  "object"
                                                    ? task.assignee?.id
                                                    : (task.assignee ?? null),
                                              });

                                              setShowTaskEdit(true);
                                              setOpenMenuId(null);
                                            }}
                                          >
                                            Edit
                                          </button>
                                          <button
                                            className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 w-full text-left text-red-500"
                                            onClick={() => {
                                              setTaskToDelete(task.id);
                                              setShowDeleteTaskModal(true);
                                              setOpenMenuId(null);
                                            }}
                                          >
                                            Hapus
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {task.title}
                                  </h4>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    {task.description || "-"}
                                  </p>
                                  <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">
                                    Milestone
                                  </p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {
                                      milestones.find(
                                        (m) => m.id === task.milestoneId,
                                      )?.title
                                    }
                                  </p>
                                  <div className="my-5 h-px w-full bg-zinc-200 dark:bg-zinc-800" />{" "}
                                  <div className="flex justify-between items-center mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                                    <span>{task.assignee?.name}</span>
                                    <span>
                                      {task.statusUpdatedAt
                                        ? formatTanggalID(task.statusUpdatedAt)
                                        : "DD MM"}
                                    </span>
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
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-0">
                Tambah Task
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Form tambah task project
              </p>
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
              {showStatusSelect && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Pilih Status
                  </p>

                  <select
                    value={targetStatus}
                    onChange={(e) =>
                      setTargetStatus(
                        e.target.value as "todo" | "inprogress" | "done",
                      )
                    }
                    className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                  >
                    <option value="todo">Daftar Tugas</option>
                    <option value="inprogress">Sedang Dikerjakan</option>
                    <option value="done">Selesai</option>
                  </select>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Pilih Prioritas
                </p>
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
              </div>

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
              <div className="space-y-1">
                <select
                  value={newTask.assignee}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignee: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                >
                  <option value="">Pilih Tim Pengembang</option>

                  {teamMembers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.userId.name} — {m.division}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Batal
                </button>

                <button
                  onClick={async () => {
                    await fetch("/api/tasks", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        title: newTask.title,
                        description: newTask.description,
                        milestoneId: newTask.milestoneId,
                        assignee: newTask.assignee,
                        priority: newTask.priority,
                        status: targetStatus,
                      }),
                    });

                    setNewTask({
                      title: "",
                      description: "",
                      milestoneId: "",
                      assignee: "",
                      priority: "sedang",
                    });

                    setShowTaskModal(false);
                    toast.success("Task berhasil ditambahkan");
                    fetchTasks();
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
        {showMilestoneModal && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 border dark:border-zinc-800">
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                Tambah Milestone
              </h3>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0 mb-3">
                Form tambah milestone project
              </p>

              <form
                action={createMilestone}
                onSubmit={() => {
                  setShowMilestoneModal(false);
                  setNewMilestone({ title: "", description: "", deadline: "" });
                  router.refresh();
                  toast.success("Milestone Berhasil Ditambahkan");
                }}
              >
                <input type="hidden" name="projectId" value={projectId} />

                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Milestone
                  </p>

                  <input
                    name="name"
                    placeholder="Isi nama milestone disini"
                    value={newMilestone.title}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        title: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Deskripsi
                  </p>

                  <textarea
                    name="description"
                    placeholder="Isi deskripsi milestone"
                    value={newMilestone.description || ""}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm
                dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Tanggal
                  </p>

                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="date"
                      name="dueDate"
                      value={newMilestone.deadline}
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          deadline: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg pl-10 pr-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowMilestoneModal(false)}
                    className="px-4 py-2 rounded-lg border text-zinc-700 dark:text-zinc-300 dark:border-zinc-700"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-primary text-primary-foreground"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showEditModal && editMilestone && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 border dark:border-zinc-800">
              <h3 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-zinc-100">
                Edit Milestone
              </h3>

              <form
                action={updateMilestone.bind(null, editMilestone.id, projectId)}
                onSubmit={() => {
                  setShowEditModal(false);
                  router.refresh();
                  toast.success("Milestone Berhasil Diperbarui");
                }}
                className="space-y-3"
              >
                <input
                  name="name"
                  defaultValue={editMilestone.title}
                  className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Deskripsi
                  </p>

                  <textarea
                    name="description"
                    defaultValue={editMilestone.description || ""}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm
                dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-100"
                  />
                </div>

                <input
                  type="date"
                  name="dueDate"
                  defaultValue={editMilestone.deadline?.slice(0, 10) || ""}
                  className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
                />

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="text-zinc-600 dark:text-zinc-400"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-sm p-6 space-y-4 border dark:border-zinc-800">
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                Hapus Milestone
              </h3>

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Yakin ingin menghapus milestone ini?
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Batal
                </button>

                <form
                  action={deleteMilestone.bind(null, deleteTarget, projectId)}
                  onSubmit={() => {
                    setDeleteTarget(null);
                    router.refresh();
                    toast.success("Milestone berhasil dihapus");
                  }}
                >
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        {showTaskEdit && editTask && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 space-y-3 border dark:border-zinc-800">
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                Edit Task
              </h3>

              <input
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
                className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
              />

              <textarea
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
                className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
              />

              <select
                value={editTask.priority}
                onChange={(e) =>
                  setEditTask({ ...editTask, priority: e.target.value })
                }
                className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="rendah">Rendah</option>
                <option value="sedang">Sedang</option>
                <option value="tinggi">Tinggi</option>
              </select>
              <select
                value={editTask.assignee || ""}
                onChange={(e) =>
                  setEditTask({ ...editTask, assignee: e.target.value })
                }
                className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
              >
                <option value="" disabled>
                  Pilih Tim Pengembang
                </option>

                {teamMembers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.userId.name} — {m.division}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowTaskEdit(false)}
                  className="text-zinc-600 dark:text-zinc-400"
                >
                  Batal
                </button>

                <button
                  onClick={async () => {
                    await fetch("/api/tasks", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: editTask.id,
                        title: editTask.title,
                        description: editTask.description,
                        assignee: editTask.assignee || null,
                        priority: editTask.priority,
                      }),
                    });

                    setShowTaskEdit(false);
                    toast.success("Task berhasil diperbarui");
                    fetchTasks();
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteTaskModal && taskToDelete && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-sm p-6 space-y-4 border dark:border-zinc-800">
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                Hapus Task
              </h3>

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Apakah kamu yakin ingin menghapus task ini?
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowDeleteTaskModal(false);
                    setTaskToDelete(null);
                  }}
                  className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Batal
                </button>

                <button
                  onClick={async () => {
                    await fetch("/api/tasks", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: taskToDelete }),
                    });

                    setShowDeleteTaskModal(false);
                    setTaskToDelete(null);
                    toast.success("Task berhasil dihapus");
                    fetchTasks();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
