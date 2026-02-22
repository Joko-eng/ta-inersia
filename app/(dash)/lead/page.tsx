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
    <div className="flex flex-col h-full p-8 gap-4 overflow-hidden">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Lead Generation
        </h1>
        <p className="text-base text-gray-400 dark:text-gray-500 mt-0.5">
          Scraping data bisnis secara otomatis dari Google Maps.
        </p>
      </div>
      <Suspense fallback={<LeadTableSkeleton />}>
        <LeadTableServer />
      </Suspense>
    </div>
  );
}