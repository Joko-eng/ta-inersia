"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface NavbarUserMenuProps {
  name: string;
  role: "admin" | "project_manager" | "member";
}

export function NavbarUserMenu({ name, role }: NavbarUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none cursor-pointer">
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="leading-tight text-sm">
          <p className="font-medium">{name}</p>
          <p className="text-muted-foreground capitalize">
            {role.replace("_", " ")}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
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
