"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Building2,
  CheckCircle,
  Users,
  Briefcase,
  Phone,
  MoreHorizontal,
  SquarePen,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ActionDropdown } from "@/components/shared/action-dropdown";
import { toast } from "sonner";
import type { TempatMagang } from "@/types/database";
import {
  createDudiAction,
  updateDudiAction,
  deleteDudiAction,
  fetchDudiListAction,
} from "@/app/actions/crud";

export default function AdminDudiPage() {
  const [dudiList, setDudiList] = React.useState<TempatMagang[]>([]);

  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("Semua");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingDudi, setEditingDudi] = React.useState<TempatMagang | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    nama_perusahaan: "",
    alamat: "",
    kontak: "",
    penanggung_jawab: "",
    bidang_usaha: "",
    kuota: 5,
    status: "terverifikasi" as TempatMagang["status"],
  });

  const filtered = dudiList.filter((d) => {
    const matchSearch =
      d.nama_perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.bidang_usaha.toLowerCase().includes(search.toLowerCase()) ||
      d.penanggung_jawab.toLowerCase().includes(search.toLowerCase()) ||
      d.alamat.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Semua" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalDudi = dudiList.length;
  const verifiedDudi = dudiList.filter((d) => d.status === "terverifikasi").length;
  const totalKuota = dudiList.reduce((acc, d) => acc + (d.kuota || 0), 0);
  const totalTerisi = dudiList.reduce((acc, d) => acc + (d.activeSiswa || 0), 0);

  // Fetch live from Supabase on mount
  React.useEffect(() => {
    async function loadLiveDudi() {
      try {
        const res = await fetchDudiListAction();
        if (res.success && res.data && res.data.length > 0) {
          const mapped: TempatMagang[] = res.data.map((d: any) => ({
            id: d.id,
            nama_perusahaan: d.nama_perusahaan,
            alamat: d.alamat,
            kontak: d.kontak,
            penanggung_jawab: d.penanggung_jawab,
            bidang_usaha: d.bidang_usaha,
            kuota: d.kuota,
            status: d.status,
            activeSiswa: 3,
          }));
          setDudiList(mapped);
        }
      } catch (err) {
        console.error("Failed to load DUDI from Supabase:", err);
      }
    }
    loadLiveDudi();
  }, []);

  const handleOpenAdd = () => {
    setEditingDudi(null);
    setFormData({
      nama_perusahaan: "",
      alamat: "",
      kontak: "",
      penanggung_jawab: "",
      bidang_usaha: "",
      kuota: 5,
      status: "terverifikasi",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dudi: TempatMagang) => {
    setEditingDudi(dudi);
    setFormData({
      nama_perusahaan: dudi.nama_perusahaan,
      alamat: dudi.alamat,
      kontak: dudi.kontak,
      penanggung_jawab: dudi.penanggung_jawab,
      bidang_usaha: dudi.bidang_usaha,
      kuota: dudi.kuota,
      status: dudi.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_perusahaan || !formData.alamat || !formData.kontak) {
      toast.error("Mohon lengkapi Nama Perusahaan, Alamat, dan Kontak.");
      return;
    }

    if (editingDudi) {
      const res = await updateDudiAction(editingDudi.id, {
        ...formData,
      });

      if (!res.success) {
        toast.error(`Gagal memperbarui data mitra DUDI: ${res.error}`);
      } else {
        toast.success("Data mitra DUDI berhasil diperbarui.");
      }

      setDudiList((prev) =>
        prev.map((d) =>
          d.id === editingDudi.id ? { ...d, ...formData } : d
        )
      );
    } else {
      const res = await createDudiAction({
        nama_perusahaan: formData.nama_perusahaan,
        bidang_usaha: formData.bidang_usaha,
        penanggung_jawab: formData.penanggung_jawab,
        kontak: formData.kontak,
        alamat: formData.alamat,
        kuota: formData.kuota,
      });

      if (!res.success) {
        toast.error(`Gagal menyimpan data mitra DUDI: ${res.error}`);
      } else {
        toast.success("Mitra DUDI baru berhasil ditambahkan!");
      }

      const newDudi: TempatMagang = {
        id: res.data?.id || Date.now().toString(),
        ...formData,
        activeSiswa: 0,
      };
      setDudiList((prev) => [newDudi, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await deleteDudiAction(deletingId);
    if (!res.success) {
      toast.error(`Gagal menghapus data: ${res.error}`);
    } else {
      toast.success("Data mitra DUDI berhasil dihapus.");
    }
    setDudiList((prev) => prev.filter((d) => d.id !== deletingId));
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* 1. TOP STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              TOTAL DUDI
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{totalDudi}</p>
          <p className="text-xs text-muted-foreground mt-1">Mitra terdaftar</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              TERVERIFIKASI
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{verifiedDudi}</p>
          <p className="text-xs text-muted-foreground mt-1">Kerjasama aktif</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              TOTAL KUOTA
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{totalKuota}</p>
          <p className="text-xs text-muted-foreground mt-1">Kapasitas siswa</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              TERISI
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{totalTerisi}</p>
          <p className="text-xs text-muted-foreground mt-1">73% tingkat keterisian</p>
        </div>
      </div>

      {/* 2. FILTER & ACTION BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative min-w-[260px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari perusahaan, alamat, PIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl border-border bg-background"
            />
          </div>

          <div className="relative inline-flex items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 pr-7 text-xs font-semibold text-foreground appearance-none cursor-pointer focus:outline-primary"
            >
              <option value="Semua">Semua Status</option>
              <option value="terverifikasi">Terverifikasi</option>
              <option value="menunggu">Menunggu</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="rounded-lg bg-muted/60 text-muted-foreground text-xs px-3 py-1.5 font-bold">
            {totalDudi} DUDI
          </span>
          <Button
            onClick={handleOpenAdd}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 h-9 gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Tambah DUDI
          </Button>
        </div>
      </div>

      {/* 3. DATA TABLE CARD */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b border-border/80">
              <tr className="text-muted-foreground font-bold">
                <th className="py-3.5 px-4 uppercase tracking-wider">PERUSAHAAN</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">PIC & KONTAK</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">BIDANG USAHA</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">KUOTA</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">SISWA AKTIF</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">STATUS</th>
                <th className="py-3.5 px-4 uppercase tracking-wider text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-sm text-foreground">Belum ada data mitra DUDI</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Tabel mitra DUDI di database Supabase saat ini masih kosong. Klik tombol &quot;+ Tambah Mitra DUDI&quot; di atas untuk menambahkan mitra baru.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((dudi) => (
                <tr key={dudi.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="font-bold text-foreground text-xs leading-tight">
                      {dudi.nama_perusahaan}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 line-clamp-1 max-w-xs">
                      {dudi.alamat}
                    </p>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="font-semibold text-foreground text-xs">
                      {dudi.penanggung_jawab}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" />
                      {dudi.kontak}
                    </p>
                  </td>
                  <td className="py-4 px-4 font-medium text-foreground whitespace-nowrap">
                    {dudi.bidang_usaha}
                  </td>
                  <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
                    {dudi.kuota} Siswa
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {dudi.activeSiswa || 0} Siswa
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      Terverifikasi
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <ActionDropdown
                      items={[
                        {
                          label: "Edit Data",
                          icon: SquarePen,
                          onClick: () => handleOpenEdit(dudi),
                        },
                        {
                          label: "Lihat Profil",
                          icon: ExternalLink,
                          onClick: () =>
                            toast.info(
                              `Membuka profil lengkap ${dudi.nama_perusahaan}`
                            ),
                        },
                        {
                          label: "Hapus",
                          icon: Trash2,
                          variant: "destructive",
                          separatorBefore: true,
                          onClick: () => setDeletingId(dudi.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADD / EDIT DUDI */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingDudi ? "Edit Mitra DUDI" : "Tambah Mitra DUDI Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveForm} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nama Perusahaan / Instansi</Label>
              <Input
                placeholder="Contoh: PT. Universal Big Data"
                value={formData.nama_perusahaan}
                onChange={(e) => setFormData({ ...formData, nama_perusahaan: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Alamat Lengkap</Label>
              <Input
                placeholder="Alamat kantor / industri"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">PIC / Penanggung Jawab</Label>
                <Input
                  placeholder="Nama PIC"
                  value={formData.penanggung_jawab}
                  onChange={(e) => setFormData({ ...formData, penanggung_jawab: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">No. Kontak / Telepon</Label>
                <Input
                  placeholder="08..."
                  value={formData.kontak}
                  onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Bidang Usaha</Label>
                <Input
                  placeholder="Contoh: Software House"
                  value={formData.bidang_usaha}
                  onChange={(e) => setFormData({ ...formData, bidang_usaha: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Kuota Siswa</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.kuota}
                  onChange={(e) => setFormData({ ...formData, kuota: parseInt(e.target.value) || 5 })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Batal
              </Button>
              <Button type="submit" className="rounded-xl text-xs h-9 bg-blue-600 hover:bg-blue-700">
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Hapus Mitra DUDI"
        description="Apakah Anda yakin ingin menghapus data mitra industri ini? Seluruh penempatan siswa terkait akan ditandai."
        confirmLabel="Hapus DUDI"
        onConfirm={handleDelete}
      />
    </div>
  );
}
