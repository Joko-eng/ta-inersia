"use client";

import { useState, useRef, useCallback } from "react";
import axios from "axios";

type LogType = "info" | "success" | "error" | "loading";

interface ScrapingModalProps {
  onClose: () => void;
  onScrapingDone?: () => void;
}

const LOG_DOT: Record<LogType, string> = {
  success: "bg-emerald-400",
  error:   "bg-rose-400",
  loading: "bg-blue-400 animate-pulse",
  info:    "bg-zinc-500 dark:bg-zinc-600",
};

const LOG_TEXT: Record<LogType, string> = {
  success: "text-emerald-400",
  error:   "text-rose-400",
  loading: "text-blue-400",
  info:    "text-zinc-400",
};

const INPUT_CLS =
  "w-full h-9 px-3 text-[13px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

const LABEL_CLS =
  "block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-600 mb-1.5";

export default function ScrapingModal({ onClose, onScrapingDone }: ScrapingModalProps) {
  const [location,  setLocation]  = useState("");
  const [category,  setCategory]  = useState("");
  const [dataCount, setDataCount] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isDone,    setIsDone]    = useState(false);

  const logRef   = useRef<HTMLDivElement>(null);
  const emptyRef = useRef<HTMLParagraphElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const appendLog = useCallback((type: LogType, message: string) => {
    const container = logRef.current;
    if (!container) return;

    if (emptyRef.current) emptyRef.current.style.display = "none";

    const time = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });

    const row = document.createElement("div");
    row.className = "flex items-start gap-2";
    row.innerHTML =
      `<div class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${LOG_DOT[type]}"></div>` +
      `<span class="text-[10px] text-zinc-600 shrink-0 tabular-nums font-mono w-16">${time}</span>` +
      `<span class="text-[11px] leading-relaxed ${LOG_TEXT[type]}">${message}</span>`;

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

      appendLog("success", `Klasifikasi selesai — ${data.prospek} Prospek, ${data.belum_prospek} Belum Prospek`);
      appendLog("info", "Data siap ditampilkan di tabel.");
      onScrapingDone?.();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.error ?? err.message)
        : String(err);
      appendLog("error", `Gagal menghubungi API ML: ${message}`);
    } finally {
      setIsDone(true);
    }
  }, [appendLog, onScrapingDone]);

  const handleScrape = useCallback(async () => {
    const trimmedLocation = location.trim();
    const trimmedCategory = category.trim();
    if (!trimmedLocation || !trimmedCategory) return;

    setIsRunning(true);
    setIsDone(false);
    clearLog();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/scraping", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          lokasi:     trimmedLocation,
          kategori:   trimmedCategory,
          jumlahData: dataCount ? parseInt(dataCount) : null,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        appendLog("error", `Server error: ${response.status}`);
        setIsDone(true);
        return;
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = "";

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIndex);
          buffer     = buffer.slice(newlineIndex + 1);

          if (!line.startsWith("data: ")) continue;

          try {
            const json = JSON.parse(line.slice(6)) as { type: string; message: string };

            if (json.type === "done") {
              await runMLClassification();
              break outer;
            }

            if (json.type !== "connected" && json.type !== "ping") {
              appendLog(json.type as LogType, json.message);
            }
          } catch { /* baris tidak valid, skip */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        appendLog("error", `Gagal terhubung ke server: ${String(err)}`);
        setIsDone(true);
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
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[3px]"
        onClick={!isRunning ? handleClose : undefined}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight">
              Scraping Data Baru
            </h2>
            <p className="text-[12px] text-zinc-400 dark:text-zinc-600 mt-0.5">
              Scraping dan klasifikasi Random Forest secara otomatis
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isRunning}
            className="ml-4 h-8 w-8 flex items-center justify-center rounded-lg text-[12px] text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            x
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className={LABEL_CLS}>Lokasi</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="contoh: Surabaya, Banyuwangi..."
              disabled={isRunning}
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Kategori atau Nama Bisnis</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="contoh: Restoran, Bengkel, Apotek..."
              disabled={isRunning}
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className={LABEL_CLS}>
              Jumlah Data
              <span className="ml-1.5 font-normal normal-case tracking-normal text-zinc-300 dark:text-zinc-700">
                — opsional
              </span>
            </label>
            <input
              type="number"
              value={dataCount}
              onChange={(e) => setDataCount(e.target.value)}
              min={1}
              placeholder="Kosongkan untuk ambil semua data"
              disabled={isRunning}
              className={INPUT_CLS}
            />
          </div>

          {isDone ? (
            <button
              onClick={handleClose}
              className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition-colors"
            >
              Selesai — Tutup
            </button>
          ) : (
            <button
              onClick={handleScrape}
              disabled={isRunning || !location.trim() || !category.trim()}
              className="w-full h-10 rounded-lg bg-zinc-900 dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-zinc-900 text-[13px] font-semibold transition-colors"
            >
              {isRunning ? "Memproses..." : "Mulai Scraping"}
            </button>
          )}
        </div>

        <div className="px-6 pb-5 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-600">
            Log Aktivitas
          </p>
          <div
            ref={logRef}
            className="h-36 bg-zinc-950 dark:bg-black rounded-xl p-3 overflow-y-auto flex flex-col gap-0.5 border border-zinc-800"
          >
            <p ref={emptyRef} className="text-[11px] text-zinc-600 font-light">
              Menunggu scraping dimulai...
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}