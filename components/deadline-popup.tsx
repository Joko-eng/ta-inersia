"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

type MilestoneItem = {
  _id: string;
  name: string;
  dueDate: string;
  projectId?: {
    name: string;
  };
};

export default function DeadlinePopup({
  initialItems,
}: {
  initialItems: MilestoneItem[];
}) {
  const [open, setOpen] = useState(false);

  // Semua milestone dari server
  const [items] = useState<MilestoneItem[]>(initialItems);

  // ID notifikasi yang sudah dibaca
  const [readIds, setReadIds] = useState<string[]>([]);

  // Ambil data dari localStorage saat pertama kali render
  useEffect(() => {
    const saved = localStorage.getItem("readNotifications");

    if (saved) {
      try {
        setReadIds(JSON.parse(saved));
      } catch {
        localStorage.removeItem("readNotifications");
      }
    }
  }, []);

  // Simpan ke localStorage setiap readIds berubah
  useEffect(() => {
    localStorage.setItem("readNotifications", JSON.stringify(readIds));
  }, [readIds]);

  // Hanya tampilkan yang belum dibaca
  const visibleItems = items.filter((item) => !readIds.includes(item._id));

  const unreadCount = visibleItems.length;

  function markAsRead(id: string) {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
    }
  }

  function clearNotifications() {
    const allIds = items.map((item) => item._id);
    setReadIds((prev) => [...new Set([...prev, ...allIds])]);
  }

  function daysLeft(date: string) {
    return Math.ceil(
      (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <Bell size={20} className="text-blue-500 dark:text-white" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b dark:border-zinc-700">
            <span className="font-semibold dark:text-white">
              Pemberitahuan
            </span>

            {visibleItems.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-red-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {visibleItems.length === 0 ? (
            <p className="p-3 text-sm text-zinc-500">
              Tidak ada pemberitahuan.
            </p>
          ) : (
            <>
              <div className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-500 uppercase">
                Deadline Milestone
              </div>

              <div className="max-h-72 overflow-y-auto">
                {visibleItems.map((m) => (
                  <div
                    key={m._id}
                    onClick={() => markAsRead(m._id)}
                    className="p-3 border-b cursor-pointer bg-red-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    <p className="font-medium text-sm dark:text-white">
                      {m.name}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {m.projectId?.name}
                    </p>

                    <p className="text-xs font-medium text-red-500">
                      H-{daysLeft(m.dueDate)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}