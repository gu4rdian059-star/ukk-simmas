"use client";

import * as React from "react";
import {
  Activity,
  Search,
  Filter,
  Eye,
  Calendar,
  Building2,
  UserCheck,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { fetchSiswaListAction } from "@/app/actions/crud";

export default function AdminMonitoringPage() {
  const [activeTab, setActiveTab] = React.useState("siswa");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedKelas, setSelectedKelas] = React.useState("Semua");
  const [selectedStatus, setSelectedStatus] = React.useState("Semua");
  const [selectedSiswaDetail, setSelectedSiswaDetail] = React.useState<any | null>(null);

  const [students, setStudents] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadData() {
      const res = await fetchSiswaListAction();
      if (res.success && res.data) {
        const mapped = res.data.map((s: any) => ({
          id: s.id,
          nama: s.nama,
          nis: s.nis,
          kelas: s.kelas,
          dudiName: s.dudi?.nama_perusahaan || "-",
          guruName: s.guru?.nama || "-",
          hadir: 0,
          sakit: 0,
          izin: 0,
          alfa: 0,
          jumlahJurnal: 0,
          status: s.status_magang === "sedang_magang" ? "Aktif" : s.status_magang === "lulus" ? "Lulus" : "Menunggu",
          terakhirAktif: "Hari ini",
        }));
        setStudents(mapped);
      }
    }
    loadData();
  }, []);

  const kunjunganList = [
    {
      id: "k1",
      tanggal: "2026-11-11",
      guruName: "Guru Pembimbing, S.Kom.",
      dudiName: "PT. Universal Big Data",
      catatan: "Monitoring tahap pertama, siswa beradaptasi sangat baik dengan tim IT dan mentor industri.",
    },
    {
      id: "k2",
      tanggal: "2026-10-20",
      guruName: "Dra. Endang Wahyuni, M.Pd.",
      dudiName: "PT. Telkom Indonesia",
      catatan: "Evaluasi tengah semester bersama PIC DUDI, laporan kehadiran 100% disiplin.",
    },
  ];

  const filteredStudents = students.filter((s) => {
    const matchQuery =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery);
    const matchKelas =
      selectedKelas === "Semua" || s.kelas === selectedKelas;
    const matchStatus =
      selectedStatus === "Semua" || s.status === selectedStatus;
    return matchQuery && matchKelas && matchStatus;
  });

  return (
    <div className="space-y-6 w-full">
      {/* 1. HEADER & OVERVIEW STATS */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Monitoring Global
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Pantau presensi harian, jurnal kegiatan, dan supervisi lapangan siswa secara real-time.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Siswa Aktif", val: `${students.filter((s) => s.status === "Aktif").length} Siswa`, color: "text-blue-600" },
          { label: "Tingkat Kehadiran", val: "100%", color: "text-emerald-600" },
          { label: "Jurnal Minggu Ini", val: "0 Diserahkan", color: "text-indigo-600" },
          { label: "Perlu Perhatian", val: "0 Siswa", color: "text-amber-600" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-2xs"
          >
            <p className="text-[11px] font-semibold text-muted-foreground">{item.label}</p>
            <p className={`mt-1 text-xl font-extrabold ${item.color}`}>{item.val}</p>
          </div>
        ))}
      </div>

      {/* 2. TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="siswa" className="gap-2">
            <Activity className="h-3.5 w-3.5" />
            <span>Monitoring Kehadiran & Jurnal Siswa</span>
          </TabsTrigger>
          <TabsTrigger value="kunjungan" className="gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>Kunjungan Guru Pembimbing ({kunjunganList.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SISWA */}
        <TabsContent value="siswa" className="space-y-4">
          {/* Filters Bar */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau NIS siswa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                >
                  <option value="Semua">Semua Kelas</option>
                  <option value="XII RPL 1">XII RPL 1</option>
                  <option value="XII RPL 2">XII RPL 2</option>
                  <option value="XII TKJ 1">XII TKJ 1</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Aktif">Aktif Magang</option>
                  <option value="Menunggu">Menunggu</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 border-b border-border/80">
                  <tr className="text-left font-bold text-muted-foreground">
                    <th className="p-4 uppercase tracking-wider">Siswa & Kelas</th>
                    <th className="p-4 uppercase tracking-wider">DUDI & Pembimbing</th>
                    <th className="p-4 uppercase tracking-wider">Kehadiran (H/S/I/A)</th>
                    <th className="p-4 uppercase tracking-wider">Jurnal</th>
                    <th className="p-4 uppercase tracking-wider">Status</th>
                    <th className="p-4 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-foreground">{s.nama}</p>
                        <p className="text-[10px] text-muted-foreground">
                          NIS: {s.nis} • {s.kelas}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-foreground">{s.dudiName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Guru: {s.guruName}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                            {s.hadir}H
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                            {s.sakit}S
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
                            {s.izin}I
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold">
                            {s.alfa}A
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-foreground">
                          {s.jumlahJurnal} entri
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            s.status === "Aktif"
                              ? "success"
                              : s.status === "Menunggu"
                              ? "warning"
                              : "secondary"
                          }
                          className="text-[10px] uppercase font-bold"
                        >
                          {s.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedSiswaDetail(s)}
                          className="h-8 text-xs font-semibold gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: KUNJUNGAN */}
        <TabsContent value="kunjungan" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kunjunganList.map((k) => (
              <Card key={k.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{k.dudiName}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pembimbing: {k.guruName}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-muted text-muted-foreground font-semibold">
                    {k.tanggal}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/60">
                  "{k.catatan}"
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* DETAIL MODAL */}
      {selectedSiswaDetail && (
        <Dialog open={true} onOpenChange={() => setSelectedSiswaDetail(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detail Monitoring Siswa</DialogTitle>
              <DialogDescription>
                Informasi komprehensif profil dan aktivitas magang siswa.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                  {selectedSiswaDetail.nama.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{selectedSiswaDetail.nama}</h4>
                  <p className="text-xs text-muted-foreground">
                    NIS: {selectedSiswaDetail.nis} • Kelas: {selectedSiswaDetail.kelas}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-border">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold">
                    Tempat Magang
                  </p>
                  <p className="font-semibold text-foreground mt-1">
                    {selectedSiswaDetail.dudiName}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-border">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold">
                    Guru Pembimbing
                  </p>
                  <p className="font-semibold text-foreground mt-1">
                    {selectedSiswaDetail.guruName}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border space-y-2">
                <p className="text-muted-foreground text-[10px] uppercase font-bold">
                  Rekap Kehadiran
                </p>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg font-bold">
                    {selectedSiswaDetail.hadir} Hadir
                  </div>
                  <div className="bg-blue-50 text-blue-700 p-2 rounded-lg font-bold">
                    {selectedSiswaDetail.sakit} Sakit
                  </div>
                  <div className="bg-amber-50 text-amber-700 p-2 rounded-lg font-bold">
                    {selectedSiswaDetail.izin} Izin
                  </div>
                  <div className="bg-rose-50 text-rose-700 p-2 rounded-lg font-bold">
                    {selectedSiswaDetail.alfa} Alfa
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSiswaDetail(null)}
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

