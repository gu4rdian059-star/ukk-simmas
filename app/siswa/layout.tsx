"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const siswaTitles: Record<string, string> = {
  "/siswa/dashboard": "Dashboard Siswa",
  "/siswa/pengajuan": "Pengajuan Magang",
  "/siswa/absensi": "Presensi Harian",
  "/siswa/jurnal": "Jurnal Kegiatan Harian",
};

export default function SiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("simmas_sidebar_collapsed");
      if (saved === "true") {
        setIsCollapsed(true);
      }
    }
  }, []);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => {
        const next = !prev;
        if (typeof window !== "undefined") {
          localStorage.setItem("simmas_sidebar_collapsed", String(next));
        }
        return next;
      });
    }
  };

  const currentTitle = siswaTitles[pathname] || "Dashboard Siswa";

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="siswa"
        userName="Siswa Magang"
        userEmail="siswa@simmas.sch.id"
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleSidebar}
        isOpenMobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
        <DashboardHeader
          role="siswa"
          title={currentTitle}
          userName="Siswa Magang"
          userEmail="siswa@simmas.sch.id"
          breadcrumbs={[{ title: "Siswa" }, { title: currentTitle }]}
          isSidebarCollapsed={isCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

