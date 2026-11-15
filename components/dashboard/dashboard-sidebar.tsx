"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  Settings,
  FileText,
  Clock,
  BookOpen,
  MapPin,
  ClipboardList,
  CheckCircle,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { fetchSettingsAction } from "@/app/actions/crud";
import type { UserRole } from "@/types/database";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const adminNav: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Monitoring Global", href: "/admin/monitoring", icon: Activity },
    ],
  },
  {
    label: "MASTER DATA",
    items: [
      { title: "Data Guru", href: "/admin/guru", icon: Briefcase },
      { title: "Data Siswa", href: "/admin/siswa", icon: Users },
      { title: "Data DUDI", href: "/admin/dudi", icon: Building2 },
    ],
  },
  {
    label: "MANAJEMEN",
    items: [
      { title: "Penempatan Magang", href: "/admin/penempatan", icon: MapPin },
    ],
  },
  {
    label: "SISTEM",
    items: [
      { title: "Pengaturan Sistem", href: "/admin/settings", icon: Settings },
      { title: "Log Aktivitas & Audit", href: "/admin/logs", icon: ShieldCheck },
    ],
  },
];

const guruNav: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      { title: "Dashboard", href: "/guru/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "BIMBINGAN",
    items: [
      { title: "Siswa Bimbingan", href: "/guru/siswa", icon: Users },
      { title: "Validasi Jurnal & Absensi", href: "/guru/jurnal", icon: CheckCircle },
      { title: "Kunjungan Lapangan", href: "/guru/kunjungan", icon: MapPin },
    ],
  },
];

const siswaNav: NavGroup[] = [
  {
    label: "UTAMA",
    items: [
      { title: "Dashboard", href: "/siswa/dashboard", icon: LayoutDashboard },
      { title: "Pengajuan Magang", href: "/siswa/pengajuan", icon: ClipboardList },
      { title: "Absensi Harian", href: "/siswa/absensi", icon: Clock },
      { title: "Jurnal Kegiatan", href: "/siswa/jurnal", icon: BookOpen },
    ],
  },
];

interface DashboardSidebarProps {
  role: UserRole;
  userName?: string;
  userEmail?: string;
  appName?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function DashboardSidebar({
  role,
  userName = "Pengguna",
  userEmail = "user@simmas.sch.id",
  appName = "vernoncorp",
  isCollapsed = false,
  onToggleCollapse,
  isOpenMobile = false,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [currentAppName, setCurrentAppName] = React.useState<string>(appName);

  React.useEffect(() => {
    // 1. Check cached app name from localStorage for zero flash
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("simmas_app_name");
      if (cached) {
        setCurrentAppName(cached);
      }
    }

    // 2. Fetch latest app name from server/database
    fetchSettingsAction().then((res) => {
      if (res?.success && res.data?.appName) {
        setCurrentAppName(res.data.appName);
        if (typeof window !== "undefined") {
          localStorage.setItem("simmas_app_name", res.data.appName);
        }
      }
    });

    // 3. Listen to instantaneous app_settings_updated event
    const handleUpdate = (e: any) => {
      if (e.detail?.appName) {
        setCurrentAppName(e.detail.appName);
      }
    };

    window.addEventListener("app_settings_updated", handleUpdate);
    return () => {
      window.removeEventListener("app_settings_updated", handleUpdate);
    };
  }, []);

  const navGroups =
    role === "admin" ? adminNav : role === "guru" ? guruNav : siswaNav;

  const initials =
    role === "admin"
      ? "AS"
      : role === "guru"
      ? "GP"
      : "SM";

  const roleLabel =
    role === "admin"
      ? "Administrator"
      : role === "guru"
      ? "Guru Pembimbing"
      : "Siswa Magang";

  const content = (
    <div
      className={cn(
        "flex h-screen max-h-screen flex-col justify-between border-r border-border bg-sidebar text-sidebar-foreground select-none transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border/80 transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {!isCollapsed ? (
          <>
            <Link href="/" className="hover:opacity-90 transition-opacity min-w-0">
              <Logo
                title={currentAppName}
                subtitle={
                  role === "admin"
                    ? "ADMINISTRATOR"
                    : role === "guru"
                    ? "GURU PEMBIMBING"
                    : "SISWA MAGANG"
                }
              />
            </Link>
            {/* Close button ONLY on mobile drawer */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60 transition-colors cursor-pointer lg:hidden"
                aria-label="Tutup sidebar"
                title="Tutup sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center justify-center">
            <Logo showText={false} />
          </Link>
        )}
      </div>

      {/* Sidebar Nav Items */}
      <div
        className={cn(
          "flex-1 overflow-y-auto min-h-0 space-y-6 transition-all duration-300",
          isCollapsed ? "px-2 py-4" : "px-3.5 py-4"
        )}
      >
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 transition-opacity">
                {group.label}
              </p>
            )}
            <div className="mt-1 space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== `/${role}/dashboard` &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center rounded-xl text-xs font-semibold transition-all group",
                      isCollapsed
                        ? "justify-center h-10 w-10 mx-auto px-0"
                        : "gap-3 px-3 py-2.5",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs font-bold"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-foreground"
                      )}
                    />
                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer User Box */}
      <div
        className={cn(
          "shrink-0 border-t border-border/80 bg-sidebar transition-all duration-300",
          isCollapsed ? "p-2" : "p-3.5"
        )}
      >
        <div
          className={cn(
            "flex items-center rounded-xl bg-sidebar-accent/60",
            isCollapsed ? "justify-center p-1.5" : "gap-3 p-2.5"
          )}
          title={isCollapsed ? `${userName} (${roleLabel})` : undefined}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-sidebar-foreground">
                {userName}
              </p>
              <p className="truncate text-[10px] text-muted-foreground font-medium">
                {roleLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Sticky Top-0, stays in place while body scrolls */}
      <aside
        className={cn(
          "hidden lg:flex shrink-0 sticky top-0 h-screen z-30 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-64"
        )}
      >
        {content}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 animate-in slide-in-from-left duration-200 h-screen max-h-screen">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

