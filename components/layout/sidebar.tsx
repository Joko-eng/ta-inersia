"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { sidebarMenu } from "@/config/menu";

function SidebarCollapsibleMenu({ menu }: { menu: any }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={() => setOpen(!open)}>
        <menu.icon className="h-5 w-5" />
        <span>{menu.label}</span>
        <ChevronDown
          className={`ml-auto h-4 w-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </SidebarMenuButton>

      {open && (
        <div className="ml-7 mt-1 space-y-1">
          {menu.children.map((child: any) => (
            <Link
              key={child.href}
              href={child.href}
              className="block rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}

export function AppSidebar({
  role,
}: {
  role: "admin" | "projectmanager" | "member";
}) {
  const menus = sidebarMenu[role];

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col">
        <div className="flex items-center gap-3 px-4 py-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="leading-tight">
            <p className="font-semibold">Inersia Dev</p>
            <p className="text-sm text-muted-foreground">Indonesia</p>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>MAIN</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((menu: any) =>
                menu.children ? (
                  <SidebarCollapsibleMenu key={menu.label} menu={menu} />
                ) : (
                  <SidebarMenuItem key={menu.label}>
                    <SidebarMenuButton asChild>
                      <Link href={menu.href}>
                        <menu.icon className="h-5 w-5" />
                        <span>{menu.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 pb-4 flex justify-center">
          <ThemeToggle />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
