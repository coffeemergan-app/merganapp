export type UserRole =
  | 'OWNER_HOLDING'
  | 'PURCHASE_HOLDING'
  | 'OWNER_CABANG'
  | 'KEPALA_TOKO'
  | 'PURCHASE_CABANG';

export interface BranchTheme {
  primary: string;
  gradient: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
  cardHover: string;
  buttonGradient: string;
}

export interface Branch {
  id: string;
  name: string;
  shortName: string;
  city: string;
  address: string;
  phone?: string;
  headStore?: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  themeClass: string;
  dailyBudgetLimit?: number;
  theme?: BranchTheme;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  branchId: string; // 'all' for Holding, or 'sumbawa' | 'urip' | 'madiun'
  password?: string;
  email?: string;
  roleLabel: string;
  roleDescription: string;
  permissions: string[];
}

export type ShiftType =
  | 'Shift 1 (Pagi 07:00 - 15:00)'
  | 'Shift 2 (Malam 15:00 - 23:00)'
  | 'Full Day (Event / Weekend)';

export interface ShiftRekap {
  id: string;
  branchId: string;
  tanggal: string; // YYYY-MM-DD
  hari: string; // Senin, Selasa, dll
  person: string; // Nama Kasir
  shift: ShiftType;
  cash: number;
  qris: number;
  belanjaKasir: number; // Pengeluaran kasir & belanja harian otomatis terkoneksi (read-only)
  totalNet: number; // cash + qris - belanjaKasir
  catatan?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'Beans'
  | 'UHT'
  | 'Freshmilk'
  | 'SKM'
  | 'Syrup'
  | 'Cair'
  | 'Krimer'
  | 'Powder'
  | 'Topping'
  | 'Non Bahan Baku'
  | 'Cleo'
  | 'Cup'
  | 'Operasional Lainnya';

export interface MasterBahanBaku {
  id: string;
  kategori: ExpenseCategory;
  merekBarang: string;
  satuan: string;
  tempatPembelian: string;
  hargaSatuan: number;
}

export interface DailyExpense {
  id: string;
  branchId: string;
  tanggal: string; // YYYY-MM-DD
  shift: ShiftType;
  rincianBarang: string;
  kategori: ExpenseCategory;
  hargaSatuan: number;
  kuantitas: number;
  satuan: string;
  totalBiaya: number; // hargaSatuan * kuantitas
  personPurchase: string;
  supplier?: string;
  keterangan?: string;
  createdAt: string;
}

export interface BranchOrderItem {
  merekBarang: string;
  kategori: string;
  kuantitas: number;
  satuan: string;
  catatan?: string;
}

export interface BranchOrder {
  id: string;
  nomorOrder: string;
  branchId: string;
  tanggal: string;
  pemohon: string;
  urgensi: 'Biasa' | 'Mendesak / Stok Kritis';
  status: 'MENUNGGU KONFIRMASI' | 'DIPROSES PURCHASE' | 'SELESAI / TERKIRIM';
  items: BranchOrderItem[];
  catatan?: string;
  createdAt: string;
}

export interface SetorTunai3HariRecord {
  id: string;
  branchId: string;
  year: number;
  month: number;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  labelPeriode: string;
  totalCash: number;
  totalQris: number;
  totalBelanjaKasir: number;
  totalNet: number;
  shiftCount: number;
  status: 'BELUM_DISETOR' | 'SUDAH_DISETOR';
  tanggalSetor?: string;
  bankTujuan?: string;
  disetorOleh?: string;
  nomorBukti?: string;
  catatan?: string;
  updatedAt?: string;
}

export interface KaryawanRecord {
  id: string;
  branchId: string;
  nama: string;
  jabatan: 'Barista' | 'Kasir' | 'Kitchen / Cook' | 'Cleaning Service' | 'Kepala Toko';
  gajiPokokDefault: number;
  tunjanganDefault: number;
  noHp?: string;
  statusAktif: boolean;
}

export type StatusAbsensi = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export interface AbsensiRecord {
  id: string;
  branchId: string;
  tanggal: string; // YYYY-MM-DD
  karyawanId: string;
  namaKaryawan: string;
  jabatan: string;
  shift: ShiftType;
  status: StatusAbsensi;
  jamMasuk: string;
  jamPulang: string;
  catatan?: string;
  createdAt: string;
}

export interface GajiRecord {
  id: string;
  nomorSlip: string;
  branchId: string;
  periodeBulan: string; // e.g. "Oktober 2026"
  tanggalBayar: string; // YYYY-MM-DD
  karyawanId: string;
  namaKaryawan: string;
  jabatan: string;
  gajiPokok: number;
  tunjangan: number;
  bonusKinerja: number;
  potonganKasbon: number;
  potonganTerlambat: number;
  totalGajiNet: number; // (gajiPokok + tunjangan + bonusKinerja) - (potonganKasbon + potonganTerlambat)
  statusBayar: 'LUNAS / DIBAYAR' | 'PENDING / PROSES';
  metodeBayar: 'Transfer Bank' | 'Tunai Kasir';
  catatan?: string;
  dibuatOleh: string;
  createdAt: string;
}
