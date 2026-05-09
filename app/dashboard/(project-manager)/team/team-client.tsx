"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { useClickOutside } from "@/components/ui/props";

import { addMember, deleteMember } from "./actions";

import MemberActionButtons from "./components/actionButton";
import AddMemberModal from "./components/addMember";
import DeleteMemberModal from "./components/deleteMember";

const PER_PAGE_OPTIONS = [5, 8, 10, 15];

function PerPageDropdown({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-9 px-3.5 flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
      >
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
          Tampilkan
        </span>

        <span className="font-semibold text-zinc-800 dark:text-zinc-100">
          {value}
        </span>

        <ChevronDown
          size={12}
          className={`text-zinc-400 dark:text-zinc-600 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-32 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden py-1">
          {PER_PAGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                opt === value
                  ? "font-semibold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamClient({ initialMembers }: any) {
  const [members, setMembers] = useState(initialMembers);

  const [open, setOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    division: "",
  });

  const [errors, setErrors] = useState<any>({});

  const [currentPage, setCurrentPage] = useState(1);

  const [perPage, setPerPage] = useState(5);

  const badge = (d: string) => {
    switch (d) {
      case "Front End":
        return "bg-blue-100 text-blue-700";

      case "Back End":
        return "bg-red-100 text-red-700";

      case "QA":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-purple-100 text-purple-700";
    }
  };

  const validateClient = () => {
    if (!form.name || !form.email || !form.username) {
      setErrors({
        general: ["Semua field wajib diisi"],
      });

      return false;
    }

    return true;
  };

  const totalPages = Math.max(1, Math.ceil(members.length / perPage));

  const paginatedMembers = members.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const goTo = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    }
  };

  const handlePerPageChange = (val: number) => {
    setPerPage(val);
    setCurrentPage(1);
  };

  const pageNumbers = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  })();

  return (
    <div className="p-8 space-y-4">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Tim Pengembang</h1>

          <p className="text-sm text-zinc-500">
            Ini adalah tim pengembang kami
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PerPageDropdown value={perPage} onChange={handlePerPageChange} />

            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {members.length} Total Tim
            </span>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus size={16} />
            Tim Pengembang
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 bg-gray-50 dark:bg-zinc-900 text-sm font-medium">
          <div>Nama</div>
          <div>Email</div>
          <div>Username</div>
          <div>Role</div>
          <div className="px-4">Aksi</div>
        </div>

        {paginatedMembers.length === 0 ? (
          <div className="py-20 text-center text-sm text-zinc-400">
            Belum ada anggota tim
          </div>
        ) : (
          paginatedMembers.map((m: any) => (
            <div
              key={m._id}
              className="grid grid-cols-5 px-6 py-4 text-sm border-t items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <div>{m.userId.name}</div>

              <div>{m.userId.email}</div>

              <div>{m.userId.username}</div>

              <div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs ${badge(
                    m.division,
                  )}`}
                >
                  {m.division}
                </span>
              </div>

              <div className="flex items-center">
                <MemberActionButtons
                  compact
                  onEdit={() => {
                    toast.info("Fitur edit belum tersedia");
                  }}
                  onDelete={() => setDeleteTarget(m._id)}
                />
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-white dark:bg-zinc-900">
          <span className="text-sm text-zinc-500 dark:text-zinc-500">
            {members.length === 0
              ? "Tidak ada data"
              : `${(currentPage - 1) * perPage + 1}–${Math.min(
                  currentPage * perPage,
                  members.length,
                )} dari ${members.length}`}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => goTo(page)}
                className={`h-8 min-w-[32px] px-2 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-primary text-white dark:bg-white dark:text-black border-transparent"
                    : "border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteMemberModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;

          await deleteMember(deleteTarget);

          setMembers((prev: any[]) =>
            prev.filter((x) => x._id !== deleteTarget),
          );

          toast.success("Tim berhasil dihapus");

          setDeleteTarget(null);
        }}
      />

      {/* Add Modal */}
      <AddMemberModal
        open={open}
        onClose={() => {
          setErrors({});
          setOpen(false);
        }}
        form={form}
        setForm={setForm}
        errors={errors}
        onSubmit={async () => {
          setErrors({});

          if (!validateClient()) return;

          const result = await addMember(form);

          if (result?.error) {
            setErrors(result.error);

            toast.error("Gagal menambahkan tim");

            return;
          }

          setMembers((prev: any[]) => [
            ...prev,
            {
              _id: Date.now(),
              division: form.division,
              userId: {
                name: form.name,
                email: form.email,
                username: form.username,
              },
            },
          ]);

          toast.success("Tim berhasil ditambahkan");

          setOpen(false);

          setForm({
            name: "",
            email: "",
            username: "",
            division: "",
          });
        }}
      />
    </div>
  );
}
