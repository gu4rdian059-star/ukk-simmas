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
import { submitPengajuanAction } from "@/app/actions/crud";
import { toast } from "sonner";

export default function SiswaPengajuanPage() {
  const dudiList = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      nama: "PT. Universal Big Data",
      bidang: "Teknologi Informasi & Data",
      alamat: "Jl. Tasikmadu No. 88, Malang",
      kuotaTersisa: 3,
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      nama: "PT. Telkom Indonesia",
      bidang: "Telekomunikasi & Jaringan",
      alamat: "Jl. Ketintang No. 15, Surabaya",
      kuotaTersisa: 4,
    },
    {
      id: "44444444-4444-4444-4444-444444444444",
      nama: "PT. Solusi Digital Nusantara",
      bidang: "Software House & App Dev",
      alamat: "Jl. Manyar Kertoarjo No. 24, Surabaya",
      kuotaTersisa: 3,
    },
  ];

  const [riwayatList, setRiwayatList] = React.useState([
    {
      id: "q1",
      dudiName: "PT. Universal Big Data",
      posisi: "Full-Stack Web Intern",
      tanggalMulai: "2026-07-15",
      tanggalSelesai: "2026-12-15",
      status: "disetujui",
      tanggalPengajuan: "2026-06-20",
      alasan: null,
    },
  ]);

  const [formData, setFormData] = React.useState({
    dudiName: "PT. Solusi Digital Nusantara",
    posisi: "Frontend Developer Intern",
    tanggalMulai: "2026-08-01",
    tanggalSelesai: "2027-01-31",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.posisi) {
      toast.error("Mohon isi posisi yang Anda minati.");
      return;
    }

    setIsSubmitting(true);
    await submitPengajuanAction({
      posisi: formData.posisi,
      tanggal_mulai: formData.tanggalMulai,
      tanggal_selesai: formData.tanggalSelesai,
    });

    const newRiwayat = {
      id: "q-" + Date.now(),
      dudiName: formData.dudiName,
      posisi: formData.posisi,
      tanggalMulai: formData.tanggalMulai,
      tanggalSelesai: formData.tanggalSelesai,
      status: "menunggu",
      tanggalPengajuan: new Date().toISOString().slice(0, 10),
      alasan: null,
    };

    setRiwayatList((prev) => [newRiwayat, ...prev]);
    setIsSubmitting(false);
    toast.success("Pengajuan magang berhasil dikirimkan ke administrator!");
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
            Mitra DUDI Terverifikasi
          </h2>
          {dudiList.map((d) => (
            <Card
              key={d.id}
              onClick={() => setFormData({ ...formData, dudiName: d.nama })}
              className={`p-4 cursor-pointer transition-all ${
                formData.dudiName === d.nama
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "hover:border-border/80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{d.nama}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.bidang}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{d.alamat}</p>
                </div>
                <Badge variant="info" className="text-[10px] font-bold">
                  Sisa {d.kuotaTersisa} Kuota
                </Badge>
              </div>
            </Card>
          ))}
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
                <Input id="targetDudi" value={formData.dudiName} readOnly className="bg-muted/40 font-bold" />
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
                disabled={isSubmitting}
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
            Riwayat Pengajuan Magang Anda
          </h3>
        </div>
        <div className="overflow-x-auto">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

