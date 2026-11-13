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
import { toast } from "sonner";
import type { TempatMagang } from "@/types/database";

export default function AdminDudiPage() {
  const [dudiList, setDudiList] = React.useState<TempatMagang[]>([
    {
      id: "11111111-1111-1111-1111-111111111111",
      nama_perusahaan: "PT. Universal Big Data",
      alamat: "Jl. Tasikmadu No. 88, Malang",
      kontak: "081234567890",
      penanggung_jawab: "Budi Santoso, S.Kom.",
      bidang_usaha: "Teknologi Informasi & Big Data",
      kuota: 10,
      activeSiswa: 7,
      status: "terverifikasi",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      nama_perusahaan: "PT. Telkom Indonesia",
      alamat: "Jl. Ketintang No. 15, Surabaya",
      kontak: "082198765432",
      penanggung_jawab: "Siti Rahmawati, M.T.",
      bidang_usaha: "Telekomunikasi & Jaringan",
      kuota: 8,
      activeSiswa: 5,
      status: "terverifikasi",
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      nama_perusahaan: "PT. CEO Batu Giok Shangsai",
      alamat: "Komp. Ruko Graha Family Blok B-12, Surabaya",
      kontak: "085711223344",
      penanggung_jawab: "David Wijaya",
      bidang_usaha: "E-Commerce & Digital Marketing",
      kuota: 5,
      activeSiswa: 4,
      status: "terverifikasi",
    },
    {
      id: "44444444-4444-4444-4444-444444444444",
      nama_perusahaan: "PT. Solusi Digital Nusantara",
      alamat: "Jl. Manyar Kertoarjo No. 24, Surabaya",
      kontak: "081344556677",
      penanggung_jawab: "Ahmad Fauzi",
      bidang_usaha: "Software House & App Dev",
      kuota: 6,
      activeSiswa: 3,
      status: "terverifikasi",
    },
    {
      id: "55555555-5555-5555-5555-555555555555",
      nama_perusahaan: "CV. Media Grafika Kreatif",
      alamat: "Jl. Margorejo Indah No. 5, Surabaya",
      kontak: "089877665544",
      penanggung_jawab: "Nurul Hidayati",
      bidang_usaha: "Desain Grafis & Multimedia",
      kuota: 4,
      activeSiswa: 2,
      status: "terverifikasi",
    },
  ]);

  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("Semua");
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenuId]);

  const filtered = dudiList.filter((d) => {
    const matchSearch =
      d.nama_perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.bidang_usaha.toLowerCase().includes(search.toLowerCase()) ||
      d.penanggung_jawab.toLowerCase().includes(search.toLowerCase()) ||
      d.alamat.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Semua" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalDudi = 7;
  const verifiedDudi = 6;
  const totalKuota = 45;
  const totalTerisi = 33;

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

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_perusahaan || !formData.alamat || !formData.kontak) {
      toast.error("Mohon lengkapi Nama Perusahaan, Alamat, dan Kontak.");
      return;
    }

    if (editingDudi) {
      setDudiList((prev) =>
        prev.map((d) =>
          d.id === editingDudi.id ? { ...d, ...formData } : d
        )
      );
      toast.success("Data mitra DUDI berhasil diperbarui.");
    } else {
      const newDudi: TempatMagang = {
        id: Date.now().toString(),
        ...formData,
        activeSiswa: 0,
      };
      setDudiList((prev) => [newDudi, ...prev]);
      toast.success("Mitra DUDI baru berhasil ditambahkan.");
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deletingId) return;
    setDudiList((prev) => prev.filter((d) => d.id !== deletingId));
    toast.success("Data DUDI berhasil dihapus.");
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
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
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
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
              {filtered.map((dudi) => (
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
                  <td className="py-4 px-4 text-right whitespace-nowrap relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === dudi.id ? null : dudi.id);
                      }}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Aksi"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {activeMenuId === dudi.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-4 top-12 z-50 w-44 rounded-2xl border border-border bg-white p-1.5 shadow-xl text-left animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            handleOpenEdit(dudi);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-muted/60 transition-colors"
                        >
                          <SquarePen className="h-4 w-4 text-muted-foreground" />
                          <span>Edit Data</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            toast.info(`Membuka profil lengkap ${dudi.nama_perusahaan}`);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-muted/60 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <span>Lihat Profil</span>
                        </button>

                        <div className="border-t border-border/60 my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            setDeletingId(dudi.id);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
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
