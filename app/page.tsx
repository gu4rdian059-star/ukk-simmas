import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Users,
  Building2,
  Clock,
  FileCheck,
  ShieldCheck,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const appName = "jagang company";

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. FLOATING HEADER */}
      <header className="fixed left-0 right-0 top-4 z-50 flex w-full justify-center px-4 sm:px-6 pointer-events-none">
        <div className="w-full max-w-6xl pointer-events-auto flex items-center justify-between rounded-full border border-border/60 bg-background/90 px-6 py-3.5 shadow-lg shadow-black/[0.03] backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <Logo title={appName} />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-semibold text-foreground/75 hover:text-primary transition-colors"
            >
              Fitur
            </a>
            <a
              href="#panduan"
              className="text-sm font-semibold text-foreground/75 hover:text-primary transition-colors"
            >
              Panduan
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-xs sm:text-sm">
                Masuk
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="rounded-full px-4 text-xs sm:text-sm font-bold shadow-xs">
                Mulai Sekarang
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-32">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/60 px-3.5 py-1 text-xs font-semibold text-muted-foreground mb-6 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Sistem Informasi Manajemen Magang Siswa
                </div>

                <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] mb-6">
                  Magang <br />
                  <span className="text-muted-foreground/60 font-semibold">lebih</span> <br />
                  teratur.
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
                  Platform manajemen magang siswa SMK yang menghubungkan sekolah,
                  guru pembimbing, dan dunia usaha dalam satu sistem terpadu.
                </p>

                <ul className="space-y-3 mb-10">
                  {[
                    "Penempatan magang terpusat & transparan",
                    "Monitoring kehadiran & jurnal real-time",
                    "Koordinasi sekolah, guru, dan industri",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/login">
                    <Button size="lg" className="rounded-xl px-7 font-bold shadow-md shadow-primary/20">
                      Mulai Sekarang
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button variant="outline" size="lg" className="rounded-xl px-6 font-semibold">
                      Lihat Fitur
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right Column: Hero Visual Mockup */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-background">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/50">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-warning/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-success/50" />
                    <div className="ml-3 flex-1 h-5 rounded bg-border/60 max-w-[160px]" />
                  </div>
                  <Image
                    src="/dashboard-mockup.png"
                    alt="Tampilan Dashboard jagang company"
                    width={840}
                    height={840}
                    priority
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Floating Live Badge */}
                <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-xl px-3.5 py-2.5 shadow-lg border border-primary-foreground/10 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold">Live</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURES SECTION */}
        <section id="features" className="py-24 border-t border-border/60 bg-muted/20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-3 px-3 py-1 font-bold text-xs uppercase tracking-wider">
                Fitur Platform
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                Solusi untuk setiap peran.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Siswa */}
              <Card className="p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="mb-5 inline-block">
                    <Badge variant="info" className="font-bold">
                      Untuk Siswa
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Jurnal & Kehadiran
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Catat jurnal harian dan isi daftar hadir secara digital dari
                    mana saja, kapan saja dengan validasi selfie dan foto kegiatan.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-border flex items-center text-xs font-bold text-primary">
                  <span>Lihat selengkapnya</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </div>
              </Card>

              {/* Card 2: Guru */}
              <Card className="p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300 border-primary/30 shadow-xs">
                <div>
                  <div className="mb-5 inline-block">
                    <Badge variant="success" className="font-bold">
                      Untuk Guru Pembimbing
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Monitoring Terpadu
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pantau aktivitas, setujui jurnal, catat kunjungan lapangan,
                    dan evaluasi performa siswa dalam satu dashboard terintegrasi.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-border flex items-center text-xs font-bold text-primary">
                  <span>Lihat selengkapnya</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </div>
              </Card>

              {/* Card 3: Admin */}
              <Card className="p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="mb-5 inline-block">
                    <Badge variant="warning" className="font-bold">
                      Untuk Admin Sekolah
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Manajemen Penempatan
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Kelola data DUDI, plotting pembimbing, atur kuota mitra, dan
                    pantau seluruh rekapitulasi siswa secara komprehensif.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-border flex items-center text-xs font-bold text-primary">
                  <span>Lihat selengkapnya</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. STATISTICS SECTION */}
        <section className="py-20 border-t border-border/60">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Jurnal Disetujui", value: "142+" },
                { label: "Absensi Tercatat", value: "98%" },
                { label: "Siswa Aktif", value: "324" },
                { label: "Perusahaan Mitra", value: "200+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-muted/40 border border-border/60"
                >
                  <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm font-semibold text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. GUIDE / CARA KERJA SECTION */}
        <section id="panduan" className="py-24 border-t border-border/60 bg-muted/20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-3 px-3 py-1 font-bold text-xs uppercase tracking-wider">
                Cara Kerja
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Empat langkah, satu sistem.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Registrasi DUDI",
                  desc: "Admin sekolah mendaftarkan daftar industri (DUDI) dan menetapkan kuota penempatan siswa.",
                },
                {
                  step: "02",
                  title: "Pengajuan Siswa",
                  desc: "Siswa memilih atau mengajukan tempat magang melalui dashboard masing-masing.",
                },
                {
                  step: "03",
                  title: "Persetujuan & Surat",
                  desc: "Sekolah memverifikasi dan menyetujui penempatan siswa ke pihak industri.",
                },
                {
                  step: "04",
                  title: "Monitoring",
                  desc: "Siswa mengisi jurnal harian, guru memantau perkembangan secara real-time dari sistem.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div>
                    <span className="text-3xl font-extrabold text-primary/40 font-mono">
                      {item.step}
                    </span>
                    <h4 className="mt-4 text-base font-bold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. BOTTOM CTA */}
        <section className="py-24 border-t border-border/60 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full border-[56px] border-primary-foreground/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full border-[40px] border-primary-foreground/[0.07] pointer-events-none" />

          <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary-foreground/70 mb-3 block">
              Mulai Sekarang
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
              Siap untuk digitalisasi magang?
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10 leading-relaxed">
              Tingkatkan efisiensi pemantauan dan evaluasi siswa magang dengan
              platform yang dirancang untuk produktivitas maksimal.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8 font-extrabold shadow-lg hover:bg-white"
              >
                Masuk ke Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="border-t border-border bg-card py-14">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1 space-y-3">
              <Logo title={appName} />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sistem Informasi Manajemen Magang Siswa untuk SMK modern.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Produk
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Fitur</a></li>
                <li><a href="#panduan" className="hover:text-foreground">Panduan</a></li>
                <li><span className="text-muted-foreground/60">Keamanan</span></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Akses
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground">Siswa</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Guru Pembimbing</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Administrator</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Legal
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><span className="text-muted-foreground/60">Kebijakan Privasi</span></li>
                <li><span className="text-muted-foreground/60">Ketentuan Layanan</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
            <p>© 2026 {appName}. Didesain untuk pendidikan Indonesia.</p>
            <p className="font-mono text-[11px]">Versi 2.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
