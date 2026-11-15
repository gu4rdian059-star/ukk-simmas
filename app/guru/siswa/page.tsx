"use client";

import * as React from "react";
import {
  Users,
  Search,
  Award,
  Edit3,
  Building2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  submitNilaiAction,
  fetchGuruSiswaBimbinganAction,
} from "@/app/actions/crud";
import { toast } from "sonner";

export default function GuruSiswaPage() {
  const [siswaList, setSiswaList] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [gradingStudent, setGradingStudent] = React.useState<any | null>(null);
  const [scoreInput, setScoreInput] = React.useState(85);
  const [notesInput, setNotesInput] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetchGuruSiswaBimbinganAction();
      if (res.success && res.data) {
        setSiswaList(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat siswa bimbingan:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenGrading = (s: any) => {
    setGradingStudent(s);
    setScoreInput(s.nilaiAkhir ?? 85);
    setNotesInput(s.catatanNilai ?? "");
  };

  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingStudent) return;
    if (scoreInput < 0 || scoreInput > 100) {
      toast.error("Nilai harus berada dalam rentang 0 sampai 100.");
      return;
    }

    if (!gradingStudent.penempatanId) {
      toast.error("Siswa ini belum memiliki penempatan magang aktif.");
      return;
    }

    setIsSaving(true);
    const res = await submitNilaiAction(gradingStudent.penempatanId, scoreInput, notesInput);
    if (!res.success) {
      toast.error(res.error || "Gagal menyimpan nilai.");
      setIsSaving(false);
      return;
    }

    toast.success("Nilai akhir dan evaluasi berhasil disimpan.");
    setIsSaving(false);
    setGradingStudent(null);
    await loadData();
  };

  const filtered = siswaList.filter(
    (s) =>
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      s.dudiName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Siswa Bimbingan
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Daftar seluruh siswa magang yang berada di bawah bimbingan Anda beserta status penilaian akhir.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Cari nama, NIS, DUDI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border/80">
              <tr className="text-left font-bold text-muted-foreground">
                <th className="p-4 uppercase tracking-wider">Nama Siswa</th>
                <th className="p-4 uppercase tracking-wider">NIS</th>
                <th className="p-4 uppercase tracking-wider">Kelas</th>
                <th className="p-4 uppercase tracking-wider">Tempat Magang</th>
                <th className="p-4 uppercase tracking-wider">Status Magang</th>
                <th className="p-4 uppercase tracking-wider">Nilai Akhir</th>
                <th className="p-4 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-bold text-foreground">{s.nama}</td>
                  <td className="p-4 font-mono text-muted-foreground">{s.nis}</td>
                  <td className="p-4 font-medium text-foreground">{s.kelas}</td>
                  <td className="p-4">
                    <p className="font-semibold text-blue-600">{s.dudiName}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-xs">
                      {s.dudiAddress}
                    </p>
                  </td>
                  <td className="p-4">
                    <Badge variant="success" className="text-[10px] uppercase font-bold">
                      {s.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {s.nilaiAkhir !== null ? (
                      <span className="font-extrabold text-sm text-emerald-600 font-mono">
                        {s.nilaiAkhir}
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">
                        Belum dinilai
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenGrading(s)}
                      className="h-8 text-xs font-semibold gap-1.5"
                    >
                      <Award className="h-3.5 w-3.5" />
                      {s.nilaiAkhir !== null ? "Revisi Nilai" : "Beri Nilai"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Grading Modal */}
      {gradingStudent && (
        <Dialog open={true} onOpenChange={() => setGradingStudent(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Penilaian Akhir Magang</DialogTitle>
              <DialogDescription>
                Berikan skor evaluasi (0-100) dan catatan rekomendasi untuk siswa bimbingan.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveScore} className="space-y-4 py-2">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs">
                <p className="font-bold text-foreground text-sm">{gradingStudent.nama}</p>
                <p className="text-muted-foreground mt-0.5">
                  NIS: {gradingStudent.nis} • Kelas: {gradingStudent.kelas}
                </p>
                <p className="text-blue-600 font-semibold mt-1">
                  DUDI: {gradingStudent.dudiName}
                </p>
              </div>

              <div>
                <Label htmlFor="nilai">Nilai Akhir (Skala 0 - 100)</Label>
                <Input
                  id="nilai"
                  type="number"
                  min="0"
                  max="100"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(parseFloat(e.target.value) || 0)}
                  className="font-mono text-base font-bold"
                  required
                />
              </div>

              <div>
                <Label htmlFor="catatan">Catatan Evaluasi / Catatan Guru</Label>
                <Textarea
                  id="catatan"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Catatan perkembangan, kedisiplinan, dan capaian kompetensi siswa..."
                  rows={3}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setGradingStudent(null)}
                  disabled={isSaving}
                >
                  Batal
                </Button>
                <Button type="submit" size="sm" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Nilai
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

