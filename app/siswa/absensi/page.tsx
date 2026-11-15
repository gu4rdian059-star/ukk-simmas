"use client";

import * as React from "react";
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Camera,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  fetchSiswaAbsensiAction,
  submitClockInAction,
  submitClockOutAction,
} from "@/app/actions/crud";
import { toast } from "sonner";

interface AbsensiItem {
  id: string;
  tanggal: string;
  status: string;
  waktuMasuk: string;
  waktuPulang: string;
  validasiStatus: string;
  catatanGuru?: string | null;
}

export default function SiswaAbsensiPage() {
  const [time, setTime] = React.useState<string>("");
  const [status, setStatus] = React.useState<"hadir" | "izin" | "sakit">("hadir");
  const [isClockedIn, setIsClockedIn] = React.useState(false);
  const [isClockedOut, setIsClockedOut] = React.useState(false);
  const [waktuMasuk, setWaktuMasuk] = React.useState<string | null>(null);
  const [waktuPulang, setWaktuPulang] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<AbsensiItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetchSiswaAbsensiAction();
      if (res.success && res.data) {
        setHistory(res.data.history);
        if (res.data.today) {
          setIsClockedIn(res.data.today.clockedIn);
          setIsClockedOut(res.data.today.clockedOut);
          setWaktuMasuk(res.data.today.waktuMasuk);
          setWaktuPulang(res.data.today.waktuPulang);
          if (res.data.today.status) {
            setStatus(res.data.today.status as any);
          }
        } else {
          setIsClockedIn(false);
          setIsClockedOut(false);
          setWaktuMasuk(null);
          setWaktuPulang(null);
        }
      }
    } catch (err) {
      console.error("Gagal memuat absensi:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClockIn = async () => {
    setIsSubmitting(true);
    const res = await submitClockInAction(status);
    if (!res.success) {
      toast.error(res.error || "Gagal mencatat clock in.");
      setIsSubmitting(false);
      return;
    }
    const nowTime = new Date().toTimeString().slice(0, 5);
    setWaktuMasuk(nowTime);
    setIsClockedIn(true);
    toast.success(`Clock In berhasil dicatat pada pukul ${nowTime}.`);
    await loadData();
    setIsSubmitting(false);
  };

  const handleClockOut = async () => {
    setIsSubmitting(true);
    const res = await submitClockOutAction();
    if (!res.success) {
      toast.error(res.error || "Gagal mencatat clock out.");
      setIsSubmitting(false);
      return;
    }
    const nowTime = new Date().toTimeString().slice(0, 5);
    setWaktuPulang(nowTime);
    setIsClockedOut(true);
    toast.success(`Clock Out berhasil dicatat pada pukul ${nowTime}.`);
    await loadData();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Absensi Harian
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Lakukan pencatatan kehadiran presensi clock-in dan clock-out secara real-time.
        </p>
      </div>

      {/* Clock In / Out Action Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-6 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Presensi Hari Ini
              </span>
              <Badge variant={isClockedIn ? "success" : "warning"} className="font-bold text-[10px]">
                {isClockedIn ? "Sudah Presensi Masuk" : "Belum Presensi"}
              </Badge>
            </div>

            <div className="text-center my-6">
              <p className="text-4xl sm:text-5xl font-extrabold text-foreground font-mono tracking-tight">
                {time || "07:30:00"}
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {new Intl.DateTimeFormat("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date())}
              </p>
            </div>

            <div className="mb-6">
              <Label htmlFor="statusKehadiran">Status Kehadiran</Label>
              <select
                id="statusKehadiran"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                disabled={isClockedIn}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary disabled:opacity-60"
              >
                <option value="hadir">Hadir di Tempat Magang</option>
                <option value="izin">Izin (Dispensasi Resmi)</option>
                <option value="sakit">Sakit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              size="lg"
              onClick={handleClockIn}
              disabled={isClockedIn || isSubmitting}
              className="font-bold gap-2"
            >
              {isSubmitting && !isClockedIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              Clock In
            </Button>
            <Button
              size="lg"
              variant={isClockedIn && !isClockedOut ? "default" : "outline"}
              onClick={handleClockOut}
              disabled={!isClockedIn || isClockedOut || isSubmitting}
              className="font-bold gap-2"
            >
              {isSubmitting && isClockedIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Clock Out
            </Button>
          </div>
        </Card>

        {/* Summary Card */}
        <Card className="md:col-span-6 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-foreground text-sm mb-1">
              Ringkasan Jam Kerja Hari Ini
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Verifikasi jam masuk dan kepulangan dari tempat magang.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-4 bg-muted/20">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">
                  Jam Masuk
                </p>
                <p className="text-2xl font-extrabold text-foreground mt-1 font-mono">
                  {waktuMasuk || "-"}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">
                  {waktuMasuk ? "Tepat Waktu" : "Belum Masuk"}
                </span>
              </div>

              <div className="rounded-xl border border-border p-4 bg-muted/20">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">
                  Jam Pulang
                </p>
                <p className="text-2xl font-extrabold text-foreground mt-1 font-mono">
                  {waktuPulang || "-"}
                </p>
                <span className="text-[10px] text-muted-foreground font-semibold mt-1 inline-block">
                  {waktuPulang ? "Presensi Selesai" : "Menunggu Jam Pulang"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-blue-900 text-xs flex items-center gap-2 mt-4">
            <Camera className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              Foto selfie lokasi kerja otomatis diverifikasi saat clock-in aktif.
            </span>
          </div>
        </Card>
      </div>

      {/* History Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border/80">
          <h3 className="font-bold text-sm text-foreground">
            Riwayat Absensi ({history.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          {history.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Belum ada riwayat presensi yang tercatat di database.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b border-border/80">
                <tr className="text-left font-bold text-muted-foreground">
                  <th className="p-4 uppercase tracking-wider">Tanggal</th>
                  <th className="p-4 uppercase tracking-wider">Status</th>
                  <th className="p-4 uppercase tracking-wider">Masuk</th>
                  <th className="p-4 uppercase tracking-wider">Pulang</th>
                  <th className="p-4 uppercase tracking-wider">Status Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono font-medium text-foreground">
                      {h.tanggal}
                    </td>
                    <td className="p-4">
                      <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        {h.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold">{h.waktuMasuk}</td>
                    <td className="p-4 font-mono font-bold">{h.waktuPulang}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          h.validasiStatus === "approved"
                            ? "success"
                            : h.validasiStatus === "rejected"
                            ? "destructive"
                            : "warning"
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {h.validasiStatus === "approved"
                          ? "Disetujui"
                          : h.validasiStatus === "rejected"
                          ? "Ditolak"
                          : "Menunggu"}
                      </Badge>
                      {h.catatanGuru && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Catatan: {h.catatanGuru}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
