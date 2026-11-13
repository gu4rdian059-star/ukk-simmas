"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/siswa": "Manajemen Siswa",
  "/admin/guru": "Data Guru",
  "/admin/dudi": "Data Mitra Industri (DUDI)",
  "/admin/penempatan": "Penempatan Magang",
  "/admin/monitoring": "Monitoring Global",
  "/admin/settings": "Pengaturan Sistem",
  "/admin/logs": "Log Aktivitas & Audit",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const currentTitle = pageTitles[pathname] || "Dashboard";

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="admin"
        userName="Administrator"
        userEmail="admin@simmas.sch.id"
        isOpenMobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          role="admin"
          title={currentTitle}
          userName="Administrator"
          userEmail="admin@simmas.sch.id"
          breadcrumbs={[{ title: "Admin" }, { title: currentTitle }]}
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

