"use client";

import { Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    division: "Front End",
  });

  const load = async () => {
    const r = await fetch("/api/team");
    setMembers(await r.json());
  };

  useEffect(() => {
    load();
  }, []);

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
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} /> Tim Pengembang
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 bg-gray-50 text-sm font-medium">
          <div>Nama</div>
          <div>Email</div>
          <div>Username</div>
          <div>Role</div>
          <div>Aksi</div>
        </div>

        {members.map((m) => (
          <div
            key={m._id}
            className="grid grid-cols-5 px-6 py-4 text-sm border-t items-center"
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
            <div>
              <button
                onClick={async () => {
                  if (!confirm("Hapus member ini?")) return;

                  await fetch("/api/team", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: m._id }),
                  });

                  load();
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpen(false)}
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

            <div className="space-y-3">
              <input
                placeholder="Nama"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Email"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                placeholder="Username"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />

              <select
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setForm({ ...form, division: e.target.value })}
              >
                <option>Front End</option>
                <option>Back End</option>
                <option>QA</option>
                <option>UI/UX</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm border rounded"
              >
                Batal
              </button>

              <button
                onClick={async () => {
                  await fetch("/api/team", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                  });

                  setOpen(false);
                  setForm({
                    name: "",
                    email: "",
                    username: "",
                    division: "Front End",
                  });

                  load();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
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
