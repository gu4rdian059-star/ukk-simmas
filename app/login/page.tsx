"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithSupabase } from "@/app/actions/auth";
import { toast } from "sonner";
import type { UserRole } from "@/types/database";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const demoAccounts = [
    { email: "admin@simmas.sch.id", role: "Admin" },
    { email: "guru@simmas.sch.id", role: "Guru" },
    { email: "siswa@simmas.sch.id", role: "Siswa" },
  ];

  const handleDemoClick = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Silakan masukkan email dan password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginWithSupabase(email, password);

      if (res.success && res.role) {
        setIsSuccess(true);
        toast.success("Autentikasi berhasil!");

        const targetRoute =
          res.role === "admin"
            ? "/admin/dashboard"
            : res.role === "guru"
            ? "/guru/dashboard"
            : "/siswa/dashboard";

        setTimeout(() => {
          router.push(targetRoute);
        }, 600);
      } else {
        setErrorMessage(res.error || "Email atau password salah.");
        toast.error(res.error || "Gagal masuk.");
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi.");
      toast.error("Terjadi kesalahan.");
      setIsLoading(false);
    }
  };

  // Fullscreen Loading Transition on Successful Login
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center text-center max-w-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative p-5 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg">
              <Logo className="h-12 w-12" showText={false} />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>Autentikasi Berhasil</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-2">
            Mengalihkan ke Dashboard...
          </h2>
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
            Mohon tunggu sebentar, sedang menyiapkan data dashboard Anda.
          </p>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold border border-border shadow-xs">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Memuat halaman...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* 1. LEFT BRANDING PANEL */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[42%] relative flex-col overflow-hidden bg-primary select-none shrink-0 text-primary-foreground">
        {/* Background Geometric Elements */}
        <div className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full border-[56px] border-primary-foreground/10 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full border-[40px] border-primary-foreground/[0.07] pointer-events-none" />
        <div
          className="absolute bottom-0 right-0 w-32 h-full bg-primary-foreground/[0.04] pointer-events-none"
          style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }}
        />

        <div className="relative z-10 flex flex-col h-full px-10 xl:px-14 py-12 justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm p-1.5">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-lg font-bold tracking-tight text-primary-foreground">
              jagang company
            </span>
          </Link>

          <div className="my-auto py-8">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary-foreground/60 mb-5">
              Sistem Informasi Manajemen Magang Siswa
            </p>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-primary-foreground leading-[1.1] tracking-tight mb-6">
              Magang <br />
              <span className="text-primary-foreground/50">lebih</span> <br />
              teratur.
            </h1>
            <p className="text-sm xl:text-base text-primary-foreground/75 leading-relaxed max-w-sm mb-10">
              Platform manajemen magang siswa SMK yang menghubungkan sekolah,
              guru pembimbing, dan dunia usaha dalam satu sistem terpadu.
            </p>

            <ul className="space-y-3">
              {[
                "Penempatan magang terpusat & transparan",
                "Monitoring kehadiran & jurnal real-time",
                "Koordinasi sekolah, guru, dan industri",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs xl:text-sm text-primary-foreground/90 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground/70 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-4 border-t border-primary-foreground/15 pt-6 text-center">
            <div>
              <p className="text-xl font-extrabold text-primary-foreground">50+</p>
              <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">SMK Aktif</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-primary-foreground">10k+</p>
              <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Siswa Terdaftar</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-primary-foreground">200+</p>
              <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60">Mitra DUDI</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. RIGHT LOGIN PANEL */}
      <main className="flex flex-1 flex-col justify-center bg-background px-6 sm:px-12 lg:px-14 xl:px-20 py-12">
        <div className="mx-auto w-full max-w-[360px]">
          {/* Mobile Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8 lg:hidden">
            <Logo />
          </Link>

          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-4">
            Portal Masuk
          </p>
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-[1.1] text-foreground mb-2">
            Masuk ke <br />
            <span className="text-primary">akun Anda.</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Gunakan email sekolah dan password yang diberikan oleh admin sekolah Anda.
          </p>

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Sekolah</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id"
                autoComplete="email"
                required
                className="h-11"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => toast.info("Silakan hubungi administrator sekolah untuk reset password.")}
                  className="text-[10px] uppercase tracking-[0.1em] font-bold text-primary hover:text-primary/70 transition-colors"
                >
                  Lupa?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-sm font-bold tracking-wide mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengautentikasi...
                </>
              ) : (
                <>
                  Masuk Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* 3. DEMO ACCOUNTS */}
          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">
              Akun Demo
            </p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleDemoClick(account.email)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 transition-all group text-left cursor-pointer"
                >
                  <span className="text-xs font-mono text-foreground">
                    {account.email}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    {account.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">
              Klik akun demo untuk mengisi email secara otomatis.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

