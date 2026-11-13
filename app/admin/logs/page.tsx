"use client";

import * as React from "react";
import {
  Search,
  FileText,
  Filter,
  Eye,
  Trash2,
  Clock,
  Shield,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { ActivityLog } from "@/types/database";

export default function AdminLogsPage() {
  const [logs, setLogs] = React.useState<ActivityLog[]>([
    {
      id: "l1",
      actor_email: "admin@simmas.sch.id",
      actor_role: "admin",
      action_type: "LOGIN_SUCCESS",
      entity_type: "AUTH",
      level: "INFO",
      ip_address: "127.0.0.1",
      metadata: { method: "password", browser: "Chrome/Next.js" },
      created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
    {
      id: "l2",
      actor_email: "admin@simmas.sch.id",
      actor_role: "admin",
      action_type: "UPDATE_SETTINGS",
      entity_type: "SETTINGS",
      entity_id: "1",
      level: "INFO",
      ip_address: "127.0.0.1",
      metadata: { tab: "Identitas Aplikasi", updated_fields: ["appName"] },
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "l3",
      actor_email: "guru@simmas.sch.id",
      actor_role: "guru",
      action_type: "VALIDATE_JURNAL",
      entity_type: "JURNAL",
      entity_id: "j1",
      level: "INFO",
      ip_address: "127.0.0.1",
      metadata: { status: "disetujui", student_nis: "21001" },
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "l4",
      actor_email: "siswa@simmas.sch.id",
      actor_role: "siswa",
      action_type: "SUBMIT_PRESENSI",
      entity_type: "ABSENSI",
      entity_id: "a1",
      level: "INFO",
      ip_address: "127.0.0.1",
      metadata: { status: "hadir", time: "07:30" },
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ]);

  const [search, setSearch] = React.useState("");
  const [filterLevel, setFilterLevel] = React.useState("Semua");
  const [selectedLog, setSelectedLog] = React.useState<ActivityLog | null>(null);

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.action_type.toLowerCase().includes(search.toLowerCase()) ||
      l.actor_email.toLowerCase().includes(search.toLowerCase()) ||
      l.entity_type.toLowerCase().includes(search.toLowerCase());
    const matchLevel =
      filterLevel === "Semua" || l.level === filterLevel;
    return matchSearch && matchLevel;
  });

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Log Aktivitas & Audit
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Rekam jejak seluruh operasi sistem, autentikasi, validasi, dan perubahan data.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setLogs([]);
            toast.success("Log audit tampilan berhasil dibersihkan.");
          }}
          className="rounded-xl text-xs font-semibold self-start sm:self-auto gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
          Bersihkan Log
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari aksi, aktor, entitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground focus-visible:outline-primary w-full sm:w-auto"
          >
            <option value="Semua">Semua Level</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b border-border/80">
              <tr className="text-left font-bold text-muted-foreground">
                <th className="p-4 uppercase tracking-wider">Waktu</th>
                <th className="p-4 uppercase tracking-wider">Level</th>
                <th className="p-4 uppercase tracking-wider">Aksi</th>
                <th className="p-4 uppercase tracking-wider">Aktor</th>
                <th className="p-4 uppercase tracking-wider">IP Address</th>
                <th className="p-4 uppercase tracking-wider text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-muted-foreground font-mono">
                    {new Date(log.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        log.level === "INFO"
                          ? "info"
                          : log.level === "WARN"
                          ? "warning"
                          : "destructive"
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {log.level}
                    </Badge>
                  </td>
                  <td className="p-4 font-bold text-foreground">
                    {log.action_type}
                    <span className="text-[10px] text-muted-foreground block font-normal">
                      Entitas: {log.entity_type}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-foreground">
                    {log.actor_email}
                    <span className="text-[10px] text-muted-foreground block font-normal uppercase">
                      Role: {log.actor_role}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">
                    {log.ip_address || "127.0.0.1"}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedLog(log)}
                      className="h-8 text-xs font-semibold gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Metadata
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Metadata Dialog */}
      {selectedLog && (
        <Dialog open={true} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Metadata Audit Log</DialogTitle>
              <DialogDescription>
                Rincian payload operasi {selectedLog.action_type}
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-50 font-mono text-xs overflow-x-auto leading-relaxed border border-border">
                {JSON.stringify(
                  {
                    id: selectedLog.id,
                    action: selectedLog.action_type,
                    actor: selectedLog.actor_email,
                    role: selectedLog.actor_role,
                    timestamp: selectedLog.created_at,
                    ip: selectedLog.ip_address,
                    metadata: selectedLog.metadata,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <DialogFooter>
              <Button size="sm" onClick={() => setSelectedLog(null)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

