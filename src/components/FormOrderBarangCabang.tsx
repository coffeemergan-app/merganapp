import React, { useState } from 'react';
import { CheckCircle2, PackagePlus, Plus, Trash2, X } from 'lucide-react';
import { BranchOrder, BranchOrderItem, MasterBahanBaku } from '../types';

interface FormOrderBarangCabangProps {
  branchId: string;
  branchName: string;
  masterBahanBaku: MasterBahanBaku[];
  onAddOrder: (order: Omit<BranchOrder, 'id' | 'createdAt' | 'nomorOrder'>) => void;
  onClose?: () => void;
  isModal?: boolean;
  isInline?: boolean;
}

export const FormOrderBarangCabang: React.FC<FormOrderBarangCabangProps> = ({
  branchId,
  branchName,
  masterBahanBaku,
  onAddOrder,
  onClose,
  isModal = false,
  isInline = false,
}) => {
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [pemohon, setPemohon] = useState('');
  const [urgensi, setUrgensi] = useState<BranchOrder['urgensi']>('Biasa');
  const [catatan, setCatatan] = useState('');
  const [items, setItems] = useState<BranchOrderItem[]>([
    { merekBarang: '', kategori: 'Beans', kuantitas: 1, satuan: 'Kg', catatan: '' },
  ]);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddItem = () => {
    setItems([
      ...items,
      { merekBarang: '', kategori: 'Beans', kuantitas: 1, satuan: 'Kg', catatan: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof BranchOrderItem, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };

    // Auto fill category and unit if choosing from master catalog
    if (field === 'merekBarang') {
      const found = masterBahanBaku.find((m) => m.merekBarang === val);
      if (found) {
        updated[index].kategori = found.kategori;
        updated[index].satuan = found.satuan;
      }
    }

    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pemohon.trim()) {
      alert('Silakan masukkan nama pemohon order.');
      return;
    }

    const validItems = items.filter((it) => it.merekBarang.trim() && it.kuantitas > 0);
    if (validItems.length === 0) {
      alert('Silakan pilih minimal 1 bahan baku untuk dipesan.');
      return;
    }

    onAddOrder({
      branchId,
      tanggal,
      pemohon: pemohon.trim(),
      urgensi,
      status: 'MENUNGGU KONFIRMASI',
      items: validItems,
      catatan: catatan.trim(),
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setItems([{ merekBarang: '', kategori: 'Beans', kuantitas: 1, satuan: 'Kg', catatan: '' }]);
      setCatatan('');
      if (onClose) onClose();
    }, 1200);
  };

  const containerClasses = isInline
    ? 'bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden'
    : `bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden ${
        isModal ? 'max-w-2xl w-full' : ''
      }`;

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="bg-stone-50 px-5 py-4 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
            <PackagePlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Form Order Restok ke Holding</h3>
            <p className="text-xs text-stone-500">
              Dari Cabang: <span className="text-blue-700 font-bold">{branchName}</span> (Khusus Purchase Cabang)
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
            <span>Permintaan order berhasil dikirim langsung ke Purchase Holding!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Tanggal Order</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Pemohon (Purchase)</label>
            <input
              type="text"
              placeholder="Contoh: Citra Purchase"
              value={pemohon}
              onChange={(e) => setPemohon(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Tingkat Urgensi</label>
            <select
              value={urgensi}
              onChange={(e) => setUrgensi(e.target.value as BranchOrder['urgensi'])}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              <option value="Biasa">Biasa (Jadwal Reguler)</option>
              <option value="Mendesak / Stok Kritis">Mendesak / Stok Kritis</option>
            </select>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Daftar Barang yang Dipesan ({items.length})
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs text-blue-700 hover:text-blue-800 flex items-center space-x-1 font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baris</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="bg-stone-50 p-3 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
              >
                {/* Master Item Selector or Custom Input */}
                <div className="sm:col-span-6">
                  <input
                    list={`master-options-${idx}`}
                    placeholder="Pilih atau ketik bahan baku..."
                    value={it.merekBarang}
                    onChange={(e) => handleItemChange(idx, 'merekBarang', e.target.value)}
                    required
                    className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <datalist id={`master-options-${idx}`}>
                    {masterBahanBaku.map((m) => (
                      <option key={m.id} value={m.merekBarang}>
                        {m.kategori} - {m.satuan}
                      </option>
                    ))}
                  </datalist>
                </div>

                <div className="sm:col-span-3">
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      placeholder="Qty"
                      min="0.1"
                      step="any"
                      value={it.kuantitas}
                      onChange={(e) => handleItemChange(idx, 'kuantitas', Number(e.target.value))}
                      required
                      className="w-16 bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-xs text-stone-900 font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Satuan"
                      value={it.satuan}
                      onChange={(e) => handleItemChange(idx, 'satuan', e.target.value)}
                      required
                      className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Catatan..."
                    value={it.catatan || ''}
                    onChange={(e) => handleItemChange(idx, 'catatan', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-xs text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length <= 1}
                    className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Catatan Tambahan untuk Holding</label>
          <input
            type="text"
            placeholder="Kebutuhan khusus event, estimasi jadwal kirim..."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition cursor-pointer"
          >
            Kirim Order ke Holding
          </button>
        </div>
      </form>
    </div>
  );
};
