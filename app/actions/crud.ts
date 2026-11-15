"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const DEFAULT_PASSWORD_HASH = "$2y$12$N7oyjrBvZGcaSkEpdwxAquhfmkbZZCYo.fqnD16LW88uphCeM.5ta";

async function getSupabase() {
  try {
    return createAdminClient();
  } catch {
    return await createClient();
  }
}

// ----------------------------------------------------------------------
// 1. SISWA ACTIONS
// ----------------------------------------------------------------------

export async function fetchSiswaListAction() {
  try {
    const supabase = await getSupabase();
    // 1. Try with dudi_id and status (standard schema)
    let res: any = await supabase
      .from("siswa")
      .select(`
        id, user_id, nis, kelas, status_magang, is_active, created_at,
        profiles:user_id ( id, nama, email, is_active ),
        penempatan_magang (
          id, status,
          tempat_magang:dudi_id ( id, nama_perusahaan, alamat ),
          guru:guru_id ( id, nip, profiles:user_id ( id, nama, email ) )
        )
      `)
      .order("created_at", { ascending: false });

    // 2. If error, try with tempat_magang_id and status_pengesahan
    if (res.error) {
      res = await supabase
        .from("siswa")
        .select(`
          id, user_id, nis, kelas, status_magang, is_active, created_at,
          profiles:user_id ( id, nama, email, is_active ),
          penempatan_magang (
            id, status_pengesahan,
            tempat_magang:tempat_magang_id ( id, nama_perusahaan, alamat ),
            guru:guru_id ( id, nip, profiles:user_id ( id, nama, email ) )
          )
        `)
        .order("created_at", { ascending: false });
    }

    // 3. If still error, fetch base siswa + profiles safely
    if (res.error) {
      res = await supabase
        .from("siswa")
        .select(`
          id, user_id, nis, kelas, status_magang, is_active, created_at,
          profiles:user_id ( id, nama, email, is_active )
        `)
        .order("created_at", { ascending: false });
    }

    if (res.error || !res.data) return { success: false, data: [] };

    // Format clean flat structure while preserving nested relations
    const formatted = res.data.map((item: any) => {
      const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
      const penempatan = Array.isArray(item.penempatan_magang) ? item.penempatan_magang[0] : item.penempatan_magang;
      const tm = penempatan?.tempat_magang;
      const tempatMagang = Array.isArray(tm) ? tm[0] : tm;
      const g = penempatan?.guru;
      const guruObj = Array.isArray(g) ? g[0] : g;
      const guruProfile = Array.isArray(guruObj?.profiles) ? guruObj.profiles[0] : guruObj?.profiles;

      return {
        id: item.id,
        user_id: item.user_id,
        nis: item.nis,
        nama: profile?.nama || "Siswa",
        email: profile?.email || "",
        kelas: item.kelas,
        status_magang: item.status_magang || "belum_magang",
        is_active: item.is_active ?? true,
        created_at: item.created_at,
        dudi: tempatMagang ? { id: tempatMagang.id, nama_perusahaan: tempatMagang.nama_perusahaan } : null,
        guru: guruProfile ? { id: guruObj.id, nama: guruProfile.nama } : null,
      };
    });

    return { success: true, data: formatted };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
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
    const supabase = await getSupabase();
    const profileId = crypto.randomUUID();
    const siswaId = crypto.randomUUID();

    // 1. Insert into profiles
    const { error: pErr } = await supabase.from("profiles").insert({
      id: profileId,
      nama: data.nama,
      email: data.email,
      password: DEFAULT_PASSWORD_HASH,
      role: "siswa",
      is_active: true,
    });

    if (pErr) throw new Error(pErr.message);

    // 2. Insert into siswa
    const { data: newRow, error: sErr } = await supabase
      .from("siswa")
      .insert({
        id: siswaId,
        user_id: profileId,
        nis: data.nis,
        kelas: data.kelas,
        status_magang: "belum_magang",
        is_active: true,
      })
      .select()
      .maybeSingle();

    if (sErr) {
      // Rollback profile
      await supabase.from("profiles").delete().eq("id", profileId);
      throw new Error(sErr.message);
    }

    revalidatePath("/admin/siswa");
    revalidatePath("/admin/dashboard");
    return {
      success: true,
      data: {
        id: siswaId,
        user_id: profileId,
        nis: data.nis,
        nama: data.nama,
        email: data.email,
        kelas: data.kelas,
        status_magang: "belum_magang",
      },
    };
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
    status_magang?: string;
  }
) {
  try {
    const supabase = await getSupabase();

    // 1. Fetch siswa to get user_id
    const { data: existing, error: fErr } = await supabase
      .from("siswa")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();

    if (fErr || !existing) {
      throw new Error("Data siswa tidak ditemukan.");
    }

    // Map status string if frontend sends old keys
    let mappedStatus = data.status_magang || "belum_magang";
    if (mappedStatus === "magang") mappedStatus = "sedang_magang";
    if (mappedStatus === "selesai") mappedStatus = "lulus";
    if (mappedStatus === "belum_mengajukan") mappedStatus = "belum_magang";
    if (mappedStatus === "menunggu") mappedStatus = "pengajuan";

    // 2. Update siswa table
    const { error: sErr } = await supabase
      .from("siswa")
      .update({
        nis: data.nis,
        kelas: data.kelas,
        status_magang: mappedStatus,
      })
      .eq("id", id);

    if (sErr) throw new Error(sErr.message);

    // 3. Update profiles table
    if (existing.user_id) {
      const { error: pErr } = await supabase
        .from("profiles")
        .update({
          nama: data.nama,
          email: data.email,
        })
        .eq("id", existing.user_id);

      if (pErr) throw new Error(pErr.message);
    }

    revalidatePath("/admin/siswa");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteSiswaAction(id: string) {
  try {
    const supabase = await getSupabase();

    // 1. Get user_id
    const { data: existing } = await supabase
      .from("siswa")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();

    // 2. Clean up relational references
    await supabase.from("penempatan_magang").delete().eq("siswa_id", id);
    await supabase.from("absensi").delete().eq("siswa_id", id);
    await supabase.from("jurnal_harian").delete().eq("siswa_id", id);
    await supabase.from("pengajuan_magang").delete().eq("siswa_id", id);

    // 3. Delete from siswa
    const { error: sErr } = await supabase.from("siswa").delete().eq("id", id);
    if (sErr) throw new Error(sErr.message);

    // 4. Delete from profiles
    if (existing?.user_id) {
      await supabase.from("profiles").delete().eq("id", existing.user_id);
    }

    revalidatePath("/admin/siswa");
    revalidatePath("/admin/dashboard");
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
    const supabase = await getSupabase();

    // 1. Check existing penempatan
    const { data: existing } = await supabase
      .from("penempatan_magang")
      .select("id")
      .eq("siswa_id", siswaId)
      .maybeSingle();

    const today = new Date().toISOString().slice(0, 10);
    const end = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    if (existing) {
      const { error: uErr } = await supabase
        .from("penempatan_magang")
        .update({
          tempat_magang_id: dudiId,
          guru_id: guruId,
          status_pengesahan: "disahkan",
        })
        .eq("id", existing.id);
      if (uErr) throw new Error(uErr.message);
    } else {
      const { error: iErr } = await supabase.from("penempatan_magang").insert({
        id: crypto.randomUUID(),
        siswa_id: siswaId,
        tempat_magang_id: dudiId,
        guru_id: guruId,
        status_pengesahan: "disahkan",
        tanggal_mulai: today,
        tanggal_selesai: end,
      });
      if (iErr) throw new Error(iErr.message);
    }

    // 2. Update status in siswa
    await supabase
      .from("siswa")
      .update({
        status_magang: "sedang_magang",
      })
      .eq("id", siswaId);

    revalidatePath("/admin/siswa");
    revalidatePath("/admin/penempatan");
    revalidatePath("/admin/monitoring");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------------------------
// 2. GURU ACTIONS
// ----------------------------------------------------------------------

export async function fetchGuruListAction() {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("guru")
      .select(`
        id, user_id, nip, jurusan, is_active, created_at,
        profiles:user_id ( id, nama, email, is_active )
      `)
      .order("created_at", { ascending: false });

    if (error || !data) return { success: false, data: [] };

    const formatted = data.map((item: any) => {
      const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
      return {
        id: item.id,
        user_id: item.user_id,
        nip: item.nip,
        nama: profile?.nama || "Guru",
        email: profile?.email || "",
        jurusan: item.jurusan || "Rekayasa Perangkat Lunak",
        is_active: item.is_active ?? true,
        status: (item.is_active ?? true) ? "aktif" : "nonaktif",
        created_at: item.created_at,
      };
    });

    return { success: true, data: formatted };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

export async function createGuruAction(data: {
  nip: string;
  nama: string;
  email: string;
  jurusan: string;
  no_telepon?: string;
}) {
  try {
    const supabase = await getSupabase();
    const profileId = crypto.randomUUID();
    const guruId = crypto.randomUUID();

    // 1. Insert into profiles
    const { error: pErr } = await supabase.from("profiles").insert({
      id: profileId,
      nama: data.nama,
      email: data.email,
      password: DEFAULT_PASSWORD_HASH,
      role: "guru",
      is_active: true,
    });

    if (pErr) throw new Error(pErr.message);

    // 2. Insert into guru
    const { data: newRow, error: gErr } = await supabase
      .from("guru")
      .insert({
        id: guruId,
        user_id: profileId,
        nip: data.nip,
        jurusan: data.jurusan,
        is_active: true,
      })
      .select()
      .maybeSingle();

    if (gErr) {
      await supabase.from("profiles").delete().eq("id", profileId);
      throw new Error(gErr.message);
    }

    revalidatePath("/admin/guru");
    revalidatePath("/admin/dashboard");
    return {
      success: true,
      data: {
        id: guruId,
        user_id: profileId,
        nip: data.nip,
        nama: data.nama,
        email: data.email,
        jurusan: data.jurusan,
        status: "aktif",
      },
    };
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
    const supabase = await getSupabase();

    const { data: existing, error: fErr } = await supabase
      .from("guru")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();

    if (fErr || !existing) throw new Error("Data guru tidak ditemukan.");

    // 1. Update guru
    const { error: gErr } = await supabase
      .from("guru")
      .update({
        nip: data.nip,
        jurusan: data.jurusan,
        is_active: data.status === "aktif",
      })
      .eq("id", id);

    if (gErr) throw new Error(gErr.message);

    // 2. Update profiles
    if (existing.user_id) {
      const { error: pErr } = await supabase
        .from("profiles")
        .update({
          nama: data.nama,
          email: data.email,
          is_active: data.status === "aktif",
        })
        .eq("id", existing.user_id);

      if (pErr) throw new Error(pErr.message);
    }

    revalidatePath("/admin/guru");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteGuruAction(id: string) {
  try {
    const supabase = await getSupabase();

    const { data: existing } = await supabase
      .from("guru")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();

    // Unlink from penempatan & delete kunjungan
    await supabase.from("penempatan_magang").update({ guru_id: null }).eq("guru_id", id);
    await supabase.from("kunjungan").delete().eq("guru_id", id);

    const { error: gErr } = await supabase.from("guru").delete().eq("id", id);
    if (gErr) throw new Error(gErr.message);

    if (existing?.user_id) {
      await supabase.from("profiles").delete().eq("id", existing.user_id);
    }

    revalidatePath("/admin/guru");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------------------------
// 3. DUDI (TEMPAT MAGANG) ACTIONS
// ----------------------------------------------------------------------

export async function fetchDudiListAction() {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("tempat_magang")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return { success: false, data: [] };

    const formatted = data.map((d: any) => ({
      id: d.id,
      nama_perusahaan: d.nama_perusahaan,
      bidang_usaha: d.bidang_usaha,
      penanggung_jawab: d.penanggung_jawab,
      kontak: d.kontak_pic || "",
      alamat: d.alamat,
      kuota: d.kuota ?? 5,
      status: d.is_verified ? "terverifikasi" : "menunggu",
      is_verified: d.is_verified ?? true,
      created_at: d.created_at,
    }));

    return { success: true, data: formatted };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
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
    const supabase = await getSupabase();
    const dudiId = crypto.randomUUID();

    const { data: newRow, error } = await supabase
      .from("tempat_magang")
      .insert({
        id: dudiId,
        nama_perusahaan: data.nama_perusahaan,
        bidang_usaha: data.bidang_usaha,
        penanggung_jawab: data.penanggung_jawab,
        kontak_pic: data.kontak,
        alamat: data.alamat,
        kuota: Number(data.kuota) || 5,
        is_verified: true,
      })
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    revalidatePath("/admin/dudi");
    revalidatePath("/admin/dashboard");
    return { success: true, data: newRow };
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
    const supabase = await getSupabase();
    const { error } = await supabase
      .from("tempat_magang")
      .update({
        nama_perusahaan: data.nama_perusahaan,
        bidang_usaha: data.bidang_usaha,
        penanggung_jawab: data.penanggung_jawab,
        kontak_pic: data.kontak,
        alamat: data.alamat,
        kuota: Number(data.kuota) || 5,
        is_verified: data.status === "terverifikasi",
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/dudi");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteDudiAction(id: string) {
  try {
    const supabase = await getSupabase();
    await supabase.from("penempatan_magang").delete().eq("tempat_magang_id", id);
    await supabase.from("pengajuan_magang").delete().eq("tempat_magang_id", id);
    await supabase.from("kunjungan").delete().eq("tempat_magang_id", id);

    const { error } = await supabase.from("tempat_magang").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/dudi");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------------------------
// 4. PENEMPATAN & PENGAJUAN ACTIONS
// ----------------------------------------------------------------------

export async function fetchPenempatanListAction() {
  try {
    const supabase = await getSupabase();
    // 1. Try selecting with dudi_id first (standard 01_simmas_schema.sql)
    let res: any = await supabase
      .from("penempatan_magang")
      .select(`
        id, siswa_id, dudi_id, guru_id, status, tanggal_mulai, tanggal_selesai, nilai_akhir, created_at,
        siswa:siswa_id ( id, nis, kelas, profiles:user_id ( nama, email ) ),
        tempat_magang:dudi_id ( id, nama_perusahaan, alamat ),
        guru:guru_id ( id, nip, profiles:user_id ( nama, email ) )
      `)
      .order("created_at", { ascending: false });

    // 2. If column not found, fallback to tempat_magang_id & status_pengesahan
    if (res.error) {
      res = await supabase
        .from("penempatan_magang")
        .select(`
          id, siswa_id, tempat_magang_id, guru_id, status_pengesahan, tanggal_mulai, tanggal_selesai, nilai_akhir, created_at,
          siswa:siswa_id ( id, nis, kelas, profiles:user_id ( nama, email ) ),
          tempat_magang:tempat_magang_id ( id, nama_perusahaan, alamat ),
          guru:guru_id ( id, nip, profiles:user_id ( nama, email ) )
        `)
        .order("created_at", { ascending: false });
    }

    if (res.error || !res.data) return { success: false, data: [] };

    const formatted = res.data.map((p: any) => {
      const siswa = Array.isArray(p.siswa) ? p.siswa[0] : p.siswa;
      const siswaProf = Array.isArray(siswa?.profiles) ? siswa.profiles[0] : siswa?.profiles;
      const tm = Array.isArray(p.tempat_magang) ? p.tempat_magang[0] : p.tempat_magang;
      const g = Array.isArray(p.guru) ? p.guru[0] : p.guru;
      const guruProf = Array.isArray(g?.profiles) ? g.profiles[0] : g?.profiles;

      const pStatus = p.status || p.status_pengesahan || "aktif";

      return {
        id: p.id,
        siswa_id: p.siswa_id,
        dudi_id: p.dudi_id || p.tempat_magang_id,
        guru_id: p.guru_id,
        siswaName: siswaProf?.nama || "Siswa",
        nis: siswa?.nis || "-",
        kelas: siswa?.kelas || "-",
        dudiName: tm?.nama_perusahaan || "-",
        guruName: guruProf?.nama || "-",
        tanggal_mulai: p.tanggal_mulai || "-",
        tanggal_selesai: p.tanggal_selesai || "-",
        status: pStatus === "lulus_magang" || pStatus === "selesai" ? "selesai" : "aktif",
        nilai_akhir: p.nilai_akhir,
      };
    });

    return { success: true, data: formatted };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

export async function fetchPengajuanListAction() {
  try {
    const supabase = await getSupabase();
    let res: any = await supabase
      .from("pengajuan_magang")
      .select(`
        id, siswa_id, dudi_id, posisi, status, alasan_penolakan, tanggal_mulai, tanggal_selesai, created_at,
        siswa:siswa_id ( id, nis, kelas, profiles:user_id ( nama, email ) ),
        tempat_magang:dudi_id ( id, nama_perusahaan, alamat )
      `)
      .order("created_at", { ascending: false });

    if (res.error) {
      res = await supabase
        .from("pengajuan_magang")
        .select(`
          id, siswa_id, tempat_magang_id, posisi, status, catatan_penolakan, tanggal_mulai, tanggal_selesai, tanggal_pengajuan,
          siswa:siswa_id ( id, nis, kelas, profiles:user_id ( nama, email ) ),
          tempat_magang:tempat_magang_id ( id, nama_perusahaan, alamat )
        `)
        .order("tanggal_pengajuan", { ascending: false });
    }

    if (res.error || !res.data) return { success: false, data: [] };

    const formatted = res.data.map((q: any) => {
      const siswa = Array.isArray(q.siswa) ? q.siswa[0] : q.siswa;
      const siswaProf = Array.isArray(siswa?.profiles) ? siswa.profiles[0] : siswa?.profiles;
      const tm = Array.isArray(q.tempat_magang) ? q.tempat_magang[0] : q.tempat_magang;

      return {
        id: q.id,
        siswa_id: q.siswa_id,
        posisi: q.posisi,
        tanggal_mulai: q.tanggal_mulai,
        tanggal_selesai: q.tanggal_selesai,
        status: q.status,
        siswaName: siswaProf?.nama || "Siswa",
        nis: siswa?.nis || "-",
        kelas: siswa?.kelas || "-",
        dudiName: tm?.nama_perusahaan || "-",
        dudiAddress: tm?.alamat || "-",
        tanggalPengajuan: q.tanggal_pengajuan || q.created_at?.slice(0, 10) || "-",
      };
    });

    return { success: true, data: formatted };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
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
    const supabase = await getSupabase();
    const id = crypto.randomUUID();

    // 1. Try insert with dudi_id and status: "aktif"
    let { error } = await supabase.from("penempatan_magang").insert({
      id,
      siswa_id: data.siswa_id,
      dudi_id: data.dudi_id,
      guru_id: data.guru_id,
      tanggal_mulai: data.tanggal_mulai,
      tanggal_selesai: data.tanggal_selesai,
      status: "aktif",
    });

    // 2. If column not found, fallback to tempat_magang_id and status_pengesahan
    if (error && (error.message.includes("dudi_id") || error.message.includes("status"))) {
      const fallback = await supabase.from("penempatan_magang").insert({
        id,
        siswa_id: data.siswa_id,
        tempat_magang_id: data.dudi_id,
        guru_id: data.guru_id,
        tanggal_mulai: data.tanggal_mulai,
        tanggal_selesai: data.tanggal_selesai,
        status_pengesahan: "disahkan",
      });
      error = fallback.error;
    }

    if (error) throw new Error(error.message);

    // Update siswa status
    const { error: sErr } = await supabase
      .from("siswa")
      .update({ status_magang: "magang" })
      .eq("id", data.siswa_id);

    if (sErr) {
      await supabase
        .from("siswa")
        .update({ status_magang: "sedang_magang" })
        .eq("id", data.siswa_id);
    }

    revalidatePath("/admin/penempatan");
    revalidatePath("/admin/siswa");
    revalidatePath("/admin/dashboard");
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
    const supabase = await getSupabase();
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

    const id = crypto.randomUUID();
    const targetDudiId = dudiId || pengajuan.dudi_id || pengajuan.tempat_magang_id;

    let { error } = await supabase.from("penempatan_magang").insert({
      id,
      siswa_id: pengajuan.siswa_id,
      dudi_id: targetDudiId,
      guru_id: guruId,
      tanggal_mulai: pengajuan.tanggal_mulai,
      tanggal_selesai: pengajuan.tanggal_selesai,
      status: "aktif",
    });

    if (error) {
      await supabase.from("penempatan_magang").insert({
        id,
        siswa_id: pengajuan.siswa_id,
        tempat_magang_id: targetDudiId,
        guru_id: guruId,
        tanggal_mulai: pengajuan.tanggal_mulai,
        tanggal_selesai: pengajuan.tanggal_selesai,
        status_pengesahan: "disahkan",
      });
    }

    const { error: sErr } = await supabase
      .from("siswa")
      .update({ status_magang: "magang" })
      .eq("id", pengajuan.siswa_id);

    if (sErr) {
      await supabase
        .from("siswa")
        .update({ status_magang: "sedang_magang" })
        .eq("id", pengajuan.siswa_id);
    }

    revalidatePath("/admin/penempatan");
    revalidatePath("/admin/siswa");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function rejectPengajuanAction(pengajuanId: string, alasan: string) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from("pengajuan_magang")
      .update({
        status: "ditolak",
        catatan_penolakan: alasan,
      })
      .eq("id", pengajuanId);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/penempatan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------------------------
// 5. SETTINGS ACTIONS
// ----------------------------------------------------------------------

export async function fetchLogsAction() {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error || !data) return { success: false, data: [] };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, data: [] };
  }
}

export async function fetchSettingsAction() {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from("settings").select("key, value");

    const defaultSettings = {
      appName: "vernoncorp",
      appDescription: "Sistem Informasi Manajemen Magang Siswa",
      contactEmail: "info@vernoncorp.sch.id",
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
    };

    if (error || !data || data.length === 0) {
      return { success: true, data: defaultSettings };
    }

    const map: Record<string, string> = {};
    for (const item of data) {
      if (item.key && item.value !== undefined && item.value !== null) {
        map[item.key] = String(item.value);
      }
    }

    return {
      success: true,
      data: {
        appName: map["app_name"] || defaultSettings.appName,
        appDescription: map["app_description"] || map["app_fullname"] || defaultSettings.appDescription,
        contactEmail: map["contact_email"] || defaultSettings.contactEmail,
        landingHeroTitle: map["hero_title"] || defaultSettings.landingHeroTitle,
        landingHeroSubtitle: map["hero_subtitle"] || defaultSettings.landingHeroSubtitle,
        landingHeroDescription: map["hero_description"] || defaultSettings.landingHeroDescription,
        schoolName: map["school_name"] || defaultSettings.schoolName,
        schoolAddress: map["school_address"] || defaultSettings.schoolAddress,
        schoolPhone: map["school_phone"] || defaultSettings.schoolPhone,
        schoolWebsite: map["school_website"] || defaultSettings.schoolWebsite,
        principalName: map["principal_name"] || defaultSettings.principalName,
        principalNip: map["principal_nip"] || defaultSettings.principalNip,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      data: {
        appName: "vernoncorp",
        appDescription: "Sistem Informasi Manajemen Magang Siswa",
        contactEmail: "info@vernoncorp.sch.id",
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
      },
      error: err.message,
    };
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
    const supabase = await getSupabase();
    const now = new Date().toISOString();

    const rows = [
      { key: "app_name", value: data.appName, updated_at: now },
      { key: "app_fullname", value: data.appDescription, updated_at: now },
      { key: "app_description", value: data.appDescription, updated_at: now },
      { key: "contact_email", value: data.contactEmail, updated_at: now },
      { key: "hero_title", value: data.landingHeroTitle, updated_at: now },
      { key: "hero_subtitle", value: data.landingHeroSubtitle, updated_at: now },
      { key: "hero_description", value: data.landingHeroDescription, updated_at: now },
      { key: "school_name", value: data.schoolName, updated_at: now },
      { key: "school_address", value: data.schoolAddress, updated_at: now },
      { key: "school_phone", value: data.schoolPhone, updated_at: now },
      { key: "school_website", value: data.schoolWebsite, updated_at: now },
      { key: "principal_name", value: data.principalName, updated_at: now },
      { key: "principal_nip", value: data.principalNip, updated_at: now },
    ];

    const { error } = await supabase
      .from("settings")
      .upsert(rows, { onConflict: "key" });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/guru", "layout");
    revalidatePath("/siswa", "layout");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------------------------
// 6. GURU & SISWA OPERATIONAL ACTIONS
// ----------------------------------------------------------------------

export async function submitNilaiAction(
  penempatanId: string,
  nilai: number,
  catatan?: string
) {
  try {
    const supabase = await getSupabase();
    let { error } = await supabase
      .from("penempatan_magang")
      .update({
        nilai_akhir: nilai,
        catatan_nilai: catatan || null,
        status: "selesai",
      })
      .eq("id", penempatanId);

    if (error && (error.message.includes("catatan_nilai") || error.message.includes("status"))) {
      const fb = await supabase
        .from("penempatan_magang")
        .update({
          nilai_akhir: nilai,
          catatan_admin: catatan || null,
          status_pengesahan: "lulus_magang",
        })
        .eq("id", penempatanId);
      error = fb.error;
    }

    if (error) throw new Error(error.message);
    revalidatePath("/guru/siswa");
    revalidatePath("/admin/penempatan");
    revalidatePath("/admin/siswa");
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
    const supabase = await getSupabase();
    let { error } = await supabase
      .from("jurnal_harian")
      .update({
        status: status,
        catatan_guru: catatan || null,
      })
      .eq("id", jurnalId);

    if (error && error.message.includes("status")) {
      const fb = await supabase
        .from("jurnal_harian")
        .update({
          status_verifikasi: status,
          catatan_guru: catatan || null,
        })
        .eq("id", jurnalId);
      error = fb.error;
    }

    if (error) throw new Error(error.message);
    revalidatePath("/guru/jurnal");
    revalidatePath("/siswa/jurnal");
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
    const supabase = await getSupabase();
    let { error } = await supabase
      .from("absensi")
      .update({
        validasi_status: status,
        catatan_guru: catatan || null,
      })
      .eq("id", absensiId);

    if (error && error.message.includes("validasi_status")) {
      const fb = await supabase
        .from("absensi")
        .update({
          status_validasi: status,
          catatan_guru: catatan || null,
        })
        .eq("id", absensiId);
      error = fb.error;
    }

    if (error) throw new Error(error.message);
    revalidatePath("/guru/jurnal");
    revalidatePath("/siswa/absensi");
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
  guru_id?: string;
}) {
  try {
    const supabase = await getSupabase();

    let targetGuruId = data.guru_id;
    if (!targetGuruId) {
      const { data: g } = await supabase.from("guru").select("id").limit(1).maybeSingle();
      targetGuruId = g?.id;
    }

    let { error } = await supabase.from("kunjungan").insert({
      id: crypto.randomUUID(),
      tanggal: data.tanggal,
      catatan: data.catatan,
      photo_url: data.photo_url || null,
      guru_id: targetGuruId,
      dudi_id: data.dudi_id,
    });

    if (error && error.message.includes("dudi_id")) {
      const fb = await supabase.from("kunjungan").insert({
        id: crypto.randomUUID(),
        tanggal: data.tanggal,
        catatan: data.catatan,
        photo_url: data.photo_url || null,
        guru_id: targetGuruId,
        tempat_magang_id: data.dudi_id,
      });
      error = fb.error;
    }

    if (error) throw new Error(error.message);
    revalidatePath("/guru/kunjungan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteKunjunganAction(id: string) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from("kunjungan").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/guru/kunjungan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchKunjunganListAction() {
  try {
    const supabase = await getSupabase();
    let res: any = await supabase
      .from("kunjungan")
      .select(`
        id, tanggal, catatan, photo_url, dudi_id, guru_id,
        tempat_magang:dudi_id ( id, nama_perusahaan, alamat ),
        guru:guru_id ( id, nip, profiles:user_id ( nama ) )
      `)
      .order("tanggal", { ascending: false });

    if (res.error) {
      res = await supabase
        .from("kunjungan")
        .select(`
          id, tanggal, catatan, photo_url, tempat_magang_id, guru_id,
          tempat_magang:tempat_magang_id ( id, nama_perusahaan, alamat ),
          guru:guru_id ( id, nip, profiles:user_id ( nama ) )
        `)
        .order("tanggal", { ascending: false });
    }

    if (res.error || !res.data) return { success: true, data: [] };

    const formatted = res.data.map((k: any) => {
      const tm = Array.isArray(k.tempat_magang) ? k.tempat_magang[0] : k.tempat_magang;
      const g = Array.isArray(k.guru) ? k.guru[0] : k.guru;
      const guruProf = Array.isArray(g?.profiles) ? g.profiles[0] : g?.profiles;

      return {
        id: k.id,
        dudi_id: k.dudi_id || k.tempat_magang_id,
        dudiName: tm?.nama_perusahaan || "Mitra Industri",
        dudiAddress: tm?.alamat || "-",
        guruName: guruProf?.nama || "Guru Pembimbing",
        tanggal: k.tanggal,
        catatan: k.catatan,
        photoUrl: k.photo_url || null,
      };
    });

    return { success: true, data: formatted };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

export async function fetchGuruSiswaBimbinganAction() {
  try {
    const supabase = await getSupabase();
    let res: any = await supabase
      .from("siswa")
      .select(`
        id, nis, kelas, status_magang,
        profiles:user_id ( nama, email ),
        penempatan_magang (
          id, nilai_akhir, catatan_nilai, status,
          tempat_magang:dudi_id ( id, nama_perusahaan, alamat )
        )
      `)
      .order("created_at", { ascending: false });

    if (res.error) {
      res = await supabase
        .from("siswa")
        .select(`
          id, nis, kelas, status_magang,
          profiles:user_id ( nama, email ),
          penempatan_magang (
            id, nilai_akhir, catatan_admin, status_pengesahan,
            tempat_magang:tempat_magang_id ( id, nama_perusahaan, alamat )
          )
        `)
        .order("created_at", { ascending: false });
    }

    if (res.error || !res.data) return { success: true, data: [] };

    const formatted = res.data.map((s: any) => {
      const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
      const penempatan = Array.isArray(s.penempatan_magang) ? s.penempatan_magang[0] : s.penempatan_magang;
      const tm = Array.isArray(penempatan?.tempat_magang) ? penempatan?.tempat_magang[0] : penempatan?.tempat_magang;

      return {
        id: s.id,
        penempatanId: penempatan?.id || null,
        nis: s.nis,
        nama: profile?.nama || "Siswa",
        kelas: s.kelas,
        dudiName: tm?.nama_perusahaan || "-",
        dudiAddress: tm?.alamat || "-",
        status: s.status_magang || "belum_magang",
        nilaiAkhir: penempatan?.nilai_akhir ?? null,
        catatanNilai: penempatan?.catatan_nilai || penempatan?.catatan_admin || null,
      };
    });

    return { success: true, data: formatted };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

export async function fetchGuruValidasiAction() {
  try {
    const supabase = await getSupabase();
    // 1. Fetch journals
    let jRes: any = await supabase
      .from("jurnal_harian")
      .select(`
        id, tanggal, kegiatan, kendala, solusi, photo_url, status, catatan_guru,
        siswa:siswa_id ( id, nis, kelas, profiles:user_id ( nama ) )
      `)
      .order("tanggal", { ascending: false });

    if (jRes.error) {
      jRes = await supabase
        .from("jurnal_harian")
        .select(`
          id, tanggal, kegiatan, kendala, solusi, photo_url, status_verifikasi, catatan_guru,
          siswa:siswa_id ( id, nis, kelas, profiles:user_id ( nama ) )
        `)
        .order("tanggal", { ascending: false });
    }

    // 2. Fetch attendances
    let aRes: any = await supabase
      .from("absensi")
      .select(`
        id, tanggal, status, waktu_masuk, waktu_pulang, photo_masuk_url, validasi_status, catatan_guru,
        siswa:siswa_id ( id, nis, kelas, profiles:user_id ( nama ) )
      `)
      .order("tanggal", { ascending: false });

    if (aRes.error) {
      aRes = await supabase
        .from("absensi")
        .select(`
          id, tanggal, status, jam_masuk, jam_pulang, photo_masuk_url, status_validasi, catatan_guru,
          siswa:siswa_id ( id, nis, kelas, profiles:user_id ( nama ) )
        `)
        .order("tanggal", { ascending: false });
    }

    const jurnal = (jRes.data || []).map((j: any) => {
      const siswa = Array.isArray(j.siswa) ? j.siswa[0] : j.siswa;
      const profile = Array.isArray(siswa?.profiles) ? siswa?.profiles[0] : siswa?.profiles;
      return {
        id: j.id,
        tanggal: j.tanggal,
        siswaName: profile?.nama || "Siswa",
        nis: siswa?.nis || "-",
        kelas: siswa?.kelas || "-",
        kegiatan: j.kegiatan,
        kendala: j.kendala,
        solusi: j.solusi,
        photoUrl: j.photo_url,
        status: (j.status || j.status_verifikasi || "menunggu") as "menunggu" | "disetujui" | "revisi",
        catatanGuru: j.catatan_guru,
      };
    });

    const absensi = (aRes.data || []).map((a: any) => {
      const siswa = Array.isArray(a.siswa) ? a.siswa[0] : a.siswa;
      const profile = Array.isArray(siswa?.profiles) ? siswa?.profiles[0] : siswa?.profiles;
      return {
        id: a.id,
        tanggal: a.tanggal,
        siswaName: profile?.nama || "Siswa",
        nis: siswa?.nis || "-",
        kelas: siswa?.kelas || "-",
        status: a.status || "hadir",
        waktuMasuk: a.waktu_masuk || a.jam_masuk || "-",
        waktuPulang: a.waktu_pulang || a.jam_pulang || "-",
        photoUrl: a.photo_masuk_url || null,
        validasiStatus: (a.validasi_status || a.status_validasi || "pending") as "pending" | "approved" | "rejected",
        catatanGuru: a.catatan_guru,
      };
    });

    return { success: true, data: { jurnal, absensi } };
  } catch (err: any) {
    return { success: false, error: err.message, data: { jurnal: [], absensi: [] } };
  }
}

export async function fetchSiswaAbsensiAction(siswaId?: string) {
  try {
    const supabase = await getSupabase();
    let targetSiswaId = siswaId;
    if (!targetSiswaId) {
      const { data: s } = await supabase.from("siswa").select("id").limit(1).maybeSingle();
      targetSiswaId = s?.id;
    }

    if (!targetSiswaId) return { success: true, data: { today: null, history: [] } };

    const todayStr = new Date().toISOString().slice(0, 10);
    const { data: records, error } = await supabase
      .from("absensi")
      .select("*")
      .eq("siswa_id", targetSiswaId)
      .order("tanggal", { ascending: false });

    if (error) throw new Error(error.message);

    const list = records || [];
    const todayRecord = list.find((r: any) => r.tanggal === todayStr);

    const history = list.map((h: any) => ({
      id: h.id,
      tanggal: h.tanggal,
      status: h.status,
      waktuMasuk: h.waktu_masuk || h.jam_masuk || "-",
      waktuPulang: h.waktu_pulang || h.jam_pulang || "-",
      validasiStatus: h.validasi_status || h.status_validasi || "pending",
      catatanGuru: h.catatan_guru,
    }));

    const today = todayRecord
      ? {
          clockedIn: Boolean(todayRecord.waktu_masuk || todayRecord.jam_masuk),
          clockedOut: Boolean(todayRecord.waktu_pulang || todayRecord.jam_pulang),
          waktuMasuk: todayRecord.waktu_masuk || todayRecord.jam_masuk || "07:30",
          waktuPulang: todayRecord.waktu_pulang || todayRecord.jam_pulang || null,
          status: todayRecord.status || "hadir",
        }
      : {
          clockedIn: false,
          clockedOut: false,
          waktuMasuk: null,
          waktuPulang: null,
          status: "hadir",
        };

    return { success: true, data: { today, history } };
  } catch (err: any) {
    return { success: false, error: err.message, data: { today: null, history: [] } };
  }
}

export async function fetchSiswaJurnalAction(siswaId?: string) {
  try {
    const supabase = await getSupabase();
    let targetSiswaId = siswaId;
    if (!targetSiswaId) {
      const { data: s } = await supabase.from("siswa").select("id").limit(1).maybeSingle();
      targetSiswaId = s?.id;
    }

    if (!targetSiswaId) return { success: true, data: [] };

    const { data, error } = await supabase
      .from("jurnal_harian")
      .select("*")
      .eq("siswa_id", targetSiswaId)
      .order("tanggal", { ascending: false });

    if (error) throw new Error(error.message);

    const formatted = (data || []).map((j: any) => ({
      id: j.id,
      tanggal: j.tanggal,
      kegiatan: j.kegiatan,
      kendala: j.kendala,
      solusi: j.solusi,
      photoUrl: j.photo_url,
      status: j.status || j.status_verifikasi || "menunggu",
      catatanGuru: j.catatan_guru,
    }));

    return { success: true, data: formatted };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

export async function submitPengajuanAction(data: {
  siswa_id?: string;
  dudi_id?: string;
  posisi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}) {
  try {
    const supabase = await getSupabase();
    let targetSiswaId = data.siswa_id;
    if (!targetSiswaId) {
      const { data: s } = await supabase
        .from("siswa")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      targetSiswaId = s?.id;
    }

    if (!targetSiswaId) {
      throw new Error("Data siswa tidak ditemukan di sistem.");
    }

    const id = crypto.randomUUID();

    // 1. Try insert with dudi_id (01_simmas_schema.sql standard)
    let { error } = await supabase.from("pengajuan_magang").insert({
      id,
      siswa_id: targetSiswaId,
      dudi_id: data.dudi_id || null,
      posisi: data.posisi,
      tanggal_mulai: data.tanggal_mulai,
      tanggal_selesai: data.tanggal_selesai,
      status: "menunggu",
    });

    // 2. Fallback to tempat_magang_id if needed
    if (error && error.message.includes("dudi_id")) {
      const fb = await supabase.from("pengajuan_magang").insert({
        id,
        siswa_id: targetSiswaId,
        tempat_magang_id: data.dudi_id || null,
        posisi: data.posisi,
        tanggal_mulai: data.tanggal_mulai,
        tanggal_selesai: data.tanggal_selesai,
        status: "menunggu",
      });
      error = fb.error;
    }

    if (error) throw new Error(error.message);

    // Update siswa status
    await supabase
      .from("siswa")
      .update({ status_magang: "menunggu" })
      .eq("id", targetSiswaId);

    revalidatePath("/siswa/pengajuan");
    revalidatePath("/admin/penempatan");
    revalidatePath("/admin/dashboard");
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
    const supabase = await getSupabase();
    const today = new Date().toISOString().slice(0, 10);
    const time = new Date().toTimeString().slice(0, 5);

    const { data: s } = await supabase
      .from("siswa")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const targetSiswaId = s?.id;

    if (!targetSiswaId) {
      throw new Error("Data siswa tidak ditemukan.");
    }

    // 1. Check if record already exists for today
    const { data: existing } = await supabase
      .from("absensi")
      .select("id")
      .eq("siswa_id", targetSiswaId)
      .eq("tanggal", today)
      .maybeSingle();

    if (existing?.id) {
      // Update existing record
      let updateData: any = { status, waktu_masuk: time };
      let { error: uErr } = await supabase
        .from("absensi")
        .update(updateData)
        .eq("id", existing.id);

      if (uErr && uErr.message.includes("waktu_masuk")) {
        updateData = { status, jam_masuk: time };
        uErr = (await supabase.from("absensi").update(updateData).eq("id", existing.id)).error;
      }
      if (uErr) throw new Error(uErr.message);
    } else {
      // Insert new record
      const newId = crypto.randomUUID();
      let insertData: any = {
        id: newId,
        siswa_id: targetSiswaId,
        tanggal: today,
        status,
        waktu_masuk: time,
        validasi_status: "pending",
      };

      let { error: iErr } = await supabase.from("absensi").insert(insertData);

      // Fallback 1: if waktu_masuk or validasi_status fail
      if (iErr && (iErr.message.includes("waktu_masuk") || iErr.message.includes("validasi_status"))) {
        insertData = {
          id: newId,
          siswa_id: targetSiswaId,
          tanggal: today,
          status,
          jam_masuk: time,
          status_validasi: "pending",
        };
        iErr = (await supabase.from("absensi").insert(insertData)).error;
      }

      // Fallback 2: if status_validasi also fails, try minimal columns
      if (iErr && (iErr.message.includes("status_validasi") || iErr.message.includes("validasi_status"))) {
        delete insertData.status_validasi;
        delete insertData.validasi_status;
        iErr = (await supabase.from("absensi").insert(insertData)).error;
      }

      if (iErr) throw new Error(iErr.message);
    }

    revalidatePath("/siswa/absensi");
    revalidatePath("/guru/jurnal");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitClockOutAction() {
  try {
    const supabase = await getSupabase();
    const today = new Date().toISOString().slice(0, 10);
    const time = new Date().toTimeString().slice(0, 5);

    const { data: s } = await supabase
      .from("siswa")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const targetSiswaId = s?.id;

    if (!targetSiswaId) {
      throw new Error("Data siswa tidak ditemukan.");
    }

    // 1. Try standard schema (waktu_pulang)
    let { error } = await supabase
      .from("absensi")
      .update({ waktu_pulang: time })
      .eq("siswa_id", targetSiswaId)
      .eq("tanggal", today);

    // 2. Fallback to jam_pulang
    if (error && error.message.includes("waktu_pulang")) {
      const fb = await supabase
        .from("absensi")
        .update({ jam_pulang: time })
        .eq("siswa_id", targetSiswaId)
        .eq("tanggal", today);
      error = fb.error;
    }

    if (error) throw new Error(error.message);
    revalidatePath("/siswa/absensi");
    revalidatePath("/guru/jurnal");
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
    const supabase = await getSupabase();
    const { data: s } = await supabase
      .from("siswa")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const targetSiswaId = s?.id;

    if (!targetSiswaId) {
      throw new Error("Data siswa tidak ditemukan.");
    }

    // 1. Try standard schema (status: "menunggu")
    let { error } = await supabase.from("jurnal_harian").insert({
      id: crypto.randomUUID(),
      siswa_id: targetSiswaId,
      tanggal: data.tanggal,
      kegiatan: data.kegiatan,
      kendala: data.kendala || null,
      solusi: data.solusi || null,
      status: "menunggu",
    });

    // 2. Fallback to status_verifikasi if needed
    if (error && error.message.includes("status")) {
      const fb = await supabase.from("jurnal_harian").insert({
        id: crypto.randomUUID(),
        siswa_id: targetSiswaId,
        tanggal: data.tanggal,
        kegiatan: data.kegiatan,
        kendala: data.kendala || null,
        solusi: data.solusi || null,
        status_verifikasi: "menunggu",
      });
      error = fb.error;
    }

    if (error) throw new Error(error.message);
    revalidatePath("/siswa/jurnal");
    revalidatePath("/guru/jurnal");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteJurnalAction(id: string) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from("jurnal_harian").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/siswa/jurnal");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
