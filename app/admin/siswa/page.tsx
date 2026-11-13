"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Users,
  Briefcase,
  Clock,
  GraduationCap,
  SlidersHorizontal,
  ChevronDown,
  MoreHorizontal,
  SquarePen,
  UserPlus,
  RefreshCw,
  Trash2,
  X,
  Building2,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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

interface SiswaItem {
  id: string;
  nis: string;
  nama: string;
  email: string;
  avatar: string;
  kelas: string;
  status_magang: "magang" | "lulus" | "belum_mengajukan" | "menunggu";
  status_label: string;
  industri: string;
  guru_pembimbing: string;
}

export default function AdminSiswaPage() {
  const [siswaList, setSiswaList] = React.useState<SiswaItem[]>([
    {
      id: "1",
      nis: "23123123",
      nama: "hihuahmad",
      email: "hihuahmad@simmas.sch.id",
      avatar: "H",
      kelas: "XII RPL 1",
      status_magang: "magang",
      status_label: "Sedang Magang",
      industri: "fhjk",
      guru_pembimbing: "guruhuhu",
    },
    {
      id: "2",
      nis: "45678",
      nama: "penceng siswa",
      email: "penceng.siswa@simmas.sch.id",
      avatar: "PS",
      kelas: "XII RPL 1",
      status_magang: "magang",
      status_label: "Sedang Magang",
      industri: "PT CEO Batu Giok",
      guru_pembimbing: "guruhuhu",
    },
    {
      id: "3",
      nis: "1678",
      nama: "bagas mahen",
      email: "bagas.mahen.4678@simmas.sch.id",
      avatar: "BM",
      kelas: "hgvgbhmvgj",
      status_magang: "magang",
      status_label: "Sedang Magang",
      industri: "PT CEO Batu Giok",
      guru_pembimbing: "-",
    },
    {
      id: "4",
      nis: "425364767534231",
      nama: "bagas mahen",
      email: "bagas.mahen@simmas.sch.id",
      avatar: "BM",
      kelas: "XII RPL 4",
      status_magang: "lulus",
      status_label: "Lulus",
      industri: "PT kikuk",
      guru_pembimbing: "Guru Test",
    },
    {
      id: "5",
      nis: "21001",
      nama: "Siswa Magang",
      email: "siswa@simmas.sch.id",
      avatar: "SM",
      kelas: "XII RPL 1",
      status_magang: "magang",
      status_label: "Sedang Magang",
      industri: "PT. Universal Big Data",
      guru_pembimbing: "Guru Pembimbing, S.Kom.",
    },
    {
      id: "6",
      nis: "21008",
      nama: "Gilang Ramadhan",
      email: "gilang.ramadhan@simmas.sch.id",
      avatar: "GR",
      kelas: "XII RPL 2",
      status_magang: "menunggu",
      status_label: "Belum Magang",
      industri: "-",
      guru_pembimbing: "-",
    },
    {
      id: "7",
      nis: "21009",
      nama: "Hana Maharani",
      email: "hana.maharani@simmas.sch.id",
      avatar: "HM",
      kelas: "XII RPL 2",
      status_magang: "belum_mengajukan",
      status_label: "Belum Magang",
      industri: "-",
      guru_pembimbing: "-",
    },
  ]);

  const [search, setSearch] = React.useState("");
  const [filterKelas, setFilterKelas] = React.useState("Semua");
  const [filterIndustri, setFilterIndustri] = React.useState("Semua");
  const [filterStatus, setFilterStatus] = React.useState("Semua");

  // Active action menu row ID
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  // Dialog states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isPlottingOpen, setIsPlottingOpen] = React.useState(false);
  const [isStatusOpen, setIsStatusOpen] = React.useState(false);
  const [editingSiswa, setEditingSiswa] = React.useState<SiswaItem | null>(null);
  const [selectedSiswa, setSelectedSiswa] = React.useState<SiswaItem | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Form states
  const [formData, setFormData] = React.useState({
    nis: "",
    nama: "",
    email: "",
    kelas: "XII RPL 1",
    industri: "",
    guru_pembimbing: "",
  });

  const [plotData, setPlotData] = React.useState({
    industri: "PT. Universal Big Data",
    guru_pembimbing: "Guru Pembimbing, S.Kom.",
  });

  const [statusValue, setStatusValue] = React.useState<SiswaItem["status_magang"]>("magang");

  // Close popup menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenuId]);

  // Filtered rows
  const filtered = siswaList.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.kelas.toLowerCase().includes(search.toLowerCase());
    const matchKelas = filterKelas === "Semua" || s.kelas === filterKelas;
    const matchIndustri = filterIndustri === "Semua" || s.industri === filterIndustri;
    const matchStatus =
      filterStatus === "Semua" ||
      (filterStatus === "magang" && s.status_magang === "magang") ||
      (filterStatus === "lulus" && s.status_magang === "lulus") ||
      (filterStatus === "belum" && (s.status_magang === "belum_mengajukan" || s.status_magang === "menunggu"));
    return matchSearch && matchKelas && matchIndustri && matchStatus;
  });

  // Calculate dynamic stats matching screenshot (33, 7, 2, 1)
  const totalCount = 33;
  const magangCount = 7;
  const belumCount = 2;
  const lulusCount = 1;

  // Handlers
  const handleOpenAdd = () => {
    setEditingSiswa(null);
    setFormData({
      nis: "",
      nama: "",
      email: "",
      kelas: "XII RPL 1",
      industri: "",
      guru_pembimbing: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (siswa: SiswaItem) => {
    setEditingSiswa(siswa);
    setFormData({
      nis: siswa.nis,
      nama: siswa.nama,
      email: siswa.email,
      kelas: siswa.kelas,
      industri: siswa.industri,
      guru_pembimbing: siswa.guru_pembimbing,
    });
    setIsModalOpen(true);
  };

  const handleOpenPlot = (siswa: SiswaItem) => {
    setSelectedSiswa(siswa);
    setPlotData({
      industri: siswa.industri !== "-" ? siswa.industri : "PT. Universal Big Data",
      guru_pembimbing: siswa.guru_pembimbing !== "-" ? siswa.guru_pembimbing : "Guru Pembimbing, S.Kom.",
    });
    setIsPlottingOpen(true);
  };

  const handleOpenStatus = (siswa: SiswaItem) => {
    setSelectedSiswa(siswa);
    setStatusValue(siswa.status_magang);
    setIsStatusOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nis || !formData.nama || !formData.email) {
      toast.error("Mohon lengkapi NIS, Nama, dan Email.");
      return;
    }

    if (editingSiswa) {
      setSiswaList((prev) =>
        prev.map((s) =>
          s.id === editingSiswa.id
            ? {
                ...s,
                nis: formData.nis,
                nama: formData.nama,
                email: formData.email,
                kelas: formData.kelas,
                industri: formData.industri || s.industri,
                guru_pembimbing: formData.guru_pembimbing || s.guru_pembimbing,
              }
            : s
        )
      );
      toast.success("Data siswa berhasil diperbarui.");
    } else {
      const initials = formData.nama
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
      const newSiswa: SiswaItem = {
        id: Date.now().toString(),
        nis: formData.nis,
        nama: formData.nama,
        email: formData.email,
        avatar: initials || "S",
        kelas: formData.kelas,
        status_magang: "belum_mengajukan",
        status_label: "Belum Magang",
        industri: formData.industri || "-",
        guru_pembimbing: formData.guru_pembimbing || "-",
      };
      setSiswaList((prev) => [newSiswa, ...prev]);
      toast.success("Siswa baru berhasil ditambahkan.");
    }

    setIsModalOpen(false);
  };

  const handleSavePlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) return;
    setSiswaList((prev) =>
      prev.map((s) =>
        s.id === selectedSiswa.id
          ? {
              ...s,
              industri: plotData.industri,
              guru_pembimbing: plotData.guru_pembimbing,
              status_magang: "magang",
              status_label: "Sedang Magang",
            }
          : s
      )
    );
    toast.success("Plotting pembimbing & industri berhasil disimpan.");
    setIsPlottingOpen(false);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) return;
    const label =
      statusValue === "magang"
        ? "Sedang Magang"
        : statusValue === "lulus"
        ? "Lulus"
        : "Belum Magang";

    setSiswaList((prev) =>
      prev.map((s) =>
        s.id === selectedSiswa.id
          ? {
              ...s,
              status_magang: statusValue,
              status_label: label,
            }
          : s
      )
    );
    toast.success("Status magang berhasil diubah.");
    setIsStatusOpen(false);
  };

  const handleDelete = () => {
    if (!deletingId) return;
    setSiswaList((prev) => prev.filter((s) => s.id !== deletingId));
    toast.success("Data siswa berhasil dihapus.");
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. TOP STAT CARDS (4 Cards Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL SISWA */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              TOTAL SISWA
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{totalCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Terdaftar</p>
        </div>

        {/* Card 2: SEDANG MAGANG */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              SEDANG MAGANG
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{magangCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Aktif di industri</p>
        </div>

        {/* Card 3: BELUM MAGANG */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              BELUM MAGANG
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{belumCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Perlu ditempatkan</p>
        </div>

        {/* Card 4: LULUS MAGANG */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              LULUS MAGANG
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">{lulusCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Selesai program</p>
        </div>
      </div>

      {/* 2. FILTER & ACTION BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left Search & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari nama, NIS, atau kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl border-border bg-background"
            />
          </div>

          {/* Filter Kelas */}
          <div className="relative inline-flex items-center">
            <SlidersHorizontal className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background pl-8 pr-7 text-xs font-semibold text-foreground appearance-none cursor-pointer focus:outline-primary"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="XII RPL 1">XII RPL 1</option>
              <option value="XII RPL 2">XII RPL 2</option>
              <option value="XII RPL 4">XII RPL 4</option>
              <option value="XII TKJ 1">XII TKJ 1</option>
            </select>
            <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Filter Industri */}
          <div className="relative inline-flex items-center">
            <select
              value={filterIndustri}
              onChange={(e) => setFilterIndustri(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 pr-7 text-xs font-semibold text-foreground appearance-none cursor-pointer focus:outline-primary"
            >
              <option value="Semua">Semua Industri</option>
              <option value="PT CEO Batu Giok">PT CEO Batu Giok</option>
              <option value="PT. Universal Big Data">PT. Universal Big Data</option>
              <option value="PT. Telkom Indonesia">PT. Telkom Indonesia</option>
              <option value="fhjk">fhjk</option>
              <option value="PT kikuk">PT kikuk</option>
            </select>
            <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Filter Status */}
          <div className="relative inline-flex items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 pr-7 text-xs font-semibold text-foreground appearance-none cursor-pointer focus:outline-primary"
            >
              <option value="Semua">Semua Status</option>
              <option value="magang">Sedang Magang</option>
              <option value="belum">Belum Magang</option>
              <option value="lulus">Lulus</option>
            </select>
            <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Right Counter & Add Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="rounded-lg bg-muted/60 text-muted-foreground text-xs px-3 py-1.5 font-bold">
            {totalCount} Siswa
          </span>
          <Button
            onClick={handleOpenAdd}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 h-9 gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Tambah Siswa
          </Button>
        </div>
      </div>

      {/* 3. DATA TABLE CARD */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b border-border/80">
              <tr className="text-muted-foreground font-bold">
                <th className="py-3.5 px-4 uppercase tracking-wider">NIS</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">NAMA LENGKAP</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">KELAS</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">STATUS MAGANG</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">INDUSTRI</th>
                <th className="py-3.5 px-4 uppercase tracking-wider">GURU PEMBIMBING</th>
                <th className="py-3.5 px-4 uppercase tracking-wider text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((siswa) => (
                <tr key={siswa.id} className="hover:bg-muted/20 transition-colors">
                  {/* NIS */}
                  <td className="py-4 px-4 font-mono font-medium text-foreground whitespace-nowrap">
                    {siswa.nis}
                  </td>

                  {/* NAMA LENGKAP */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                        {siswa.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-xs leading-tight">
                          {siswa.nama}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                          {siswa.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* KELAS */}
                  <td className="py-4 px-4 font-medium text-foreground whitespace-nowrap">
                    {siswa.kelas}
                  </td>

                  {/* STATUS MAGANG */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {siswa.status_magang === "magang" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Sedang Magang
                      </span>
                    ) : siswa.status_magang === "lulus" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        Lulus
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                        Belum Magang
                      </span>
                    )}
                  </td>

                  {/* INDUSTRI */}
                  <td className="py-4 px-4 font-medium text-foreground whitespace-nowrap">
                    {siswa.industri}
                  </td>

                  {/* GURU PEMBIMBING */}
                  <td className="py-4 px-4 font-medium text-foreground whitespace-nowrap">
                    {siswa.guru_pembimbing}
                  </td>

                  {/* AKSI DROPDOWN MENU */}
                  <td className="py-4 px-4 text-right whitespace-nowrap relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === siswa.id ? null : siswa.id);
                      }}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Aksi"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {/* Popup menu matching screenshot */}
                    {activeMenuId === siswa.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-4 top-12 z-50 w-48 rounded-2xl border border-border bg-white p-1.5 shadow-xl text-left animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            handleOpenEdit(siswa);
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
                            handleOpenPlot(siswa);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-muted/60 transition-colors"
                        >
                          <UserPlus className="h-4 w-4 text-muted-foreground" />
                          <span>Plot Pembimbing</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            handleOpenStatus(siswa);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-muted/60 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4 text-muted-foreground" />
                          <span>Ubah Status Magang</span>
                        </button>

                        <div className="border-t border-border/60 my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            setDeletingId(siswa.id);
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

      {/* MODAL 1: ADD / EDIT SISWA */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingSiswa ? "Edit Data Siswa" : "Tambah Siswa Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveForm} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">NIS</Label>
              <Input
                placeholder="Nomor Induk Siswa"
                value={formData.nis}
                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nama Lengkap</Label>
              <Input
                placeholder="Nama lengkap siswa"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Siswa</Label>
              <Input
                type="email"
                placeholder="email@simmas.sch.id"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Kelas</Label>
              <select
                value={formData.kelas}
                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium focus:outline-primary"
              >
                <option value="XII RPL 1">XII RPL 1</option>
                <option value="XII RPL 2">XII RPL 2</option>
                <option value="XII RPL 4">XII RPL 4</option>
                <option value="XII TKJ 1">XII TKJ 1</option>
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

      {/* MODAL 2: PLOT PEMBIMBING & INDUSTRI */}
      <Dialog open={isPlottingOpen} onOpenChange={setIsPlottingOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Plot Pembimbing & Industri
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePlot} className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Tentukan penempatan industri DUDI dan guru pembimbing untuk{" "}
              <strong className="text-foreground">{selectedSiswa?.nama}</strong>.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mitra Industri (DUDI)</Label>
              <select
                value={plotData.industri}
                onChange={(e) => setPlotData({ ...plotData, industri: e.target.value })}
                className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium focus:outline-primary"
              >
                <option value="PT. Universal Big Data">PT. Universal Big Data</option>
                <option value="PT. Telkom Indonesia">PT. Telkom Indonesia</option>
                <option value="PT CEO Batu Giok">PT CEO Batu Giok</option>
                <option value="PT. Solusi Digital Nusantara">PT. Solusi Digital Nusantara</option>
                <option value="CV. Media Grafika Kreatif">CV. Media Grafika Kreatif</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Guru Pembimbing</Label>
              <select
                value={plotData.guru_pembimbing}
                onChange={(e) => setPlotData({ ...plotData, guru_pembimbing: e.target.value })}
                className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium focus:outline-primary"
              >
                <option value="Guru Pembimbing, S.Kom.">Guru Pembimbing, S.Kom.</option>
                <option value="Dra. Endang Wahyuni, M.Pd.">Dra. Endang Wahyuni, M.Pd.</option>
                <option value="Rian Pratama, S.Kom., M.Cs.">Rian Pratama, S.Kom., M.Cs.</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPlottingOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Batal
              </Button>
              <Button type="submit" className="rounded-xl text-xs h-9 bg-blue-600 hover:bg-blue-700">
                Simpan Plotting
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: UBAH STATUS MAGANG */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Ubah Status Magang
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveStatus} className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Pilih status baru untuk <strong className="text-foreground">{selectedSiswa?.nama}</strong>.
            </p>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  statusValue === "magang" ? "border-blue-600 bg-blue-50/50" : "border-border hover:bg-muted/40"
                }`}
                onClick={() => setStatusValue("magang")}
              >
                <span className="text-xs font-semibold text-foreground">Sedang Magang</span>
                {statusValue === "magang" && <Check className="h-4 w-4 text-blue-600" />}
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  statusValue === "lulus" ? "border-emerald-600 bg-emerald-50/50" : "border-border hover:bg-muted/40"
                }`}
                onClick={() => setStatusValue("lulus")}
              >
                <span className="text-xs font-semibold text-foreground">Lulus Magang</span>
                {statusValue === "lulus" && <Check className="h-4 w-4 text-emerald-600" />}
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  statusValue === "belum_mengajukan" ? "border-amber-600 bg-amber-50/50" : "border-border hover:bg-muted/40"
                }`}
                onClick={() => setStatusValue("belum_mengajukan")}
              >
                <span className="text-xs font-semibold text-foreground">Belum Magang</span>
                {statusValue === "belum_mengajukan" && <Check className="h-4 w-4 text-amber-600" />}
              </label>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsStatusOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Batal
              </Button>
              <Button type="submit" className="rounded-xl text-xs h-9 bg-blue-600 hover:bg-blue-700">
                Terapkan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Hapus Data Siswa"
        description="Apakah Anda yakin ingin menghapus data siswa ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus Siswa"
        onConfirm={handleDelete}
      />
    </div>
  );
}
