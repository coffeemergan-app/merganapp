import React, { useState } from 'react';
import {
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  Plus,
  Printer,
  Search,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { GajiRecord, UserRole } from '../types';
import { exportGajiToPdf } from '../utils/export';

interface TabelGajiKaryawanProps {
  gajiList: GajiRecord[];
  branchName: string;
  userRole: UserRole;
  canInput: boolean;
  onOpenForm?: () => void;
  onUpdateStatus?: (id: string, status: GajiRecord['statusBayar']) => void;
  onDelete?: (id: string) => void;
}

export const TabelGajiKaryawan: React.FC<TabelGajiKaryawanProps> = ({
  gajiList,
  branchName,
  userRole,
  canInput,
  onOpenForm,
  onUpdateStatus,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedSlip, setSelectedSlip] = useState<GajiRecord | null>(null);

  const filtered = gajiList.filter((item) => {
    const matchSearch =
      item.namaKaryawan.toLowerCase().includes(search.toLowerCase()) ||
      item.nomorSlip.toLowerCase().includes(search.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(search.toLowerCase()) ||
      item.periodeBulan.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || item.statusBayar === filterStatus;
    return matchSearch && matchStatus;
  });

  // Calculate summary metrics
  const totalNetGaji = gajiList.reduce((acc, curr) => acc + curr.totalGajiNet, 0);
  const totalLunas = gajiList
    .filter((g) => g.statusBayar === 'LUNAS / DIBAYAR')
    .reduce((acc, curr) => acc + curr.totalGajiNet, 0);
  const totalPending = gajiList
    .filter((g) => g.statusBayar !== 'LUNAS / DIBAYAR')
    .reduce((acc, curr) => acc + curr.totalGajiNet, 0);

  const exportCSV = () => {
    const headers = [
      'Nomor Slip',
      'Periode',
      'Tanggal Bayar',
      'Nama Karyawan',
      'Jabatan',
      'Gaji Pokok',
      'Tunjangan',
      'Bonus',
      'Potongan Kasbon',
      'Potongan Terlambat',
      'Total Net',
      'Status Bayar',
      'Metode Bayar',
      'Dibuat Oleh',
    ];
    const rows = filtered.map((g) => [
      g.nomorSlip,
      `"${g.periodeBulan}"`,
      g.tanggalBayar,
      `"${g.namaKaryawan}"`,
      `"${g.jabatan}"`,
      g.gajiPokok,
      g.tunjangan,
      g.bonusKinerja,
      g.potonganKasbon,
      g.potonganTerlambat,
      g.totalGajiNet,
      `"${g.statusBayar}"`,
      `"${g.metodeBayar}"`,
      `"${g.dibuatOleh}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_gaji_${branchName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Total Beban Gaji</span>
            <Banknote className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
            Rp {totalNetGaji.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Total seluruh slip gaji tercatat</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
            <span>Gaji Sudah Dibayarkan</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
            Rp {totalLunas.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-1">Status Lunas / Terkirim ke staf</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-700 font-semibold mb-1">
            <span>Gaji Pending / Proses</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
            Rp {totalPending.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-amber-700/80 mt-1">Menunggu pencairan kasir/bank</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        {/* Card Header & Controls */}
        <div className="p-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-stone-50/50">
          <div>
            <div className="flex items-center space-x-2">
              <Banknote className="w-5 h-5 text-stone-800" />
              <h3 className="font-bold text-stone-900 text-base">Daftar Penggajian & Slip Karyawan</h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Kelola dan pantau pembayaran honorarium & gaji staf di {branchName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari slip / nama..."
                className="bg-white border border-stone-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center space-x-1 bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-xs text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="LUNAS / DIBAYAR">Lunas</option>
                <option value="PENDING / PROSES">Pending</option>
              </select>
            </div>

            {/* Print & PDF Buttons */}
            <button
              onClick={() => window.print()}
              className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
              title="Print Langsung Tabel Penggajian"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span>Print</span>
            </button>

            <button
              onClick={() => exportGajiToPdf(filtered, branchName)}
              className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
              title="Download PDF Rekap Penggajian"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>PDF</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={exportCSV}
              className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center space-x-1 transition-all"
              title="Download Data Gaji CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Input Button if has permission */}
            {canInput && onOpenForm && (
              <button
                onClick={onOpenForm}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Terbitkan Slip</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">No. Slip</th>
                <th className="py-3 px-4">Periode & Tgl</th>
                <th className="py-3 px-4">Nama & Jabatan</th>
                <th className="py-3 px-4 text-right">Gaji Pokok</th>
                <th className="py-3 px-4 text-right">Tunj + Bonus</th>
                <th className="py-3 px-4 text-right">Potongan</th>
                <th className="py-3 px-4 text-right">Total Net</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400">
                    <Banknote className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    <p className="font-semibold">Belum ada slip gaji yang tercatat</p>
                    {canInput && (
                      <p className="text-[11px] mt-1 text-stone-500">
                        Klik tombol "Terbitkan Slip" untuk membuat slip gaji baru.
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isLunas = item.statusBayar === 'LUNAS / DIBAYAR';
                  const totalTunjBonus = item.tunjangan + item.bonusKinerja;
                  const totalPot = item.potonganKasbon + item.potonganTerlambat;

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900 whitespace-nowrap">
                        {item.nomorSlip}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-stone-800">{item.periodeBulan}</div>
                        <div className="text-[10px] text-stone-500 font-mono">{item.tanggalBayar}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-stone-900">{item.namaKaryawan}</div>
                        <span className="inline-block bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded text-[10px]">
                          {item.jabatan}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-700 whitespace-nowrap">
                        Rp {item.gajiPokok.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 whitespace-nowrap">
                        +Rp {totalTunjBonus.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-red-600 whitespace-nowrap">
                        {totalPot > 0 ? `-Rp ${totalPot.toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-stone-900 whitespace-nowrap">
                        Rp {item.totalGajiNet.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {canInput && onUpdateStatus ? (
                          <button
                            onClick={() =>
                              onUpdateStatus(
                                item.id,
                                isLunas ? 'PENDING / PROSES' : 'LUNAS / DIBAYAR'
                              )
                            }
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                              isLunas
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                            }`}
                            title="Klik untuk ubah status pembayaran"
                          >
                            {isLunas ? 'LUNAS' : 'PENDING'}
                          </button>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isLunas
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-amber-50 text-amber-700 border-amber-300'
                            }`}
                          >
                            {isLunas ? 'LUNAS' : 'PENDING'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => setSelectedSlip(item)}
                            className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                            title="Lihat & Cetak Slip Gaji"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {canInput && onDelete && (
                            <button
                              onClick={() => onDelete(item.id)}
                              className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Hapus Slip Gaji"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Gaji Modal / Print Preview */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <Banknote className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-stone-900">Slip Gaji Karyawan</h3>
              </div>
              <button
                onClick={() => setSelectedSlip(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs" id="slip-print-content">
              {/* Slip Header */}
              <div className="text-center pb-2 border-b border-stone-200">
                <div className="font-black text-sm tracking-widest text-stone-900">TOKO KOPI MERGAN</div>
                <div className="text-[11px] text-stone-600">{branchName}</div>
                <div className="text-[10px] text-stone-400 font-mono mt-0.5">{selectedSlip.nomorSlip}</div>
              </div>

              {/* Staff Info */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-500 text-[10px]">Nama Karyawan:</span>
                  <div className="font-bold text-stone-900">{selectedSlip.namaKaryawan}</div>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">Jabatan:</span>
                  <div className="font-semibold text-stone-800">{selectedSlip.jabatan}</div>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">Periode:</span>
                  <div className="font-semibold text-stone-800">{selectedSlip.periodeBulan}</div>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">Tanggal Bayar:</span>
                  <div className="font-mono text-stone-800">{selectedSlip.tanggalBayar}</div>
                </div>
              </div>

              {/* Rincian Komponen */}
              <div className="space-y-1.5 border-t border-b border-stone-200 py-3">
                <div className="flex justify-between">
                  <span className="text-stone-600">Gaji Pokok:</span>
                  <span className="font-mono font-bold text-stone-900">Rp {selectedSlip.gajiPokok.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Tunjangan:</span>
                  <span className="font-mono text-stone-900">+Rp {selectedSlip.tunjangan.toLocaleString('id-ID')}</span>
                </div>
                {selectedSlip.bonusKinerja > 0 && (
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Bonus Kinerja:</span>
                    <span className="font-mono text-emerald-700">+Rp {selectedSlip.bonusKinerja.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {selectedSlip.potonganKasbon > 0 && (
                  <div className="flex justify-between">
                    <span className="text-red-600">Potongan Kasbon:</span>
                    <span className="font-mono text-red-600">-Rp {selectedSlip.potonganKasbon.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {selectedSlip.potonganTerlambat > 0 && (
                  <div className="flex justify-between">
                    <span className="text-red-600">Potongan Terlambat:</span>
                    <span className="font-mono text-red-600">-Rp {selectedSlip.potonganTerlambat.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-sm">
                  <span className="text-stone-900">TOTAL GAJI NETTO:</span>
                  <span className="font-mono text-emerald-700 font-black">
                    Rp {selectedSlip.totalGajiNet.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Footer info */}
              <div className="text-[11px] text-stone-500 flex justify-between items-center">
                <span>Metode: {selectedSlip.metodeBayar}</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  {selectedSlip.statusBayar}
                </span>
              </div>
              {selectedSlip.catatan && (
                <div className="text-[10px] text-stone-500 italic bg-stone-50 p-2 rounded">
                  Catatan: {selectedSlip.catatan}
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-stone-900 hover:bg-black text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Slip</span>
              </button>
              <button
                onClick={() => setSelectedSlip(null)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 px-4 rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
