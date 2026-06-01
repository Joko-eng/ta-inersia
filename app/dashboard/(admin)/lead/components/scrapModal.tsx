"use client";

import { ModalOverlay } from "@/components/ui/props";
import { useCallback, useEffect, useRef, useState } from "react";

type LogType = "info" | "success" | "error" | "loading";
type Phase = "idle" | "scraping" | "ml" | "done";

interface LogEntry {
  id: number;
  type: LogType;
  time: string;
  message: string;
}

interface ScrapingModalProps {
  onClose: () => void;
  onScrapingDone?: () => void;
}

const LOG_DOT: Record<LogType, string> = {
  success: "bg-emerald-400",
  error: "bg-rose-400",
  loading: "bg-blue-400 animate-pulse",
  info: "bg-zinc-500 dark:bg-zinc-600",
};

const LOG_TEXT: Record<LogType, string> = {
  success: "text-emerald-400",
  error: "text-rose-400",
  loading: "text-blue-400",
  info: "text-zinc-400",
};

const INPUT_CLS =
  "w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-40 disabled:cursor-not-allowed";

const LABEL_CLS =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5";

const SHIMMER_STYLE_BLUE: React.CSSProperties = {
  animation: "shimmer 1.4s ease-in-out infinite",
  background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%)",
  backgroundSize: "200% 100%",
};

const SHIMMER_STYLE_PURPLE: React.CSSProperties = {
  background: "linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #a855f7 100%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.6s ease-in-out infinite",
};

let _logId = 0;

function makeEntry(type: LogType, message: string): LogEntry {
  return {
    id: ++_logId,
    type,
    time: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    message,
  };
}

