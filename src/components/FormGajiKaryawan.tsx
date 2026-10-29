import React, { useEffect, useState } from 'react';
import {
  Banknote,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  FileText,
  MinusCircle,
  PlusCircle,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { GajiRecord, KaryawanRecord } from '../types';

interface FormGajiKaryawanProps {
  branchId: string;
  branchName: string;
  karyawanList: KaryawanRecord[];
  currentUserName: string;
  onSave: (record: Omit<GajiRecord, 'id' | 'createdAt' | 'nomorSlip'>) => void;
  onCancel?: () => void;
  isInline?: boolean;
}

export const FormGajiKaryawan: React.FC<FormGajiKaryawanProps> = ({
  branchId,
  branchName,
  karyawanList,
  currentUserName,
  onSave,
  onCancel,
  isInline = false,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [periodeBulan, setPeriodeBulan] = useState('Oktober 2026');
  const [tanggalBayar, setTanggalBayar] = useState(today);
  const [karyawanId, setKaryawanId] = useState(karyawanList[0]?.id || '');

  const [gajiPokok, setGajiPokok] = useState(karyawanList[0]?.gajiPokokDefault || 2200000);
  const [tunjangan, setTunjangan] = useState(karyawanList[0]?.tunjanganDefault || 300000);
  const [bonusKinerja, setBonusKinerja] = useState(0);
  const [potonganKasbon, setPotonganKasbon] = useState(0);
  const [potonganTerlambat, setPotonganTerlambat] = useState(0);

  const [statusBayar, setStatusBayar] = useState<'LUNAS / DIBAYAR' | 'PENDING / PROSES'>('LUNAS / DIBAYAR');
  const [metodeBayar, setMetodeBayar] = useState<'Transfer Bank' | 'Tunai Kasir'>('Transfer Bank');
  const [catatan, setCatatan] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // When selected employee changes, update default salary & allowances
  const handleKaryawanChange = (newId: string) => {
    setKaryawanId(newId);
    const emp = karyawanList.find((k) => k.id === newId);
    if (emp) {
      setGajiPokok(emp.gajiPokokDefault);
      setTunjangan(emp.tunjanganDefault);
    }
  };

  const selectedKaryawan = karyawanList.find((k) => k.id === karyawanId) || karyawanList[0];

  // Calculated Net Salary
  const totalPendapatan = Number(gajiPokok || 0) + Number(tunjangan || 0) + Number(bonusKinerja || 0);
  const totalPotongan = Number(potonganKasbon || 0) + Number(potonganTerlambat || 0);
  const totalGajiNet = Math.max(0, totalPendapatan - totalPotongan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKaryawan) return;

    onSave({
      branchId,
      periodeBulan,
      tanggalBayar,
      karyawanId: selectedKaryawan.id,
      namaKaryawan: selectedKaryawan.nama,
      jabatan: selectedKaryawan.jabatan,
      gajiPokok: Number(gajiPokok),
      tunjangan: Number(tunjangan),
      bonusKinerja: Number(bonusKinerja),
      potonganKasbon: Number(potonganKasbon),
      potonganTerlambat: Number(potonganTerlambat),
      totalGajiNet,
      statusBayar,
      metodeBayar,
      catatan,
      dibuatOleh: currentUserName || 'Kepala Toko',
    });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);

    // Reset extras
    setBonusKinerja(0);
    setPotonganKasbon(0);
    setPotonganTerlambat(0);
    setCatatan('');
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Branch & Status Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Form Slip Gaji: <strong>{branchName}</strong></span>
        </div>
        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
          Kepala Toko
        </span>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg text-sm flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Slip gaji berhasil disimpan & diterbitkan!</span>
        </div>
      )}

      {/* Periode & Tanggal Bayar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Periode Gaji
          </label>
          <div className="relative">
            <FileSpreadsheet className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={periodeBulan}
              onChange={(e) => setPeriodeBulan(e.target.value)}
              placeholder="Contoh: Oktober 2026"
              required
              className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Tanggal Pencairan
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="date"
              value={tanggalBayar}
              onChange={(e) => setTanggalBayar(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Pilih Karyawan */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          Pilih Karyawan
        </label>
        <div className="relative">
          <Users className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <select
            value={karyawanId}
            onChange={(e) => handleKaryawanChange(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {karyawanList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama} — {k.jabatan} (Standar Rp {k.gajiPokokDefault.toLocaleString('id-ID')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pendapatan: Gaji Pokok, Tunjangan, Bonus */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-800 border-b border-stone-200 pb-1.5">
          <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Komponen Pendapatan Karyawan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Gaji Pokok (Rp)
            </label>
            <input
              type="number"
              min="0"
              step="50000"
              value={gajiPokok}
              onChange={(e) => setGajiPokok(Number(e.target.value))}
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Tunjangan (Rp)
            </label>
            <input
              type="number"
              min="0"
              step="25000"
              value={tunjangan}
              onChange={(e) => setTunjangan(Number(e.target.value))}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Bonus Kinerja (Rp)
            </label>
            <input
              type="number"
              min="0"
              step="25000"
              value={bonusKinerja}
              onChange={(e) => setBonusKinerja(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Potongan: Kasbon & Terlambat */}
      <div className="bg-red-50/50 border border-red-200 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-red-900 border-b border-red-200 pb-1.5">
          <MinusCircle className="w-3.5 h-3.5 text-red-600" />
          <span>Komponen Potongan (Kasbon & Disiplin)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Potongan Kasbon (Rp)
            </label>
            <input
              type="number"
              min="0"
              step="10000"
              value={potonganKasbon}
              onChange={(e) => setPotonganKasbon(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 font-bold focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Potongan Terlambat / Izin (Rp)
            </label>
            <input
              type="number"
              min="0"
              step="10000"
              value={potonganTerlambat}
              onChange={(e) => setPotonganTerlambat(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 font-bold focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* TOTAL GAJI NETTO PREVIEW */}
      <div className="bg-stone-900 text-white rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
            Total Diterima Karyawan (Gaji Net)
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            Rp {totalGajiNet.toLocaleString('id-ID')}
          </div>
        </div>
        <div className="text-right text-xs text-stone-300">
          <div>Pendapatan: Rp {totalPendapatan.toLocaleString('id-ID')}</div>
          <div className="text-red-300">Potongan: -Rp {totalPotongan.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Metode & Status Bayar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Metode Pembayaran
          </label>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <select
              value={metodeBayar}
              onChange={(e) => setMetodeBayar(e.target.value as any)}
              className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 font-medium focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="Tunai Kasir">Tunai Kasir</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Status Pembayaran
          </label>
          <select
            value={statusBayar}
            onChange={(e) => setStatusBayar(e.target.value as any)}
            className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="LUNAS / DIBAYAR">LUNAS / DIBAYAR</option>
            <option value="PENDING / PROSES">PENDING / PROSES</option>
          </select>
        </div>
      </div>

      {/* Catatan Slip */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          Catatan / Keterangan Slip
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Kinerja prima bulan ini, kasbon sisa 1x angsuran..."
            className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center space-x-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Banknote className="w-4 h-4" />
          <span>Terbitkan Slip Gaji</span>
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2.5 px-3 rounded-lg text-sm transition-all"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );

  if (isInline) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Form Penggajian Karyawan</h3>
              <p className="text-[11px] text-stone-500">Khusus Kepala Toko Cabang</p>
            </div>
          </div>
        </div>
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full p-6 animate-scale-up my-8">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Input Slip Gaji Karyawan</h3>
              <p className="text-xs text-stone-500">{branchName}</p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {formContent}
      </div>
    </div>
  );
};
