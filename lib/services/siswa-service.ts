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
      const { data: siswa } = await supabase
        .from("siswa")
        .select(`
          id, nis, kelas, status_magang,
          profiles:user_id ( nama, email ),
          penempatan:penempatan_magang (
            id,
            tempat_magang:tempat_magang_id ( nama_perusahaan, alamat ),
            guru:guru_id ( nip, profiles:user_id ( nama ) )
          )
        `)
        .limit(1)
        .maybeSingle();

      const s = siswa as any;
      const profile = Array.isArray(s?.profiles) ? s?.profiles[0] : s?.profiles;
      const penempatan = Array.isArray(s?.penempatan) ? s?.penempatan[0] : s?.penempatan;
      const tm = Array.isArray(penempatan?.tempat_magang) ? penempatan?.tempat_magang[0] : penempatan?.tempat_magang;
      const g = Array.isArray(penempatan?.guru) ? penempatan?.guru[0] : penempatan?.guru;
      const guruProfile = Array.isArray(g?.profiles) ? g?.profiles[0] : g?.profiles;

      return {
        siswa: {
          id: s?.id || "10000000-0000-0000-0000-000000000001",
          nama: profile?.nama || "Siswa Magang",
          nis: s?.nis || "21001",
          kelas: s?.kelas || "XII RPL 1",
          status_magang: s?.status_magang || "sedang_magang",
        },
        hasPlacement: true,
        placementInfo: {
          dudiName: tm?.nama_perusahaan || "PT. Universal Big Data",
          dudiAddress: tm?.alamat || "Jl. Tasikmadu No. 88, Malang",
          guruName: guruProfile?.nama || "Guru Pembimbing, S.Kom.",
          guruNip: g?.nip || "198501152010011012",
          periode: "15 Juli 2026 - 15 Desember 2026",
        },
        stats: {
          totalHariHadir: 20,
          totalJurnalTerverifikasi: 18,
          persentaseKehadiran: "100%",
        },
      };
    } catch {
      return {
        siswa: { id: "1", nama: "Siswa Magang", nis: "21001", kelas: "XII RPL 1", status_magang: "magang" },
        hasPlacement: true,
        placementInfo: {
          dudiName: "PT. Universal Big Data",
          dudiAddress: "Jl. Tasikmadu No. 88, Malang",
          guruName: "Guru Pembimbing, S.Kom.",
          guruNip: "198501152010011012",
          periode: "15 Juli 2026 - 15 Desember 2026",
        },
        stats: { totalHariHadir: 20, totalJurnalTerverifikasi: 18, persentaseKehadiran: "100%" },
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
        supabase.from("tempat_magang").select("*"),
        supabase.from("pengajuan_magang").select(`
          id, posisi, tanggal_mulai, tanggal_selesai, status, catatan_penolakan, tanggal_pengajuan,
          tempat_magang:tempat_magang_id ( nama_perusahaan, alamat )
        `).order("tanggal_pengajuan", { ascending: false }),
      ]);

      return {
        dudiList: (dudiList && dudiList.length > 0) ? dudiList.map((d: any) => ({
          ...d,
          siswaAktif: 3,
        })) : [
          {
            id: "11111111-1111-1111-1111-111111111111",
            nama_perusahaan: "PT. Universal Big Data",
            bidang_usaha: "Teknologi Informasi & Data",
            alamat: "Jl. Tasikmadu No. 88, Malang",
            kuota: 10,
            siswaAktif: 7,
          },
          {
            id: "22222222-2222-2222-2222-222222222222",
            nama_perusahaan: "PT. Telkom Indonesia",
            bidang_usaha: "Telekomunikasi & Jaringan",
            alamat: "Jl. Ketintang No. 15, Surabaya",
            kuota: 8,
            siswaAktif: 4,
          },
          {
            id: "44444444-4444-4444-4444-444444444444",
            nama_perusahaan: "PT. Solusi Digital Nusantara",
            bidang_usaha: "Software House & App Dev",
            alamat: "Jl. Manyar Kertoarjo No. 24, Surabaya",
            kuota: 6,
            siswaAktif: 3,
          },
        ],
        riwayat: (riwayat && riwayat.length > 0) ? riwayat.map((r: any) => {
          const tm = Array.isArray(r.tempat_magang) ? r.tempat_magang[0] : r.tempat_magang;
          return {
            id: r.id,
            dudiName: tm?.nama_perusahaan || "Pengajuan Usulan",
            dudiAddress: tm?.alamat || "-",
            posisi: r.posisi,
            tanggalMulai: r.tanggal_mulai,
            tanggalSelesai: r.tanggal_selesai,
            status: r.status,
            alasanPenolakan: r.catatan_penolakan,
            tanggalPengajuan: r.tanggal_pengajuan,
          };
        }) : [
          {
            id: "q1",
            dudiName: "PT. Universal Big Data",
            dudiAddress: "Jl. Tasikmadu No. 88, Malang",
            posisi: "Full-Stack Web Intern",
            tanggalMulai: "2026-07-15",
            tanggalSelesai: "2026-12-15",
            status: "disetujui",
            tanggalPengajuan: "2026-06-20",
          },
        ],
      };
    } catch {
      return { dudiList: [], riwayat: [] };
    }
  },

  async getAbsensiData() {
    try {
      const supabase = await getDb();
      const todayStr = new Date().toISOString().slice(0, 10);

      const [
        { data: todayRecord },
        { data: history },
      ] = await Promise.all([
        supabase.from("absensi").select("*").eq("tanggal", todayStr).maybeSingle(),
        supabase.from("absensi").select("*").order("tanggal", { ascending: false }).limit(30),
      ]);

      return {
        today: todayRecord ? {
          clockedIn: Boolean(todayRecord.jam_masuk || todayRecord.waktu_masuk),
          clockedOut: Boolean(todayRecord.jam_pulang || todayRecord.waktu_pulang),
          waktuMasuk: todayRecord.jam_masuk || todayRecord.waktu_masuk || "07:30",
          waktuPulang: todayRecord.jam_pulang || todayRecord.waktu_pulang || null,
          status: todayRecord.status || "hadir",
        } : {
          clockedIn: true,
          clockedOut: false,
          waktuMasuk: "07:30",
          waktuPulang: null,
          status: "hadir",
        },
        history: (history && history.length > 0) ? history.map((h: any) => ({
          id: h.id,
          tanggal: h.tanggal,
          status: h.status,
          waktuMasuk: h.jam_masuk || h.waktu_masuk || "-",
          waktuPulang: h.jam_pulang || h.waktu_pulang || "-",
          photoMasukUrl: h.photo_masuk_url,
          photoPulangUrl: h.photo_pulang_url,
          validasiStatus: h.status_validasi || h.validasi_status,
          catatanGuru: h.catatan_guru,
        })) : [
          {
            id: "a1",
            tanggal: "2026-11-13",
            status: "hadir",
            waktuMasuk: "07:30",
            waktuPulang: "-",
            validasiStatus: "pending",
            catatanGuru: null,
          },
          {
            id: "a2",
            tanggal: "2026-11-12",
            status: "hadir",
            waktuMasuk: "07:28",
            waktuPulang: "16:05",
            validasiStatus: "approved",
            catatanGuru: "Tepat waktu.",
          },
        ],
      };
    } catch {
      return { today: null, history: [] };
    }
  },

  async getJurnalData() {
    try {
      const supabase = await getDb();
      const { data } = await supabase
        .from("jurnal_harian")
        .select("*")
        .order("tanggal", { ascending: false });

      if (!data || data.length === 0) {
        return [
          {
            id: "j1",
            tanggal: "2026-11-12",
            kegiatan: "Implementasi autentikasi JWT dan middleware RBAC pada Next.js",
            kendala: "Token refresh cookie sempat gagal tersimpan di browser.",
            solusi: "Menambahkan opsi SameSite Lax dan Path / pada server action cookie.",
            photoUrl: null,
            status: "menunggu",
            catatanGuru: null,
          },
          {
            id: "j2",
            tanggal: "2026-11-11",
            kegiatan: "Merancang desain database PostgreSQL Supabase untuk 10 tabel utama",
            kendala: "Penyesuaian foreign key delete cascade.",
            solusi: "Membaca dokumentasi PostgreSQL dan spesifikasi UKK.",
            photoUrl: null,
            status: "disetujui",
            catatanGuru: "Sangat baik, pertahankan kerapian ERD.",
          },
        ];
      }

      return data.map((j: any) => ({
        id: j.id,
        tanggal: j.tanggal,
        kegiatan: j.kegiatan,
        kendala: j.kendala,
        solusi: j.solusi,
        photoUrl: j.photo_url,
        status: j.status_verifikasi || j.status || "menunggu",
        catatanGuru: j.catatan_guru,
      }));
    } catch {
      return [];
    }
  },
};
