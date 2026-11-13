import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "jagang company - Sistem Informasi Manajemen Magang Siswa",
  description:
    "Platform terpusat pengelolaan magang SMK. Mudah, modern, dan efisien untuk Siswa, Guru, dan Admin.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full scroll-smooth antialiased font-sans"
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
