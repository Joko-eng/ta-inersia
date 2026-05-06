import { Suspense } from "react";
import LeadTable from "./components/leadTable";
import LeadTableSkeleton from "./components/leadTableSkeleton";
import { getLeads } from "./leadAction";

async function LeadTableServer() {
  const leads = await getLeads();
  return <LeadTable initialLeads={leads} />;
}

export default function LeadGenerationPage() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-white dark:bg-zinc-900">
      <div className="shrink-0 flex items-end justify-between px-5 sm:px-8 lg:px-10 pt-5 border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Manajemen Data
          </p>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">
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
