import {
  BarChart3,
  Briefcase,
  House,
  Layers,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";

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

export const sidebarMenu: Record<Role, MenuItem[]> = {
  admin: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: House,
    },
    {
      label: "Prospek Klien",
      href: "/prospek-klien",
      icon: Briefcase,
    },
    {
      label: "Klien",
      href: "/klien",
      icon: UserCheck,
    },
    {
      label: "Project Manager",
      href: "/project-manager",
      icon: Users,
    },
    {
      label: "Income",
      icon: BarChart3,
      children: [
        {
          label: "Ringkasan",
          href: "/income",
        },
        {
          label: "Laporan",
          href: "/income/laporan",
        },
      ],
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
  ],
};

export function getSidebarMenu(projects: Project[]): Record<Role, MenuItem[]> {
  const projectItems: MenuItem[] = projects.map((project) => ({
    label: project.name,
    href: `/dashboard/projects/${project.id}`,
  }));

  const projectMenu: MenuItem = {
    label: "Projects",
    icon: Layers,
    children: projectItems,
  };

  return {
    admin: [
      { label: "Dashboard", href: "/dashboard", icon: House },
      { label: "Prospek Klien", href: "/prospek-klien", icon: Briefcase },
      { label: "Klien", href: "/klien", icon: UserCheck },
      { label: "Project Manager", href: "/project-manager", icon: Users },
      {
        label: "Income",
        icon: BarChart3,
        children: [
          { label: "Ringkasan", href: "/income" },
          { label: "Laporan", href: "/income/laporan" },
        ],
      },
      projectMenu,
      { label: "Pengaturan", href: "/settings", icon: Settings },
    ],

    projectmanager: [
      { label: "Dashboard", href: "/dashboard", icon: House },
      { label: "Tim Pengembang", href: "/team", icon: Users }, // FIX
      projectMenu,
    ],

    member: [
      { label: "Dashboard", href: "/dashboard", icon: House },
      projectMenu,
    ],
  };
}
