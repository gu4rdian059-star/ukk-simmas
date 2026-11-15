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
import {
  fetchDudiListAction,
  fetchKunjunganListAction,
  createKunjunganAction,
  deleteKunjunganAction,
} from "@/app/actions/crud";
import { toast } from "sonner";

interface KunjunganItem {
  id: string;
  dudi_id?: string;
  dudiName: string;
  dudiAddress: string;
  guruName?: string;
  tanggal: string;
  catatan: string;
  photoUrl?: string | null;
}

export default function GuruKunjunganPage() {
  const [kunjunganList, setKunjunganList] = React.useState<KunjunganItem[]>([]);
  const [dudiList, setDudiList] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    dudi_id: "",
    tanggal: new Date().toISOString().slice(0, 10),
    catatan: "",
  });
  const [isSaving, setIsSaving] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const [kRes, dRes] = await Promise.all([
        fetchKunjunganListAction(),
        fetchDudiListAction(),
      ]);

      if (kRes.success && kRes.data) {
        setKunjunganList(kRes.data);
      }
      if (dRes.success && dRes.data) {
        setDudiList(dRes.data);
        if (dRes.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            dudi_id: prev.dudi_id || dRes.data[0].id,
          }));
        }
      }
    } catch (err) {
      console.error("Gagal memuat kunjungan:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dudi_id) {
      toast.error("Mohon pilih mitra industri.");
      return;
    }
    if (!formData.catatan.trim()) {
      toast.error("Mohon isi catatan hasil kunjungan lapangan.");
      return;
    }

    setIsSaving(true);
    const res = await createKunjunganAction({
      dudi_id: formData.dudi_id,
      tanggal: formData.tanggal,
      catatan: formData.catatan,
    });

    if (!res.success) {
      toast.error(res.error || "Gagal menyimpan kunjungan.");
      setIsSaving(false);
      return;
    }

    toast.success("Catatan kunjungan lapangan berhasil ditambahkan.");
    setIsSaving(false);
    setIsAddOpen(false);
    setFormData((prev) => ({
      ...prev,
      tanggal: new Date().toISOString().slice(0, 10),
      catatan: "",
    }));
    await loadData();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await deleteKunjunganAction(deletingId);
    if (!res.success) {
      toast.error(res.error || "Gagal menghapus kunjungan.");
      return;
    }
    toast.success("Catatan kunjungan berhasil dihapus.");
    setDeletingId(null);
    await loadData();
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Kunjungan Supervisi Lapangan
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Dokumentasikan kunjungan monitoring dan evaluasi kondisi siswa di tempat magang industri.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="rounded-xl font-bold gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Catat Kunjungan Baru
        </Button>
      </div>

      {/* List of Visits */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Memuat catatan kunjungan...
          </div>
        ) : kunjunganList.length === 0 ? (
          <Card className="p-8 text-center text-xs text-muted-foreground">
            Belum ada catatan kunjungan lapangan yang tersimpan di sistem.
          </Card>
        ) : (
          kunjunganList.map((k) => (
            <Card key={k.id} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
          ))
        )}
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
                  value={formData.dudi_id}
                  onChange={(e) => setFormData({ ...formData, dudi_id: e.target.value })}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary"
                >
                  {dudiList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama_perusahaan}
                    </option>
                  ))}
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
                  placeholder="Tuliskan perkembangan kompetensi siswa, kondisi lingkungan kerja, atau hasil dialog bersama mentor industri..."
                  rows={4}
                  required
                />
              </div>

              <DialogFooter className="gap-2 sm:justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                  disabled={isSaving}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSaving} className="font-bold">
                  {isSaving ? "Menyimpan..." : "Simpan Kunjungan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Hapus Catatan Kunjungan"
        description="Apakah Anda yakin ingin menghapus catatan kunjungan lapangan ini?"
        confirmLabel="Hapus Kunjungan"
        onConfirm={handleDelete}
      />
    </div>
  );
}
