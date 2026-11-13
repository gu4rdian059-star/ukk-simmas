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
      const [
        { count: pendingJurnal },
        { count: totalSiswa },
        { data: assignedStudents },
        { data: recentJournals },
      ] = await Promise.all([
        supabase.from("jurnal_harian").select("*", { count: "exact", head: true }).eq("status_verifikasi", "menunggu"),
        supabase.from("siswa").select("*", { count: "exact", head: true }),
        supabase.from("siswa").select(`
          id, nis, kelas, status_magang,
          profiles:user_id ( nama )
        `).limit(5),
        supabase.from("jurnal_harian").select(`
          id, tanggal, kegiatan, status_verifikasi,
          siswa:siswa_id ( profiles:user_id ( nama ) )
        `).order("tanggal", { ascending: false }).limit(4),
      ]);

      return {
        stats: {
          pendingJurnal: pendingJurnal ?? 2,
          totalSiswa: totalSiswa ?? 3,
          jurnalBelumDinilai: pendingJurnal ?? 2,
          rasioKehadiranHariIni: "100%",
        },
        assignedStudents: (assignedStudents && assignedStudents.length > 0) ? assignedStudents.map((s: any) => {
          const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
          return {
            id: s.id,
            nis: s.nis,
            nama: profile?.nama || "Siswa Magang",
            kelas: s.kelas,
            status_magang: s.status_magang === "sedang_magang" ? "magang" : s.status_magang,
          };
        }) : [
          { id: "1", nis: "21001", nama: "Siswa Magang", kelas: "XII RPL 1", status_magang: "magang" },
          { id: "2", nis: "21002", nama: "Aditya Pratama", kelas: "XII RPL 1", status_magang: "magang" },
          { id: "3", nis: "21003", nama: "Bella Safitri", kelas: "XII RPL 1", status_magang: "magang" },
        ],
        recentJournals: (recentJournals && recentJournals.length > 0) ? recentJournals.map((j: any) => {
          const siswa = Array.isArray(j.siswa) ? j.siswa[0] : j.siswa;
          const profile = Array.isArray(siswa?.profiles) ? siswa?.profiles[0] : siswa?.profiles;
          return {
            id: j.id,
            tanggal: j.tanggal,
            kegiatan: j.kegiatan,
            status: j.status_verifikasi || "menunggu",
            siswaName: profile?.nama || "Siswa Magang",
          };
        }) : [
          {
            id: "j1",
            tanggal: "2026-11-12",
            kegiatan: "Implementasi autentikasi JWT dan middleware RBAC pada Next.js",
            status: "menunggu",
            siswaName: "Siswa Magang",
          },
          {
            id: "j2",
            tanggal: "2026-11-11",
            kegiatan: "Membuat desain skema ERD untuk modul presensi dan jurnal",
            status: "disetujui",
            siswaName: "Aditya Pratama",
          },
        ],
      };
    } catch {
      return {
        stats: { pendingJurnal: 2, totalSiswa: 3, jurnalBelumDinilai: 2, rasioKehadiranHariIni: "100%" },
        assignedStudents: [],
        recentJournals: [],
      };
    }
  },

  async getSiswaBimbingan() {
    try {
      const supabase = await getDb();
      const { data } = await supabase
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

      if (!data || data.length === 0) {
        return [
          {
            id: "10000000-0000-0000-0000-000000000001",
            nis: "21001",
            nama: "Siswa Magang",
            kelas: "XII RPL 1",
            dudiName: "PT. Universal Big Data",
            dudiAddress: "Jl. Tasikmadu No. 88, Malang",
            status: "magang",
            nilaiAkhir: 92,
            catatanNilai: "Performa sangat baik dan inisiatif tinggi.",
          },
        ];
      }

      return data.map((s: any) => {
        const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
        const penempatan = Array.isArray(s.penempatan_magang) ? s.penempatan_magang[0] : s.penempatan_magang;
        const tm = Array.isArray(penempatan?.tempat_magang) ? penempatan?.tempat_magang[0] : penempatan?.tempat_magang;
        return {
          id: s.id,
          nis: s.nis,
          nama: profile?.nama || "Siswa",
          kelas: s.kelas,
          dudiName: tm?.nama_perusahaan || "-",
          dudiAddress: tm?.alamat || "-",
          status: s.status_magang === "sedang_magang" ? "magang" : s.status_magang,
          nilaiAkhir: penempatan?.nilai_akhir || null,
          catatanNilai: penempatan?.catatan_admin || null,
        };
      });
    } catch {
      return [];
    }
  },

  async getValidasiData() {
    try {
      const supabase = await getDb();
      const [
        { data: jurnal },
        { data: absensi },
      ] = await Promise.all([
        supabase.from("jurnal_harian").select(`
          id, tanggal, kegiatan, kendala, solusi, photo_url, status_verifikasi, catatan_guru,
          siswa:siswa_id ( nis, kelas, profiles:user_id ( nama ) )
        `).order("tanggal", { ascending: false }),
        supabase.from("absensi").select(`
          id, tanggal, status, jam_masuk, jam_pulang, photo_masuk_url, status_validasi, catatan_guru,
          siswa:siswa_id ( nis, kelas, profiles:user_id ( nama ) )
        `).order("tanggal", { ascending: false }),
      ]);

      return {
        jurnal: (jurnal && jurnal.length > 0) ? jurnal.map((j: any) => {
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
            status: j.status_verifikasi || "menunggu",
            catatanGuru: j.catatan_guru,
          };
        }) : [
          {
            id: "j1",
            tanggal: "2026-11-12",
            siswaName: "Siswa Magang",
            nis: "21001",
            kelas: "XII RPL 1",
            kegiatan: "Implementasi autentikasi JWT dan middleware RBAC pada Next.js",
            kendala: "Token refresh cookie sempat gagal tersimpan di browser.",
            solusi: "Menambahkan opsi SameSite Lax dan Path / pada server action cookie.",
            photoUrl: null,
            status: "menunggu",
            catatanGuru: null,
          },
        ],
        absensi: (absensi && absensi.length > 0) ? absensi.map((a: any) => {
          const siswa = Array.isArray(a.siswa) ? a.siswa[0] : a.siswa;
          const profile = Array.isArray(siswa?.profiles) ? siswa?.profiles[0] : siswa?.profiles;
          return {
            id: a.id,
            tanggal: a.tanggal,
            siswaName: profile?.nama || "Siswa",
            nis: siswa?.nis || "-",
            status: a.status,
            waktuMasuk: a.jam_masuk || "-",
            waktuPulang: a.jam_pulang || "-",
            photoUrl: a.photo_masuk_url,
            validasiStatus: a.status_validasi || "pending",
            catatanGuru: a.catatan_guru,
          };
        }) : [
          {
            id: "a1",
            tanggal: "2026-11-13",
            siswaName: "Siswa Magang",
            nis: "21001",
            status: "hadir",
            waktuMasuk: "07:30",
            waktuPulang: "-",
            validasiStatus: "pending",
            catatanGuru: null,
          },
        ],
      };
    } catch {
      return { jurnal: [], absensi: [] };
    }
  },

  async getKunjunganData() {
    try {
      const supabase = await createClient();
      let data: any[] | null = null;

      // Try selecting with tempat_magang_id first
      const { data: d1, error: e1 } = await supabase
        .from("kunjungan")
        .select(`
          id, tanggal, catatan, photo_url,
          tempat_magang:tempat_magang_id ( nama_perusahaan, alamat )
        `)
        .order("tanggal", { ascending: false });

      if (!e1 && d1) {
        data = d1.map((item: any) => ({
          ...item,
          dudi: item.tempat_magang,
        }));
      } else {
        // Fallback to dudi_id
        const { data: d2 } = await supabase
          .from("kunjungan")
          .select(`
            id, tanggal, catatan, photo_url,
            dudi:dudi_id ( nama_perusahaan, alamat )
          `)
          .order("tanggal", { ascending: false });
        data = d2;
      }

      if (!data || data.length === 0) {
        return {
          stats: {
            totalKunjungan: 3,
            kunjunganBulanIni: 1,
            totalDudi: 2,
          },
          list: [
            {
              id: "k1",
              dudiName: "PT. Universal Big Data",
              dudiAddress: "Jl. Tasikmadu No. 88, Malang",
              tanggal: "2026-11-11",
              catatan: "Monitoring tahap pertama, siswa beradaptasi sangat baik dengan tim IT dan mentor industri.",
              photoUrl: null,
            },
            {
              id: "k2",
              dudiName: "PT. Telkom Indonesia",
              dudiAddress: "Jl. Ketintang No. 15, Surabaya",
              tanggal: "2026-10-15",
              catatan: "Evaluasi tengah semester bersama PIC DUDI, laporan kehadiran 100% disiplin.",
              photoUrl: null,
            },
          ],
        };
      }

      return {
        stats: {
          totalKunjungan: data.length,
          kunjunganBulanIni: 1,
          totalDudi: new Set(data.map((k: any) => k.dudi?.nama_perusahaan)).size,
        },
        list: data.map((k: any) => ({
          id: k.id,
          dudiName: k.dudi?.nama_perusahaan || "DUDI",
          dudiAddress: k.dudi?.alamat || "-",
          tanggal: k.tanggal,
          catatan: k.catatan,
          photoUrl: k.photo_url,
        })),
      };
    } catch {
      return { stats: { totalKunjungan: 0, kunjunganBulanIni: 0, totalDudi: 0 }, list: [] };
    }
  },
};

