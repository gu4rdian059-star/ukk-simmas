export type UserRole = 'admin' | 'guru' | 'siswa';

export interface Profile {
  id: string;
  email: string;
  nama: string;
  role: UserRole;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Guru {
  id: string;
  user_id?: string | null;
  nip: string;
  nama: string;
  email: string;
  jurusan: string;
  no_telepon?: string | null;
  status?: 'aktif' | 'nonaktif';
  is_active?: boolean;
  activeSiswa?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TempatMagang {
  id: string;
  nama_perusahaan: string;
  bidang_usaha: string;
  penanggung_jawab: string;
  kontak: string;
  alamat: string;
  kuota: number;
  siswaAktif?: number;
  activeSiswa?: number;
  status: 'terverifikasi' | 'menunggu' | 'ditolak';
  created_at?: string;
  updated_at?: string;
}

export interface Siswa {
  id: string;
  user_id?: string | null;
  nis: string;
  nama: string;
  email: string;
  kelas: string;
  jurusan?: string | null;
  no_telepon?: string | null;
  status_magang: 'belum_mengajukan' | 'menunggu' | 'magang' | 'selesai' | 'dibatalkan';
  guru_id?: string | null;
  dudi_id?: string | null;
  guruPembimbing?: string | null;
  industri?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PenempatanMagang {
  id: string;
  siswa_id: string;
  dudi_id: string;
  guru_id: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: 'aktif' | 'selesai' | 'dibatalkan';
  nilai_akhir?: number | null;
  catatan_nilai?: string | null;
  siswaName?: string;
  nis?: string;
  kelas?: string;
  dudiName?: string;
  guruName?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PengajuanMagang {
  id: string;
  siswa_id: string;
  dudi_id?: string | null;
  nama_dudi_usulan?: string | null;
  alamat_dudi_usulan?: string | null;
  posisi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  alasan_penolakan?: string | null;
  siswaName?: string;
  nis?: string;
  kelas?: string;
  dudiName?: string;
  dudiAddress?: string;
  isDudiBaru?: boolean;
  tanggalPengajuan?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Absensi {
  id: string;
  siswa_id: string;
  tanggal: string;
  status: 'hadir' | 'izin' | 'sakit';
  waktu_masuk?: string | null;
  waktu_pulang?: string | null;
  photo_masuk_url?: string | null;
  photo_pulang_url?: string | null;
  catatan?: string | null;
  validasi_status: 'pending' | 'approved' | 'rejected';
  catatan_guru?: string | null;
  validated_by?: string | null;
  validated_at?: string | null;
  siswaName?: string;
  nis?: string;
  kelas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JurnalHarian {
  id: string;
  siswa_id: string;
  tanggal: string;
  kegiatan: string;
  kendala?: string | null;
  solusi?: string | null;
  photo_url?: string | null;
  status: 'menunggu' | 'disetujui' | 'revisi';
  catatan_guru?: string | null;
  validated_by?: string | null;
  validated_at?: string | null;
  siswaName?: string;
  nis?: string;
  kelas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Kunjungan {
  id: string;
  guru_id: string;
  dudi_id?: string;
  tempat_magang_id?: string;
  tanggal: string;
  catatan: string;
  photo_url?: string | null;
  guruName?: string;
  dudiName?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string | null;
  actor_email: string;
  actor_role: string;
  action_type: string;
  entity_type: string;
  entity_id?: string | null;
  level: 'INFO' | 'WARN' | 'ERROR';
  metadata?: Record<string, unknown>;
  ip_address?: string | null;
  created_at: string;
}

export interface AppSettings {
  id: number;
  app_name: string;
  app_description: string;
  contact_email: string;
  landing_hero_title: string;
  landing_hero_subtitle: string;
  landing_hero_description: string;
  school_name: string;
  school_address: string;
  school_phone: string;
  school_website: string;
  principal_name: string;
  principal_nip: string;
  updated_at?: string;
}

