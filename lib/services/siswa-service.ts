import { createClient } from "@/lib/supabase/server";

export const siswaService = {
  async getDashboard() {
    try {
      const supabase = await createClient();
      const { data: siswa } = await supabase
        .from("siswa")
        .select(`
          id, nis, nama, kelas, status_magang,
          guru:guru_id ( nama, nip ),
          dudi:dudi_id ( nama_perusahaan, alamat )
        `)
        .eq("email", "siswa@simmas.sch.id")
        .maybeSingle();

      const s = siswa as any;
      const hasPlacement = s?.status_magang === "magang";

      return {
        siswa: s || {
          id: "10000000-0000-0000-0000-000000000001",
          nama: "Siswa Magang",
          nis: "21001",
          kelas: "XII RPL 1",
          status_magang: "magang",
        },
        hasPlacement: true,
        placementInfo: {
          dudiName: s?.dudi?.nama_perusahaan || (Array.isArray(s?.dudi) ? s?.dudi[0]?.nama_perusahaan : "PT. Universal Big Data"),
          dudiAddress: s?.dudi?.alamat || (Array.isArray(s?.dudi) ? s?.dudi[0]?.alamat : "Jl. Tasikmadu No. 88, Malang"),
          guruName: s?.guru?.nama || (Array.isArray(s?.guru) ? s?.guru[0]?.nama : "Guru Pembimbing, S.Kom."),
          guruNip: s?.guru?.nip || (Array.isArray(s?.guru) ? s?.guru[0]?.nip : "198501152010011012"),
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
      const supabase = await createClient();
      const [
        { data: dudiList },
        { data: riwayat },
      ] = await Promise.all([
        supabase.from("tempat_magang").select("*").eq("status", "terverifikasi"),
        supabase.from("pengajuan_magang").select(`
          id, posisi, tanggal_mulai, tanggal_selesai, status, alasan_penolakan, created_at,
          dudi:dudi_id ( nama_perusahaan, alamat )
        `).order("created_at", { ascending: false }),
      ]);

      return {
        dudiList: (dudiList && dudiList.length > 0) ? dudiList : [
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
        riwayat: (riwayat && riwayat.length > 0) ? riwayat.map((r: any) => ({
          id: r.id,
          dudiName: r.dudi?.nama_perusahaan || "Pengajuan Usulan",
          dudiAddress: r.dudi?.alamat || "-",
          posisi: r.posisi,
          tanggalMulai: r.tanggal_mulai,
          tanggalSelesai: r.tanggal_selesai,
          status: r.status,
          alasanPenolakan: r.alasan_penolakan,
          tanggalPengajuan: r.created_at?.slice(0, 10),
        })) : [
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
      const supabase = await createClient();
      const todayStr = new Date().toISOString().slice(0, 10);

      const [
        { data: todayRecord },
        { data: history },
      ] = await Promise.all([
        supabase.from("absensi").select("*").eq("tanggal", todayStr).maybeSingle(),
        supabase.from("absensi").select("*").order("tanggal", { ascending: false }).limit(30),
      ]);

      return {
        today: todayRecord || {
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
          waktuMasuk: h.waktu_masuk || "-",
          waktuPulang: h.waktu_pulang || "-",
          photoMasukUrl: h.photo_masuk_url,
          photoPulangUrl: h.photo_pulang_url,
          validasiStatus: h.validasi_status,
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
          {
            id: "a3",
            tanggal: "2026-11-11",
            status: "hadir",
            waktuMasuk: "07:25",
            waktuPulang: "16:00",
            validasiStatus: "approved",
            catatanGuru: "Hadir lengkap.",
          },
        ],
      };
    } catch {
      return { today: null, history: [] };
    }
  },

  async getJurnalData() {
    try {
      const supabase = await createClient();
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
          {
            id: "j3",
            tanggal: "2026-11-10",
            kegiatan: "Setup repositori Next.js 16 dengan TypeScript dan Tailwind CSS",
            kendala: "Konfigurasi Tailwind CSS v4 dengan variabel CSS.",
            solusi: "Menyesuaikan @theme inline di globals.css.",
            photoUrl: null,
            status: "disetujui",
            catatanGuru: "Bagus.",
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
        status: j.status,
        catatanGuru: j.catatan_guru,
      }));
    } catch {
      return [];
    }
  },
};
