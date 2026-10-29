import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, FileText, UserCheck, Users, X } from 'lucide-react';
import { AbsensiRecord, KaryawanRecord, ShiftType, StatusAbsensi } from '../types';

interface FormAbsensiKaryawanProps {
  branchId: string;
  branchName: string;
  karyawanList: KaryawanRecord[];
  onSave: (record: Omit<AbsensiRecord, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  isInline?: boolean;
}

export const FormAbsensiKaryawan: React.FC<FormAbsensiKaryawanProps> = ({
  branchId,
  branchName,
  karyawanList,
  onSave,
  onCancel,
  isInline = false,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [tanggal, setTanggal] = useState(today);
  const [karyawanId, setKaryawanId] = useState(karyawanList[0]?.id || '');
  const [shift, setShift] = useState<ShiftType>('Shift 1 (Pagi 07:00 - 15:00)');
  const [status, setStatus] = useState<StatusAbsensi>('Hadir');
  const [jamMasuk, setJamMasuk] = useState('06:55');
  const [jamPulang, setJamPulang] = useState('15:05');
  const [catatan, setCatatan] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const selectedKaryawan = karyawanList.find((k) => k.id === karyawanId) || karyawanList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKaryawan) return;

    onSave({
      branchId,
      tanggal,
      karyawanId: selectedKaryawan.id,
      namaKaryawan: selectedKaryawan.nama,
      jabatan: selectedKaryawan.jabatan,
      shift,
      status,
      jamMasuk: status === 'Hadir' ? jamMasuk : '-',
      jamPulang: status === 'Hadir' ? jamPulang : '-',
      catatan,
    });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);

    // Reset default notes
    setCatatan('');
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Branch & Status Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Form Presensi: <strong>{branchName}</strong></span>
        </div>
        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">
          Kepala Toko
        </span>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg text-sm flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Presensi berhasil dicatat ke sistem!</span>
        </div>
      )}

      {/* Tanggal & Shift */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Tanggal Presensi
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Shift Kerja
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value as ShiftType)}
              className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="Shift 1 (Pagi 07:00 - 15:00)">Shift 1 (Pagi 07:00 - 15:00)</option>
              <option value="Shift 2 (Malam 15:00 - 23:00)">Shift 2 (Malam 15:00 - 23:00)</option>
              <option value="Full Day (Event / Weekend)">Full Day (Event / Weekend)</option>
            </select>
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
            onChange={(e) => setKaryawanId(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium"
          >
            {karyawanList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama} — {k.jabatan}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Presensi Buttons */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
          Status Kehadiran
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as StatusAbsensi[]).map((st) => {
            const isSel = status === st;
            let activeColor = 'bg-stone-900 text-white border-stone-900';
            if (st === 'Hadir') activeColor = 'bg-emerald-600 text-white border-emerald-600';
            if (st === 'Izin') activeColor = 'bg-amber-600 text-white border-amber-600';
            if (st === 'Sakit') activeColor = 'bg-blue-600 text-white border-blue-600';
            if (st === 'Alpa') activeColor = 'bg-red-600 text-white border-red-600';

            return (
              <button
                type="button"
                key={st}
                onClick={() => setStatus(st)}
                className={`py-1.5 text-xs font-bold rounded-lg border transition-all text-center ${
                  isSel ? activeColor : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Jam Masuk & Jam Pulang (hanya jika Hadir) */}
      {status === 'Hadir' && (
        <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 border border-stone-200 rounded-lg">
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Jam Masuk
            </label>
            <input
              type="text"
              value={jamMasuk}
              onChange={(e) => setJamMasuk(e.target.value)}
              placeholder="07:00"
              className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Jam Pulang
            </label>
            <input
              type="text"
              value={jamPulang}
              onChange={(e) => setJamPulang(e.target.value)}
              placeholder="15:00"
              className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}

      {/* Catatan / Alasan */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          Catatan / Keterangan
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Datang on-time, ganti shift, izin urusan keluarga..."
            className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center space-x-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Simpan Presensi</span>
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
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Form Input Absen Karyawan</h3>
              <p className="text-[11px] text-stone-500">Khusus Kepala Toko Cabang</p>
            </div>
          </div>
        </div>
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 animate-scale-up">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Input Absen Karyawan</h3>
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
