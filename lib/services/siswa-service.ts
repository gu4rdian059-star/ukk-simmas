import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getDb() {
  try {
    return createAdminClient();
  } catch {
    return await createClient();
  }
}

export const siswaService = {
  async getDashboard() {
    try {
      const supabase = await getDb();
      let siswa: any = null;
      const res = await supabase
        .from("siswa")
        .select(`
          id, nis, kelas, status_magang,
          profiles:user_id ( nama, email ),
          penempatan_magang (
            id, status, tanggal_mulai, tanggal_selesai,
            tempat_magang:dudi_id ( nama_perusahaan, alamat ),
            guru:guru_id ( nip, profiles:user_id ( nama ) )
          )
        `)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      siswa = res.data;

      if (!siswa) {
        const fb = await supabase
          .from("siswa")
          .select(`
            id, nis, kelas, status_magang,
            profiles:user_id ( nama, email ),
            penempatan:penempatan_magang (
              id, status, tanggal_mulai, tanggal_selesai,
              tempat_magang:tempat_magang_id ( nama_perusahaan, alamat ),
              guru:guru_id ( nip, profiles:user_id ( nama ) )
            )
          `)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        siswa = fb.data;
      }

      const s = siswa as any;
      if (!s) {
        return {
          siswa: { id: "", nama: "Siswa", nis: "-", kelas: "-", status_magang: "belum_magang" },
          hasPlacement: false,
          placementInfo: null,
          stats: { totalHariHadir: 0, totalJurnalTerverifikasi: 0, persentaseKehadiran: "0%" },
        };
      }

      const profile = Array.isArray(s?.profiles) ? s?.profiles[0] : s?.profiles;
      const penempatans = Array.isArray(s?.penempatan_magang || s?.penempatan)
        ? (s?.penempatan_magang || s?.penempatan)
        : [s?.penempatan_magang || s?.penempatan].filter(Boolean);
      const penempatan = penempatans.find((p: any) => p?.status === "aktif") || penempatans[0];
      const tm = Array.isArray(penempatan?.tempat_magang) ? penempatan?.tempat_magang[0] : penempatan?.tempat_magang;
      const g = Array.isArray(penempatan?.guru) ? penempatan?.guru[0] : penempatan?.guru;
      const guruProfile = Array.isArray(g?.profiles) ? g?.profiles[0] : g?.profiles;

      // Stats
      const [{ count: hadirCount }, { count: totalAbsensi }, { count: jurnalApprovedCount }] = await Promise.all([
        supabase.from("absensi").select("*", { count: "exact", head: true }).eq("siswa_id", s.id).eq("status", "hadir"),
        supabase.from("absensi").select("*", { count: "exact", head: true }).eq("siswa_id", s.id),
        supabase.from("jurnal_harian").select("*", { count: "exact", head: true }).eq("siswa_id", s.id).eq("status", "disetujui"),
      ]);

      const attendancePercent = (totalAbsensi && totalAbsensi > 0)
        ? `${Math.round(((hadirCount || 0) / totalAbsensi) * 100)}%`
        : "100%";

      const hasPlacement = Boolean(penempatan && tm);

      return {
        siswa: {
          id: s.id,
          nama: profile?.nama || "Siswa Magang",
          nis: s.nis || "-",
          kelas: s.kelas || "-",
          status_magang: s.status_magang || "belum_magang",
        },
        hasPlacement,
        placementInfo: hasPlacement
          ? {
              dudiName: tm.nama_perusahaan,
              dudiAddress: tm.alamat || "-",
              guruName: guruProfile?.nama || "Guru Pembimbing",
              guruNip: g?.nip || "-",
              periode: `${penempatan.tanggal_mulai} s.d. ${penempatan.tanggal_selesai}`,
            }
          : null,
        stats: {
          totalHariHadir: hadirCount || 0,
          totalJurnalTerverifikasi: jurnalApprovedCount || 0,
          persentaseKehadiran: attendancePercent,
        },
      };
    } catch {
      return {
        siswa: { id: "", nama: "Siswa", nis: "-", kelas: "-", status_magang: "belum_magang" },
        hasPlacement: false,
        placementInfo: null,
        stats: { totalHariHadir: 0, totalJurnalTerverifikasi: 0, persentaseKehadiran: "0%" },
      };
    }
  },

  async getPengajuanData() {
    try {
      const supabase = await getDb();
      const [
        { data: dudiList },
        { data: riwayat },
      ] = await Promise.all([
        supabase.from("tempat_magang").select("*").order("nama_perusahaan", { ascending: true }),
        supabase.from("pengajuan_magang").select(`
          id, posisi, tanggal_mulai, tanggal_selesai, status, alasan_penolakan, created_at,
          tempat_magang:dudi_id ( nama_perusahaan, alamat )
        `).order("created_at", { ascending: false }),
      ]);

      return {
        dudiList: (dudiList || []).map((d: any) => ({
          id: d.id,
          nama: d.nama_perusahaan,
          nama_perusahaan: d.nama_perusahaan,
          bidang: d.bidang_usaha,
          bidang_usaha: d.bidang_usaha,
          alamat: d.alamat || "-",
          kuotaTersisa: d.kuota ?? 5,
        })),
        riwayat: (riwayat || []).map((r: any) => {
          const tm = Array.isArray(r.tempat_magang) ? r.tempat_magang[0] : r.tempat_magang;
          return {
            id: r.id,
            dudiName: tm?.nama_perusahaan || "Mitra Industri",
            dudiAddress: tm?.alamat || "-",
            posisi: r.posisi,
            tanggalMulai: r.tanggal_mulai,
            tanggalSelesai: r.tanggal_selesai,
            status: r.status,
            alasanPenolakan: r.alasan_penolakan || null,
            tanggalPengajuan: r.created_at ? r.created_at.slice(0, 10) : "-",
          };
        }),
      };
    } catch {
      return { dudiList: [], riwayat: [] };
    }
  },

  async getAbsensiData() {
    try {
      const supabase = await getDb();
      const todayStr = new Date().toISOString().slice(0, 10);

      const { data: s } = await supabase.from("siswa").select("id").limit(1).maybeSingle();
      const targetSiswaId = s?.id;

      if (!targetSiswaId) {
        return { today: null, history: [] };
      }

      const [
        { data: todayRecord },
        { data: history },
      ] = await Promise.all([
        supabase.from("absensi").select("*").eq("siswa_id", targetSiswaId).eq("tanggal", todayStr).maybeSingle(),
        supabase.from("absensi").select("*").eq("siswa_id", targetSiswaId).order("tanggal", { ascending: false }).limit(30),
      ]);

      return {
        today: todayRecord ? {
          clockedIn: Boolean(todayRecord.waktu_masuk || todayRecord.jam_masuk),
          clockedOut: Boolean(todayRecord.waktu_pulang || todayRecord.jam_pulang),
          waktuMasuk: todayRecord.waktu_masuk || todayRecord.jam_masuk || "07:30",
          waktuPulang: todayRecord.waktu_pulang || todayRecord.jam_pulang || null,
          status: todayRecord.status || "hadir",
        } : null,
        history: (history || []).map((h: any) => ({
          id: h.id,
          tanggal: h.tanggal,
          status: h.status,
          waktuMasuk: h.waktu_masuk || h.jam_masuk || "-",
          waktuPulang: h.waktu_pulang || h.jam_pulang || "-",
          photoMasukUrl: h.photo_masuk_url,
          photoPulangUrl: h.photo_pulang_url,
          validasiStatus: h.validasi_status || h.status_validasi || "pending",
          catatanGuru: h.catatan_guru,
        })),
      };
    } catch {
      return { today: null, history: [] };
    }
  },

  async getJurnalData() {
    try {
      const supabase = await getDb();
      const { data: s } = await supabase.from("siswa").select("id").limit(1).maybeSingle();
      const targetSiswaId = s?.id;

      if (!targetSiswaId) return [];

      const { data } = await supabase
        .from("jurnal_harian")
        .select("*")
        .eq("siswa_id", targetSiswaId)
        .order("tanggal", { ascending: false });

      return (data || []).map((j: any) => ({
        id: j.id,
        tanggal: j.tanggal,
        kegiatan: j.kegiatan,
        kendala: j.kendala,
        solusi: j.solusi,
        photoUrl: j.photo_url,
        status: j.status || j.status_verifikasi || "menunggu",
        catatanGuru: j.catatan_guru,
      }));
    } catch {
      return [];
    }
  },
};
