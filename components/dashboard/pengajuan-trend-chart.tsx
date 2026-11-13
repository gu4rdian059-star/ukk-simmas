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

const dataTahun = [
  { name: "Jul", pengajuan: 12, disetujui: 11 },
  { name: "Agu", pengajuan: 18, disetujui: 18 },
  { name: "Sep", pengajuan: 8, disetujui: 8 },
  { name: "Okt", pengajuan: 14, disetujui: 14 },
  { name: "Nov", pengajuan: 6, disetujui: 5 },
  { name: "Des", pengajuan: 4, disetujui: 4 },
];

const dataBulan = [
  { name: "Minggu 1", pengajuan: 3, disetujui: 3 },
  { name: "Minggu 2", pengajuan: 5, disetujui: 5 },
  { name: "Minggu 3", pengajuan: 2, disetujui: 1 },
  { name: "Minggu 4", pengajuan: 4, disetujui: 4 },
];

const dataHari = [
  { name: "Sen", pengajuan: 2, disetujui: 2 },
  { name: "Sel", pengajuan: 1, disetujui: 1 },
  { name: "Rab", pengajuan: 3, disetujui: 3 },
  { name: "Kam", pengajuan: 0, disetujui: 0 },
  { name: "Jum", pengajuan: 2, disetujui: 1 },
  { name: "Sab", pengajuan: 0, disetujui: 0 },
  { name: "Min", pengajuan: 1, disetujui: 1 },
];

export function PengajuanTrendChart() {
  const [period, setPeriod] = React.useState<"hari" | "bulan" | "tahun">("tahun");
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData =
    period === "hari" ? dataHari : period === "bulan" ? dataBulan : dataTahun;

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
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
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
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
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
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
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
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPengajuan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorDisetujui" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
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
      </div>
    </div>
  );
}

