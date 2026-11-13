"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const guruTitles: Record<string, string> = {
  "/guru/dashboard": "Dashboard Pembimbing",
  "/guru/siswa": "Siswa Bimbingan",
  "/guru/jurnal": "Validasi Jurnal & Presensi",
  "/guru/kunjungan": "Kunjungan Lapangan",
};

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const currentTitle = guruTitles[pathname] || "Dashboard";

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="guru"
        userName="Guru Pembimbing"
        userEmail="guru@simmas.sch.id"
        isOpenMobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          role="guru"
          title={currentTitle}
          userName="Guru Pembimbing"
          userEmail="guru@simmas.sch.id"
          breadcrumbs={[{ title: "Guru" }, { title: currentTitle }]}
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

