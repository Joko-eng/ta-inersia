import DeadlinePopup from "@/components/deadline-popup";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getDeadlines } from "@/lib/getDeadlines";
import { NavbarUserMenu } from "./navbar-user";

interface AppNavbarProps {
  name: string;
  role: "admin" | "project_manager" | "member";
}

export async function AppNavbar({ name, role }: AppNavbarProps) {
  const deadlines = await getDeadlines();
  return (
    <header className="w-full flex h-16 items-center border-b bg-background px-6">
      <SidebarTrigger className="mr-4" />
      <div className="flex-1 max-w-lg">
        <Input placeholder="Search..." />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <DeadlinePopup initialItems={deadlines} />
        <NavbarUserMenu name={name} role={role} />
      </div>
    </header>
  );
}
