import DeadlinePopup from "@/components/deadline-popup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getDeadlines } from "@/lib/getDeadlines";

interface AppNavbarProps {
  name: string;
  role: "admin" | "projectmanager" | "member";
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
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="leading-tight text-sm">
          <p className="font-medium">{name}</p>
          <p className="text-muted-foreground capitalize">{role}</p>
        </div>
      </div>
    </header>
  );
}
