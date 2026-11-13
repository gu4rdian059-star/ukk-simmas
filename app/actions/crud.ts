"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createGuruAction(data: {
  nip: string;
  nama: string;
  email: string;
  jurusan: string;
  no_telepon?: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("guru").insert({
      nip: data.nip,
      nama: data.nama,
      email: data.email,
      jurusan: data.jurusan,
      no_telepon: data.no_telepon || null,
      status: "aktif",
    });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/guru");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateGuruAction(
  id: string,
  data: {
    nip: string;
    nama: string;
    email: string;
    jurusan: string;
    status: "aktif" | "nonaktif";
  }
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("guru")
      .update({
        nip: data.nip,
        nama: data.nama,
        email: data.email,
        jurusan: data.jurusan,
        status: data.status,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/guru");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteGuruAction(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("guru").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/guru");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createSiswaAction(data: {
  nis: string;
  nama: string;
  email: string;
  kelas: string;
  jurusan?: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("siswa").insert({
      nis: data.nis,
      nama: data.nama,
      email: data.email,
      kelas: data.kelas,
      jurusan: data.jurusan || "Rekayasa Perangkat Lunak",
      status_magang: "belum_mengajukan",
    });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/siswa");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateSiswaAction(
  id: string,
  data: {
    nis: string;
    nama: string;
    email: string;
    kelas: string;
    status_magang: "belum_mengajukan" | "menunggu" | "magang" | "selesai" | "dibatalkan";
  }
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("siswa")
      .update({
        nis: data.nis,
        nama: data.nama,
        email: data.email,
        kelas: data.kelas,
        status_magang: data.status_magang,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/siswa");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteSiswaAction(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("siswa").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/siswa");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function plottingSiswaAction(
  siswaId: string,
  guruId: string,
  dudiId: string
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("siswa")
      .update({
        guru_id: guruId,
        dudi_id: dudiId,
        status_magang: "magang",
      })
      .eq("id", siswaId);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/siswa");
    revalidatePath("/admin/monitoring");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createDudiAction(data: {
  nama_perusahaan: string;
  bidang_usaha: string;
  penanggung_jawab: string;
  kontak: string;
  alamat: string;
  kuota: number;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("tempat_magang").insert({
      ...data,
      status: "terverifikasi",
    });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/dudi");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateDudiAction(
  id: string,
  data: {
    nama_perusahaan: string;
    bidang_usaha: string;
    penanggung_jawab: string;
    kontak: string;
    alamat: string;
    kuota: number;
    status: "terverifikasi" | "menunggu" | "ditolak";
  }
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("tempat_magang")
      .update(data)
      .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/dudi");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteDudiAction(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("tempat_magang").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/dudi");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createPenempatanAction(data: {
  siswa_id: string;
  dudi_id: string;
  guru_id: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("penempatan_magang").insert({
      ...data,
      status: "aktif",
    });

    if (error) throw new Error(error.message);

    await supabase
      .from("siswa")
      .update({
        status_magang: "magang",
        guru_id: data.guru_id,
        dudi_id: data.dudi_id,
      })
      .eq("id", data.siswa_id);

    revalidatePath("/admin/penempatan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function approvePengajuanAction(
  pengajuanId: string,
  dudiId: string,
  guruId: string
) {
  try {
    const supabase = await createClient();
    const { data: pengajuan, error: pErr } = await supabase
      .from("pengajuan_magang")
      .select("*")
      .eq("id", pengajuanId)
      .single();

    if (pErr) throw new Error(pErr.message);

    await supabase
      .from("pengajuan_magang")
      .update({ status: "disetujui" })
      .eq("id", pengajuanId);

    await supabase.from("penempatan_magang").insert({
      siswa_id: pengajuan.siswa_id,
      dudi_id: dudiId || pengajuan.dudi_id,
      guru_id: guruId,
      tanggal_mulai: pengajuan.tanggal_mulai,
      tanggal_selesai: pengajuan.tanggal_selesai,
      status: "aktif",
    });

    await supabase
      .from("siswa")
      .update({
        status_magang: "magang",
        guru_id: guruId,
        dudi_id: dudiId || pengajuan.dudi_id,
      })
      .eq("id", pengajuan.siswa_id);

    revalidatePath("/admin/penempatan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function rejectPengajuanAction(pengajuanId: string, alasan: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("pengajuan_magang")
      .update({
        status: "ditolak",
        alasan_penolakan: alasan,
      })
      .eq("id", pengajuanId);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/penempatan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateSettingsAction(data: {
  appName: string;
  appDescription: string;
  contactEmail: string;
  landingHeroTitle: string;
  landingHeroSubtitle: string;
  landingHeroDescription: string;
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolWebsite: string;
  principalName: string;
  principalNip: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("app_settings")
      .upsert({
        id: 1,
        app_name: data.appName,
        app_description: data.appDescription,
        contact_email: data.contactEmail,
        landing_hero_title: data.landingHeroTitle,
        landing_hero_subtitle: data.landingHeroSubtitle,
        landing_hero_description: data.landingHeroDescription,
        school_name: data.schoolName,
        school_address: data.schoolAddress,
        school_phone: data.schoolPhone,
        school_website: data.schoolWebsite,
        principal_name: data.principalName,
        principal_nip: data.principalNip,
      });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitNilaiAction(
  penempatanId: string,
  nilai: number,
  catatan?: string
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("penempatan_magang")
      .update({
        nilai_akhir: nilai,
        catatan_nilai: catatan || null,
      })
      .eq("id", penempatanId);

    if (error) throw new Error(error.message);
    revalidatePath("/guru/siswa");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function validateJurnalAction(
  jurnalId: string,
  status: "disetujui" | "revisi",
  catatan?: string
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("jurnal_harian")
      .update({
        status,
        catatan_guru: catatan || null,
        validated_at: new Date().toISOString(),
      })
      .eq("id", jurnalId);

    if (error) throw new Error(error.message);
    revalidatePath("/guru/jurnal");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function validateAbsensiAction(
  absensiId: string,
  status: "approved" | "rejected",
  catatan?: string
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("absensi")
      .update({
        validasi_status: status,
        catatan_guru: catatan || null,
        validated_at: new Date().toISOString(),
      })
      .eq("id", absensiId);

    if (error) throw new Error(error.message);
    revalidatePath("/guru/jurnal");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createKunjunganAction(data: {
  dudi_id: string;
  tanggal: string;
  catatan: string;
  photo_url?: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("kunjungan").insert({
      ...data,
      guru_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", // fallback or auth
    });

    if (error) throw new Error(error.message);
    revalidatePath("/guru/kunjungan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteKunjunganAction(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("kunjungan").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/guru/kunjungan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitPengajuanAction(data: {
  dudi_id?: string;
  posisi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("pengajuan_magang").insert({
      siswa_id: "10000000-0000-0000-0000-000000000001",
      dudi_id: data.dudi_id || null,
      posisi: data.posisi,
      tanggal_mulai: data.tanggal_mulai,
      tanggal_selesai: data.tanggal_selesai,
      status: "menunggu",
    });

    if (error) throw new Error(error.message);
    revalidatePath("/siswa/pengajuan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitClockInAction(
  status: "hadir" | "izin" | "sakit",
  catatan?: string
) {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().slice(0, 10);
    const time = new Date().toTimeString().slice(0, 5);

    const { error } = await supabase.from("absensi").upsert(
      {
        siswa_id: "10000000-0000-0000-0000-000000000001",
        tanggal: today,
        status,
        waktu_masuk: time,
        catatan: catatan || null,
        validasi_status: "pending",
      },
      { onConflict: "siswa_id,tanggal" }
    );

    if (error) throw new Error(error.message);
    revalidatePath("/siswa/absensi");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitClockOutAction() {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().slice(0, 10);
    const time = new Date().toTimeString().slice(0, 5);

    const { error } = await supabase
      .from("absensi")
      .update({ waktu_pulang: time })
      .eq("siswa_id", "10000000-0000-0000-0000-000000000001")
      .eq("tanggal", today);

    if (error) throw new Error(error.message);
    revalidatePath("/siswa/absensi");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createJurnalAction(data: {
  tanggal: string;
  kegiatan: string;
  kendala?: string;
  solusi?: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("jurnal_harian").insert({
      siswa_id: "10000000-0000-0000-0000-000000000001",
      tanggal: data.tanggal,
      kegiatan: data.kegiatan,
      kendala: data.kendala || null,
      solusi: data.solusi || null,
      status: "menunggu",
    });

    if (error) throw new Error(error.message);
    revalidatePath("/siswa/jurnal");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteJurnalAction(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("jurnal_harian").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/siswa/jurnal");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

