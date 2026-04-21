import { Suspense } from "react";
import { getLeads } from "./leadAction";
import LeadTable from "./components/leadTable";
import LeadTableSkeleton from "./components/leadTableSkeleton";

async function LeadTableServer() {
  const leads = await getLeads();
  return <LeadTable initialLeads={leads} />;
}

export default function LeadGenerationPage() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-[#F5F5F3] dark:bg-[#111111]">
      <div className="shrink-0 flex items-end justify-between px-5 sm:px-8 lg:px-10 pt-6 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-600 mb-1.5">
            Manajemen Data
          </p>
          <h1 className="text-xl sm:text-2xl font-light text-zinc-900 dark:text-white tracking-tight leading-none">
            Lead Generation
          </h1>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden px-5 sm:px-8 lg:px-10 py-5">
        <Suspense fallback={<LeadTableSkeleton />}>
          <LeadTableServer />
        </Suspense>
      </div>
    </div>
  );
}