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
import { createJurnalAction, deleteJurnalAction } from "@/app/actions/crud";
import { toast } from "sonner";
import type { JurnalHarian } from "@/types/database";

export default function SiswaJurnalPage() {
  const [jurnalList, setJurnalList] = React.useState<any[]>([
    {
      id: "j1",
      tanggal: "2026-11-12",
      kegiatan: "Implementasi autentikasi JWT dan middleware RBAC pada Next.js",
      kendala: "Token refresh cookie sempat gagal tersimpan di browser.",
      solusi: "Menambahkan opsi SameSite Lax dan Path / pada server action cookie.",
      status: "menunggu",
      catatanGuru: null,
    },
    {
      id: "j2",
      tanggal: "2026-11-11",
      kegiatan: "Merancang desain database PostgreSQL Supabase untuk 10 tabel utama",
      kendala: "Penyesuaian foreign key delete cascade.",
      solusi: "Membaca dokumentasi PostgreSQL dan spesifikasi UKK.",
      status: "disetujui",
      catatanGuru: "Sangat baik, pertahankan kerapian ERD.",
    },
    {
      id: "j3",
      tanggal: "2026-11-10",
      kegiatan: "Setup repositori Next.js 16 dengan TypeScript dan Tailwind CSS",
      kendala: "Konfigurasi Tailwind CSS v4 dengan variabel CSS.",
      solusi: "Menyesuaikan @theme inline di globals.css.",
      status: "disetujui",
      catatanGuru: "Bagus.",
    },
  ]);

  const [formData, setFormData] = React.useState({
    tanggal: new Date().toISOString().slice(0, 10),
    kegiatan: "",
    kendala: "",
    solusi: "",
  });

  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.kegiatan.trim().length < 15) {
      toast.error("Uraian kegiatan minimal harus 15 karakter.");
      return;
    }

    setIsSubmitting(true);
    await createJurnalAction(formData);

    const newJurnal = {
      id: "j-" + Date.now(),
      tanggal: formData.tanggal,
      kegiatan: formData.kegiatan,
      kendala: formData.kendala,
      solusi: formData.solusi,
      status: "menunggu",
      catatanGuru: null,
    };

    setJurnalList((prev) => [newJurnal, ...prev]);
    setIsSubmitting(false);
    setFormData({
      tanggal: new Date().toISOString().slice(0, 10),
      kegiatan: "",
      kendala: "",
      solusi: "",
    });
    toast.success("Jurnal kegiatan harian berhasil dikirim untuk dievaluasi!");
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteJurnalAction(deletingId);
    setJurnalList((prev) => prev.filter((j) => j.id !== deletingId));
    toast.success("Entri jurnal berhasil dihapus.");
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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

