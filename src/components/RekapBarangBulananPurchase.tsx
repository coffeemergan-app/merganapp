import React, { useMemo, useState } from 'react';
import {
  Archive,
  BarChart3,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  Filter,
  Layers,
  Package,
  Printer,
  Search,
  ShoppingBag,
  Store,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { DailyExpense, Branch } from '../types';
import { formatRupiah } from '../utils/format';
import { exportRekapBarangBulananToPdf, RekapBarangItem } from '../utils/export';

interface RekapBarangBulananPurchaseProps {
  expenses: DailyExpense[];
  branchName: string;
  branches?: Branch[];
  activeBranchId?: string;
  onSelectBranch?: (id: string) => void;
  isHolding?: boolean;
}

export const RekapBarangBulananPurchase: React.FC<RekapBarangBulananPurchaseProps> = ({
  expenses,
  branchName,
  branches = [],
  activeBranchId,
  onSelectBranch,
  isHolding = false,
}) => {
  // Current month default in YYYY-MM format
  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentYearMonth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Month labels in Indonesian
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const formatPeriodeDisplay = (ym: string) => {
    const [year, month] = ym.split('-');
    const mIdx = parseInt(month, 10) - 1;
    return `${monthNames[mIdx] || month} ${year}`;
  };

  // Filter raw expenses by month and branch (if activeBranchId provided)
  const monthlyExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchMonth = e.tanggal.startsWith(selectedMonth);
      const matchBranch = !activeBranchId || activeBranchId === 'all' || e.branchId === activeBranchId;
      return matchMonth && matchBranch;
    });
  }, [expenses, selectedMonth, activeBranchId]);

  // Aggregate by item name (merekBarang)
  const aggregatedItems: RekapBarangItem[] = useMemo(() => {
    const map = new Map<string, RekapBarangItem>();

    monthlyExpenses.forEach((exp) => {
      const rawName = (exp.rincianBarang || '').trim();
      if (!rawName) return;

      // Group key based on lower case name + category
      const key = `${rawName.toLowerCase()}_${exp.kategori || 'Operational'}`;

      if (!map.has(key)) {
        map.set(key, {
          merekBarang: rawName,
          kategori: exp.kategori || 'Operational',
          satuan: exp.satuan || 'Pcs',
          totalKuantitas: Number(exp.kuantitas) || 0,
          totalBiaya: Number(exp.totalBiaya) || 0,
          frekuensiBeli: 1,
          suppliers: exp.supplier ? [exp.supplier] : [],
        });
      } else {
        const item = map.get(key)!;
        item.totalKuantitas += Number(exp.kuantitas) || 0;
        item.totalBiaya += Number(exp.totalBiaya) || 0;
        item.frekuensiBeli += 1;
        if (exp.supplier && !item.suppliers.includes(exp.supplier)) {
          item.suppliers.push(exp.supplier);
        }
      }
    });

    // Convert map to array and sort descending by totalBiaya
    return Array.from(map.values()).sort((a, b) => b.totalBiaya - a.totalBiaya);
  }, [monthlyExpenses]);

  // Filtered view by search & category
  const filteredItems = useMemo(() => {
    return aggregatedItems.filter((item) => {
      const matchSearch =
        item.merekBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.suppliers.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCat = selectedCategory === 'ALL' || item.kategori === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [aggregatedItems, searchTerm, selectedCategory]);

  // KPI Calculations
  const totalPengeluaranBulanIni = aggregatedItems.reduce((sum, item) => sum + item.totalBiaya, 0);
  const totalFrekuensiBelanja = aggregatedItems.reduce((sum, item) => sum + item.frekuensiBeli, 0);
  const totalItemUnik = aggregatedItems.length;
  const topExpenseItem = aggregatedItems[0];

  // Distinct categories available in current month
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    aggregatedItems.forEach((i) => cats.add(i.kategori));
    return Array.from(cats);
  }, [aggregatedItems]);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePdf = () => {
    exportRekapBarangBulananToPdf(filteredItems, formatPeriodeDisplay(selectedMonth), branchName);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Top Banner & Header */}
      <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-stone-900">
                  Rekapitulasi Barang Terbeli Bulanan
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Khusus Purchase
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Akumulasi kuantitas, harga rata-rata, dan total belanja bahan baku periode bulanan di {branchName}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Month selector, Print, PDF */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Month Picker */}
          <div className="flex items-center space-x-1.5 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          {/* Branch filter if in Holding mode */}
          {isHolding && branches.length > 0 && onSelectBranch && (
            <div className="flex items-center space-x-1.5 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <Store className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={activeBranchId || 'all'}
                onChange={(e) => onSelectBranch(e.target.value)}
                className="text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Cabang (Konsolidasi)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.shortName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Cetak Langsung Tabel Rekap Bulanan"
          >
            <Printer className="w-3.5 h-3.5 text-stone-700" />
            <span>Print</span>
          </button>

          {/* Save PDF Button */}
          <button
            onClick={handleSavePdf}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            title="Simpan sebagai PDF Resmi"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Summary Cards */}
      <div className="p-4 sm:p-5 border-b border-stone-200 bg-white grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Total Belanja Bulan Ini</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-stone-900 font-mono">
            {formatRupiah(totalPengeluaranBulanIni)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Periode: <b className="text-stone-800">{formatPeriodeDisplay(selectedMonth)}</b>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Ragam Bahan Baku</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-stone-900">
            {totalItemUnik} <span className="text-xs font-normal text-stone-500">Jenis Barang</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Total {totalFrekuensiBelanja} kali transaksi belanja
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Belanja Tertinggi</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-stone-900 truncate" title={topExpenseItem?.merekBarang || '-'}>
            {topExpenseItem ? topExpenseItem.merekBarang : 'Belum Ada Data'}
          </div>
          <div className="text-[11px] text-emerald-700 font-mono font-bold mt-1">
            {topExpenseItem ? formatRupiah(topExpenseItem.totalBiaya) : 'Rp 0'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Status Audit Purchase</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-stone-900">
            Sinkron Realtime
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Terkunci ke kasir per tanggal
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-stone-50/40 border-b border-stone-200 flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama bahan baku, kategori, atau supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="ALL">Semua Kategori ({aggregatedItems.length})</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-100 text-stone-700 border-b border-stone-200">
              <th className="py-2.5 px-3 font-bold w-12 text-center">No</th>
              <th className="py-2.5 px-4 font-bold">Nama Bahan Baku / Barang</th>
              <th className="py-2.5 px-3 font-bold">Kategori</th>
              <th className="py-2.5 px-3 font-bold text-center">Frekuensi</th>
              <th className="py-2.5 px-3 font-bold text-right">Total Kuantitas</th>
              <th className="py-2.5 px-3 font-bold text-right">Rata-rata / Satuan</th>
              <th className="py-2.5 px-4 font-bold text-right">Total Biaya Pembelian</th>
              <th className="py-2.5 px-4 font-bold">Supplier / Sumber Toko</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-stone-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Archive className="w-7 h-7 text-stone-300" />
                    <span>
                      Tidak ada catatan pembelian barang pada periode{' '}
                      <b>{formatPeriodeDisplay(selectedMonth)}</b>.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => {
                const avgPrice = item.totalKuantitas > 0 ? Math.round(item.totalBiaya / item.totalKuantitas) : 0;
                return (
                  <tr key={`${item.merekBarang}-${idx}`} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-2.5 px-3 text-center text-stone-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-stone-900">
                      {item.merekBarang}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        {item.frekuensiBeli}x
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-stone-900 font-mono">
                      {item.totalKuantitas.toLocaleString('id-ID')} <span className="text-[11px] font-normal text-stone-500">{item.satuan}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-stone-600 font-mono">
                      {formatRupiah(avgPrice)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-black text-purple-900 font-mono">
                      {formatRupiah(item.totalBiaya)}
                    </td>
                    <td className="py-2.5 px-4 text-stone-600 text-[11px]">
                      {item.suppliers.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.suppliers.map((s, sIdx) => (
                            <span key={sIdx} className="bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200 text-stone-700">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {filteredItems.length > 0 && (
            <tfoot>
              <tr className="bg-stone-100 font-bold text-stone-900 border-t-2 border-stone-300">
                <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider text-[11px]">
                  Total Seluruh Belanja Bulan {formatPeriodeDisplay(selectedMonth)}:
                </td>
                <td className="py-3 px-3 text-center font-mono font-black text-blue-800">
                  {totalFrekuensiBelanja}x Transaksi
                </td>
                <td colSpan={2}></td>
                <td className="py-3 px-4 text-right font-black text-purple-900 text-sm font-mono">
                  {formatRupiah(totalPengeluaranBulanIni)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
