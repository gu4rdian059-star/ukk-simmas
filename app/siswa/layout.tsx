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
  const currentTitle = siswaTitles[pathname] || "Dashboard Siswa";

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="siswa"
        userName="Siswa Magang"
        userEmail="siswa@simmas.sch.id"
        isOpenMobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          role="siswa"
          title={currentTitle}
          userName="Siswa Magang"
          userEmail="siswa@simmas.sch.id"
          breadcrumbs={[{ title: "Siswa" }, { title: currentTitle }]}
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

