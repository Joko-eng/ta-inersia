import { Home, Layers, Settings, Users } from "lucide-react";

export const sidebarMenu = {
  admin: [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Tim Pengembang",
      icon: Users,
      href: "/dashboard/team",
    },
    {
      label: "Kelola Proyek",
      icon: Layers,
      children: [
        {
          label: "Semua Proyek",
          href: "/dashboard/projects",
        },
        {
          label: "Manajemen User",
          href: "/dashboard/users",
        },
      ],
    },
    {
      label: "Pengaturan",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ],

  manager: [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Kelola Proyek",
      icon: Layers,
      children: [
        {
          label: "Proyek Aktif",
          href: "/dashboard/projects/active",
        },
      ],
    },
  ],

  member: [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Tugas Saya",
      icon: Layers,
      href: "/dashboard/my-tasks",
    },
  ],
} as const;
