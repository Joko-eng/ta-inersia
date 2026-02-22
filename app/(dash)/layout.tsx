import { AppNavbar } from "@/components/layout/navbar";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();

  const projects = await Project.find().select("_id name").lean();

  const mappedProjects = projects.map((p: any) => ({
    id: p._id.toString(),
    name: p.name,
  }));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role="admin" projects={mappedProjects} />

        <div className="flex-1 flex flex-col">
          <AppNavbar name="Dimas Dani" role="admin" />

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
