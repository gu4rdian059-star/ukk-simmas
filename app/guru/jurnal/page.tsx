"use client";

import * as React from "react";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  validateJurnalAction,
  validateAbsensiAction,
  fetchGuruValidasiAction,
} from "@/app/actions/crud";
import { toast } from "sonner";

export default function GuruJurnalPage() {
  const [activeTab, setActiveTab] = React.useState("jurnal");
  const [jurnalList, setJurnalList] = React.useState<any[]>([]);
  const [absensiList, setAbsensiList] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Modal states
  const [evaluatingJurnal, setEvaluatingJurnal] = React.useState<any | null>(null);
  const [evaluatingAbsensi, setEvaluatingAbsensi] = React.useState<any | null>(null);
  const [evalNotes, setEvalNotes] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetchGuruValidasiAction();
      if (res.success && res.data) {
        setJurnalList(res.data.jurnal);
        setAbsensiList(res.data.absensi);
      }
    } catch (err) {
      console.error("Gagal memuat data validasi guru:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Jurnal Validation
  const handleValidateJurnal = async (status: "disetujui" | "revisi") => {
    if (!evaluatingJurnal) return;
    setIsSaving(true);
    const res = await validateJurnalAction(evaluatingJurnal.id, status, evalNotes);
    if (!res.success) {
      toast.error(res.error || "Gagal memvalidasi jurnal.");
      setIsSaving(false);
      return;
    }

    toast.success(`Jurnal berhasil ${status === "disetujui" ? "disetujui" : "diminta revisi"}.`);
    setIsSaving(false);
    setEvaluatingJurnal(null);
    setEvalNotes("");
    await loadData();
  };

  // Handle Absensi Validation
  const handleValidateAbsensi = async (status: "approved" | "rejected") => {
    if (!evaluatingAbsensi) return;
    setIsSaving(true);
    const res = await validateAbsensiAction(evaluatingAbsensi.id, status, evalNotes);
    if (!res.success) {
      toast.error(res.error || "Gagal memvalidasi presensi.");
      setIsSaving(false);
      return;
    }

    toast.success(`Presensi berhasil ${status === "approved" ? "disetujui" : "ditolak"}.`);
    setIsSaving(false);
    setEvaluatingAbsensi(null);
    setEvalNotes("");
    await loadData();
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Validasi Jurnal & Absensi
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Verifikasi keabsahan presensi kehadiran dan evaluasi laporan jurnal kegiatan harian siswa.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="jurnal" className="gap-2">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Jurnal Kegiatan ({jurnalList.filter((j) => j.status === "menunggu").length} Pending)</span>
          </TabsTrigger>
          <TabsTrigger value="absensi" className="gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>Absensi Siswa ({absensiList.filter((a) => a.validasiStatus === "pending").length} Pending)</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: JURNAL */}
        <TabsContent value="jurnal" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 border-b border-border/80">
                  <tr className="text-left font-bold text-muted-foreground">
                    <th className="p-4 uppercase tracking-wider">Tanggal & Siswa</th>
                    <th className="p-4 uppercase tracking-wider">Uraian Kegiatan</th>
                    <th className="p-4 uppercase tracking-wider">Kendala & Solusi</th>
                    <th className="p-4 uppercase tracking-wider">Status</th>
                    <th className="p-4 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {jurnalList.map((j) => (
                    <tr key={j.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-foreground">{j.siswaName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {j.tanggal} • {j.kelas}
                        </p>
                      </td>
                      <td className="p-4 max-w-sm">
                        <p className="text-foreground leading-relaxed line-clamp-2">
                          {j.kegiatan}
                        </p>
                      </td>
                      <td className="p-4 max-w-xs text-muted-foreground">
                        <p className="line-clamp-1">K: {j.kendala || "-"}</p>
                        <p className="line-clamp-1">S: {j.solusi || "-"}</p>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            j.status === "disetujui"
                              ? "success"
                              : j.status === "menunggu"
                                ? "warning"
                                : "destructive"
                          }
                          className="text-[10px] uppercase font-bold"
                        >
                          {j.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEvaluatingJurnal(j);
                            setEvalNotes(j.catatanGuru || "");
                          }}
                          className="h-8 text-xs font-semibold gap-1.5"
                        >
                          Evaluasi
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: ABSENSI */}
        <TabsContent value="absensi" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 border-b border-border/80">
                  <tr className="text-left font-bold text-muted-foreground">
                    <th className="p-4 uppercase tracking-wider">Tanggal & Siswa</th>
                    <th className="p-4 uppercase tracking-wider">Status Kehadiran</th>
                    <th className="p-4 uppercase tracking-wider">Jam Masuk</th>
                    <th className="p-4 uppercase tracking-wider">Jam Pulang</th>
                    <th className="p-4 uppercase tracking-wider">Status Validasi</th>
                    <th className="p-4 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {absensiList.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-foreground">{a.siswaName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {a.tanggal}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-semibold">{a.waktuMasuk || "-"}</td>
                      <td className="p-4 font-mono font-semibold">{a.waktuPulang || "-"}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            a.validasiStatus === "approved"
                              ? "success"
                              : a.validasiStatus === "pending"
                                ? "warning"
                                : "destructive"
                          }
                          className="text-[10px] uppercase font-bold"
                        >
                          {a.validasiStatus}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEvaluatingAbsensi(a);
                            setEvalNotes(a.catatanGuru || "");
                          }}
                          className="h-8 text-xs font-semibold gap-1.5"
                        >
                          Validasi
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Jurnal Validation Modal */}
      {evaluatingJurnal && (
        <Dialog open={true} onOpenChange={() => setEvaluatingJurnal(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Evaluasi Jurnal Kegiatan</DialogTitle>
              <DialogDescription>
                Tinjau deskripsi pekerjaan, kendala, solusi, dan berikan catatan evaluasi.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-2 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <p className="font-bold text-foreground">{evaluatingJurnal.siswaName}</p>
                <p className="text-[10px] text-muted-foreground">
                  Tanggal: {evaluatingJurnal.tanggal} • {evaluatingJurnal.kelas}
                </p>
              </div>

              <div>
                <Label>Uraian Kegiatan</Label>
                <p className="p-3 rounded-lg bg-background border border-border text-foreground leading-relaxed">
                  {evaluatingJurnal.kegiatan}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Kendala yang Dihadapi</Label>
                  <p className="p-2.5 rounded-lg bg-background border border-border text-muted-foreground leading-relaxed">
                    {evaluatingJurnal.kendala || "-"}
                  </p>
                </div>
                <div>
                  <Label>Solusi / Penyelesaian</Label>
                  <p className="p-2.5 rounded-lg bg-background border border-border text-muted-foreground leading-relaxed">
                    {evaluatingJurnal.solusi || "-"}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="catatanGuru">Catatan / Umpan Balik Guru</Label>
                <Textarea
                  id="catatanGuru"
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  placeholder="Bagus, terus kembangkan pemahaman arsitektur middleware..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleValidateJurnal("revisi")}
                disabled={isSaving}
              >
                Minta Revisi
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEvaluatingJurnal(null)}
                  disabled={isSaving}
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  onClick={() => handleValidateJurnal("disetujui")}
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Setujui Jurnal
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Absensi Validation Modal */}
      {evaluatingAbsensi && (
        <Dialog open={true} onOpenChange={() => setEvaluatingAbsensi(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Validasi Presensi Siswa</DialogTitle>
              <DialogDescription>
                Verifikasi jam masuk, jam pulang, dan surat/foto kehadiran.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-2 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                <p className="font-bold text-foreground text-sm">{evaluatingAbsensi.siswaName}</p>
                <p className="text-muted-foreground mt-0.5">
                  Tanggal: {evaluatingAbsensi.tanggal} • Status: {evaluatingAbsensi.status.toUpperCase()}
                </p>
                <p className="text-foreground mt-1 font-mono">
                  Waktu: {evaluatingAbsensi.waktuMasuk || "-"} s.d. {evaluatingAbsensi.waktuPulang || "-"}
                </p>
              </div>

              <div>
                <Label htmlFor="catatanAbsensi">Catatan Guru (Opsional)</Label>
                <Input
                  id="catatanAbsensi"
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  placeholder="Catatan verifikasi..."
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleValidateAbsensi("rejected")}
                disabled={isSaving}
              >
                Tolak Presensi
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEvaluatingAbsensi(null)}
                  disabled={isSaving}
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  onClick={() => handleValidateAbsensi("approved")}
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Setujui Presensi
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

