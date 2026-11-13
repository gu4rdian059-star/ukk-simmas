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
import {
  fetchPenempatanListAction,
  fetchPengajuanListAction,
  createPenempatanAction,
  approvePengajuanAction,
  rejectPengajuanAction,
  fetchSiswaListAction,
  fetchDudiListAction,
  fetchGuruListAction,
} from "@/app/actions/crud";

export default function AdminPenempatanPage() {
  const [penempatanList, setPenempatanList] = React.useState<PenempatanMagang[]>([]);
  const [pengajuanList, setPengajuanList] = React.useState<PengajuanMagang[]>([]);
  const [siswaOptions, setSiswaOptions] = React.useState<{ id: string; nama: string; nis: string; kelas: string }[]>([]);
  const [dudiOptions, setDudiOptions] = React.useState<{ id: string; nama_perusahaan: string }[]>([]);
  const [guruOptions, setGuruOptions] = React.useState<{ id: string; nama: string }[]>([]);
  const [selectedGuruForApproval, setSelectedGuruForApproval] = React.useState("");

  // Add Form state
  const [formData, setFormData] = React.useState({
    siswa_id: "",
    dudi_id: "",
    guru_id: "",
    siswaName: "",
    dudiName: "",
    guruName: "",
    tanggal_mulai: "2026-07-15",
    tanggal_selesai: "2026-12-15",
  });
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [penempatanRes, pengajuanRes, siswaRes, dudiRes, guruRes] = await Promise.all([
          fetchPenempatanListAction(),
          fetchPengajuanListAction(),
          fetchSiswaListAction(),
          fetchDudiListAction(),
          fetchGuruListAction(),
        ]);
        if (penempatanRes.success && penempatanRes.data) {
          setPenempatanList(penempatanRes.data as PenempatanMagang[]);
        }
        if (pengajuanRes.success && pengajuanRes.data) {
          setPengajuanList(pengajuanRes.data as PengajuanMagang[]);
        }
        if (siswaRes.success && siswaRes.data) {
          setSiswaOptions(siswaRes.data);
          if (siswaRes.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              siswa_id: prev.siswa_id || siswaRes.data[0].id,
              siswaName: prev.siswaName || `${siswaRes.data[0].nama} (${siswaRes.data[0].nis})`,
            }));
          }
        }
        if (dudiRes.success && dudiRes.data) {
          setDudiOptions(dudiRes.data);
          if (dudiRes.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              dudi_id: prev.dudi_id || dudiRes.data[0].id,
              dudiName: prev.dudiName || dudiRes.data[0].nama_perusahaan,
            }));
          }
        }
        if (guruRes.success && guruRes.data) {
          setGuruOptions(guruRes.data);
          if (guruRes.data.length > 0) {
            setSelectedGuruForApproval(guruRes.data[0].nama);
            setFormData((prev) => ({
              ...prev,
              guru_id: prev.guru_id || guruRes.data[0].id,
              guruName: prev.guruName || guruRes.data[0].nama,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load penempatan/pengajuan:", err);
      }
    }
    loadData();
  }, []);

  const [search, setSearch] = React.useState("");
  const [filterKelas, setFilterKelas] = React.useState("Semua");
  const [filterStatus, setFilterStatus] = React.useState("Semua");

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [approvalModal, setApprovalModal] = React.useState<PengajuanMagang | null>(null);
  const [rejectModal, setRejectModal] = React.useState<PengajuanMagang | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  const handleCreatePenempatan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.siswa_id || !formData.dudi_id || !formData.guru_id) {
      toast.error("Mohon pilih siswa, mitra industri, dan guru pembimbing.");
      return;
    }
    setIsSaving(true);

    const res = await createPenempatanAction({
      siswa_id: formData.siswa_id,
      dudi_id: formData.dudi_id,
      guru_id: formData.guru_id,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
    });

    if (!res.success) {
      toast.error(`Gagal simpan penempatan: ${res.error}`);
      setIsSaving(false);
      return;
    }

    const selectedSiswa = siswaOptions.find((s) => s.id === formData.siswa_id);
    const selectedDudi = dudiOptions.find((d) => d.id === formData.dudi_id);
    const selectedGuru = guruOptions.find((g) => g.id === formData.guru_id);

    const newPenempatan: PenempatanMagang = {
      id: "p-" + Date.now(),
      siswa_id: formData.siswa_id,
      dudi_id: formData.dudi_id,
      guru_id: formData.guru_id,
      siswaName: selectedSiswa?.nama || formData.siswaName,
      nis: selectedSiswa?.nis || "-",
      kelas: selectedSiswa?.kelas || "-",
      dudiName: selectedDudi?.nama_perusahaan || formData.dudiName,
      guruName: selectedGuru?.nama || formData.guruName,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      status: "aktif",
    };

    setPenempatanList((prev) => [newPenempatan, ...prev]);
    setIsSaving(false);
    setIsAddOpen(false);
    toast.success("Penempatan magang berhasil disimpan.");
  };

  const handleApprovePengajuan = async (guruName: string) => {
    if (!approvalModal) return;
    setIsSaving(true);

    try {
      await approvePengajuanAction(
        approvalModal.id,
        approvalModal.dudi_id || "",
        guruName || ""
      );
    } catch (err) {
      console.error(err);
    }

    // Move to penempatan
    const newP: PenempatanMagang = {
      id: "p-" + Date.now(),
      siswa_id: approvalModal.siswa_id,
      dudi_id: approvalModal.dudi_id || "d-app",
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

    try {
      await rejectPengajuanAction(rejectModal.id, rejectReason || "Ditolak oleh admin.");
    } catch (err) {
      console.error(err);
    }

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
    <div className="space-y-6 w-full">
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <p className="font-semibold text-sm text-foreground">Belum ada penempatan magang</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Klik &quot;Tambah Penempatan&quot; di atas untuk menempatkan siswa ke industri DUDI.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
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
              )))}
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
                  value={formData.siswa_id}
                  onChange={(e) => {
                    const sid = e.target.value;
                    const sObj = siswaOptions.find((s) => s.id === sid);
                    setFormData({
                      ...formData,
                      siswa_id: sid,
                      siswaName: sObj ? `${sObj.nama} (${sObj.nis})` : "",
                    });
                  }}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                  required
                >
                  <option value="" disabled>-- Pilih Siswa --</option>
                  {siswaOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} - {s.kelas} ({s.nis})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="dudi">Pilih Tempat Magang (DUDI)</Label>
                <select
                  id="dudi"
                  value={formData.dudi_id}
                  onChange={(e) => {
                    const did = e.target.value;
                    const dObj = dudiOptions.find((d) => d.id === did);
                    setFormData({
                      ...formData,
                      dudi_id: did,
                      dudiName: dObj ? dObj.nama_perusahaan : "",
                    });
                  }}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                  required
                >
                  <option value="" disabled>-- Pilih Tempat Magang --</option>
                  {dudiOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama_perusahaan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="guru">Pilih Guru Pembimbing</Label>
                <select
                  id="guru"
                  value={formData.guru_id}
                  onChange={(e) => {
                    const gid = e.target.value;
                    const gObj = guruOptions.find((g) => g.id === gid);
                    setFormData({
                      ...formData,
                      guru_id: gid,
                      guruName: gObj ? gObj.nama : "",
                    });
                  }}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                  required
                >
                  <option value="" disabled>-- Pilih Guru Pembimbing --</option>
                  {guruOptions.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama}
                    </option>
                  ))}
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
                  value={selectedGuruForApproval}
                  onChange={(e) => setSelectedGuruForApproval(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                >
                  {guruOptions.length > 0 ? (
                    guruOptions.map((g) => (
                      <option key={g.id} value={g.nama}>
                        {g.nama}
                      </option>
                    ))
                  ) : (
                    <option value="Guru Pembimbing, S.Kom.">Guru Pembimbing, S.Kom.</option>
                  )}
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
                onClick={() => handleApprovePengajuan(selectedGuruForApproval || guruOptions[0]?.nama || "Guru Pembimbing, S.Kom.")}
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

