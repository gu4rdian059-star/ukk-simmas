"use client";

import * as React from "react";
import {
  Search,
  Plus,
  ClipboardList,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
  Building2,
  Users,
  Briefcase,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";
import type { PenempatanMagang, PengajuanMagang } from "@/types/database";

export default function AdminPenempatanPage() {
  const [penempatanList, setPenempatanList] = React.useState<PenempatanMagang[]>([
    {
      id: "p1",
      siswa_id: "s1",
      dudi_id: "d1",
      guru_id: "g1",
      siswaName: "Siswa Magang",
      nis: "21001",
      kelas: "XII RPL 1",
      dudiName: "PT. Universal Big Data",
      guruName: "Guru Pembimbing, S.Kom.",
      tanggal_mulai: "2026-07-15",
      tanggal_selesai: "2026-12-15",
      status: "aktif",
      nilai_akhir: null,
    },
    {
      id: "p2",
      siswa_id: "s2",
      dudi_id: "d1",
      guru_id: "g1",
      siswaName: "Aditya Pratama",
      nis: "21002",
      kelas: "XII RPL 1",
      dudiName: "PT. Universal Big Data",
      guruName: "Guru Pembimbing, S.Kom.",
      tanggal_mulai: "2026-07-15",
      tanggal_selesai: "2026-12-15",
      status: "aktif",
      nilai_akhir: null,
    },
    {
      id: "p3",
      siswa_id: "s3",
      dudi_id: "d2",
      guru_id: "g1",
      siswaName: "Bella Safitri",
      nis: "21003",
      kelas: "XII RPL 1",
      dudiName: "PT. Telkom Indonesia",
      guruName: "Guru Pembimbing, S.Kom.",
      tanggal_mulai: "2026-07-15",
      tanggal_selesai: "2026-12-15",
      status: "aktif",
      nilai_akhir: null,
    },
  ]);

  const [pengajuanList, setPengajuanList] = React.useState<PengajuanMagang[]>([
    {
      id: "q1",
      siswa_id: "s8",
      posisi: "Frontend Developer Intern",
      tanggal_mulai: "2026-08-01",
      tanggal_selesai: "2027-01-31",
      status: "menunggu",
      siswaName: "Gilang Ramadhan",
      nis: "21008",
      kelas: "XII RPL 1",
      dudiName: "PT. Solusi Digital Nusantara",
      dudiAddress: "Jl. Manyar Kertoarjo No. 24",
      tanggalPengajuan: "2026-11-10",
    },
  ]);

  const [search, setSearch] = React.useState("");
  const [filterKelas, setFilterKelas] = React.useState("Semua");
  const [filterStatus, setFilterStatus] = React.useState("Semua");

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [approvalModal, setApprovalModal] = React.useState<PengajuanMagang | null>(null);
  const [rejectModal, setRejectModal] = React.useState<PengajuanMagang | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  // Add Form state
  const [formData, setFormData] = React.useState({
    siswaName: "Chandra Wijaya (21004)",
    dudiName: "PT. Universal Big Data",
    guruName: "Guru Pembimbing, S.Kom.",
    tanggal_mulai: "2026-07-15",
    tanggal_selesai: "2026-12-15",
  });
  const [isSaving, setIsSaving] = React.useState(false);

  const handleCreatePenempatan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    const newPenempatan: PenempatanMagang = {
      id: "p-" + Date.now(),
      siswa_id: "s-new",
      dudi_id: "d-new",
      guru_id: "g-new",
      siswaName: formData.siswaName.split(" (")[0],
      nis: formData.siswaName.split("(")[1]?.replace(")", "") || "21004",
      kelas: "XII RPL 2",
      dudiName: formData.dudiName,
      guruName: formData.guruName,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      status: "aktif",
    };

    setPenempatanList((prev) => [newPenempatan, ...prev]);
    setIsSaving(false);
    setIsAddOpen(false);
    toast.success("Penempatan magang berhasil diterbitkan.");
  };

  const handleApprovePengajuan = async (guruName: string) => {
    if (!approvalModal) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    // Move to penempatan
    const newP: PenempatanMagang = {
      id: "p-" + Date.now(),
      siswa_id: approvalModal.siswa_id,
      dudi_id: "d-app",
      guru_id: "g-app",
      siswaName: approvalModal.siswaName,
      nis: approvalModal.nis,
      kelas: approvalModal.kelas,
      dudiName: approvalModal.dudiName,
      guruName: guruName || "Guru Pembimbing, S.Kom.",
      tanggal_mulai: approvalModal.tanggal_mulai,
      tanggal_selesai: approvalModal.tanggal_selesai,
      status: "aktif",
    };

    setPenempatanList((prev) => [newP, ...prev]);
    setPengajuanList((prev) => prev.filter((q) => q.id !== approvalModal.id));
    setIsSaving(false);
    setApprovalModal(null);
    toast.success("Pengajuan disetujui & penempatan disahkan.");
  };

  const handleRejectPengajuan = async () => {
    if (!rejectModal) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    setPengajuanList((prev) => prev.filter((q) => q.id !== rejectModal.id));
    setIsSaving(false);
    setRejectModal(null);
    setRejectReason("");
    toast.info("Pengajuan magang telah ditolak.");
  };

  const filtered = penempatanList.filter((p) => {
    const matchSearch =
      (p.siswaName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.nis || "").includes(search) ||
      (p.dudiName || "").toLowerCase().includes(search.toLowerCase());
    const matchKelas =
      filterKelas === "Semua" || p.kelas === filterKelas;
    const matchStatus =
      filterStatus === "Semua" || p.status === filterStatus;
    return matchSearch && matchKelas && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Penempatan Magang Siswa
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Validasi pengajuan siswa, sahkan periode magang resmi, dan plotting pembimbing.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="rounded-xl font-bold gap-2 self-start sm:self-auto shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Tambah Penempatan
        </Button>
      </div>

      {/* PENDING APPROVALS BOX */}
      {pengajuanList.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              Pengajuan Menunggu Persetujuan ({pengajuanList.length})
            </h3>
          </div>

          <div className="space-y-3">
            {pengajuanList.map((q) => (
              <div
                key={q.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-amber-200/80 bg-background"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground text-xs">{q.siswaName}</p>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      ({q.nis} • {q.kelas})
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mengajukan ke <strong className="text-foreground">{q.dudiName}</strong> sebagai <em>{q.posisi}</em>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Periode: {q.tanggal_mulai} s.d. {q.tanggal_selesai}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRejectModal(q)}
                    className="h-8 text-xs font-semibold text-destructive hover:bg-destructive/10"
                  >
                    Tolak
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setApprovalModal(q)}
                    className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Setujui & Tempatkan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari siswa, DUDI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="XII RPL 1">XII RPL 1</option>
              <option value="XII RPL 2">XII RPL 2</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
            >
              <option value="Semua">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Penempatan Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border/80">
              <tr className="text-left font-bold text-muted-foreground">
                <th className="p-4 uppercase tracking-wider">Siswa</th>
                <th className="p-4 uppercase tracking-wider">Kelas</th>
                <th className="p-4 uppercase tracking-wider">Tempat Magang</th>
                <th className="p-4 uppercase tracking-wider">Guru Pembimbing</th>
                <th className="p-4 uppercase tracking-wider">Periode</th>
                <th className="p-4 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-bold text-foreground">
                    {p.siswaName}
                    <p className="text-[10px] text-muted-foreground font-mono">
                      NIS: {p.nis}
                    </p>
                  </td>
                  <td className="p-4 font-medium text-foreground">{p.kelas}</td>
                  <td className="p-4 font-bold text-blue-600">{p.dudiName}</td>
                  <td className="p-4 text-foreground">{p.guruName}</td>
                  <td className="p-4 text-muted-foreground font-mono text-[11px]">
                    {p.tanggal_mulai} s.d. {p.tanggal_selesai}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={p.status === "aktif" ? "success" : "secondary"}
                      className="text-[10px] uppercase font-bold"
                    >
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Penempatan Modal */}
      {isAddOpen && (
        <Dialog open={true} onOpenChange={() => setIsAddOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Penempatan Magang</DialogTitle>
              <DialogDescription>
                Tentukan siswa, mitra industri, pembimbing, dan tanggal periode magang.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreatePenempatan} className="space-y-3.5 py-2">
              <div>
                <Label htmlFor="siswa">Pilih Siswa</Label>
                <select
                  id="siswa"
                  value={formData.siswaName}
                  onChange={(e) => setFormData({ ...formData, siswaName: e.target.value })}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                >
                  <option value="Chandra Wijaya (21004)">Chandra Wijaya - XII RPL 2 (21004)</option>
                  <option value="Dewi Lestari (21005)">Dewi Lestari - XII RPL 2 (21005)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="dudi">Pilih Tempat Magang (DUDI)</Label>
                <select
                  id="dudi"
                  value={formData.dudiName}
                  onChange={(e) => setFormData({ ...formData, dudiName: e.target.value })}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                >
                  <option value="PT. Universal Big Data">PT. Universal Big Data</option>
                  <option value="PT. Telkom Indonesia">PT. Telkom Indonesia</option>
                  <option value="PT. CEO Batu Giok Shangsai">PT. CEO Batu Giok Shangsai</option>
                </select>
              </div>

              <div>
                <Label htmlFor="guru">Pilih Guru Pembimbing</Label>
                <select
                  id="guru"
                  value={formData.guruName}
                  onChange={(e) => setFormData({ ...formData, guruName: e.target.value })}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                >
                  <option value="Guru Pembimbing, S.Kom.">Guru Pembimbing, S.Kom.</option>
                  <option value="Dra. Endang Wahyuni, M.Pd.">Dra. Endang Wahyuni, M.Pd.</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="tglMulai">Tanggal Mulai</Label>
                  <Input
                    id="tglMulai"
                    type="date"
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tglSelesai">Tanggal Selesai</Label>
                  <Input
                    id="tglSelesai"
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                    required
                  />
                </div>
              </div>

              <DialogFooter className="pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddOpen(false)}
                  disabled={isSaving}
                >
                  Batal
                </Button>
                <Button type="submit" size="sm" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Penempatan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval Modal */}
      {approvalModal && (
        <Dialog open={true} onOpenChange={() => setApprovalModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Sahkan Penempatan Magang</DialogTitle>
              <DialogDescription>
                Tentukan guru pembimbing untuk memvalidasi siswa ini.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <p className="font-bold text-foreground">{approvalModal.siswaName}</p>
                <p className="text-muted-foreground mt-0.5">
                  Industri: {approvalModal.dudiName}
                </p>
                <p className="text-muted-foreground">Posisi: {approvalModal.posisi}</p>
              </div>

              <div>
                <Label htmlFor="assignGuru">Tugaskan Guru Pembimbing</Label>
                <select
                  id="assignGuru"
                  defaultValue="Guru Pembimbing, S.Kom."
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                >
                  <option value="Guru Pembimbing, S.Kom.">Guru Pembimbing, S.Kom.</option>
                  <option value="Dra. Endang Wahyuni, M.Pd.">Dra. Endang Wahyuni, M.Pd.</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setApprovalModal(null)}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                onClick={() => handleApprovePengajuan("Guru Pembimbing, S.Kom.")}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Setujui & Tempatkan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <Dialog open={true} onOpenChange={() => setRejectModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tolak Pengajuan Magang</DialogTitle>
              <DialogDescription>
                Berikan alasan penolakan agar siswa dapat merevisi pengajuan.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <Label htmlFor="alasan">Alasan Penolakan</Label>
              <Input
                id="alasan"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Kuota perusahaan telah penuh atau DUDI belum MoU"
                required
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectModal(null)}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRejectPengajuan}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Konfirmasi Tolak
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

