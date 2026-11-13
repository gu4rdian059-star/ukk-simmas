"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Users,
  Briefcase,
  CheckCircle,
  GraduationCap,
  Building2,
  ChevronDown,
  MoreHorizontal,
  SquarePen,
  Trash2,
  Eye,
  SlidersHorizontal,
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
import type { Guru } from "@/types/database";
import {
  createGuruAction,
  updateGuruAction,
  deleteGuruAction,
  fetchGuruListAction,
} from "@/app/actions/crud";

export default function AdminGuruPage() {
  const [guruList, setGuruList] = React.useState<Guru[]>([]);

  const [search, setSearch] = React.useState("");
  const [filterJurusan, setFilterJurusan] = React.useState("Semua");
  const [filterStatus, setFilterStatus] = React.useState("Semua");
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingGuru, setEditingGuru] = React.useState<Guru | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    nip: "",
    nama: "",
    email: "",
    jurusan: "Rekayasa Perangkat Lunak",
    status: "aktif" as Guru["status"],
  });

  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenuId]);

  const filtered = guruList.filter((g) => {
    const matchSearch =
      g.nama.toLowerCase().includes(search.toLowerCase()) ||
      g.nip.includes(search) ||
      g.email.toLowerCase().includes(search.toLowerCase());
    const matchJurusan = filterJurusan === "Semua" || g.jurusan === filterJurusan;
    const matchStatus = filterStatus === "Semua" || g.status === filterStatus;
    return matchSearch && matchJurusan && matchStatus;
  });

  const totalGuru = guruList.length;
  const guruAktif = guruList.filter((g) => g.status === "aktif").length;
  const totalBimbingan = guruList.reduce((acc, g) => acc + (g.activeSiswa || 0), 0);
  const avgBimbingan = totalGuru > 0 ? (totalBimbingan / totalGuru).toFixed(1) : "0";

  // Fetch live from Supabase on mount
  React.useEffect(() => {
    async function loadLiveGuru() {
      try {
        const res = await fetchGuruListAction();
        if (res.success && res.data && res.data.length > 0) {
          const mapped: Guru[] = res.data.map((g: any) => ({
            id: g.id,
            nip: g.nip,
            nama: g.nama,
            email: g.email,
            jurusan: g.jurusan || "Rekayasa Perangkat Lunak",
            status: g.status || (g.is_active ? "aktif" : "nonaktif"),
            activeSiswa: 3,
          }));
          setGuruList(mapped);
        }
      } catch (err) {
        console.error("Failed to load guru from Supabase:", err);
      }
    }
    loadLiveGuru();
  }, []);

  const handleOpenAdd = () => {
    setEditingGuru(null);
    setFormData({
      nip: "",
      nama: "",
      email: "",
      jurusan: "Rekayasa Perangkat Lunak",
      status: "aktif",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guru: Guru) => {
    setEditingGuru(guru);
    setFormData({
      nip: guru.nip,
      nama: guru.nama,
      email: guru.email,
      jurusan: guru.jurusan || "Rekayasa Perangkat Lunak",
      status: guru.status || "aktif",
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nip || !formData.nama || !formData.email) {
      toast.error("Mohon lengkapi NIP, Nama, dan Email.");
      return;
    }

    const currentStatus: "aktif" | "nonaktif" = formData.status === "nonaktif" ? "nonaktif" : "aktif";

    if (editingGuru) {
      const res = await updateGuruAction(editingGuru.id, {
        nip: formData.nip,
        nama: formData.nama,
        email: formData.email,
        jurusan: formData.jurusan,
        status: currentStatus,
      });

      if (!res.success) {
        toast.error(`Gagal memperbarui data guru: ${res.error}`);
      } else {
        toast.success("Data guru berhasil diperbarui.");
      }

      setGuruList((prev) =>
        prev.map((g) =>
          g.id === editingGuru.id ? { ...g, ...formData } : g
        )
      );
    } else {
      const res = await createGuruAction({
        nip: formData.nip,
        nama: formData.nama,
        email: formData.email,
        jurusan: formData.jurusan,
      });

      if (!res.success) {
        toast.error(`Gagal menyimpan data guru: ${res.error}`);
      } else {
        toast.success("Guru pembimbing baru berhasil ditambahkan!");
      }

      const newGuru: Guru = {
        id: res.data?.id || Date.now().toString(),
        nip: formData.nip,
        nama: formData.nama,
        email: formData.email,
        jurusan: formData.jurusan,
        status: formData.status,
        activeSiswa: 0,
      };
      setGuruList((prev) => [newGuru, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await deleteGuruAction(deletingId);
    if (!res.success) {
      toast.error(`Gagal menghapus data: ${res.error}`);
    } else {
      toast.success("Data guru berhasil dihapus.");
    }
    setGuruList((prev) => prev.filter((g) => g.id !== deletingId));
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* 1. TOP STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              TOTAL GURU
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{totalGuru}</p>
          <p className="text-xs text-muted-foreground mt-1">Terdaftar</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              GURU AKTIF
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{guruAktif}</p>
          <p className="text-xs text-muted-foreground mt-1">Siap membimbing</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              TOTAL BIMBINGAN
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{totalBimbingan}</p>
          <p className="text-xs text-muted-foreground mt-1">Siswa terdistribusi</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              RATA-RATA BIMBINGAN
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{avgBimbingan}</p>
          <p className="text-xs text-muted-foreground mt-1">Siswa / pembimbing</p>
        </div>
      </div>

      {/* 2. FILTER & ACTION BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari NIP, nama guru..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl border-border bg-background"
            />
          </div>

          <div className="relative inline-flex items-center">
            <SlidersHorizontal className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background pl-8 pr-7 text-xs font-semibold text-foreground appearance-none cursor-pointer focus:outline-primary"
            >
              <option value="Semua">Semua Jurusan</option>
              <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
              <option value="Teknik Komputer dan Jaringan">Teknik Komputer dan Jaringan</option>
            </select>
            <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative inline-flex items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 pr-7 text-xs font-semibold text-foreground appearance-none cursor-pointer focus:outline-primary"
            >
              <option value="Semua">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="rounded-lg bg-muted/60 text-muted-foreground text-xs px-3 py-1.5 font-bold">
            {totalGuru} Guru
          </span>
          <Button
            onClick={handleOpenAdd}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 h-9 gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Tambah Guru
          </Button>
        </div>
      </div>

      {/* 3. DATA TABLE CARD */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b border-border/80">
              <tr className="text-muted-foreground font-bold">
                <th className="py-3.5 px-4 uppercase tracking-wider">NIP</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">NAMA LENGKAP</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">JURUSAN</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">BIMBINGAN</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">STATUS</th>
                <th className="py-3.5 px-4 uppercase tracking-wider text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
                        <Users className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-sm text-foreground">Belum ada data guru</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Tabel guru di database Supabase saat ini masih kosong. Klik tombol &quot;+ Tambah Guru&quot; di atas untuk menambahkan guru pembimbing baru.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((guru) => (
                <tr key={guru.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4 font-mono font-medium text-foreground whitespace-nowrap">
                    {guru.nip}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                        {guru.nama.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-xs leading-tight">
                          {guru.nama}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                          {guru.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-foreground whitespace-nowrap">
                    {guru.jurusan}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {guru.activeSiswa || 0} Siswa
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      Aktif
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === guru.id ? null : guru.id);
                      }}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Aksi"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {activeMenuId === guru.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-4 top-12 z-50 w-44 rounded-2xl border border-border bg-white p-1.5 shadow-xl text-left animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            handleOpenEdit(guru);
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
                            toast.info(`Membuka data ${guru.activeSiswa || 0} siswa bimbingan ${guru.nama}`);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-muted/60 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>Lihat Siswa</span>
                        </button>

                        <div className="border-t border-border/60 my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            setDeletingId(guru.id);
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
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADD / EDIT GURU */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingGuru ? "Edit Data Guru" : "Tambah Guru Pembimbing"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveForm} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">NIP Guru</Label>
              <Input
                placeholder="Nomor Induk Pegawai"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nama Lengkap & Gelar</Label>
              <Input
                placeholder="Contoh: Budi Santoso, S.Kom."
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Guru</Label>
              <Input
                type="email"
                placeholder="guru@simmas.sch.id"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Jurusan</Label>
              <select
                value={formData.jurusan}
                onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium focus:outline-primary"
              >
                <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                <option value="Teknik Komputer dan Jaringan">Teknik Komputer dan Jaringan</option>
              </select>
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
        title="Hapus Guru Pembimbing"
        description="Apakah Anda yakin ingin menghapus data guru pembimbing ini? Seluruh bimbingan aktif akan dialihkan."
        confirmLabel="Hapus Guru"
        onConfirm={handleDelete}
      />
    </div>
  );
}
