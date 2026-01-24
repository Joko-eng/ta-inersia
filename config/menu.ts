import { Folder, House, Settings, Users } from "lucide-react";

/* =========================
   TYPES
========================= */
export type Role = "admin" | "projectmanager" | "member";

export interface Project {
  id: string;
  name: string;
}

export interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  children?: MenuItem[];
}

/* =========================
   STATIC MENU (TANPA PROJECT)
========================= */
export const sidebarMenu: Record<Role, MenuItem[]> = {
  admin: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: House,
    },
    {
      label: "Tim Pengembang",
      href: "/team",
      icon: Users,
    },
    {
      label: "Pengaturan",
      href: "/settings",
      icon: Settings,
    },
  ],

  projectmanager: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: House,
    },
    {
      label: "Tim Pengembang",
      href: "/team",
      icon: Users,
    },
  ],

  member: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: House,
    },
    {
      label: "Tim Pengembang",
      href: "/team",
      icon: Users,
    },
  ],
};

/* =========================
   DYNAMIC MENU (PROJECT)
========================= */
export function getSidebarMenu(projects: Project[]): Record<Role, MenuItem[]> {
  const projectItems: MenuItem[] = projects.map((project) => ({
    label: project.name,
    href: `/dashboard/projects/${project.id}`, // langsung ke page.tsx yang SUDAH ADA
  }));

  const projectMenu: MenuItem = {
    label: "Projects",
    icon: Folder,
    children: projectItems,
  };

  return {
    admin: [
      { label: "Dashboard", href: "/dashboard", icon: House },
      { label: "Tim Pengembang", href: "/team", icon: Users },
      projectMenu,
      { label: "Pengaturan", href: "/settings", icon: Settings },
    ],

    projectmanager: [
      { label: "Dashboard", href: "/dashboard", icon: House },
      { label: "Tim Pengembang", href: "/team", icon: Users },
      projectMenu,
    ],

    member: [
      { label: "Dashboard", href: "/dashboard", icon: House },
      { label: "Tim Pengembang", href: "/team", icon: Users },
      projectMenu,
    ],
  };
}
