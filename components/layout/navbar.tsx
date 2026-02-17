import DeadlinePopup from "@/components/deadline-popup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AppNavbarProps {
  name: string;
  role: "admin" | "projectmanager" | "member";
}

export function AppNavbar({ name, role }: AppNavbarProps) {
  return (
    <header className="w-full flex h-16 items-center border-b bg-background px-6">
      <SidebarTrigger className="mr-4" />
      <div className="flex-1 max-w-lg">
        <Input placeholder="Search..." />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <DeadlinePopup />
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
