import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Plus,
  Printer,
  Search,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { AbsensiRecord, UserRole } from '../types';
import { exportAbsensiToPdf } from '../utils/export';

interface TabelAbsensiKaryawanProps {
  absensiList: AbsensiRecord[];
  branchName: string;
  userRole: UserRole;
  canInput: boolean;
  onOpenForm?: () => void;
  onDelete?: (id: string) => void;
}

export const TabelAbsensiKaryawan: React.FC<TabelAbsensiKaryawanProps> = ({
  absensiList,
  branchName,
  userRole,
  canInput,
  onOpenForm,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = absensiList.filter((item) => {
    const matchSearch =
      item.namaKaryawan.toLowerCase().includes(search.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(search.toLowerCase()) ||
      (item.catatan || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Calculate quick summary metrics
  const totalHadir = absensiList.filter((a) => a.status === 'Hadir').length;
  const totalIzin = absensiList.filter((a) => a.status === 'Izin').length;
  const totalSakit = absensiList.filter((a) => a.status === 'Sakit').length;
  const totalAlpa = absensiList.filter((a) => a.status === 'Alpa').length;

  const exportCSV = () => {
    const headers = ['Tanggal', 'Nama Karyawan', 'Jabatan', 'Shift', 'Status', 'Jam Masuk', 'Jam Pulang', 'Catatan'];
    const rows = filtered.map((a) => [
      a.tanggal,
      `"${a.namaKaryawan}"`,
      `"${a.jabatan}"`,
      `"${a.shift}"`,
      a.status,
      a.jamMasuk,
      a.jamPulang,
      `"${a.catatan || '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_absensi_${branchName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Hadir</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-xl font-black text-stone-900">{totalHadir} <span className="text-xs font-normal text-stone-500">karyawan</span></div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Izin</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-xl font-black text-amber-700">{totalIzin} <span className="text-xs font-normal text-stone-500">karyawan</span></div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Sakit</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-xl font-black text-blue-700">{totalSakit} <span className="text-xs font-normal text-stone-500">karyawan</span></div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
            <span>Alpa</span>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </div>
          <div className="text-xl font-black text-red-700">{totalAlpa} <span className="text-xs font-normal text-stone-500">karyawan</span></div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        {/* Card Header & Controls */}
        <div className="p-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-stone-50/50">
          <div>
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-stone-800" />
              <h3 className="font-bold text-stone-900 text-base">Rekap Absensi & Presensi Karyawan</h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Data kehadiran staf toko di {branchName}
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
                placeholder="Cari nama karyawan..."
                className="bg-white border border-stone-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 w-44"
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
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
                <option value="Alpa">Alpa</option>
              </select>
            </div>

            {/* Print & PDF Buttons */}
            <button
              onClick={() => window.print()}
              className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
              title="Print Langsung Tabel Absensi"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span>Print</span>
            </button>

            <button
              onClick={() => exportAbsensiToPdf(filtered, branchName)}
              className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
              title="Download PDF Rekap Absensi"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>PDF</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={exportCSV}
              className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center space-x-1 transition-all"
              title="Download Data Absensi CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Input Button if has permission */}
            {canInput && onOpenForm && (
              <button
                onClick={onOpenForm}
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Absen</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Nama Karyawan</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Shift Kerja</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Jam Kerja</th>
                <th className="py-3 px-4">Catatan</th>
                {canInput && <th className="py-3 px-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={canInput ? 8 : 7} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    <p className="font-semibold">Belum ada catatan presensi untuk filter ini</p>
                    {canInput && (
                      <p className="text-[11px] mt-1 text-stone-500">
                        Klik tombol "Input Absen" untuk mencatat presensi hari ini.
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  let badge = 'bg-stone-100 text-stone-700 border-stone-300';
                  if (item.status === 'Hadir') badge = 'bg-emerald-50 text-emerald-700 border-emerald-300';
                  if (item.status === 'Izin') badge = 'bg-amber-50 text-amber-700 border-amber-300';
                  if (item.status === 'Sakit') badge = 'bg-blue-50 text-blue-700 border-blue-300';
                  if (item.status === 'Alpa') badge = 'bg-red-50 text-red-700 border-red-300';

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-stone-800 whitespace-nowrap">
                        {item.tanggal}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                        {item.namaKaryawan}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px] font-medium text-stone-700">
                          {item.jabatan}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                        {item.shift}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-stone-600 whitespace-nowrap">
                        {item.status === 'Hadir' ? (
                          <span>{item.jamMasuk} - {item.jamPulang}</span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                        {item.catatan || <span className="text-stone-400 italic">-</span>}
                      </td>
                      {canInput && (
                        <td className="py-3 px-4 text-right">
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item.id)}
                              className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors"
                              title="Hapus Catatan Presensi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
