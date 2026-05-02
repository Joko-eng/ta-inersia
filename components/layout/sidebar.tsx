"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

import { MenuItem, Project, Role, getSidebarMenu } from "@/lib/config/menu";

const ICON_SIZE = 20;
const ICON_STYLE = { width: ICON_SIZE, height: ICON_SIZE };

const isActive = (pathname: string, href?: string) =>
  Boolean(href && pathname === href);

function SidebarLink({ item }: { item: MenuItem }) {
  const pathname = usePathname();
  if (!item.href) return null;

  const active = isActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      className={`block rounded-md px-2 py-1 text-sm transition-colors ${
        active
          ? "bg-muted text-foreground font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {item.label}
    </Link>
  );
}

function SidebarNestedMenu({ menu }: { menu: MenuItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!menu.children) return;
    setOpen(menu.children.some((c) => pathname === c.href));
  }, [pathname, menu.children]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={() => setOpen((v) => !v)}>
        {menu.icon && <menu.icon style={ICON_STYLE} />}
        <span className="ml-2">{menu.label}</span>
        <ChevronDown
          className={`ml-auto h-4 w-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </SidebarMenuButton>

      {open && (
        <div className="ml-10 space-y-1">
          {menu.children?.map((child) => (
            <SidebarLink key={child.label} item={child} />
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}

function SidebarHeader() {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <Image
        src="/logo.png"
        alt="Logo"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div>
        <p className="font-semibold">Inersia Dev</p>
        <p className="text-sm text-muted-foreground">Indonesia</p>
      </div>
    </div>
  );
}

export function AppSidebar({ role }: { role: Role; projects?: Project[] }) {
  const pathname = usePathname();

  const menus = getSidebarMenu(role) ?? [];
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col">
        <SidebarHeader />

        <SidebarGroup>
          <SidebarGroupLabel>MAIN</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((menu) =>
                menu.children ? (
                  <SidebarNestedMenu key={menu.label} menu={menu} />
                ) : (
                  <SidebarMenuItem key={menu.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(pathname, menu.href)}
                    >
                      <Link
                        href={menu.href ?? "#"}
                        className="flex items-center gap-4"
                      >
                        {menu.icon && <menu.icon style={ICON_STYLE} />}
                        <span>{menu.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto flex justify-center px-4 pb-4">
          <ThemeToggle />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
