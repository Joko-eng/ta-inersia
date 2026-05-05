"use client";

import { DropResult } from "@hello-pangea/dnd";
import { BarChart2Icon, KanbanSquare, Link, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Milestone } from "@/types/IMilestone";
import { Task } from "@/types/ITask";
import { TeamMember } from "@/types/ITeamMember";
import KanbanBoard from "../components/KanbanBoard";
import MilestoneModal from "../components/MilestoneCreate";
import MilestoneDeleteModal from "../components/MilestoneDelete";
import MilestoneEditModal from "../components/MilestoneEdit";
import MilestoneTable from "../components/MilestoneTable";
import TaskModal from "../components/TaskCreate";
import TaskDeleteModal from "../components/TaskDelete";
import TaskEditModal from "../components/TaskEdit";

export default function ProjectClient({
  projectId,
  initialMilestones,
  name,
}: {
  projectId: string;
  initialMilestones: Milestone[];
  name?: string;
}) {
  const router = useRouter();
  const milestones = initialMilestones;
  const [activeTab, setActiveTab] = useState<"milestone" | "tugas">(
    "milestone",
  );

  // Tasks & team
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Modal visibility
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskEdit, setShowTaskEdit] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);

  // Selected items
  const [editMilestone, setEditMilestone] = useState<Milestone | null>(null);
  const [editTask, setEditTask] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Kanban
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [targetStatus, setTargetStatus] = useState<
    "todo" | "inprogress" | "done"
  >("todo");
  const [showStatusSelect, setShowStatusSelect] = useState(false);

  const fetchTasks = async () => {
    const res = await fetch(`/api/tasks?projectId=${projectId}`);
    const data = await res.json();
    setTasks(data.tasks);
    setTeamMembers(data.team);
  };

  useEffect(() => {
    if (!projectId) return;
    fetchTasks();
  }, [projectId]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    let reorderedTasks: typeof tasks = [];
    setTasks((prev) => {
      const draggedTask = prev.find((t) => t.id === draggableId);
      if (!draggedTask) return prev;
      const remaining = prev.filter((t) => t.id !== draggableId);
      const destColTasks = remaining.filter((t) => t.status === newStatus);
      const otherTasks = remaining.filter((t) => t.status !== newStatus);
      const updatedDragged = { ...draggedTask, status: newStatus as any };
      destColTasks.splice(destination.index, 0, updatedDragged);
      reorderedTasks = [...otherTasks, ...destColTasks];
      return reorderedTasks;
    });

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: draggableId, status: newStatus }),
      });
      const updatedTask = await res.json();

      setTasks((prev) =>
        prev.map((task) =>
          task.id === draggableId
            ? {
                ...task,
                status: updatedTask.status,
                statusUpdatedAt: updatedTask.statusUpdatedAt,
              }
            : task,
        ),
      );

      await router.refresh();

      setTasks((prev) => {
        const orderMap = new Map(reorderedTasks.map((t, i) => [t.id, i]));
        return [...prev].sort((a, b) => {
          const aIndex = orderMap.get(a.id) ?? 999;
          const bIndex = orderMap.get(b.id) ?? 999;
          return aIndex - bIndex;
        });
      });

      toast.success("Status task diperbarui");
    } catch {
      toast.error("Gagal memperbarui status");
    }
  };

  const handleSaveEditTask = async () => {
    await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editTask.id,
        title: editTask.title,
        description: editTask.description,
        assignee:
          typeof editTask.assignee === "string"
            ? editTask.assignee || null
            : editTask.assignee?.id || null,
        priority: editTask.priority,
      }),
    });
    setShowTaskEdit(false);
    toast.success("Task berhasil diperbarui");
    fetchTasks();
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
              onClick={() => setActiveTab("tugas")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
                activeTab === "tugas"
                  ? "bg-background dark:bg-muted shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <KanbanSquare className="h-4 w-4" />
              Tugas
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (activeTab === "tugas") {
                  setTargetStatus("todo");
                  setShowStatusSelect(true);
                  setShowTaskModal(true);
                } else {
                  setShowMilestoneModal(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-white text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
            >
              <Plus className="h-4 w-4" />
              {activeTab === "tugas" ? "Tugas" : "Milestone"}
            </button>

            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/proyek-member/${projectId}/share`;
                navigator.clipboard
                  .writeText(shareUrl)
                  .then(() => toast.success("Link berhasil disalin!"));
              }}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Link className="h-4 w-4" />
              Salin Link
            </button>
          </div>
        </div>

        {activeTab === "milestone" && (
          <MilestoneTable
            milestones={milestones}
            onEdit={(m) => {
              setEditMilestone(m);
              setShowEditModal(true);
            }}
            onDelete={(id) => setDeleteTarget(id)}
          />
        )}

        {activeTab === "tugas" && (
          <KanbanBoard
            tasks={tasks}
            milestones={milestones}
            openMenuId={openMenuId}
            onToggleMenu={setOpenMenuId}
            onAddTask={(status) => {
              setTargetStatus(status);
              setShowTaskModal(true);
              setShowStatusSelect(false);
            }}
            onEditTask={(task) => {
              setEditTask({
                ...task,
                assignee:
                  typeof task.assignee === "object"
                    ? task.assignee?.id
                    : (task.assignee ?? null),
              });
              setShowTaskEdit(true);
            }}
            onDeleteTask={(id) => {
              setTaskToDelete(id);
              setShowDeleteTaskModal(true);
            }}
            onDragEnd={handleDragEnd}
          />
        )}

        {showMilestoneModal && (
          <MilestoneModal
            projectId={projectId}
            onClose={() => setShowMilestoneModal(false)}
            onSuccess={() => {
              setShowMilestoneModal(false);
              router.refresh();
              toast.success("Milestone berhasil ditambahkan");
            }}
          />
        )}

        {showEditModal && editMilestone && (
          <MilestoneEditModal
            milestone={editMilestone}
            projectId={projectId}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
              setShowEditModal(false);
              router.refresh();
              toast.success("Milestone berhasil diperbarui");
            }}
          />
        )}

        {deleteTarget && (
          <MilestoneDeleteModal
            milestoneId={deleteTarget}
            projectId={projectId}
            onClose={() => setDeleteTarget(null)}
            onSuccess={() => {
              setDeleteTarget(null);
              router.refresh();
              toast.success("Milestone berhasil dihapus");
            }}
            onError={(msg) => toast.error(msg)}
          />
        )}

        {showTaskModal && (
          <TaskModal
            milestones={milestones}
            teamMembers={teamMembers}
            defaultStatus={targetStatus}
            showStatusSelect={showStatusSelect}
            onClose={() => setShowTaskModal(false)}
            onSuccess={() => {
              setShowTaskModal(false);
              toast.success("Task berhasil ditambahkan");
              fetchTasks();
            }}
            onError={(msg) => toast.error(msg)}
          />
        )}

        {showTaskEdit && editTask && (
          <TaskEditModal
            task={editTask}
            teamMembers={teamMembers}
            onChange={setEditTask}
            onClose={() => setShowTaskEdit(false)}
            onSave={handleSaveEditTask}
          />
        )}

        {showDeleteTaskModal && taskToDelete && (
          <TaskDeleteModal
            taskId={taskToDelete}
            onClose={() => {
              setShowDeleteTaskModal(false);
              setTaskToDelete(null);
            }}
            onSuccess={() => {
              setShowDeleteTaskModal(false);
              setTaskToDelete(null);
              toast.success("Task berhasil dihapus");
              fetchTasks();
            }}
          />
        )}
      </div>
    </div>
  );
}
