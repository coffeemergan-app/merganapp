import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatRupiah } from './format';
import {
  AbsensiRecord,
  BranchOrder,
  DailyExpense,
  GajiRecord,
  MasterBahanBaku,
  ShiftRekap,
} from '../types';

export const exportShiftsToExcel = (shifts: ShiftRekap[], branchName: string): void => {
  const data = shifts.map((s, idx) => ({
    No: idx + 1,
    Tanggal: s.tanggal,
    Hari: s.hari,
    Shift: s.shift,
    Kasir: s.person,
    'Cash (Rp)': s.cash,
    'QRIS (Rp)': s.qris,
    'Belanja Kasir (Rp)': s.belanjaKasir,
    'Total Net (Rp)': s.totalNet,
    Catatan: s.catatan || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Kasir');
  XLSX.writeFile(
    workbook,
    `Rekap_Kasir_${branchName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};

export const exportShiftsToPdf = (shifts: ShiftRekap[], branchName: string): void => {
  const doc = new jsPDF('landscape');
  doc.setFontSize(14);
  doc.text(`Rekapitulasi Kasir Harian - ${branchName}`, 14, 15);
  doc.setFontSize(10);
  doc.text(`Toko Kopi Mergan | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 22);

  const tableData = shifts.map((s, idx) => [
    idx + 1,
    s.tanggal,
    s.hari,
    s.shift,
    s.person,
    formatRupiah(s.cash),
    formatRupiah(s.qris),
    formatRupiah(s.belanjaKasir),
    formatRupiah(s.totalNet),
    s.catatan || '-',
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['No', 'Tanggal', 'Hari', 'Shift', 'Kasir', 'Cash', 'QRIS', 'Belanja Kasir', 'Net Bersih', 'Catatan']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [120, 53, 15], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  doc.save(`Rekap_Kasir_${branchName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportExpensesToExcel = (expenses: DailyExpense[], branchName: string): void => {
  const data = expenses.map((e, idx) => ({
    No: idx + 1,
    Tanggal: e.tanggal,
    Shift: e.shift,
    'Rincian Barang': e.rincianBarang,
    Kategori: e.kategori,
    'Harga Satuan (Rp)': e.hargaSatuan,
    Qty: e.kuantitas,
    Satuan: e.satuan,
    'Total Biaya (Rp)': e.totalBiaya,
    'Person Purchase': e.personPurchase,
    Keterangan: e.keterangan || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Belanja Harian');
  XLSX.writeFile(
    workbook,
    `Belanja_Harian_${branchName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};

export const exportExpensesToPdf = (expenses: DailyExpense[], branchName: string): void => {
  const doc = new jsPDF('landscape');
  doc.setFontSize(14);
  doc.text(`Rekap Belanja Operasional & Bahan Baku - ${branchName}`, 14, 15);
  doc.setFontSize(10);
  doc.text(`Toko Kopi Mergan | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 22);

  const tableData = expenses.map((e, idx) => [
    idx + 1,
    e.tanggal,
    e.shift,
    e.rincianBarang,
    e.kategori,
    formatRupiah(e.hargaSatuan),
    `${e.kuantitas} ${e.satuan}`,
    formatRupiah(e.totalBiaya),
    e.personPurchase,
    e.keterangan || '-',
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['No', 'Tanggal', 'Shift', 'Barang', 'Kategori', 'Harga Satuan', 'Qty', 'Total Biaya', 'Purchase', 'Keterangan']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [190, 24, 93], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  doc.save(`Belanja_Harian_${branchName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportOrdersToPdf = (orders: BranchOrder[], branchName: string): void => {
  const doc = new jsPDF('landscape');
  doc.setFontSize(14);
  doc.text(`Rekap Order Restok Bahan Baku - ${branchName}`, 14, 15);
  doc.setFontSize(10);
  doc.text(`Toko Kopi Mergan | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 22);

  const tableData = orders.map((o, idx) => [
    idx + 1,
    o.nomorOrder,
    o.tanggal,
    o.pemohon,
    o.urgensi,
    o.status,
    o.items.map((i) => `${i.merekBarang} (${i.kuantitas} ${i.satuan})`).join(', '),
    o.catatan || '-',
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['No', 'No. Order', 'Tanggal', 'Pemohon', 'Urgensi', 'Status', 'Daftar Barang', 'Catatan']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [29, 78, 216], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  doc.save(`Rekap_Order_${branchName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportAbsensiToPdf = (absensiList: AbsensiRecord[], branchName: string): void => {
  const doc = new jsPDF('landscape');
  doc.setFontSize(14);
  doc.text(`Rekapitulasi Presensi & Absensi Karyawan - ${branchName}`, 14, 15);
  doc.setFontSize(10);
  doc.text(`Toko Kopi Mergan | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 22);

  const tableData = absensiList.map((a, idx) => [
    idx + 1,
    a.tanggal,
    a.namaKaryawan,
    a.jabatan,
    a.shift,
    a.status,
    a.status === 'Hadir' ? `${a.jamMasuk} - ${a.jamPulang}` : '-',
    a.catatan || '-',
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['No', 'Tanggal', 'Nama Karyawan', 'Jabatan', 'Shift', 'Status', 'Jam Kerja', 'Catatan']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  doc.save(`Rekap_Absensi_${branchName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportGajiToPdf = (gajiList: GajiRecord[], branchName: string): void => {
  const doc = new jsPDF('landscape');
  doc.setFontSize(14);
  doc.text(`Rekapitulasi Penggajian & Slip Karyawan - ${branchName}`, 14, 15);
  doc.setFontSize(10);
  doc.text(`Toko Kopi Mergan | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 22);

  const tableData = gajiList.map((g, idx) => [
    idx + 1,
    g.nomorSlip,
    g.periodeBulan,
    g.namaKaryawan,
    g.jabatan,
    formatRupiah(g.gajiPokok),
    formatRupiah(g.tunjangan + g.bonusKinerja),
    formatRupiah(g.potonganKasbon + g.potonganTerlambat),
    formatRupiah(g.totalGajiNet),
    g.statusBayar,
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['No', 'No. Slip', 'Periode', 'Nama', 'Jabatan', 'Gaji Pokok', 'Tunj + Bonus', 'Potongan', 'Total Net', 'Status Bayar']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [4, 120, 87], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  doc.save(`Rekap_Gaji_${branchName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportMasterToPdf = (items: MasterBahanBaku[]): void => {
  const doc = new jsPDF('portrait');
  doc.setFontSize(14);
  doc.text('Katalog Master Bahan Baku Resmi - Holding Toko Kopi Mergan', 14, 15);
  doc.setFontSize(10);
  doc.text(`Total: ${items.length} Item Resmi | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 22);

  const tableData = items.map((m, idx) => [
    idx + 1,
    m.merekBarang,
    m.kategori,
    m.satuan,
    formatRupiah(m.hargaSatuan),
    m.tempatPembelian,
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['No', 'Nama Bahan Baku', 'Kategori', 'Satuan', 'Harga Standar Holding', 'Supplier / Sumber']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [126, 34, 206], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  doc.save(`Master_Bahan_Baku_Mergan_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export interface RekapBarangItem {
  merekBarang: string;
  kategori: string;
  satuan: string;
  totalKuantitas: number;
  totalBiaya: number;
  frekuensiBeli: number;
  suppliers: string[];
}

export const exportRekapBarangBulananToPdf = (
  items: RekapBarangItem[],
  periodeBulan: string,
  branchName: string
): void => {
  const doc = new jsPDF('landscape');
  doc.setFontSize(14);
  doc.text(`Rekapitulasi Pembelian Barang Bulanan - ${periodeBulan}`, 14, 15);
  doc.setFontSize(10);
  doc.text(`Toko Kopi Mergan (${branchName}) | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 22);

  const tableData = items.map((item, idx) => [
    idx + 1,
    item.merekBarang,
    item.kategori,
    `${item.totalKuantitas} ${item.satuan}`,
    `${item.frekuensiBeli}x`,
    formatRupiah(item.totalBiaya),
    formatRupiah(item.totalKuantitas > 0 ? Math.round(item.totalBiaya / item.totalKuantitas) : 0),
    item.suppliers.filter(Boolean).join(', ') || '-',
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['No', 'Nama Barang Terbeli', 'Kategori', 'Total Qty', 'Frekuensi', 'Total Biaya', 'Rata-rata/Satuan', 'Supplier']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [168, 85, 247], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  doc.save(`Rekap_Barang_${periodeBulan.replace(/\s+/g, '_')}_${branchName.replace(/\s+/g, '_')}.pdf`);
};
