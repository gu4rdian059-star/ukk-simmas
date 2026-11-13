"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, LogOut, ChevronDown, UserCheck, Bell, PanelLeftClose } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth";
import { toast } from "sonner";
import type { UserRole } from "@/types/database";

interface DashboardHeaderProps {
  role: UserRole;
  title?: string;
  userName?: string;
  userEmail?: string;
  breadcrumbs?: { title: string; href?: string }[];
  onToggleSidebar?: () => void;
}

export function DashboardHeader({
  role,
  title,
  userName = "Pengguna",
  userEmail = "user@simmas.sch.id",
  breadcrumbs = [{ title: "Overview" }, { title: "Dashboard" }],
  onToggleSidebar,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const initials =
    role === "admin"
      ? "AS"
      : role === "guru"
      ? "GP"
      : "SM";

  const roleLabel =
    role === "admin"
      ? "Admin"
      : role === "guru"
      ? "Guru"
      : "Siswa";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
      toast.success("Berhasil keluar dari sistem.");
      router.push("/login");
    } catch {
      toast.error("Gagal logout, silakan coba lagi.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const headerTitle = title || (breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : "Dashboard");

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: Toggle button + Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Toggle Sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>

        <h1 className="text-sm font-semibold text-foreground tracking-tight ml-1">
          {headerTitle}
        </h1>
      </div>

      {/* Right side: Search shortcut & User avatar dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Search button preview */}
        <button
          type="button"
          onClick={() => toast.info("Fitur pencarian cepat (⌘K) siap digunakan.")}
          className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Cari...</span>
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => toast.info("Tidak ada notifikasi baru.")}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>

        {/* User Pill & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl p-1 sm:pr-2 text-left hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
              {initials}
            </div>
            <span className="text-xs font-semibold text-foreground">
              {roleLabel}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-border bg-card p-2 shadow-lg animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-xs font-bold text-foreground truncate">
                    {userName}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {userEmail}
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {role}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{isLoggingOut ? "Keluar..." : "Keluar (Logout)"}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

