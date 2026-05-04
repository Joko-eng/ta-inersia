// "use client";

// import { useEffect, useState, useTransition } from "react";
// import { getProjects, createProject, getProspekLeads, archiveProject, restoreProject } from "./actions";

// interface ProjectData {
//   id:          string;
//   name:        string;
//   trackerCode: string;
//   isArchived:  boolean;
//   createdAt:   string;
//   leadNama:    string | null;
// }

// interface LeadOption {
//   id:     string;
//   nama:   string;
//   lokasi: string;
// }

// const inputCls =
//   "w-full h-9 px-3 text-[13px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors";

// const labelCls =
//   "block text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-600 mb-1.5";

// function AddProjectModal({
//   leads,
//   onClose,
//   onSaved,
// }: {
//   leads:   LeadOption[];
//   onClose: () => void;
//   onSaved: () => void;
// }) {
//   const [errors,    setErrors]    = useState<Record<string, string[]>>({});
//   const [isPending, startTransition] = useTransition();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);

//     startTransition(async () => {
//       const result = await createProject(formData);
//       if (result?.error) {
//         setErrors(result.error as Record<string, string[]>);
//       } else {
//         onSaved();
//         onClose();
//       }
//     });
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
//       <div
//         className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[3px]"
//         onClick={onClose}
//       />

//       <div className="relative w-full sm:max-w-sm bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
//         <div className="sm:hidden flex justify-center pt-3 pb-0">
//           <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
//         </div>

//         <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4 shrink-0">
//           <div>
//             <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight">Tambah Proyek</h2>
//             <p className="text-[12px] text-zinc-400 dark:text-zinc-600 mt-0.5">Isi detail proyek baru</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-[12px] text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
//           >
//             x
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
//           <div>
//             <label className={labelCls}>
//               Nama Proyek <span className="text-rose-400 ml-0.5 normal-case tracking-normal font-normal">*</span>
//             </label>
//             <input
//               name="name"
//               type="text"
//               placeholder="cth. Website Company Profile"
//               className={inputCls}
//             />
//             {errors.name && (
//               <p className="text-[11px] text-rose-500 mt-1.5">{errors.name[0]}</p>
//             )}
//           </div>

//           <div>
//             <label className={labelCls}>
//               Kode Tracker <span className="text-rose-400 ml-0.5 normal-case tracking-normal font-normal">*</span>
//             </label>
//             <input
//               name="trackerCode"
//               type="text"
//               placeholder="cth. WCP"
//               className={`${inputCls} font-mono uppercase`}
//             />
//             {errors.trackerCode && (
//               <p className="text-[11px] text-rose-500 mt-1.5">{errors.trackerCode[0]}</p>
//             )}
//           </div>

//           <div>
//             <label className={labelCls}>
//               Lead (Prospek)
//               <span className="ml-1.5 font-normal normal-case tracking-normal text-zinc-300 dark:text-zinc-700">— opsional</span>
//             </label>
//             {leads.length === 0 ? (
//               <div className={`${inputCls} flex items-center text-zinc-300 dark:text-zinc-700 italic`}>
//                 Tidak ada lead berstatus Prospek
//               </div>
//             ) : (
//               <select name="leadId" className={`${inputCls} cursor-pointer`}>
//                 <option value="">— Pilih Lead —</option>
//                 {leads.map((lead) => (
//                   <option key={lead.id} value={lead.id}>
//                     {lead.nama}{lead.lokasi ? ` · ${lead.lokasi}` : ""}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>

//           <div>
//             <label className={labelCls}>
//               Project Manager ID <span className="text-rose-400 ml-0.5 normal-case tracking-normal font-normal">*</span>
//             </label>
//             <input
//               name="projectManagerId"
//               type="text"
//               placeholder="MongoDB ObjectId"
//               className={`${inputCls} font-mono`}
//             />
//             {errors.projectManagerId && (
//               <p className="text-[11px] text-rose-500 mt-1.5">{errors.projectManagerId[0]}</p>
//             )}
//           </div>

//           <div className="flex gap-2 pt-1">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 h-10 rounded-lg text-[13px] font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               disabled={isPending}
//               className="flex-1 h-10 rounded-lg text-[13px] font-semibold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//             >
//               {isPending ? "Menyimpan..." : "Simpan"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default function ProjectPage() {
//   const [projects,       setProjects]       = useState<ProjectData[]>([]);
//   const [leads,          setLeads]          = useState<LeadOption[]>([]);
//   const [showAddModal,   setShowAddModal]   = useState(false);
//   const [loading,        setLoading]        = useState(true);

