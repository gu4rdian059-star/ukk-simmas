import * as React from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { guruService } from "@/lib/services/guru-service";

export default async function GuruDashboardPage() {
  const data = await guruService.getDashboard();

  return (
    <div className="space-y-6 w-full">
      {/* 1. GREETING BANNER */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white shadow-lg shadow-blue-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <Badge className="mb-2 bg-white/20 text-white hover:bg-white/30 border-none font-bold text-[10px] uppercase">
            Portal Guru Pembimbing
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Selamat datang, Guru Pembimbing
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-blue-100/90">
            Ada{" "}
            <span className="font-bold text-white underline underline-offset-2">
              {data.stats.pendingJurnal} jurnal kegiatan
            </span>{" "}
            yang memerlukan evaluasi dan validasi Anda.
          </p>
        </div>
        <Link href="/guru/jurnal">
          <Button
            variant="secondary"
            className="rounded-xl font-bold bg-white text-blue-600 hover:bg-blue-50 shadow-sm shrink-0"
          >
            Lihat Jurnal
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* 2. STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Siswa Bimbingan"
          value={data.stats.totalSiswa}
          icon={Users}
          iconBg="bg-blue-50 dark:bg-blue-950/40"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Jurnal Perlu Evaluasi"
          value={data.stats.jurnalBelumDinilai}
          icon={Clock}
          iconBg="bg-amber-50 dark:bg-amber-950/40"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value={data.stats.rasioKehadiranHariIni}
          icon={CheckCircle2}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Kunjungan Lapangan"
          value={2}
          icon={MapPin}
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
          iconColor="text-indigo-600"
        />
      </div>

      {/* 3. ROW: JURNAL TERBARU & SISWA BIMBINGAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jurnal Perlu Evaluasi */}
        <Card className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Jurnal Perlu Evaluasi</CardTitle>
              <CardDescription className="mt-1">
                Aktivitas harian terbaru yang dikirimkan oleh siswa bimbingan
              </CardDescription>
            </div>
            <Link href="/guru/jurnal" className="text-xs font-bold text-primary hover:underline">
              Semua Jurnal
            </Link>
          </div>

          <div className="space-y-3">
            {data.recentJournals.map((j: any) => (
              <div
                key={j.id}
                className="p-3.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-foreground">
                    {j.siswaName}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {j.tanggal}
                  </span>
                </div>
                <p className="text-xs text-foreground/85 line-clamp-2 leading-relaxed">
                  {j.kegiatan}
                </p>
                <div className="mt-2.5 flex items-center justify-between">
                  <Badge
                    variant={j.status === "disetujui" ? "success" : "warning"}
                    className="text-[10px] uppercase font-bold"
                  >
                    {j.status}
                  </Badge>
                  <Link href="/guru/jurnal">
                    <Button size="sm" variant="ghost" className="h-7 text-xs font-semibold p-0">
                      Evaluasi
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Daftar Siswa Bimbingan */}
        <Card className="lg:col-span-5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Daftar Siswa Bimbingan</CardTitle>
              <CardDescription className="mt-1">
                Siswa yang berada di bawah pengawasan Anda
              </CardDescription>
            </div>
            <Link href="/guru/siswa" className="text-xs font-bold text-primary hover:underline">
              Kelola Siswa
            </Link>
          </div>

          <div className="space-y-3">
            {data.assignedStudents.map((s: any) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xs">
                    {s.nama.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{s.nama}</p>
                    <p className="text-[10px] text-muted-foreground">
                      NIS: {s.nis} • {s.kelas}
                    </p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px] uppercase font-bold">
                  {s.status_magang}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

