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
      href: "/dashboard/team",
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

function buildMemberProjectMenu(projects: Project[]): MenuItem {
  return {
    label: "Lihat Proyek",
    icon: Layers,
    href: "/proyek",
  };
}

export function getSidebarMenu(
  role: Role,
  managedProjects: Project[] = [],
  assignedProjects: Project[] = [],
): MenuItem[] {
  switch (role) {
    case "admin":
      return [
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
        { label: "Pengaturan", href: "/settings", icon: Settings },
      ];

    case "projectmanager":
      return [
        { label: "Dashboard", href: "/dashboard", icon: House },
        { label: "Tim Pengembang", href: "/team", icon: Users },
        { label: "Kelola Proyek", href: "/kelola-proyek", icon: Layers },
      ];

    case "member":
      return [
        { label: "Dashboard", href: "/dashboard", icon: House },
        buildMemberProjectMenu(assignedProjects),
      ];
  }
}