//   const fetchData = async () => {
//     setLoading(true);
//     const [projectData, leadData] = await Promise.all([
//       getProjects(),
//       getProspekLeads(),
//     ]);
//     setProjects(projectData);
//     setLeads(leadData);
//     setLoading(false);
//   };

//   useEffect(() => { fetchData(); }, []);

//   const handleArchive = async (id: string, isArchived: boolean) => {
//     if (isArchived) {
//       await restoreProject(id);
//     } else {
//       await archiveProject(id);
//     }
//     await fetchData();
//   };

//   return (
//     <div className="flex flex-col h-full min-h-0 overflow-hidden bg-[#F5F5F3] dark:bg-[#111111]">
//       {showAddModal && (
//         <AddProjectModal
//           leads={leads}
//           onClose={() => setShowAddModal(false)}
//           onSaved={fetchData}
//         />
//       )}

//       <div className="shrink-0 flex items-end justify-between px-5 sm:px-8 lg:px-10 pt-6 pb-5 border-b border-zinc-200 dark:border-zinc-800">
//         <div>
//           <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-600 mb-1.5">
//             Manajemen Data
//           </p>
//           <h1 className="text-xl sm:text-2xl font-light text-zinc-900 dark:text-white tracking-tight leading-none">
//             Proyek
//           </h1>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="h-9 px-5 text-[12px] font-semibold rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
//         >
//           Tambah Proyek
//         </button>
//       </div>

//       <div className="flex-1 min-h-0 flex flex-col overflow-hidden px-5 sm:px-8 lg:px-10 py-5">
//         {loading ? (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-[13px] text-zinc-400 dark:text-zinc-600">Memuat data...</p>
//           </div>
//         ) : (
//           <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
//             <div className="flex-1 min-h-0 overflow-auto">
//               <table className="border-collapse w-full" style={{ minWidth: "700px" }}>
//                 <thead className="sticky top-0 z-10">
//                   <tr className="bg-[#F5F5F3] dark:bg-zinc-800/80 border-b border-zinc-100 dark:border-zinc-800">
//                     {[
//                       { label: "No",           align: "text-center", w: "w-12"    },
//                       { label: "Nama Proyek",  align: "text-left",   w: ""        },
//                       { label: "Kode Tracker", align: "text-center", w: "w-32"    },
//                       { label: "Lead",         align: "text-left",   w: "w-40"    },
//                       { label: "Dibuat",       align: "text-center", w: "w-32"    },
//                       { label: "Status",       align: "text-center", w: "w-28"    },
//                       { label: "Aksi",         align: "text-center", w: "w-24"    },
//                     ].map(({ label, align, w }) => (
//                       <th
//                         key={label}
//                         className={`py-3 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600 ${align} ${w}`}
//                       >
//                         {label}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
//                   {projects.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="py-28 text-center">
//                         <p className="text-[14px] text-zinc-400 dark:text-zinc-600 font-light">Belum ada proyek</p>
//                         <p className="text-[12px] text-zinc-300 dark:text-zinc-700 mt-1.5">Klik Tambah Proyek untuk memulai</p>
//                       </td>
//                     </tr>
//                   ) : (
//                     projects.map((project, idx) => (
//                       <tr
//                         key={project.id}
//                         className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors duration-75"
//                       >
//                         <td className="py-4 px-4 text-center text-[12px] text-zinc-300 dark:text-zinc-700 tabular-nums">
//                           {idx + 1}
//                         </td>

//                         <td className="py-4 px-4">
//                           <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
//                             {project.name}
//                           </span>
//                         </td>

//                         <td className="py-4 px-4 text-center">
//                           <span className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-1 rounded">
//                             {project.trackerCode}
//                           </span>
//                         </td>

//                         <td className="py-4 px-4 text-[13px] text-zinc-500 dark:text-zinc-500">
//                           {project.leadNama ?? (
//                             <span className="text-zinc-200 dark:text-zinc-800">-</span>
//                           )}
//                         </td>

//                         <td className="py-4 px-4 text-center text-[12px] text-zinc-400 dark:text-zinc-600 tabular-nums">
//                           {new Date(project.createdAt).toLocaleDateString("id-ID", {
//                             day: "numeric", month: "short", year: "numeric",
//                           })}
//                         </td>

//                         <td className="py-4 px-4 text-center">
//                           {project.isArchived ? (
//                             <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800">
//                               Diarsipkan
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40">
//                               Aktif
//                             </span>
//                           )}
//                         </td>

//                         <td className="py-4 px-4">
//                           <div className="flex items-center justify-center">
//                             <button
//                               onClick={() => handleArchive(project.id, project.isArchived)}
//                               className="h-7 px-3 text-[11px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
//                             >
//                               {project.isArchived ? "Pulihkan" : "Arsipkan"}
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }