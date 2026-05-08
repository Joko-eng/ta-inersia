"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { KanbanSquare } from "lucide-react";
import Image from "next/image";

export default function ProjectSidebar({
  projectName,
}: {
  projectName: string;
}) {
  return (
    <aside className="w-64 h-screen border-r bg-white dark:bg-zinc-950 flex flex-col">
      <div className="h-16 flex items-center gap-3 px-5 border-b">
        <Image
          src="/logo.png"
          alt="Logo"
          width={30}
          height={30}
          className="rounded"
        />
        <div>
          <p className="text-sm font-semibold leading-none">
            Inersia Dev <br /> Indonesia
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
          <KanbanSquare className="h-4 w-4" />
          <span className="text-sm">Proyek</span>
        </div>

        <h2 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
          {projectName}
        </h2>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Tampilan ini digunakan untuk memantau perkembangan tugas dalam proyek
        </p>
      </div>

      <div className="flex-1" />

      {/* tambahkan ini */}
      <div className="flex justify-center px-4 pb-2">
        <ThemeToggle />
      </div>

      <div className="p-4 text-xs text-zinc-400 border-t">
        © {new Date().getFullYear()} InersiaDev
      </div>
    </aside>
  );
}
