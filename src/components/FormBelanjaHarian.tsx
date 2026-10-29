import React, { useState } from 'react';
import { CheckCircle2, ShoppingCart, Sparkles, X } from 'lucide-react';
import { formatRupiah } from '../utils/format';
import { DailyExpense, ExpenseCategory, MasterBahanBaku, ShiftType } from '../types';

interface FormBelanjaHarianProps {
  branchId: string;
  branchName: string;
  masterBahanBaku: MasterBahanBaku[];
  onAddExpense: (expense: Omit<DailyExpense, 'id' | 'createdAt'>) => void;
  onClose?: () => void;
  isModal?: boolean;
  isInline?: boolean;
}

export const FormBelanjaHarian: React.FC<FormBelanjaHarianProps> = ({
  branchId,
  branchName,
  masterBahanBaku,
  onAddExpense,
  onClose,
  isModal = false,
  isInline = false,
}) => {
  const [selectedMasterId, setSelectedMasterId] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState<ShiftType>('Shift 1 (Pagi 07:00 - 15:00)');
  const [rincianBarang, setRincianBarang] = useState('');
  const [kategori, setKategori] = useState<ExpenseCategory>('Beans');
  const [hargaSatuan, setHargaSatuan] = useState<number | ''>('');
  const [kuantitas, setKuantitas] = useState<number | ''>(1);
  const [satuan, setSatuan] = useState('Pcs');
  const [personPurchase, setPersonPurchase] = useState('');
  const [supplier, setSupplier] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const numHarga = Number(hargaSatuan) || 0;
  const numQty = Number(kuantitas) || 0;
  const totalBiaya = numHarga * numQty;

  const handleSelectMaster = (masterId: string) => {
    setSelectedMasterId(masterId);
    if (!masterId) return;
    const item = masterBahanBaku.find((m) => m.id === masterId);
    if (item) {
      setRincianBarang(item.merekBarang);
      setKategori(item.kategori);
      setHargaSatuan(item.hargaSatuan);
      setSatuan(item.satuan);
      setSupplier(item.tempatPembelian);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rincianBarang.trim()) {
      alert('Silakan isi nama barang / bahan baku.');
      return;
    }
    if (!personPurchase.trim()) {
      alert('Silakan isi nama petugas purchase.');
      return;
    }

    onAddExpense({
      branchId,
      tanggal,
      shift,
      rincianBarang: rincianBarang.trim(),
      kategori,
      hargaSatuan: numHarga,
      kuantitas: numQty,
      satuan: satuan.trim(),
      totalBiaya,
      personPurchase: personPurchase.trim(),
      supplier: supplier.trim(),
      keterangan: keterangan.trim(),
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setSelectedMasterId('');
      setRincianBarang('');
      setHargaSatuan('');
      setKuantitas(1);
      setKeterangan('');
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
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Input Belanja Bahan Baku &amp; Operasional</h3>
            <p className="text-xs text-stone-500">
              Cabang: <span className="text-rose-700 font-bold">{branchName}</span> (Khusus Purchase Cabang)
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
            <span>Data belanja berhasil dicatat &amp; terhubung ke rekap kasir harian!</span>
          </div>
        )}

        {/* Master Catalog Quick Picker */}
        <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
          <div className="flex items-center space-x-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <label className="text-xs font-bold text-amber-900">
              Pilih dari Master Bahan Baku Resmi (Holding)
            </label>
          </div>
          <select
            value={selectedMasterId}
            onChange={(e) => handleSelectMaster(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="">-- Pilih Master Bahan Baku (Harga &amp; Satuan Otomatis) --</option>
            {masterBahanBaku.map((m) => (
              <option key={m.id} value={m.id}>
                [{m.kategori}] {m.merekBarang} - {formatRupiah(m.hargaSatuan)} / {m.satuan} ({m.tempatPembelian})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Tanggal Pembelian</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Shift Operasional</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value as ShiftType)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="Shift 1 (Pagi 07:00 - 15:00)">Shift 1 (Pagi 07:00 - 15:00)</option>
              <option value="Shift 2 (Malam 15:00 - 23:00)">Shift 2 (Malam 15:00 - 23:00)</option>
              <option value="Full Day (Event / Weekend)">Full Day (Event / Weekend)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">Rincian Barang / Keperluan</label>
            <input
              type="text"
              placeholder="Contoh: Fresh Milk Greenfields 1L"
              value={rincianBarang}
              onChange={(e) => setRincianBarang(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value as ExpenseCategory)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Harga Satuan (Rp)</label>
            <input
              type="number"
              placeholder="0"
              value={hargaSatuan}
              onChange={(e) => setHargaSatuan(e.target.value === '' ? '' : Number(e.target.value))}
              min="0"
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Kuantitas</label>
            <input
              type="number"
              placeholder="1"
              value={kuantitas}
              onChange={(e) => setKuantitas(e.target.value === '' ? '' : Number(e.target.value))}
              min="0.1"
              step="any"
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Satuan</label>
            <input
              type="text"
              placeholder="Kg / Liter / Pcs / Dus"
              value={satuan}
              onChange={(e) => setSatuan(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Petugas Purchase Cabang</label>
            <input
              type="text"
              placeholder="Contoh: Citra / Eka / Tio"
              value={personPurchase}
              onChange={(e) => setPersonPurchase(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Supplier / Toko Pembelian</label>
            <input
              type="text"
              placeholder="Contoh: Toko Bahan Kue / Supermarket"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Live Calculation Total Biaya */}
        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 block font-semibold">Total Biaya Belanja</span>
            <span className="text-[10px] text-stone-400">Harga Satuan × Kuantitas</span>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-rose-700 font-mono tracking-tight">
              {formatRupiah(totalBiaya)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Keterangan Tambahan (Opsional)</label>
          <input
            type="text"
            placeholder="No nota, nomor bukti transfer, kebutuhan mendesak..."
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
            className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition cursor-pointer"
          >
            Simpan Belanja Cabang
          </button>
        </div>
      </form>
    </div>
  );
};
