"use client";

import * as React from "react";
import {
  ClipboardList,
  Building2,
  Calendar,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  fetchDudiListAction,
  fetchPengajuanListAction,
  submitPengajuanAction,
} from "@/app/actions/crud";
import { toast } from "sonner";

interface DudiItem {
  id: string;
  nama_perusahaan: string;
  bidang_usaha?: string;
  alamat?: string;
  kuota?: number;
}

interface RiwayatItem {
  id: string;
  dudiName: string;
  posisi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
  tanggalPengajuan: string;
  alasan?: string | null;
}

export default function SiswaPengajuanPage() {
  const [dudiList, setDudiList] = React.useState<DudiItem[]>([]);
  const [riwayatList, setRiwayatList] = React.useState<RiwayatItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [formData, setFormData] = React.useState({
    dudi_id: "",
    dudiName: "",
    posisi: "Full-Stack Web Intern",
    tanggalMulai: "2026-08-01",
    tanggalSelesai: "2027-01-31",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const [dudiRes, pengajuanRes] = await Promise.all([
        fetchDudiListAction(),
        fetchPengajuanListAction(),
      ]);

      if (dudiRes.success && dudiRes.data && dudiRes.data.length > 0) {
        setDudiList(dudiRes.data);
        setFormData((prev) => ({
          ...prev,
          dudi_id: prev.dudi_id || dudiRes.data[0].id,
          dudiName: prev.dudiName || dudiRes.data[0].nama_perusahaan,
        }));
      }

      if (pengajuanRes.success && pengajuanRes.data) {
        setRiwayatList(
          pengajuanRes.data.map((q: any) => ({
            id: q.id,
            dudiName: q.dudiName || "Mitra Industri",
            posisi: q.posisi,
            tanggalMulai: q.tanggal_mulai,
            tanggalSelesai: q.tanggal_selesai,
            status: q.status,
            tanggalPengajuan: q.tanggalPengajuan || "-",
            alasan: q.alasan || null,
          }))
        );
      }
    } catch (err) {
      console.error("Gagal memuat data pengajuan:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dudi_id) {
      toast.error("Silakan pilih mitra industri terlebih dahulu.");
      return;
    }
    if (!formData.posisi.trim()) {
      toast.error("Mohon isi posisi yang Anda minati.");
      return;
    }

    setIsSubmitting(true);
    const res = await submitPengajuanAction({
      dudi_id: formData.dudi_id,
      posisi: formData.posisi,
      tanggal_mulai: formData.tanggalMulai,
      tanggal_selesai: formData.tanggalSelesai,
    });

    if (!res.success) {
      toast.error(res.error || "Gagal mengirimkan formulir pengajuan.");
      setIsSubmitting(false);
      return;
    }

    toast.success("Pengajuan magang berhasil dikirimkan ke administrator!");
    await loadData();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Pengajuan Tempat Magang
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Pilih dari daftar industri mitra sekolah atau ajukan tempat praktik kerja lapangan yang Anda minati.
        </p>
      </div>

      {/* Directory of DUDI & Submission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mitra DUDI Available */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Mitra DUDI Terverifikasi ({dudiList.length})
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground text-xs">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Memuat daftar industri...
            </div>
          ) : dudiList.length === 0 ? (
            <Card className="p-6 text-center text-xs text-muted-foreground">
              Belum ada data mitra industri yang terdaftar di sistem.
            </Card>
          ) : (
            dudiList.map((d) => (
              <Card
                key={d.id}
                onClick={() =>
                  setFormData({
                    ...formData,
                    dudi_id: d.id,
                    dudiName: d.nama_perusahaan,
                  })
                }
                className={`p-4 cursor-pointer transition-all ${
                  formData.dudi_id === d.id
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "hover:border-border/80"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{d.nama_perusahaan}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.bidang_usaha || "Bidang Industri"}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{d.alamat || "-"}</p>
                  </div>
                  <Badge variant="info" className="text-[10px] font-bold">
                    Kuota {d.kuota ?? 5}
                  </Badge>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Submission Form */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <h2 className="text-base font-bold text-foreground mb-1">
              Formulir Pengajuan Magang
            </h2>
            <p className="text-xs text-muted-foreground mb-5">
              Isi data posisi yang diminati dan rentang perkiraan tanggal pelaksanaan.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="targetDudi">Tempat Magang Terpilih</Label>
                <Input
                  id="targetDudi"
                  value={formData.dudiName || "Pilih mitra industri di sebelah kiri"}
                  readOnly
                  className="bg-muted/40 font-bold"
                />
              </div>

              <div>
                <Label htmlFor="posisi">Posisi / Bidang Pekerjaan yang Diminati</Label>
                <Input
                  id="posisi"
                  value={formData.posisi}
                  onChange={(e) => setFormData({ ...formData, posisi: e.target.value })}
                  placeholder="Contoh: Web Developer, Quality Assurance, UI/UX Designer"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="tglMulai">Tanggal Mulai Magang</Label>
                  <Input
                    id="tglMulai"
                    type="date"
                    value={formData.tanggalMulai}
                    onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tglSelesai">Tanggal Selesai Magang</Label>
                  <Input
                    id="tglSelesai"
                    type="date"
                    value={formData.tanggalSelesai}
                    onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-bold gap-2 mt-2"
                disabled={isSubmitting || !formData.dudi_id}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengirim Pengajuan...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Kirim Pengajuan Magang
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Riwayat Pengajuan Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border/80">
          <h3 className="font-bold text-sm text-foreground">
            Riwayat Pengajuan Magang Anda ({riwayatList.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          {riwayatList.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Belum ada riwayat pengajuan magang yang dikirimkan.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b border-border/80">
                <tr className="text-left font-bold text-muted-foreground">
                  <th className="p-4 uppercase tracking-wider">Tanggal</th>
                  <th className="p-4 uppercase tracking-wider">Perusahaan Mitra</th>
                  <th className="p-4 uppercase tracking-wider">Posisi</th>
                  <th className="p-4 uppercase tracking-wider">Periode Magang</th>
                  <th className="p-4 uppercase tracking-wider">Status Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {riwayatList.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-muted-foreground font-mono">{r.tanggalPengajuan}</td>
                    <td className="p-4 font-bold text-foreground">{r.dudiName}</td>
                    <td className="p-4 text-foreground font-medium">{r.posisi}</td>
                    <td className="p-4 text-muted-foreground font-mono">
                      {r.tanggalMulai} s.d. {r.tanggalSelesai}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          r.status === "disetujui"
                            ? "success"
                            : r.status === "menunggu"
                            ? "warning"
                            : "destructive"
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {r.status}
                      </Badge>
                      {r.alasan && (
                        <p className="text-[10px] text-destructive mt-1 font-medium">
                          Catatan: {r.alasan}
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
