"use client";

import * as React from "react";
import {
  BookOpen,
  Calendar,
  Send,
  CheckCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  Clock,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  createJurnalAction,
  deleteJurnalAction,
  fetchSiswaJurnalAction,
} from "@/app/actions/crud";
import { toast } from "sonner";

interface JurnalItem {
  id: string;
  tanggal: string;
  kegiatan: string;
  kendala?: string | null;
  solusi?: string | null;
  status: string;
  catatanGuru?: string | null;
}

export default function SiswaJurnalPage() {
  const [jurnalList, setJurnalList] = React.useState<JurnalItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [formData, setFormData] = React.useState({
    tanggal: new Date().toISOString().slice(0, 10),
    kegiatan: "",
    kendala: "",
    solusi: "",
  });

  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetchSiswaJurnalAction();
      if (res.success && res.data) {
        setJurnalList(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat jurnal:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.kegiatan.trim().length < 15) {
      toast.error("Uraian kegiatan minimal harus 15 karakter.");
      return;
    }

    setIsSubmitting(true);
    const res = await createJurnalAction(formData);

    if (!res.success) {
      toast.error(res.error || "Gagal menyimpan jurnal.");
      setIsSubmitting(false);
      return;
    }

    toast.success("Jurnal kegiatan harian berhasil dikirim untuk dievaluasi!");
    setFormData({
      tanggal: new Date().toISOString().slice(0, 10),
      kegiatan: "",
      kendala: "",
      solusi: "",
    });
    await loadData();
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await deleteJurnalAction(deletingId);
    if (!res.success) {
      toast.error(res.error || "Gagal menghapus jurnal.");
      return;
    }
    toast.success("Entri jurnal berhasil dihapus.");
    setDeletingId(null);
    await loadData();
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Jurnal Kegiatan Harian
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Dokumentasikan ringkasan pekerjaan, kendala teknis, serta solusi pemecahan masalah selama magang.
        </p>
      </div>

      {/* Form Input Card */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-foreground mb-1">
          Tulis Jurnal Kegiatan Baru
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          Deskripsikan pekerjaan Anda hari ini secara jelas dan objektif (minimal 15 karakter).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full sm:w-60">
            <Label htmlFor="tglJurnal">Tanggal Kegiatan</Label>
            <Input
              id="tglJurnal"
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="kegiatan">Uraian Rincian Kegiatan</Label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {formData.kegiatan.length}/15 karakter minimum
              </span>
            </div>
            <Textarea
              id="kegiatan"
              value={formData.kegiatan}
              onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
              placeholder="Jelaskan modul yang dikerjakan, bug yang diperbaiki, atau materi yang dipelajari hari ini..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kendala">Kendala yang Dihadapi (Opsional)</Label>
              <Textarea
                id="kendala"
                value={formData.kendala}
                onChange={(e) => setFormData({ ...formData, kendala: e.target.value })}
                placeholder="Kesulitan teknis, kendala jaringan, atau ketidaksesuaian API..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="solusi">Solusi / Pemecahan Masalah (Opsional)</Label>
              <Textarea
                id="solusi"
                value={formData.solusi}
                onChange={(e) => setFormData({ ...formData, solusi: e.target.value })}
                placeholder="Cara mengatasi kendala, diskusi dengan mentor, atau referensi dokumentasi..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="lg"
              className="rounded-xl px-7 font-bold gap-2"
              disabled={isSubmitting || formData.kegiatan.trim().length < 15}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengirim Jurnal...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Kirim Jurnal Harian
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* History Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border/80">
          <h3 className="font-bold text-sm text-foreground">
            Riwayat Jurnal Kegiatan ({jurnalList.length} Entri)
          </h3>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Memuat data jurnal...
            </div>
          ) : jurnalList.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Belum ada jurnal kegiatan yang dibuat. Silakan isi form di atas.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b border-border/80">
                <tr className="text-left font-bold text-muted-foreground">
                  <th className="p-4 uppercase tracking-wider">Tanggal</th>
                  <th className="p-4 uppercase tracking-wider">Uraian Kegiatan</th>
                  <th className="p-4 uppercase tracking-wider">Kendala & Solusi</th>
                  <th className="p-4 uppercase tracking-wider">Status & Catatan Guru</th>
                  <th className="p-4 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {jurnalList.map((j) => (
                  <tr key={j.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono font-medium text-foreground whitespace-nowrap">
                      {j.tanggal}
                    </td>
                    <td className="p-4 max-w-sm">
                      <p className="font-medium text-foreground leading-relaxed">
                        {j.kegiatan}
                      </p>
                    </td>
                    <td className="p-4 max-w-xs text-muted-foreground">
                      <p className="line-clamp-1">K: {j.kendala || "-"}</p>
                      <p className="line-clamp-1">S: {j.solusi || "-"}</p>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          j.status === "disetujui"
                            ? "success"
                            : j.status === "menunggu"
                            ? "warning"
                            : "destructive"
                        }
                        className="text-[10px] uppercase font-bold mb-1"
                      >
                        {j.status}
                      </Badge>
                      {j.catatanGuru && (
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold italic mt-0.5">
                          "{j.catatanGuru}"
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {j.status !== "disetujui" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingId(j.id)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          aria-label="Hapus jurnal"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Terkunci</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Hapus Entri Jurnal"
        description="Apakah Anda yakin ingin menghapus laporan jurnal kegiatan ini?"
        confirmLabel="Hapus Jurnal"
        onConfirm={handleDelete}
      />
    </div>
  );
}
