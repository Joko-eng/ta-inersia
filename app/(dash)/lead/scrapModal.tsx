"use client";

import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { X, MapPin, Tag, Hash, Play, Loader2 } from "lucide-react";

type LogType = "info" | "success" | "error" | "loading";

interface ScrapingModalProps {
  onClose: () => void;
  onScrapingDone?: () => void;
}

interface LogEntry {
  type: LogType;
  message: string;
}

const LOG_ICONS: Record<LogType, string> = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 mt-0.5 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  loading: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400 mt-0.5 shrink-0 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
  info: `<span class="w-[11px] h-[11px] mt-0.5 shrink-0 rounded-full bg-gray-400 inline-block"></span>`,
};

const LOG_COLORS: Record<LogType, string> = {
  success: "text-green-400",
  error: "text-red-400",
  loading: "text-blue-400",
  info: "text-gray-300",
};

export default function ScrapingModal({
  onClose,
  onScrapingDone,
}: ScrapingModalProps) {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [dataCount, setDataCount] = useState("10");
  const [isRunning, setIsRunning] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);
  const emptyRef = useRef<HTMLParagraphElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const appendLog = useCallback((type: LogType, message: string) => {
    const container = logRef.current;
    if (!container) return;

    if (emptyRef.current) emptyRef.current.style.display = "none";

    const time = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const row = document.createElement("div");
    row.className = "flex items-start gap-2";
    row.innerHTML =
      `${LOG_ICONS[type]}` +
      `<span class="text-gray-500 text-[10px] shrink-0 mt-0.5">${time}</span>` +
      `<span class="text-[11px] leading-relaxed ${LOG_COLORS[type]}">${message}</span>`;

    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  }, []);

  const clearLog = useCallback(() => {
    const container = logRef.current;
    if (!container) return;
    container.innerHTML = "";
    if (emptyRef.current) {
      container.appendChild(emptyRef.current);
      emptyRef.current.style.display = "";
    }
  }, []);

  const runMLClassification = useCallback(async () => {
    appendLog("info", "Memulai klasifikasi Machine Learning...");
    try {
      const { data, status } = await axios.post("/api/ml");

      if (status !== 200 || data.error) {
        appendLog("error", `Klasifikasi gagal: ${data.error ?? status}`);
        return;
      }

      appendLog(
        "success",
        `Klasifikasi selesai — ${data.prospek} Prospek, ${data.belum_prospek} Belum Prospek`,
      );
      appendLog("info", "Data siap ditampilkan di tabel.");
      onScrapingDone?.();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.error ?? err.message)
        : String(err);
      appendLog("error", `Gagal menghubungi API ML: ${message}`);
    }
  }, [appendLog, onScrapingDone]);

  const handleScrape = useCallback(async () => {
    const trimmedLocation = location.trim();
    const trimmedCategory = category.trim();
    if (!trimmedLocation || !trimmedCategory) return;

    setIsRunning(true);
    clearLog();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/scraping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lokasi: trimmedLocation,
          kategori: trimmedCategory,
          jumlahData: parseInt(dataCount) || 10,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        appendLog("error", `Server error: ${response.status}`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (!line.startsWith("data: ")) continue;

          try {
            const json = JSON.parse(line.slice(6)) as {
              type: string;
              message: string;
            };
            if (json.type === "done") {
              await runMLClassification();
              break outer;
            }
            appendLog(json.type as LogType, json.message);
          } catch {}
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        appendLog("error", `Gagal terhubung ke server: ${String(err)}`);
      }
    } finally {
      abortRef.current = null;
      setIsRunning(false);
    }
  }, [location, category, dataCount, appendLog, clearLog, runMLClassification]);

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    onClose();
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Scraping Data Baru
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Scraping → Klasifikasi Random Forest → Status otomatis
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <MapPin size={12} /> Lokasi
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="contoh: Banyuwangi, Surabaya..."
              disabled={isRunning}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Tag size={12} /> Kategori / Nama Bisnis
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="contoh: Restoran, Bengkel, Apotek..."
              disabled={isRunning}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Hash size={12} /> Jumlah Data
            </label>
            <input
              type="number"
              value={dataCount}
              onChange={(e) => setDataCount(e.target.value)}
              min={1}
              max={500}
              disabled={isRunning}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            />
          </div>

          <button
            onClick={handleScrape}
            disabled={isRunning || !location.trim() || !category.trim()}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors mt-1"
          >
            {isRunning ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Sedang
                Memproses...
              </>
            ) : (
              <>
                <Play size={13} /> Mulai Scraping
              </>
            )}
          </button>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Log Aktivitas
          </p>
          <div
            ref={logRef}
            className="h-40 bg-gray-950 dark:bg-black rounded-xl p-3 overflow-y-auto font-mono flex flex-col gap-1.5 border border-gray-800"
          >
            <p ref={emptyRef} className="text-xs text-gray-600 italic">
              Menunggu scraping dimulai...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
