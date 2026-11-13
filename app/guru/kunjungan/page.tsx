"use client";

import * as React from "react";
import {
  MapPin,
  Plus,
  Calendar,
  Building2,
  Trash2,
  Edit2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import type { Kunjungan } from "@/types/database";

export default function GuruKunjunganPage() {
  const [kunjunganList, setKunjunganList] = React.useState<any[]>([
    {
      id: "k1",
      dudiName: "PT. Universal Big Data",
      dudiAddress: "Jl. Tasikmadu No. 88, Malang",
      tanggal: "2026-11-11",
      catatan: "Monitoring tahap pertama, siswa beradaptasi sangat baik dengan tim IT dan mentor industri.",
      photoUrl: null,
    },
    {
      id: "k2",
      dudiName: "PT. Telkom Indonesia",
      dudiAddress: "Jl. Ketintang No. 15, Surabaya",
      tanggal: "2026-10-15",
      catatan: "Evaluasi tengah semester bersama PIC DUDI, laporan kehadiran 100% disiplin.",
      photoUrl: null,
    },
  ]);

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    dudiName: "PT. Universal Big Data",
    tanggal: new Date().toISOString().slice(0, 10),
    catatan: "",
  });
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.catatan) {
      toast.error("Mohon isi catatan hasil kunjungan lapangan.");
      return;
    }

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    const newKunjungan = {
      id: "k-" + Date.now(),
      dudiName: formData.dudiName,
      dudiAddress: "Jl. Industri Rekayasa No. 1",
      tanggal: formData.tanggal,
      catatan: formData.catatan,
      photoUrl: null,
    };

    setKunjunganList((prev) => [newKunjungan, ...prev]);
    setIsSaving(false);
    setIsAddOpen(false);
    setFormData({
      dudiName: "PT. Universal Big Data",
      tanggal: new Date().toISOString().slice(0, 10),
      catatan: "",
    });
    toast.success("Catatan kunjungan lapangan berhasil ditambahkan.");
  };

  const handleDelete = () => {
    if (!deletingId) return;
    setKunjunganList((prev) => prev.filter((k) => k.id !== deletingId));
    toast.success("Catatan kunjungan berhasil dihapus.");
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Kunjungan Lapangan
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Dokumentasikan supervisi berkala dan koordinasi dengan mentor industri mitra.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="rounded-xl font-bold gap-2 self-start sm:self-auto shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Tambah Kunjungan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs">
          <p className="text-xs font-semibold text-muted-foreground">Total Kunjungan</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground font-mono">
            {kunjunganList.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs">
          <p className="text-xs font-semibold text-muted-foreground">Kunjungan Bulan Ini</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-600 font-mono">1</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs">
          <p className="text-xs font-semibold text-muted-foreground">Total DUDI Dikunjungi</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600 font-mono">
            {new Set(kunjunganList.map((k) => k.dudiName)).size} Mitra
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Kronologis Riwayat Kunjungan
        </h2>

        {kunjunganList.map((k) => (
          <Card key={k.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{k.dudiName}</h3>
                  <p className="text-[10px] text-muted-foreground">{k.dudiAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-muted/50 px-2.5 py-1 rounded-lg border border-border/60">
                  <Calendar className="h-3.5 w-3.5" />
                  {k.tanggal}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeletingId(k.id)}
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                  aria-label="Hapus kunjungan"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-foreground/85 leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border/50">
              "{k.catatan}"
            </p>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <Dialog open={true} onOpenChange={() => setIsAddOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Catat Kunjungan Lapangan</DialogTitle>
              <DialogDescription>
                Pilih DUDI yang dikunjungi, tanggal supervisi, dan rangkuman evaluasi.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-3.5 py-2">
              <div>
                <Label htmlFor="dudi">Pilih Mitra Industri (DUDI)</Label>
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
                <Label htmlFor="tanggal">Tanggal Kunjungan</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="catatan">Catatan Evaluasi / Hasil Monitoring</Label>
                <Textarea
                  id="catatan"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  placeholder="Deskripsikan hasil diskusi dengan PIC, progres pengerjaan modul, atau arahan kerja untuk siswa..."
                  rows={4}
                  required
                />
              </div>

              <DialogFooter className="pt-2">
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
                  Simpan Kunjungan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Hapus Kunjungan"
        description="Apakah Anda yakin ingin menghapus catatan kunjungan lapangan ini?"
        confirmLabel="Hapus"
        onConfirm={handleDelete}
      />
    </div>
  );
}

