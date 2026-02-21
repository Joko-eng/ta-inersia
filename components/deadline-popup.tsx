"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function DeadlinePopup() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/deadlines")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const unreadCount = items.filter((i) => !readIds.includes(i._id)).length;

  function markAsRead(id: string) {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
    }
  }

  function clearNotifications() {
    setItems([]);
    setReadIds([]);
  }

  function daysLeft(date: string) {
    return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-zinc-100"
      >
        <Bell size={20} className="text-blue-500" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-semibold">Pemberitahuan</span>

            {items.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-red-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {items.length === 0 && (
            <p className="p-3 text-sm text-zinc-500">
              Tidak ada pemberitahuan.
            </p>
          )}

          {items.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-500 uppercase">
                Deadline Milestone
              </div>

              <div className="max-h-72 overflow-y-auto">
                {items.map((m) => {
                  const unread = !readIds.includes(m._id);

                  return (
                    <div
                      key={m._id}
                      onClick={() => markAsRead(m._id)}
                      className={`p-3 border-b cursor-pointer transition
              ${unread ? "bg-red-50" : "bg-white"}
              hover:bg-zinc-100`}
                    >
                      <p className="font-medium text-sm">{m.name}</p>

                      <p className="text-xs text-zinc-500">
                        {m.projectId?.name}
                      </p>

                      <p className="text-xs font-medium">
                        H-{daysLeft(m.dueDate)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
