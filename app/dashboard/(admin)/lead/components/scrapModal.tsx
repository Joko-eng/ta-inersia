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

// SVG border progress — mengelilingi kotak log
// rect: w=100%, h=144px (h-36), rx=12 (rounded-xl)
// perimeter ≈ 2*(width+height), kita pakai nilai relatif via viewBox
function LogBorderProgress({ percent }: { percent: number | null }) {
  // Ukuran kotak log dalam px (sesuai className h-36 = 144px, lebar container dikurangi padding px-6*2 = 24*2)
  // Gunakan SVG dengan preserveAspectRatio agar responsif
  const W = 100; // viewBox units (%)
  const H = 40;  // proporsi tinggi relatif terhadap lebar
  const R = 3.2; // border-radius relatif
  const stroke = 1.8;
  const pad = stroke / 2;

  const w = W - pad * 2;
  const h = H - pad * 2;
  const r = R;

  // Perimeter kotak rounded-rect (approx, corner arc = 2πr/4 per sudut)
  const perimeter = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;

  const isDeterminate = percent !== null;
  const filled = isDeterminate ? (percent / 100) * perimeter : 0;
  const isDone = percent === 100;

  const strokeColor = isDone
    ? "#10b981" // emerald-500
    : "#3b82f6"; // blue-500

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ borderRadius: "0.75rem", overflow: "visible" }}
    >
      {/* Track */}
      <rect
        x={pad} y={pad} width={w} height={h} rx={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-zinc-800"
      />
      {/* Progress */}
      {isDeterminate ? (
        <rect
          x={pad} y={pad} width={w} height={h} rx={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeDasharray={`${filled} ${perimeter}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          style={{
            transformOrigin: "center",
            transform: `rotate(-90deg) scaleX(-1)`,
            transition: "stroke-dasharray 0.5s ease-out, stroke 0.4s ease",
          }}
        />
      ) : (
        // Indeterminate — segmen pendek berputar
        <rect
          x={pad} y={pad} width={w} height={h} rx={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeDasharray={`${perimeter * 0.25} ${perimeter}`}
          strokeLinecap="round"
          style={{ animation: "borderSpin 1.6s linear infinite" }}
        />
      )}
    </svg>
  );
}

export default function ScrapingModal({ onClose, onScrapingDone }: ScrapingModalProps) {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [dataCount, setDataCount] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scrapedCount, setScrapedCount] = useState(0);
  const [targetCount, setTargetCount] = useState<number | null>(null);

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
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
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
            const json = JSON.parse(line.slice(6)) as { type: string; message: string };
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

  // Progress global: scraping = 0–80%, ML = 80–100%, done = 100%
  const globalPercent = (() => {
    if (phase === "idle") return null;
    if (phase === "done") return 100;
    if (phase === "ml") return null; // indeterminate selama ML
    if (phase === "scraping") {
      if (targetCount === null || targetCount === 0) return null;
      return Math.min(78, Math.round((scrapedCount / targetCount) * 80));
    }
    return null;
  })();

  const phaseLabel = (() => {
    if (phase === "scraping") {
      if (targetCount !== null) return `Scraping ${scrapedCount} / ${targetCount}`;
      return `Scraping ${scrapedCount} data...`;
    }
    if (phase === "ml") return "Klasifikasi ML...";
    if (phase === "done") return "Selesai";
    return null;
  })();

  const percentDisplay = (() => {
    if (phase === "done") return "100%";
    if (globalPercent !== null) return `${globalPercent}%`;
    if (phase === "scraping" || phase === "ml") return "—";
    return null;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        @keyframes borderSpin {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -1000; }
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

        <div className="px-6 pb-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Log Aktivitas
            </p>
            {phase !== "idle" && (
              <div className="flex items-center gap-2">
                {phaseLabel && (
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {phaseLabel}
                  </span>
                )}
                {percentDisplay && (
                  <span
                    className={`text-xs font-mono font-semibold tabular-nums ${
                      phase === "done" ? "text-emerald-500" : "text-blue-400"
                    }`}
                  >
                    {percentDisplay}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <div
              ref={logContainerRef}
              className="h-36 bg-zinc-950 dark:bg-black rounded-xl p-3 overflow-y-auto flex flex-col gap-0.5"
            >
              {logs.length === 0 ? (
                <p className="text-xs text-zinc-600">Menunggu scraping dimulai...</p>
              ) : (
                logs.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-2">
                    <div className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${LOG_DOT[entry.type]}`} />
                    <span className="text-[10px] text-zinc-600 shrink-0 tabular-nums font-mono w-16">
                      {entry.time}
                    </span>
                    <span className={`text-xs leading-relaxed ${LOG_TEXT[entry.type]}`}>
                      {entry.message}
                    </span>
                  </div>
                ))
              )}
            </div>
            {phase !== "idle" && (
              <LogBorderProgress percent={globalPercent ?? (phase === "done" ? 100 : null)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}