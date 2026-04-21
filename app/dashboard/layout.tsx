import { AppNavbar } from "@/components/layout/navbar";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !session.user) redirect("/login");

  const role = (session.user as any).role as "admin" | "project_manager";
  const name = session.user.name ?? "";

  await connectDB();

  const projects = await Project.find().select("_id name").lean();

  const mappedProjects = projects.map((p: any) => ({
    id: p._id.toString(),
    name: p.name,
  }));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role={role} projects={mappedProjects} />

        <div className="flex-1 flex flex-col">
          <AppNavbar name={name} role={role} />

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
