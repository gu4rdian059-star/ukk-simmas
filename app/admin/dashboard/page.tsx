import * as React from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Building2,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PengajuanTrendChart } from "@/components/dashboard/pengajuan-trend-chart";
import { adminService } from "@/lib/services/admin-service";

export default async function AdminDashboardPage() {
  const data = await adminService.getDashboardStats();

  const todayStr = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Recent system activity logs with exact timestamps (jam)
  const systemActivities = [
    {
      id: "log-1",
      actor: "admin@simmas.sch.id",
      actorName: "Administrator SIMMAS",
      role: "admin",
      roleLabel: "Admin",
      avatarBg: "bg-blue-100 text-blue-700",
      initials: "AD",
      action: "LOGIN_SUCCESS",
      description: "Login berhasil ke dalam sistem SIMMAS",
      jam: "14:32 WIB",
      tanggal: "Hari ini",
      badgeVariant: "bg-blue-50 text-blue-700 border-blue-200/60",
      badgeText: "INFO",
    },
    {
      id: "log-2",
      actor: "guru@simmas.sch.id",
      actorName: "Guru Pembimbing, S.Kom.",
      role: "guru",
      roleLabel: "Guru",
      avatarBg: "bg-emerald-100 text-emerald-700",
      initials: "GP",
      action: "VALIDATE_JURNAL",
      description: "Menyetujui jurnal harian Siswa Magang (PT. Universal Big Data)",
      jam: "13:15 WIB",
      tanggal: "Hari ini",
      badgeVariant: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      badgeText: "SUCCESS",
    },
    {
      id: "log-3",
      actor: "siswa@simmas.sch.id",
      actorName: "Siswa Magang",
      role: "siswa",
      roleLabel: "Siswa",
      avatarBg: "bg-purple-100 text-purple-700",
      initials: "SI",
      action: "SUBMIT_PENGAJUAN",
      description: "Mengirimkan pengajuan magang ke PT. Solusi Digital Nusantara",
      jam: "11:04 WIB",
      tanggal: "Hari ini",
      badgeVariant: "bg-blue-50 text-blue-700 border-blue-200/60",
      badgeText: "INFO",
    },
    {
      id: "log-4",
      actor: "siswa@simmas.sch.id",
      actorName: "Siswa Magang",
      role: "siswa",
      roleLabel: "Siswa",
      avatarBg: "bg-purple-100 text-purple-700",
      initials: "SI",
      action: "SUBMIT_PRESENSI",
      description: "Presensi masuk harian (Hadir) tepat waktu di PT. Universal Big Data",
      jam: "08:00 WIB",
      tanggal: "Hari ini",
      badgeVariant: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      badgeText: "SUCCESS",
    },
    {
      id: "log-5",
      actor: "admin@simmas.sch.id",
      actorName: "Administrator SIMMAS",
      role: "admin",
      roleLabel: "Admin",
      avatarBg: "bg-blue-100 text-blue-700",
      initials: "AD",
      action: "CREATE_DUDI",
      description: "Menambahkan mitra industri baru: PT. CEO Batu Giok Shangsai",
      jam: "16:45 WIB",
      tanggal: "Kemarin",
      badgeVariant: "bg-amber-50 text-amber-700 border-amber-200/60",
      badgeText: "INFO",
    },
    {
      id: "log-6",
      actor: "guru@simmas.sch.id",
      actorName: "Guru Pembimbing, S.Kom.",
      role: "guru",
      roleLabel: "Guru",
      avatarBg: "bg-emerald-100 text-emerald-700",
      initials: "GP",
      action: "CREATE_KUNJUNGAN",
      description: "Mencatat laporan kunjungan supervisi ke PT. Universal Big Data",
      jam: "10:20 WIB",
      tanggal: "Kemarin",
      badgeVariant: "bg-blue-50 text-blue-700 border-blue-200/60",
      badgeText: "INFO",
    },
  ];

  return (
    <div className="space-y-6 w-full font-sans">
      {/* 1. TOP GREETING BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 text-white shadow-lg shadow-blue-500/10">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-100/90 text-xs font-semibold uppercase tracking-wider mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{todayStr}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Selamat datang kembali, Admin
            </h1>
            <p className="mt-1.5 text-sm text-blue-100/90">
              Ada{" "}
              <span className="font-bold text-white underline underline-offset-4">
                1 pengajuan magang
              </span>{" "}
              yang menunggu peninjauan dan validasi Anda hari ini.
            </p>
          </div>
          <Link href="/admin/penempatan">
            <Button
              variant="secondary"
              className="rounded-xl font-bold text-xs bg-white text-blue-600 hover:bg-blue-50 shadow-sm shrink-0 px-5 h-10"
            >
              Tinjau Pengajuan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. 4 TOP STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL SISWA */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              TOTAL SISWA
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{data.totalSiswa}</p>
          <p className="text-xs text-muted-foreground mt-1">Siswa terdaftar</p>
        </div>

        {/* GURU PEMBIMBING */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              GURU PEMBIMBING
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{data.totalGuru}</p>
          <p className="text-xs text-muted-foreground mt-1">Aktif membimbing</p>
        </div>

        {/* MITRA DUDI */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              MITRA DUDI
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{data.totalDudi}</p>
          <p className="text-xs text-muted-foreground mt-1">Mitra terverifikasi</p>
        </div>

        {/* MENUNGGU VALIDASI */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              MENUNGGU VALIDASI
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{data.pendingPengajuan}</p>
          <p className="text-xs text-muted-foreground mt-1">Pengajuan pending</p>
        </div>
      </div>

      {/* 3. ROW 2: TREN PENGAJUAN MAGANG & STATUS PENEMPATAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TREN PENGAJUAN MAGANG (CHART) */}
        <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Tren Pengajuan Magang
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Grafik volume usulan magang siswa per periode
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <TrendingUp className="h-3.5 w-3.5" />
                +24%
              </span>
            </div>

            <PengajuanTrendChart />
          </div>

          <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Total 34 pengajuan terproses semester ini</span>
            <Link href="/admin/penempatan" className="font-bold text-blue-600 hover:underline">
              Kelola Penempatan →
            </Link>
          </div>
        </div>

        {/* STATUS PENEMPATAN SISWA */}
        <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Status Penempatan
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Distribusi status magang siswa terkini
                </p>
              </div>
              <Link href="/admin/siswa" className="text-xs font-bold text-blue-600 hover:underline">
                Lihat Siswa
              </Link>
            </div>

            <div className="space-y-4 my-5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-2 text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    Sedang Magang
                  </span>
                  <span className="text-foreground font-bold">22 (67%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "67%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-2 text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Lulus Program
                  </span>
                  <span className="text-foreground font-bold">8 (24%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "24%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-2 text-amber-700">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Belum Ditempatkan
                  </span>
                  <span className="text-foreground font-bold">3 (9%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "9%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Target keterserapan industri: 95%</span>
            <span className="font-bold text-emerald-600">On Track</span>
          </div>
        </div>
      </div>

      {/* 4. ROW 3: AKTIVITAS SISTEM TERAKHIR (DENGAN JAM & DETAIL LENGKAP) */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Aktivitas Sistem Terakhir
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rekam jejak aktivitas seluruh pengguna beserta waktu eksekusi (jam & tanggal)
            </p>
          </div>
          <Link href="/admin/logs" className="text-xs font-bold text-blue-600 hover:underline">
            Lihat semua log audit →
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {systemActivities.map((act) => (
            <div
              key={act.id}
              className="py-3.5 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-muted/30 px-3 rounded-xl transition-colors"
            >
              {/* Left: User Avatar + Description */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-xs ${act.avatarBg}`}
                >
                  {act.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    {act.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="font-medium">{act.actorName}</span>
                    <span>•</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-muted">
                      {act.roleLabel}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">{act.actor}</span>
                  </div>
                </div>
              </div>

              {/* Right: Exact Jam / Timestamp + Badge */}
              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground font-mono flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {act.jam}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{act.tanggal}</p>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${act.badgeVariant}`}
                >
                  {act.badgeText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
