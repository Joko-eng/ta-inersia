import {
  BarChart3,
  Briefcase,
  House,
  Layers,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";

export type Role = "admin" | "project_manager";

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

// export const sidebarMenu: Record<Role, MenuItem[]> = {
//   admin: [
//     {
//       label: "Dashboard",
//       href: "/dashboard",
//       icon: House,
//     },
//     {
//       label: "Lead Generation",
//       href: "/lead",
//       icon: Briefcase,
//     },
//     {
//       label: "Project",
//       href: "/admin/project",
//       icon: UserCheck,
//     },
//     {
//       label: "Project Manager",
//       href: "/project-manager",
//       icon: Users,
//     },
//     {
//       label: "Income",
//       icon: BarChart3,
//       children: [
//         {
//           label: "Ringkasan",
//           href: "/income",
//         },
//         {
//           label: "Laporan",
//           href: "/income/laporan",
//         },
//       ],
//     },
//   ],

//   project_manager: [
//     {
//       label: "Dashboard",
//       href: "/dashboard",
//       icon: House,
//     },
//     {
//       label: "Tim Pengembang",
//       href: "/dashboard/team",
//       icon: Users,
//     },
//   ],
// };

export function getSidebarMenu(role: Role): MenuItem[] {
  switch (role) {
    case "admin":
      return [
        { label: "Dashboard", href: "/dashboard", icon: House },
        { label: "Lead Generation", href: "/dashboard/lead", icon: Briefcase },
        { label: "Project", href: "/dashboard/admin/project", icon: UserCheck },
        {
          label: "Project Manager",
          href: "/dashboard/project-manager",
          icon: Users,
        },
        {
          label: "Income",
          icon: BarChart3,
          children: [
            { label: "Ringkasan", href: "/dashboard/income" },
            { label: "Laporan", href: "/dashboard/income/laporan" },
          ],
        },
        { label: "Profile", href: "/dashboard/profile", icon: Settings },
      ];

    case "project_manager":
      return [
        { label: "Dashboard", href: "/dashboard", icon: House },
        { label: "Tim Pengembang", href: "/dashboard/team", icon: Users },
        {
          label: "Kelola Proyek",
          href: "/dashboard/kelola-proyek",
          icon: Layers,
        },
        { label: "Profile", href: "/dashboard/profile", icon: Settings },
      ];
  }
}