function formatElapsed(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

export default function ScrapingModal({
  onClose,
  onScrapingDone,
}: ScrapingModalProps) {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [dataCount, setDataCount] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scrapedCount, setScrapedCount] = useState(0);
  const [targetCount, setTargetCount] = useState<number | null>(null);
  const [mlElapsed, setMlElapsed] = useState(0);

  const logContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mlTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearMlTimer = useCallback(() => {
    if (mlTimerRef.current) {
      clearInterval(mlTimerRef.current);
      mlTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearMlTimer, [clearMlTimer]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop =
          logContainerRef.current.scrollHeight;
      }
    });
  }, []);

  const appendLog = useCallback(
    (type: LogType, message: string) => {
      setLogs((prev) => [...prev, makeEntry(type, message)]);
      if (type === "success") setScrapedCount((n) => n + 1);
      scrollToBottom();
    },
    [scrollToBottom],
  );

  const runMLClassification = useCallback(async () => {
    setPhase("ml");
    setMlElapsed(0);
    mlTimerRef.current = setInterval(() => setMlElapsed((s) => s + 1), 1000);
    appendLog("info", "Memulai klasifikasi Machine Learning...");

    try {
      const res = await fetch("/api/ml", { method: "POST" });
      const data = await res.json();

      if (!res.ok || data.error) {
        appendLog("error", `Klasifikasi gagal: ${data.error ?? res.status}`);
        return;
      }

      appendLog(
        "success",
        `Klasifikasi selesai — ${data.prospek} Prospek, ${data.belum_prospek} Belum Prospek`,
      );
      appendLog("info", "Data siap ditampilkan di tabel.");
      onScrapingDone?.();
    } catch (err) {
      appendLog("error", `Gagal menghubungi API ML: ${String(err)}`);
    } finally {
      clearMlTimer();
      setPhase("done");
      setIsDone(true);
    }
  }, [appendLog, onScrapingDone, clearMlTimer]);

  const handleScrape = useCallback(async () => {
    const trimmedLocation = location.trim();
    const trimmedCategory = category.trim();
    if (!trimmedLocation || !trimmedCategory) return;

    const parsedCount = dataCount ? Math.max(1, parseInt(dataCount)) : null;

    setIsRunning(true);
    setIsDone(false);
    setLogs([]);
    setPhase("scraping");
    setScrapedCount(0);
    setTargetCount(parsedCount);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/scraping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lokasi: trimmedLocation,
          kategori: trimmedCategory,
          jumlahData: parsedCount,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        appendLog("error", `Server error: ${response.status}`);
        setIsDone(true);
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
            if (json.type !== "connected" && json.type !== "ping") {
              appendLog(json.type as LogType, json.message);
            }
          } catch {}
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
  }, [location, category, dataCount, appendLog, runMLClassification]);

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    clearMlTimer();
    onClose();
  }, [onClose, clearMlTimer]);

  const scrapePercent = (() => {
    if (phase === "done") return 100;
    if (phase !== "scraping" || targetCount === null || targetCount === 0)
      return null;
    return Math.min(95, Math.round((scrapedCount / targetCount) * 100));
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>

      <ModalOverlay onClick={!isRunning ? handleClose : undefined} />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-2 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Scraping Data Baru
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Scraping dan klasifikasi Random Forest secara otomatis
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isRunning}
            className="shrink-0 mt-0.5 h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
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
              <span className="ml-1.5 text-sm font-normal text-zinc-400 dark:text-zinc-600">
                opsional
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
              className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
            >
              Selesai, Tutup
            </button>
          ) : (
            <button
              onClick={handleScrape}
              disabled={isRunning || !location.trim() || !category.trim()}
              className="w-full h-10 rounded-lg bg-primary hover:bg-blue-700 dark:bg-white dark:text-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
            >
              {isRunning ? "Memproses..." : "Mulai Scraping"}
            </button>
          )}
        </div>

        {phase !== "idle" && (
          <div className="px-6 pb-2 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Scraping
                </span>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {targetCount !== null
                    ? `${scrapedCount} / ${targetCount}`
                    : `${scrapedCount} data`}
                  {phase === "done" && (
                    <span className="ml-1.5 text-emerald-500">✓</span>
                  )}
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                {scrapePercent !== null ? (
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${phase === "done" ? 100 : scrapePercent}%`,
                    }}
                  />
                ) : (
                  <div
                    className={`h-full rounded-full ${phase === "done" ? "bg-emerald-500 w-full" : "w-1/3"}`}
                    style={
                      phase === "scraping" ? SHIMMER_STYLE_BLUE : undefined
                    }
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Klasifikasi ML
                </span>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {phase === "ml" && (
                    <span className="text-blue-400">
                      {formatElapsed(mlElapsed)}
                    </span>
                  )}
                  {phase === "done" && (
                    <span className="text-emerald-500">✓ Selesai</span>
                  )}
                  {phase === "scraping" && (
                    <span className="text-zinc-400">Menunggu...</span>
                  )}
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                {phase === "scraping" ? (
                  <div className="h-full w-0 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                ) : phase === "ml" ? (
                  <div
                    className="h-full w-full rounded-full"
                    style={SHIMMER_STYLE_PURPLE}
                  />
                ) : (
                  <div className="h-full w-full bg-emerald-500 rounded-full transition-all duration-700" />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="px-6 pb-6 flex flex-col gap-2">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Log Aktivitas
          </p>
          <div
            ref={logContainerRef}
            className="h-36 bg-zinc-950 dark:bg-black rounded-xl p-3 overflow-y-auto flex flex-col gap-0.5 border border-zinc-800"
          >
            {logs.length === 0 ? (
              <p className="text-xs text-zinc-600">
                Menunggu scraping dimulai...
              </p>
            ) : (
              logs.map((entry) => (
                <div key={entry.id} className="flex items-start gap-2">
                  <div
                    className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${LOG_DOT[entry.type]}`}
                  />
                  <span className="text-[10px] text-zinc-600 shrink-0 tabular-nums font-mono w-16">
                    {entry.time}
                  </span>
                  <span
                    className={`text-xs leading-relaxed ${LOG_TEXT[entry.type]}`}
                  >
                    {entry.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
