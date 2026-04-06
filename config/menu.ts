import {
  BarChart3,
  Briefcase,
  House,
  Layers,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";

export type Role = "admin" | "project_manager" | "member";

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
      label: "Lead Generation",
      href: "/lead",
      icon: Briefcase,
    },
    {
      label: "Project",
      href: "/admin/project",
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

  project_manager: [
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
function buildProjectMenu(projects: Project[]): MenuItem {
  return {
    label: "Kelola Proyek",
    icon: Layers,
    children: projects.map((p) => ({
      label: p.name,
      href: `/proyek/${p.id}`,
    })),
  };
}
function buildMemberProjectMenu(projects: Project[]): MenuItem {
  return {
    label: "Lihat Proyek",
    icon: Layers,
    href: "/proyek-tim",
  };
}

export function getSidebarMenu(
  role: Role,
  assignedProjects: Project[] = [],
): MenuItem[] {
  switch (role) {
    case "admin":
      return [
        { label: "Dashboard", href: "/dashboard", icon: House },
        { label: "Lead Generation", href: "/lead", icon: Briefcase },
        { label: "Project", href: "/admin/project", icon: UserCheck },
        { label: "Project Manager", href: "/project-manager", icon: Users },
        {
          label: "Income",
          icon: BarChart3,
          children: [
            { label: "Ringkasan", href: "/income" },
            { label: "Laporan", href: "/income/laporan" },
          ],
        },
        { label: "Profile", href: "/profile", icon: Settings },
      ];

    case "project_manager":
      return [
        { label: "Dashboard", href: "/dashboard", icon: House },
        { label: "Tim Pengembang", href: "/team", icon: Users },
        { label: "Kelola Proyek", href: "/kelola-proyek", icon: Layers },
        { label: "Profile", href: "/profile", icon: Settings },
      ];

    case "member":
      return [
        { label: "Dashboard", href: "/dashboard", icon: House },
        buildMemberProjectMenu(assignedProjects),
        { label: "Profile", href: "/profile", icon: Settings },
      ];
  }
}
