"use client";

import { COLUMNS, Milestone } from "@/types/IMilestone";
import { Task } from "@/types/ITask";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
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
}: KanbanBoardProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                      onAddTask(col.id as "todo" | "inprogress" | "done")
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
