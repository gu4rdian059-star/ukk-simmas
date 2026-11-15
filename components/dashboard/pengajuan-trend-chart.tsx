"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Info } from "lucide-react";

export interface RawPengajuanItem {
  id: string;
  status: string;
  date: string;
}

interface PengajuanTrendChartProps {
  rawPengajuan?: RawPengajuanItem[];
  totalPengajuan?: number;
}

const semesterMonths = [
  { name: "Jul", monthIndex: 6 },
  { name: "Agu", monthIndex: 7 },
  { name: "Sep", monthIndex: 8 },
  { name: "Okt", monthIndex: 9 },
  { name: "Nov", monthIndex: 10 },
  { name: "Des", monthIndex: 11 },
];

const monthWeeks = [
  { name: "Minggu 1", minDay: 1, maxDay: 7 },
  { name: "Minggu 2", minDay: 8, maxDay: 14 },
  { name: "Minggu 3", minDay: 15, maxDay: 21 },
  { name: "Minggu 4", minDay: 22, maxDay: 31 },
];

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function PengajuanTrendChart({
  rawPengajuan = [],
  totalPengajuan = 0,
}: PengajuanTrendChartProps) {
  const [period, setPeriod] = React.useState<"hari" | "bulan" | "tahun">("tahun");
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute real data strictly from database records
  const chartData = React.useMemo(() => {
    const records = Array.isArray(rawPengajuan) ? rawPengajuan : [];

    if (period === "tahun") {
      return semesterMonths.map((m) => {
        const matches = records.filter((r) => {
          if (!r.date) return false;
          const d = new Date(r.date);
          return !isNaN(d.getTime()) && d.getMonth() === m.monthIndex;
        });
        const disetujuiCount = matches.filter(
          (r) => r.status === "disetujui" || r.status === "aktif"
        ).length;
        return {
          name: m.name,
          pengajuan: matches.length,
          disetujui: disetujuiCount,
        };
      });
    }

    if (period === "bulan") {
      const currentMonth = new Date().getMonth();
      const thisMonthRecords = records.filter((r) => {
        if (!r.date) return false;
        const d = new Date(r.date);
        return !isNaN(d.getTime()) && d.getMonth() === currentMonth;
      });

      return monthWeeks.map((w) => {
        const matches = thisMonthRecords.filter((r) => {
          const day = new Date(r.date).getDate();
          return day >= w.minDay && day <= w.maxDay;
        });
        const disetujuiCount = matches.filter(
          (r) => r.status === "disetujui" || r.status === "aktif"
        ).length;
        return {
          name: w.name,
          pengajuan: matches.length,
          disetujui: disetujuiCount,
        };
      });
    }

    // "hari": 7 Hari Terakhir
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const target = new Date();
      target.setDate(today.getDate() - i);
      const targetDateStr = target.toISOString().slice(0, 10);
      const label = dayNames[target.getDay()];

      const matches = records.filter((r) => {
        if (!r.date) return false;
        return r.date.startsWith(targetDateStr);
      });
      const disetujuiCount = matches.filter(
        (r) => r.status === "disetujui" || r.status === "aktif"
      ).length;

      days.push({
        name: label,
        pengajuan: matches.length,
        disetujui: disetujuiCount,
      });
    }
    return days;
  }, [period, rawPengajuan]);

  const maxVal = React.useMemo(() => {
    return Math.max(...chartData.map((d) => Math.max(d.pengajuan, d.disetujui)), 0);
  }, [chartData]);

  const hasData = maxVal > 0;

  if (!isMounted) {
    return <div className="h-64 w-full rounded-xl bg-muted/40 animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      {/* Header filter toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <span className="font-semibold text-foreground">Pengajuan Masuk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-foreground">Disetujui</span>
          </div>
        </div>

        <div className="inline-flex rounded-xl bg-muted/60 p-1 border border-border/60">
          <button
            type="button"
            onClick={() => setPeriod("hari")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              period === "hari"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            7 Hari
          </button>
          <button
            type="button"
            onClick={() => setPeriod("bulan")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              period === "bulan"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            30 Hari
          </button>
          <button
            type="button"
            onClick={() => setPeriod("tahun")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              period === "tahun"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tahun Ini
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPengajuan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorDisetujui" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              domain={[0, Math.max(5, maxVal + 1)]}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="pengajuan"
              name="Pengajuan Masuk"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPengajuan)"
            />
            <Area
              type="monotone"
              dataKey="disetujui"
              name="Disetujui"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorDisetujui)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Empty state informative overlay when zero records exist */}
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/90 px-3.5 py-2 text-xs text-muted-foreground shadow-xs backdrop-blur-xs">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Belum ada usulan magang siswa pada periode ini (0 data).</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
