"use client";

import * as React from "react";
import { Save, Settings, Globe, School, Check, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { updateSettingsAction } from "@/app/actions/crud";
import { toast } from "sonner";
import type { AppSettings } from "@/types/database";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState("identitas");
  const [isSaving, setIsSaving] = React.useState(false);

  const [settings, setSettings] = React.useState({
    appName: "jagang company",
    appDescription: "Sistem Informasi Manajemen Magang Siswa",
    contactEmail: "info@simmas.sch.id",
    landingHeroTitle: "Magang\nlebih\nteratur.",
    landingHeroSubtitle: "Sistem Informasi Manajemen Magang Siswa",
    landingHeroDescription:
      "Platform manajemen magang siswa SMK yang menghubungkan sekolah, guru pembimbing, dan dunia usaha dalam satu sistem terpadu.",
    schoolName: "SMK Negeri 1 Surabaya",
    schoolAddress: "Jl. SMEA No. 4, Wonokromo, Surabaya",
    schoolPhone: "(031) 8292038",
    schoolWebsite: "www.smkn1-sby.sch.id",
    principalName: "Drs. H. Sugiyono, M.Pd.",
    principalNip: "196503151989031008",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettingsAction(settings);
      toast.success("Pengaturan sistem berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Pengaturan Sistem
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Sesuaikan identitas aplikasi, konten halaman depan, dan informasi profil sekolah.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="identitas" className="gap-2">
              <Settings className="h-3.5 w-3.5" />
              <span>Identitas Aplikasi</span>
            </TabsTrigger>
            <TabsTrigger value="landing" className="gap-2">
              <Globe className="h-3.5 w-3.5" />
              <span>Halaman Depan</span>
            </TabsTrigger>
            <TabsTrigger value="sekolah" className="gap-2">
              <School className="h-3.5 w-3.5" />
              <span>Data Sekolah</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: IDENTITAS */}
          <TabsContent value="identitas">
            <Card className="p-6 space-y-4">
              <div>
                <Label htmlFor="appName">Nama Aplikasi</Label>
                <Input
                  id="appName"
                  value={settings.appName}
                  onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="appDesc">Kepanjangan Aplikasi / Deskripsi</Label>
                <Input
                  id="appDesc"
                  value={settings.appDescription}
                  onChange={(e) => setSettings({ ...settings, appDescription: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Email Kontak Resmi</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  required
                />
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: HALAMAN DEPAN */}
          <TabsContent value="landing">
            <Card className="p-6 space-y-4">
              <div>
                <Label htmlFor="heroTitle">Judul Hero Landing (Gunakan enter untuk baris baru)</Label>
                <Textarea
                  id="heroTitle"
                  value={settings.landingHeroTitle}
                  onChange={(e) => setSettings({ ...settings, landingHeroTitle: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="heroSubtitle">Subjudul Hero</Label>
                <Input
                  id="heroSubtitle"
                  value={settings.landingHeroSubtitle}
                  onChange={(e) => setSettings({ ...settings, landingHeroSubtitle: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="heroDesc">Deskripsi Lengkap Hero</Label>
                <Textarea
                  id="heroDesc"
                  value={settings.landingHeroDescription}
                  onChange={(e) => setSettings({ ...settings, landingHeroDescription: e.target.value })}
                  rows={3}
                  required
                />
              </div>
            </Card>
          </TabsContent>

          {/* TAB 3: DATA SEKOLAH */}
          <TabsContent value="sekolah">
            <Card className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schoolName">Nama Sekolah</Label>
                  <Input
                    id="schoolName"
                    value={settings.schoolName}
                    onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="schoolWebsite">Website Sekolah</Label>
                  <Input
                    id="schoolWebsite"
                    value={settings.schoolWebsite}
                    onChange={(e) => setSettings({ ...settings, schoolWebsite: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="principalName">Nama Kepala Sekolah</Label>
                  <Input
                    id="principalName"
                    value={settings.principalName}
                    onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="principalNip">NIP Kepala Sekolah</Label>
                  <Input
                    id="principalNip"
                    value={settings.principalNip}
                    onChange={(e) => setSettings({ ...settings, principalNip: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="schoolAddress">Alamat Sekolah</Label>
                <Input
                  id="schoolAddress"
                  value={settings.schoolAddress}
                  onChange={(e) => setSettings({ ...settings, schoolAddress: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="schoolPhone">Nomor Telepon</Label>
                <Input
                  id="schoolPhone"
                  value={settings.schoolPhone}
                  onChange={(e) => setSettings({ ...settings, schoolPhone: e.target.value })}
                  required
                />
              </div>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="rounded-xl px-7 font-bold gap-2 shadow-sm"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Pengaturan
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  );
}

