"use client";

import {
  deleteAttachment,
  isImageUrl,
  uploadAttachment,
  validateAttachmentFile,
} from "@/lib/uploadAttachment";
import { Task } from "@/types/ITask";
import { TeamMember } from "@/types/ITeamMember";
import { Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";

interface TaskEditModalProps {
  task: Task & {
    assignee: string | null | { id: string; name: string; division: string };
    attachmentUrl?: string | null;
    attachmentPublicId?: string | null;
    link?: string | null;
  };
  teamMembers: TeamMember[];
  onChange: (updated: any) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function TaskEditModal({
  task,
  teamMembers,
  onChange,
  onClose,
  onSave,
}: TaskEditModalProps) {
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validationError = validateAttachmentFile(selected);
    if (validationError) {
      setFileError(validationError);
      e.target.value = "";
      return;
    }
    setFileError(null);

    try {
      setUploading(true);

      // Hapus attachment lama dari Cloudinary sebelum upload baru
      if (task.attachmentPublicId) {
        await deleteAttachment(task.attachmentPublicId);
      }

      const uploaded = await uploadAttachment(selected);
      onChange({
        ...task,
        attachmentUrl: uploaded.url,
        attachmentPublicId: uploaded.publicId,
      });
    } catch (err: unknown) {
      setFileError(
        err instanceof Error
          ? err.message
          : "Gagal mengupload bukti pengerjaan",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAttachment = async () => {
    if (task.attachmentPublicId) {
      await deleteAttachment(task.attachmentPublicId);
    }
    onChange({ ...task, attachmentUrl: null, attachmentPublicId: null });
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-lg p-6 space-y-3 border dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
          Edit Task
        </h3>

        <input
          value={task.title}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
          className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
        />

        <textarea
          value={task.description}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
          className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
        />

        <select
          value={task.priority}
          onChange={(e) => onChange({ ...task, priority: e.target.value })}
          className="w-full border dark:border-zinc-700 rounded px-3 py-2 dark:bg-zinc-950 dark:text-zinc-100"
        >
          <option value="rendah">Rendah</option>
          <option value="sedang">Sedang</option>
          <option value="tinggi">Tinggi</option>
        </select>

        <select
          value={
            typeof task.assignee === "object"
              ? (task.assignee?.id ?? "")
              : (task.assignee ?? "")
          }
          onChange={(e) => onChange({ ...task, assignee: e.target.value })}
          className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
        >
          <option value="" disabled>
            Pilih Tim Pengembang
          </option>
          {teamMembers.map((m) => (
            <option key={m._id} value={m._id}>
              {m.userId.name} — {m.division}
            </option>
          ))}
        </select>

        {/* Link referensi */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Link (opsional)
          </p>
          <input
            value={task.link || ""}
            placeholder="https://..."
            onChange={(e) => onChange({ ...task, link: e.target.value })}
            className="w-full border rounded px-3 py-2 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Bukti pengerjaan (gambar/dokumen) */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Bukti Pengerjaan (opsional)
          </p>

          {task.attachmentUrl ? (
            isImageUrl(task.attachmentUrl) ? (
              <div className="relative">
                <a
                  href={task.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={task.attachmentUrl}
                    alt="bukti pengerjaan"
                    className="w-full h-64 object-cover rounded-lg border dark:border-zinc-700"
                  />
                </a>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  disabled={uploading}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between border rounded px-3 py-2 dark:border-zinc-700">
                <a
                  href={task.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 min-w-0"
                >
                  <Paperclip size={16} className="shrink-0" />
                  <span className="text-xs text-blue-600 dark:text-blue-400 truncate underline">
                    Lihat file
                  </span>
                </a>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  disabled={uploading}
                  className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            )
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 border border-dashed rounded px-3 py-3 text-sm text-zinc-500 dark:text-zinc-400 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              <Paperclip size={14} />
              {uploading
                ? "Mengupload..."
                : "Pilih gambar atau dokumen (JPG, PNG, WEBP, PDF — maks 5MB)"}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {fileError && (
            <p className="text-xs text-red-500 mt-1">{fileError}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="text-zinc-600 dark:text-zinc-400"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={uploading}
            className="px-4 py-2 bg-primary dark:bg-white text-primary-foreground rounded disabled:opacity-50"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
