import { AppNavbar } from "@/components/layout/navbar";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role="admin" />

        <div className="flex flex-1 flex-col w-full">
          <AppNavbar name="Dimas Dani" role="admin" />
          <main className="flex-1 w-full p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
