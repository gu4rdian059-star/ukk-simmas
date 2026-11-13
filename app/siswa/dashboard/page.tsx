import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { siswaService } from "@/lib/services/siswa-service";

export default async function SiswaDashboardPage() {
  const data = await siswaService.getDashboard();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. GREETING BANNER */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Badge className="mb-2 bg-white/20 text-white hover:bg-white/30 border-none font-bold text-[10px] uppercase">
            Portal Siswa Magang
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Selamat datang, {data.siswa.nama}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-blue-100/90">
            NIS: {data.siswa.nis} • Kelas: {data.siswa.kelas}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/siswa/absensi">
            <Button
              variant="secondary"
              className="rounded-xl font-bold bg-white text-blue-600 hover:bg-blue-50 shadow-sm"
            >
              <Clock className="h-4 w-4 mr-1.5" />
              Isi Presensi
            </Button>
          </Link>
          <Link href="/siswa/jurnal">
            <Button
              className="rounded-xl font-bold bg-blue-500 hover:bg-blue-400 text-white border border-white/20 shadow-sm"
            >
              <BookOpen className="h-4 w-4 mr-1.5" />
              Tulis Jurnal
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. PENEMPATAN CARD */}
      <Card className="p-6 border-blue-200/80 bg-blue-50/20 dark:border-blue-900/50 dark:bg-blue-950/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Informasi Penempatan Magang Aktif
            </span>
            <h2 className="text-xl font-extrabold text-foreground">
              {data.placementInfo.dudiName}
            </h2>
            <p className="text-xs text-muted-foreground">
              {data.placementInfo.dudiAddress}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-border text-xs">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">
                Guru Pembimbing
              </p>
              <p className="font-semibold text-foreground mt-0.5">
                {data.placementInfo.guruName}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">
                Periode Magang
              </p>
              <p className="font-semibold text-foreground mt-0.5">
                {data.placementInfo.periode}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Kehadiran"
          value={`${data.stats.totalHariHadir} Hari`}
          subtitle="Tercatat di sistem"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Jurnal Terverifikasi"
          value={`${data.stats.totalJurnalTerverifikasi} Entri`}
          subtitle="Telah disetujui guru"
          icon={BookOpen}
          iconBg="bg-blue-50 dark:bg-blue-950/40"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Persentase Kehadiran"
          value={data.stats.persentaseKehadiran}
          subtitle="Kepatuhan presensi"
          icon={Clock}
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
          iconColor="text-indigo-600"
        />
      </div>

      {/* 4. SHORTCUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1.5">
              Presensi Kehadiran Hari Ini
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Lakukan clock-in saat tiba di lokasi magang dan clock-out setelah selesai jam operasional kerja.
            </p>
          </div>
          <Link href="/siswa/absensi" className="mt-5">
            <Button variant="outline" size="sm" className="w-full font-semibold gap-1.5">
              <span>Buka Menu Absensi</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1.5">
              Laporan Jurnal Harian
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Catat rangkuman kegiatan, kendala teknik, dan solusi yang Anda temukan selama bekerja di industri.
            </p>
          </div>
          <Link href="/siswa/jurnal" className="mt-5">
            <Button variant="outline" size="sm" className="w-full font-semibold gap-1.5">
              <span>Buka Menu Jurnal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

