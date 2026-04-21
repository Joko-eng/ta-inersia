"use client";

import { Plus, Trash, X } from "lucide-react";
import { useState } from "react";
import { addMember, deleteMember } from "./actions";

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
      setErrors({ general: ["Semua field wajib diisi"] });
      return false;
    }
    return true;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Tim Pengembang</h1>
          <p className="text-sm text-zinc-500">
            Ini adalah tim pengembang kami
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-primary dark:bg-black/6 0 text-white dark:text-white dark:ring dark:ring-gray-500 px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} /> Tim Pengembang
        </button>
      </div>

      <div className="bg-white rounded-xl border dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className=" dark:bg-zinc-900 grid grid-cols-5 px-6 py-3 bg-gray-50 text-sm font-medium">
          <div>Nama</div>
          <div>Email</div>
          <div>Username</div>
          <div>Role</div>
          <div>Aksi</div>
        </div>

        {members.map((m: any) => (
          <div
            key={m._id}
            className="grid grid-cols-5 px-6 py-4 text-sm border-t items-center"
          >
            <div>{m.userId.name}</div>
            <div>{m.userId.email}</div>
            <div>{m.userId.username}</div>

            <div>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs ${badge(m.division)}`}
              >
                {m.division}
              </span>
            </div>

            <div>
              <button
                onClick={() => setDeleteTarget(m._id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-sm p-6 space-y-4 border dark:border-zinc-800">
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
              Hapus Tim Pengembang
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Yakin ingin menghapus Tim Pengembang ?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                Batal
              </button>
              <form
                action={async () => {
                  await deleteMember(deleteTarget);
                  setMembers((prev: any[]) =>
                    prev.filter((x) => x._id !== deleteTarget),
                  );
                  setDeleteTarget(null);
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                >
                  Hapus
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setErrors({});
                setOpen(false);
              }}
              className="absolute right-4 top-4 text-zinc-400"
            >
              <X size={18} />
            </button>

            <h3 className="font-semibold text-lg mb-1">
              Tambah Tim Pengembang
            </h3>

            <p className="text-sm text-zinc-500 mb-4">
              Tambahkan tim pengembang untuk melakukan pekerjaan proyek
            </p>

            {errors.general && (
              <p className="text-sm text-red-500 mb-2">{errors.general[0]}</p>
            )}

            <div className="space-y-3">
              <div>
                <input
                  placeholder="Nama"
                  className="w-full border rounded px-3 py-2"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors?.name && (
                  <p className="text-xs text-red-500">{errors.name[0]}</p>
                )}
              </div>

              <div>
                <input
                  placeholder="Email"
                  className="w-full border rounded px-3 py-2"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors?.email && (
                  <p className="text-xs text-red-500">{errors.email[0]}</p>
                )}
              </div>

              <div>
                <input
                  placeholder="Username"
                  className="w-full border rounded px-3 py-2"
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
                {errors?.username && (
                  <p className="text-xs text-red-500">{errors.username[0]}</p>
                )}
              </div>

              <div>
                <select
                  className="w-full border rounded px-3 py-2"
                  onChange={(e) =>
                    setForm({ ...form, division: e.target.value })
                  }
                >
                  <option value="">Pilih Role</option>
                  <option>Front End</option>
                  <option>Back End</option>
                  <option>QA</option>
                  <option>UI/UX</option>
                </select>

                {errors?.division && (
                  <p className="text-xs text-red-500">{errors.division[0]}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setErrors({});
                  setOpen(false);
                }}
                className="px-4 py-2 text-sm border rounded"
              >
                Batal
              </button>

              <button
                onClick={async () => {
                  setErrors({});

                  if (!validateClient()) return;

                  const result = await addMember(form);

                  if (result?.error) {
                    setErrors(result.error);
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

                  setOpen(false);

                  setForm({
                    name: "",
                    email: "",
                    username: "",
                    division: "",
                  });
                }}
                className="px-4 py-2 bg-primary dark:bg-black/70 text-white rounded text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
