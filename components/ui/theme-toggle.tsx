"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex w-fit rounded-lg bg-muted p-0.5">
      <button
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition
          ${!isDark ? "bg-background shadow" : "text-muted-foreground"}
        `}
      >
        <Sun className="h-3.5 w-3.5" />
        Terang
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition
          ${isDark ? "bg-background shadow" : "text-muted-foreground"}
        `}
      >
        <Moon className="h-3.5 w-3.5" />
        Gelap
      </button>
    </div>
  );
}
