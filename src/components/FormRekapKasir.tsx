import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Lock,
  ShoppingBag,
  X,
} from 'lucide-react';
import { formatRupiah } from '../utils/format';
import { DailyExpense, ShiftRekap, ShiftType } from '../types';

interface FormRekapKasirProps {
  branchId: string;
  branchName: string;
  onAddShift: (shift: Omit<ShiftRekap, 'id' | 'createdAt'>) => void;
  onClose?: () => void;
  isModal?: boolean;
  isInline?: boolean;
  expenses?: DailyExpense[];
}

export const FormRekapKasir: React.FC<FormRekapKasirProps> = ({
  branchId,
  branchName,
  onAddShift,
  onClose,
  isModal = false,
  isInline = false,
  expenses = [],
}) => {
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState<ShiftType>('Shift 1 (Pagi 07:00 - 15:00)');
  const [person, setPerson] = useState('');
  const [cash, setCash] = useState<number | ''>('');
  const [qris, setQris] = useState<number | ''>('');
  const [catatan, setCatatan] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);

  // Link daily purchase expenses directly & lock per date
  const matchingDailyExpenses = expenses.filter(
    (e) => e.branchId === branchId && e.tanggal === tanggal
  );
  const autoBelanjaTotal = matchingDailyExpenses.reduce(
    (sum, e) => sum + (Number(e.totalBiaya) || 0),
    0
  );

  const numCash = Number(cash) || 0;
  const numQris = Number(qris) || 0;
  const numBelanja = autoBelanjaTotal; // Locked to purchase audit source
  const netTotal = numCash + numQris - numBelanja;

  const getHariName = (dStr: string) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const d = new Date(dStr);
    return isNaN(d.getTime()) ? 'Hari Ini' : days[d.getDay()];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!person.trim()) {
      alert('Silakan masukkan nama kasir.');
      return;
    }

    onAddShift({
      branchId,
      tanggal,
      hari: getHariName(tanggal),
      person: person.trim(),
      shift,
      cash: numCash,
      qris: numQris,
      belanjaKasir: numBelanja,
      totalNet: netTotal,
      catatan: catatan.trim(),
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setCash('');
      setQris('');
      setCatatan('');
      if (onClose) onClose();
    }, 1200);
  };

  const containerClasses = isInline
    ? 'bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden'
    : `bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden ${
        isModal ? 'max-w-xl w-full' : ''
      }`;

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="bg-stone-50 px-5 py-4 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Form Rekap Kasir Harian</h3>
            <p className="text-xs text-stone-500">
              Cabang: <span className="text-amber-700 font-bold">{branchName}</span>
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Rekap kasir berhasil disimpan &amp; tersinkron secara realtime!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Pilihan Shift</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value as ShiftType)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Shift 1 (Pagi 07:00 - 15:00)">Shift 1 (Pagi 07:00 - 15:00)</option>
              <option value="Shift 2 (Malam 15:00 - 23:00)">Shift 2 (Malam 15:00 - 23:00)</option>
              <option value="Full Day (Event / Weekend)">Full Day (Event / Weekend)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Kasir / Petugas</label>
          <input
            type="text"
            placeholder="Contoh: Rian / Siti Rahma"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            required
            className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-emerald-700 mb-1">Penerimaan Cash (Rp)</label>
            <input
              type="number"
              placeholder="0"
              value={cash}
              onChange={(e) => setCash(e.target.value === '' ? '' : Number(e.target.value))}
              min="0"
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-700 mb-1">QRIS / Non-Tunai (Rp)</label>
            <input
              type="number"
              placeholder="0"
              value={qris}
              onChange={(e) => setQris(e.target.value === '' ? '' : Number(e.target.value))}
              min="0"
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-rose-700 flex items-center space-x-1">
                <span>Belanja Kasir (Rp)</span>
                <Lock className="w-3 h-3 text-rose-600" />
              </label>
              <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                Terkunci Otomatis
              </span>
            </div>
            <input
              type="text"
              readOnly
              value={formatRupiah(autoBelanjaTotal)}
              className="w-full bg-stone-100 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-800 font-mono font-bold cursor-not-allowed select-none focus:outline-none"
              title="Nilai belanja terkunci otomatis dari transaksi Purchase pada hari ini"
            />
          </div>
        </div>

        {/* Purchase Belanja Sync & Locked Badge Alert */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">
                  Belanja Terhubung ke Purchase &amp; Terkunci Per Hari ({tanggal})
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Total belanja <b>{formatRupiah(autoBelanjaTotal)}</b> ({matchingDailyExpenses.length} transaksi). Demi transparansi dan kepatuhan audit kasir, kolom belanja hanya dapat diisi dan diubah oleh <b>Petugas Purchase Cabang</b>.
                </p>
              </div>
            </div>
            {matchingDailyExpenses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowExpenseDetails(!showExpenseDetails)}
                className="text-amber-800 hover:text-amber-900 font-bold text-[11px] flex items-center space-x-0.5 shrink-0 ml-2 cursor-pointer bg-white px-2 py-1 rounded border border-amber-300"
              >
                <span>{showExpenseDetails ? 'Tutup' : 'Rincian'}</span>
                {showExpenseDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Collapsible Purchase Expense Breakdown */}
          {showExpenseDetails && matchingDailyExpenses.length > 0 && (
            <div className="mt-2 pt-2 border-t border-amber-200/70 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                Nota Belanja Purchase Tanggal {tanggal}:
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {matchingDailyExpenses.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-1.5 bg-white rounded-lg border border-amber-200 flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-semibold text-stone-900">{exp.rincianBarang}</span>{' '}
                      <span className="text-stone-500">
                        ({exp.kuantitas} {exp.satuan} @ {formatRupiah(exp.hargaSatuan)})
                      </span>
                      <div className="text-[10px] text-stone-400">
                        Oleh: {exp.personPurchase} • {exp.shift}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-rose-700">
                      {formatRupiah(exp.totalBiaya)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Calculation Box */}
        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 block font-semibold">Total Net Bersih Kasir</span>
            <span className="text-[10px] text-stone-400">Cash + QRIS - Belanja Kasir</span>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-amber-800 font-mono tracking-tight">
              {formatRupiah(netTotal)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Catatan Kasir (Opsional)</label>
          <input
            type="text"
            placeholder="Keterangan selisih kas, bon gantung, shift tukar..."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end space-x-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition cursor-pointer"
          >
            Simpan Rekap Kasir
          </button>
        </div>
      </form>
    </div>
  );
};
