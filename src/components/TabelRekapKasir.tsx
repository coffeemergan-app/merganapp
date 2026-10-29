import React, { useState } from 'react';
import { Calendar, DollarSign, Download, FileSpreadsheet, Plus, Printer, Search, Trash2, Users } from 'lucide-react';
import { exportShiftsToExcel, exportShiftsToPdf } from '../utils/export';
import { formatDate, formatRupiah } from '../utils/format';
import { ShiftRekap } from '../types';

interface TabelRekapKasirProps {
  shifts: ShiftRekap[];
  branchName: string;
  onOpenForm: () => void;
  onDeleteShift: (id: string) => void;
  canManage: boolean;
}

export const TabelRekapKasir: React.FC<TabelRekapKasirProps> = ({
  shifts,
  branchName,
  onOpenForm,
  onDeleteShift,
  canManage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('ALL');

  const filteredShifts = shifts.filter((s) => {
    const matchSearch =
      s.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.catatan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tanggal.includes(searchTerm);
    const matchShift = filterShift === 'ALL' || s.shift.includes(filterShift);
    return matchSearch && matchShift;
  });

  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
        <div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-stone-800" />
            <h3 className="font-bold text-base text-stone-900">Tabel Rekapitulasi Kasir Harian</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
              {filteredShifts.length} Data
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Cabang: {branchName} | Penerimaan Cash, QRIS, &amp; Belanja Kasir
          </p>
        </div>

        {/* Action Buttons: Print, Download PDF, Download Excel */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Print Langsung Tabel Rekap Kasir"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print</span>
          </button>

          <button
            onClick={() => exportShiftsToPdf(filteredShifts, branchName)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Download PDF Tabel Rekap Kasir"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            <span>PDF</span>
          </button>

          <button
            onClick={() => exportShiftsToExcel(filteredShifts, branchName)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition"
            title="Download Excel Tabel Rekap Kasir"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>

          {canManage && (
            <button
              onClick={onOpenForm}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Rekap Kasir</span>
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
            placeholder="Cari kasir, tanggal, atau catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={filterShift}
          onChange={(e) => setFilterShift(e.target.value)}
          className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="ALL">Semua Shift</option>
          <option value="Pagi">Shift 1 (Pagi)</option>
          <option value="Malam">Shift 2 (Malam)</option>
          <option value="Full Day">Full Day</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-100 text-stone-600 uppercase tracking-wider border-b border-stone-200 text-[10px] font-semibold">
              <th className="py-3 px-4">Tanggal &amp; Shift</th>
              <th className="py-3 px-4">Kasir</th>
              <th className="py-3 px-4 text-right text-emerald-700">Cash</th>
              <th className="py-3 px-4 text-right text-blue-700">QRIS</th>
              <th className="py-3 px-4 text-right text-rose-700">Belanja Kasir</th>
              <th className="py-3 px-4 text-right text-stone-900 font-bold">Total Net</th>
              <th className="py-3 px-4">Catatan</th>
              {canManage && <th className="py-3 px-4 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-stone-800">
            {filteredShifts.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 8 : 7} className="py-8 text-center text-stone-400 font-medium">
                  Belum ada rekapan kasir. {canManage ? 'Gunakan form input untuk mencatat shift.' : ''}
                </td>
              </tr>
            ) : (
              filteredShifts.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-stone-900">{formatDate(s.tanggal)}</div>
                    <div className="text-[10px] text-amber-800 font-medium">
                      {s.hari} • {s.shift}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5 font-medium text-stone-700">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span>{s.person}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-medium text-emerald-700">
                    {formatRupiah(s.cash)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-medium text-blue-700">
                    {formatRupiah(s.qris)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-medium text-rose-700">
                    {formatRupiah(s.belanjaKasir)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-black text-stone-900">
                    {formatRupiah(s.totalNet)}
                  </td>

                  <td className="py-3 px-4 max-w-xs truncate text-stone-500">
                    {s.catatan || '-'}
                  </td>

                  {canManage && (
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm('Hapus baris rekap kasir ini?')) {
                            onDeleteShift(s.id);
                          }
                        }}
                        className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus Rekap"
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
  );
};
