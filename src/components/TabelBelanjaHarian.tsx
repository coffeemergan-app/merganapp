import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  ListFilter,
  Plus,
  Printer,
  Search,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { exportExpensesToExcel, exportExpensesToPdf } from '../utils/export';
import { formatDate, formatRupiah } from '../utils/format';
import { Branch, DailyExpense } from '../types';
import { RekapBarangBulananPurchase } from './RekapBarangBulananPurchase';

interface TabelBelanjaHarianProps {
  expenses: DailyExpense[];
  branchName: string;
  onOpenForm: () => void;
  onDeleteExpense: (id: string) => void;
  canManage: boolean;
  branches?: Branch[];
  activeBranchId?: string;
  onSelectBranch?: (id: string) => void;
  isHolding?: boolean;
}

export const TabelBelanjaHarian: React.FC<TabelBelanjaHarianProps> = ({
  expenses,
  branchName,
  onOpenForm,
  onDeleteExpense,
  canManage,
  branches = [],
  activeBranchId,
  onSelectBranch,
  isHolding = false,
}) => {
  const [activeSubView, setActiveSubView] = useState<'TRANSAKSI' | 'REKAP_BULANAN'>('TRANSAKSI');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredExpenses = expenses.filter((e) => {
    const matchSearch =
      e.rincianBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.personPurchase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.supplier || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.tanggal.includes(searchTerm);
    const matchCat = filterCategory === 'ALL' || e.kategori === filterCategory;
    return matchSearch && matchCat;
  });

  const totalFilteredBiaya = filteredExpenses.reduce((acc, e) => acc + (e.totalBiaya || 0), 0);

  if (activeSubView === 'REKAP_BULANAN') {
    return (
      <div className="space-y-4">
        {/* Sub-view Switcher Bar */}
        <div className="flex items-center space-x-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200 w-fit">
          <button
            onClick={() => setActiveSubView('TRANSAKSI')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-white/60 transition cursor-pointer"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Daftar Nota Transaksi ({expenses.length})</span>
          </button>
          <button
            onClick={() => setActiveSubView('REKAP_BULANAN')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-purple-900 border border-stone-200 shadow-2xs transition cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            <span>Rekap Barang Terbeli Bulanan</span>
          </button>
        </div>

        <RekapBarangBulananPurchase
          expenses={expenses}
          branchName={branchName}
          branches={branches}
          activeBranchId={activeBranchId}
          onSelectBranch={onSelectBranch}
          isHolding={isHolding}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sub-view Switcher Bar */}
      <div className="flex items-center space-x-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200 w-fit">
        <button
          onClick={() => setActiveSubView('TRANSAKSI')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-rose-900 border border-stone-200 shadow-2xs transition cursor-pointer"
        >
          <ListFilter className="w-3.5 h-3.5 text-rose-600" />
          <span>Daftar Nota Transaksi ({expenses.length})</span>
        </button>
        <button
          onClick={() => setActiveSubView('REKAP_BULANAN')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-white/60 transition cursor-pointer"
        >
          <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
          <span>Rekap Barang Terbeli Bulanan</span>
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden mb-6">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
          <div>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h3 className="font-bold text-base text-stone-900">Tabel Belanja Operasional &amp; Bahan Baku</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold">
                Total: {formatRupiah(totalFilteredBiaya)}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Cabang: {branchName} | Pengeluaran bahan baku &amp; operasional harian (Tersinkron otomatis ke Kasir)
            </p>
          </div>

          {/* Action Buttons: Print, PDF, Excel, Input */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
              title="Print Langsung Tabel Belanja Harian"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span>Print</span>
            </button>

            <button
              onClick={() => exportExpensesToPdf(filteredExpenses, branchName)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
              title="Download PDF Belanja Harian"
            >
              <Download className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF</span>
            </button>

          <button
            onClick={() => exportExpensesToExcel(filteredExpenses, branchName)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition"
            title="Download Excel Belanja Harian"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>

          {canManage && (
            <button
              onClick={onOpenForm}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Belanja Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3 bg-white border-b border-stone-200 flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari barang, supplier, petugas purchase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="ALL">Semua Kategori</option>
          <option value="Beans">Beans</option>
          <option value="Freshmilk">Freshmilk</option>
          <option value="UHT">UHT</option>
          <option value="SKM">SKM</option>
          <option value="Syrup">Syrup</option>
          <option value="Cair">Cair</option>
          <option value="Powder">Powder</option>
          <option value="Cup">Cup</option>
          <option value="Cleo">Cleo</option>
          <option value="Operasional Lainnya">Operasional Lainnya</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-100 text-stone-600 uppercase tracking-wider border-b border-stone-200 text-[10px] font-semibold">
              <th className="py-3 px-4">Tanggal &amp; Shift</th>
              <th className="py-3 px-4">Rincian Barang</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4 text-right">Harga Satuan</th>
              <th className="py-3 px-4 text-center">Qty / Satuan</th>
              <th className="py-3 px-4 text-right text-rose-700 font-bold">Total Biaya</th>
              <th className="py-3 px-4">Petugas &amp; Supplier</th>
              {canManage && <th className="py-3 px-4 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-stone-800">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 8 : 7} className="py-8 text-center text-stone-400 font-medium">
                  Belum ada catatan belanja. {canManage ? 'Gunakan form input untuk mencatat belanja.' : ''}
                </td>
              </tr>
            ) : (
              filteredExpenses.map((e) => (
                <tr key={e.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-stone-900">{formatDate(e.tanggal)}</div>
                    <div className="text-[10px] text-stone-500 font-medium">{e.shift}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{e.rincianBarang}</div>
                    {e.keterangan && <div className="text-[10px] text-stone-500 italic">"{e.keterangan}"</div>}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                      {e.kategori}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-stone-700 whitespace-nowrap">
                    {formatRupiah(e.hargaSatuan)}
                  </td>

                  <td className="py-3 px-4 text-center font-mono font-bold text-stone-800 whitespace-nowrap">
                    {e.kuantitas} {e.satuan}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-black text-rose-700 whitespace-nowrap">
                    {formatRupiah(e.totalBiaya)}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-stone-800">{e.personPurchase}</div>
                    <div className="text-[10px] text-stone-500">{e.supplier || '-'}</div>
                  </td>

                  {canManage && (
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Hapus pengeluaran "${e.rincianBarang}"?`)) {
                            onDeleteExpense(e.id);
                          }
                        }}
                        className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus Belanja"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

