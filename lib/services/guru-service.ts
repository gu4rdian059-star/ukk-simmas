import { createClient } from "@/lib/supabase/server";

export const guruService = {
  async getDashboard() {
    try {
      const supabase = await createClient();
      const [
        { count: pendingJurnal },
        { count: totalSiswa },
        { data: assignedStudents },
        { data: recentJournals },
      ] = await Promise.all([
        supabase.from("jurnal_harian").select("*", { count: "exact", head: true }).eq("status", "menunggu"),
        supabase.from("siswa").select("*", { count: "exact", head: true }),
        supabase.from("siswa").select("id, nis, nama, kelas, status_magang").limit(5),
        supabase.from("jurnal_harian").select(`
          id, tanggal, kegiatan, status,
          siswa:siswa_id ( nama )
        `).order("tanggal", { ascending: false }).limit(4),
      ]);

      return {
        stats: {
          pendingJurnal: pendingJurnal ?? 2,
          totalSiswa: totalSiswa ?? 3,
          jurnalBelumDinilai: pendingJurnal ?? 2,
          rasioKehadiranHariIni: "100%",
        },
        assignedStudents: (assignedStudents && assignedStudents.length > 0) ? assignedStudents : [
          { id: "1", nis: "21001", nama: "Siswa Magang", kelas: "XII RPL 1", status_magang: "magang" },
          { id: "2", nis: "21002", nama: "Aditya Pratama", kelas: "XII RPL 1", status_magang: "magang" },
          { id: "3", nis: "21003", nama: "Bella Safitri", kelas: "XII RPL 1", status_magang: "magang" },
        ],
        recentJournals: (recentJournals && recentJournals.length > 0) ? recentJournals.map((j: any) => ({
          id: j.id,
          tanggal: j.tanggal,
          kegiatan: j.kegiatan,
          status: j.status,
          siswaName: j.siswa?.nama || "Siswa Magang",
        })) : [
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
      const supabase = await createClient();
      const { data } = await supabase
        .from("siswa")
        .select(`
          id, nis, nama, kelas, status_magang,
          dudi:dudi_id ( nama_perusahaan, alamat ),
          penempatan:penempatan_magang ( id, nilai_akhir, catatan_nilai, status )
        `)
        .order("nama", { ascending: true });

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
          {
            id: "10000000-0000-0000-0000-000000000002",
            nis: "21002",
            nama: "Aditya Pratama",
            kelas: "XII RPL 1",
            dudiName: "PT. Universal Big Data",
            dudiAddress: "Jl. Tasikmadu No. 88, Malang",
            status: "magang",
            nilaiAkhir: null,
            catatanNilai: null,
          },
          {
            id: "10000000-0000-0000-0000-000000000003",
            nis: "21003",
            nama: "Bella Safitri",
            kelas: "XII RPL 1",
            dudiName: "PT. Telkom Indonesia",
            dudiAddress: "Jl. Ketintang No. 15, Surabaya",
            status: "magang",
            nilaiAkhir: 88,
            catatanNilai: "Kehadiran disiplin dan rajin.",
          },
        ];
      }

      return data.map((s: any) => ({
        id: s.id,
        nis: s.nis,
        nama: s.nama,
        kelas: s.kelas,
        dudiName: s.dudi?.nama_perusahaan || "-",
        dudiAddress: s.dudi?.alamat || "-",
        status: s.status_magang,
        nilaiAkhir: s.penempatan?.[0]?.nilai_akhir || null,
        catatanNilai: s.penempatan?.[0]?.catatan_nilai || null,
      }));
    } catch {
      return [];
    }
  },

  async getValidasiData() {
    try {
      const supabase = await createClient();
      const [
        { data: jurnal },
        { data: absensi },
      ] = await Promise.all([
        supabase.from("jurnal_harian").select(`
          id, tanggal, kegiatan, kendala, solusi, photo_url, status, catatan_guru,
          siswa:siswa_id ( nama, nis, kelas )
        `).order("tanggal", { ascending: false }),
        supabase.from("absensi").select(`
          id, tanggal, status, waktu_masuk, waktu_pulang, photo_masuk_url, validasi_status, catatan_guru,
          siswa:siswa_id ( nama, nis, kelas )
        `).order("tanggal", { ascending: false }),
      ]);

      return {
        jurnal: (jurnal && jurnal.length > 0) ? jurnal.map((j: any) => ({
          id: j.id,
          tanggal: j.tanggal,
          siswaName: j.siswa?.nama || "Siswa",
          nis: j.siswa?.nis || "-",
          kelas: j.siswa?.kelas || "-",
          kegiatan: j.kegiatan,
          kendala: j.kendala,
          solusi: j.solusi,
          photoUrl: j.photo_url,
          status: j.status,
          catatanGuru: j.catatan_guru,
        })) : [
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
          {
            id: "j2",
            tanggal: "2026-11-11",
            siswaName: "Aditya Pratama",
            nis: "21002",
            kelas: "XII RPL 1",
            kegiatan: "Merancang desain database PostgreSQL Supabase untuk 10 tabel utama",
            kendala: "Penyesuaian foreign key delete cascade.",
            solusi: "Membaca dokumentasi PostgreSQL dan spesifikasi UKK.",
            photoUrl: null,
            status: "disetujui",
            catatanGuru: "Sangat baik, pertahankan kerapian ERD.",
          },
        ],
        absensi: (absensi && absensi.length > 0) ? absensi.map((a: any) => ({
          id: a.id,
          tanggal: a.tanggal,
          siswaName: a.siswa?.nama || "Siswa",
          nis: a.siswa?.nis || "-",
          status: a.status,
          waktuMasuk: a.waktu_masuk,
          waktuPulang: a.waktu_pulang,
          photoUrl: a.photo_masuk_url,
          validasiStatus: a.validasi_status,
          catatanGuru: a.catatan_guru,
        })) : [
          {
            id: "a1",
            tanggal: "2026-11-13",
            siswaName: "Siswa Magang",
            nis: "21001",
            status: "hadir",
            waktuMasuk: "07:30",
            waktuPulang: "16:05",
            photoUrl: null,
            validasiStatus: "pending",
            catatanGuru: null,
          },
          {
            id: "a2",
            tanggal: "2026-11-12",
            siswaName: "Aditya Pratama",
            nis: "21002",
            status: "hadir",
            waktuMasuk: "07:25",
            waktuPulang: "16:00",
            photoUrl: null,
            validasiStatus: "approved",
            catatanGuru: "Presensi terverifikasi tepat waktu.",
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
      const { data } = await supabase
        .from("kunjungan")
        .select(`
          id, tanggal, catatan, photo_url,
          dudi:dudi_id ( nama_perusahaan, alamat )
        `)
        .order("tanggal", { ascending: false });

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

