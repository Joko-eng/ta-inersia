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
import Image from "next/image";

import { sidebarMenu } from "@/config/menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../ui/theme-toggle";

export function AppSidebar({
  role,
}: {
  role: "admin" | "projectmanager" | "member";
}) {
  const menus = sidebarMenu[role];

  return (
    <Sidebar>
      <SidebarContent>
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
              {menus.map((menu) => (
                <SidebarMenuItem key={menu.label}>
                  {"children" in menu && menu.children ? (
                    <>
                      <SidebarMenuButton>
                        <menu.icon className="h-10 w-10" />
                        <span>{menu.label}</span>
                        <ChevronDown className="ml-auto h-6 w-6" />
                      </SidebarMenuButton>

                      <div className="ml-7 mt-1 space-y-1">
                        {"children" in menu &&
                          menu.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block text-sm text-muted-foreground hover:text-foreground"
                            >
                              {child.label}
                            </Link>
                          ))}
                      </div>
                    </>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link href={"href" in menu ? menu.href : "#"}>
                        <menu.icon />
                        <span>{menu.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto px-4 pb-4">
        <ThemeToggle />
      </div>
    </Sidebar>
  );
}
