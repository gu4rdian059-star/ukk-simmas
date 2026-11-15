import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getDb() {
  try {
    return createAdminClient();
  } catch {
    return await createClient();
  }
}

export const guruService = {
  async getDashboard() {
    try {
      const supabase = await getDb();
      let pendingJurnalCount = 0;

      // 1. Pending journals count
      const jRes = await supabase
        .from("jurnal_harian")
        .select("*", { count: "exact", head: true })
        .eq("status", "menunggu");

      if (jRes.error) {
        const jFb = await supabase
          .from("jurnal_harian")
          .select("*", { count: "exact", head: true })
          .eq("status_verifikasi", "menunggu");
        pendingJurnalCount = jFb.count ?? 0;
      } else {
        pendingJurnalCount = jRes.count ?? 0;
      }

      // 2. Total students
      const { count: totalSiswa } = await supabase
        .from("siswa")
        .select("*", { count: "exact", head: true });

      // 3. Assigned students
      const { data: assignedStudents } = await supabase
        .from("siswa")
        .select(`
          id, nis, kelas, status_magang,
          profiles:user_id ( nama )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      // 4. Recent journals
      let rj: any = await supabase
        .from("jurnal_harian")
        .select(`
          id, tanggal, kegiatan, status,
          siswa:siswa_id ( profiles:user_id ( nama ) )
        `)
        .order("tanggal", { ascending: false })
        .limit(5);

      if (rj.error) {
        rj = await supabase
          .from("jurnal_harian")
          .select(`
            id, tanggal, kegiatan, status_verifikasi,
            siswa:siswa_id ( profiles:user_id ( nama ) )
          `)
          .order("tanggal", { ascending: false })
          .limit(5);
      }

      return {
        stats: {
          pendingJurnal: pendingJurnalCount,
          totalSiswa: totalSiswa ?? 0,
          jurnalBelumDinilai: pendingJurnalCount,
          rasioKehadiranHariIni: "100%",
        },
        assignedStudents: (assignedStudents || []).map((s: any) => {
          const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
          return {
            id: s.id,
            nis: s.nis,
            nama: profile?.nama || "Siswa",
            kelas: s.kelas,
            status_magang: s.status_magang || "belum_magang",
          };
        }),
        recentJournals: (rj.data || []).map((j: any) => {
          const siswa = Array.isArray(j.siswa) ? j.siswa[0] : j.siswa;
          const profile = Array.isArray(siswa?.profiles) ? siswa?.profiles[0] : siswa?.profiles;
          return {
            id: j.id,
            tanggal: j.tanggal,
            kegiatan: j.kegiatan,
            status: j.status || j.status_verifikasi || "menunggu",
            siswaName: profile?.nama || "Siswa",
          };
        }),
      };
    } catch {
      return {
        stats: { pendingJurnal: 0, totalSiswa: 0, jurnalBelumDinilai: 0, rasioKehadiranHariIni: "0%" },
        assignedStudents: [],
        recentJournals: [],
      };
    }
  },

  async getSiswaBimbingan() {
    try {
      const supabase = await getDb();
      let res: any = await supabase
        .from("siswa")
        .select(`
          id, nis, kelas, status_magang,
          profiles:user_id ( nama, email ),
          penempatan_magang (
            id, nilai_akhir, catatan_nilai, status,
            tempat_magang:dudi_id ( nama_perusahaan, alamat )
          )
        `)
        .order("nis", { ascending: true });

      if (res.error) {
        res = await supabase
          .from("siswa")
          .select(`
            id, nis, kelas, status_magang,
            profiles:user_id ( nama, email ),
            penempatan_magang (
              id, nilai_akhir, catatan_admin, status_pengesahan,
              tempat_magang:tempat_magang_id ( nama_perusahaan, alamat )
            )
          `)
          .order("nis", { ascending: true });
      }

      return (res.data || []).map((s: any) => {
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
    } catch {
      return [];
    }
  },

  async getValidasiData() {
    try {
      const supabase = await getDb();
      // 1. Jurnal
      let jRes: any = await supabase
        .from("jurnal_harian")
        .select(`
          id, tanggal, kegiatan, kendala, solusi, photo_url, status, catatan_guru,
          siswa:siswa_id ( nis, kelas, profiles:user_id ( nama ) )
        `)
        .order("tanggal", { ascending: false });

      if (jRes.error) {
        jRes = await supabase
          .from("jurnal_harian")
          .select(`
            id, tanggal, kegiatan, kendala, solusi, photo_url, status_verifikasi, catatan_guru,
            siswa:siswa_id ( nis, kelas, profiles:user_id ( nama ) )
          `)
          .order("tanggal", { ascending: false });
      }

      // 2. Absensi
      let aRes: any = await supabase
        .from("absensi")
        .select(`
          id, tanggal, status, waktu_masuk, waktu_pulang, photo_masuk_url, validasi_status, catatan_guru,
          siswa:siswa_id ( nis, kelas, profiles:user_id ( nama ) )
        `)
        .order("tanggal", { ascending: false });

      if (aRes.error) {
        aRes = await supabase
          .from("absensi")
          .select(`
            id, tanggal, status, jam_masuk, jam_pulang, photo_masuk_url, status_validasi, catatan_guru,
            siswa:siswa_id ( nis, kelas, profiles:user_id ( nama ) )
          `)
          .order("tanggal", { ascending: false });
      }

      return {
        jurnal: (jRes.data || []).map((j: any) => {
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
            status: j.status || j.status_verifikasi || "menunggu",
            catatanGuru: j.catatan_guru,
          };
        }),
        absensi: (aRes.data || []).map((a: any) => {
          const siswa = Array.isArray(a.siswa) ? a.siswa[0] : a.siswa;
          const profile = Array.isArray(siswa?.profiles) ? siswa?.profiles[0] : siswa?.profiles;
          return {
            id: a.id,
            tanggal: a.tanggal,
            siswaName: profile?.nama || "Siswa",
            nis: siswa?.nis || "-",
            status: a.status,
            waktuMasuk: a.waktu_masuk || a.jam_masuk || "-",
            waktuPulang: a.waktu_pulang || a.jam_pulang || "-",
            photoUrl: a.photo_masuk_url,
            validasiStatus: a.validasi_status || a.status_validasi || "pending",
            catatanGuru: a.catatan_guru,
          };
        }),
      };
    } catch {
      return { jurnal: [], absensi: [] };
    }
  },

  async getKunjunganData() {
    try {
      const supabase = await getDb();
      let res: any = await supabase
        .from("kunjungan")
        .select(`
          id, tanggal, catatan, photo_url,
          tempat_magang:dudi_id ( nama_perusahaan, alamat )
        `)
        .order("tanggal", { ascending: false });

      if (res.error) {
        res = await supabase
          .from("kunjungan")
          .select(`
            id, tanggal, catatan, photo_url,
            tempat_magang:tempat_magang_id ( nama_perusahaan, alamat )
          `)
          .order("tanggal", { ascending: false });
      }

      const list = (res.data || []).map((k: any) => {
        const tm = Array.isArray(k.tempat_magang) ? k.tempat_magang[0] : k.tempat_magang;
        return {
          id: k.id,
          dudiName: tm?.nama_perusahaan || "Mitra Industri",
          dudiAddress: tm?.alamat || "-",
          tanggal: k.tanggal,
          catatan: k.catatan,
          photoUrl: k.photo_url,
        };
      });

      return {
        stats: {
          totalKunjungan: list.length,
          kunjunganBulanIni: list.filter((k: any) => k.tanggal?.startsWith(new Date().toISOString().slice(0, 7))).length,
          totalDudi: new Set(list.map((k: any) => k.dudiName)).size,
        },
        list,
      };
    } catch {
      return { stats: { totalKunjungan: 0, kunjunganBulanIni: 0, totalDudi: 0 }, list: [] };
    }
  },
};
