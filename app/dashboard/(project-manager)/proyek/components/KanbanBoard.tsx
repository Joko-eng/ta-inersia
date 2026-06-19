"use client";

import { COLUMNS, Milestone } from "@/types/IMilestone";
import { Task } from "@/types/ITask";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";
import TaskCard from "./TaskCard";

interface KanbanBoardProps {
  tasks: Task[];
  milestones: Milestone[];
  openMenuId: string | null;
  onToggleMenu: (id: string | null) => void;
  onAddTask: (status: "todo" | "inprogress" | "done") => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDragEnd: (result: DropResult) => void;
  maxTasks?: number;
}

// Aturan transisi status yang TIDAK diperbolehkan.
// harus melewati "inprogress" terlebih dahulu.
const FORBIDDEN_TRANSITIONS: Record<string, string[]> = {
  todo: ["done"],
};

function isTransitionAllowed(from: string, to: string) {
  if (from === to) return true;
  const blocked = FORBIDDEN_TRANSITIONS[from];
  if (!blocked) return true;
  return !blocked.includes(to);
}

export default function KanbanBoard({
  tasks,
  milestones,
  openMenuId,
  onToggleMenu,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragEnd,
  maxTasks = 12,
}: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Drop di luar area droppable, biarkan parent yang menangani (no-op).
    if (!destination) {
      onDragEnd(result);
      return;
    }

    const from = source.droppableId;
    const to = destination.droppableId;

    if (!isTransitionAllowed(from, to)) {
      // Tolak perpindahan: jangan teruskan ke parent, card akan kembali
      // ke posisi semula karena state tidak berubah.
      toast.error(
        'Task harus melalui status "In Progress" sebelum bisa ditandai "Done".',
      );
      return;
    }

    onDragEnd(result);
  };

  const handleAddTask = (status: "todo" | "inprogress" | "done") => {
    if (tasks.length >= maxTasks) {
      toast.error(`Proyek ini sudah mencapai batas maksimal ${maxTasks} task.`);
      return;
    }
    onAddTask(status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto items-start pb-4">
        {COLUMNS.map((col) => (
          <Droppable key={col.id} droppableId={col.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-w-[300px] max-h-[520px] overflow-y-auto bg-slate-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col border border-transparent dark:border-zinc-800 scrollbar-hide"
              >
                <div
                  className={`${col.color} dark:opacity-90 text-white rounded-full px-4 py-2 mb-4 flex justify-between items-center shrink-0 sticky top-0 z-10`}
                >
                  <span className="font-medium">
                    {tasks.filter((t) => t.status === col.id).length}{" "}
                    {col.title}
                  </span>
                  <button
                    onClick={() =>
                      handleAddTask(col.id as "todo" | "inprogress" | "done")
                    }
                  >
                    +
                  </button>
                </div>

                <div className="space-y-3 pr-1">
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
                          >
                            <TaskCard
                              task={task}
                              milestones={milestones}
                              openMenuId={openMenuId}
                              onToggleMenu={onToggleMenu}
                              onEdit={onEditTask}
                              onDelete={(id) => onDeleteTask(id)}
                            />
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
  );
}
