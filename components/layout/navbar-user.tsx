"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavbarUserMenuProps {
  name: string;
  role: "admin" | "project_manager" | "member";
}

export function NavbarUserMenu({ name, role }: NavbarUserMenuProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-5 outline-none cursor-pointer">
        <div className="flex items-center justify-center rounded-full bg-muted p-1">
          <CircleUser className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="leading-tight text-sm">
          <p className="font-medium">{name}</p>
          <p className="text-muted-foreground capitalize">
            {role.replace("_", " ")}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/profile")}
          className="gap-2 cursor-pointer"
        >
          <User size={16} />
          Profil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="gap-2 cursor-pointer text-red-500 focus:text-red-500"
        >
          <LogOut size={16} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
