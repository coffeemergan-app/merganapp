import React, { useState } from 'react';
import { Download, Layers, Plus, Printer, Search, Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/format';
import { exportMasterToPdf } from '../utils/export';
import { ExpenseCategory, MasterBahanBaku } from '../types';

interface MasterBahanBakuManagerProps {
  items: MasterBahanBaku[];
  onAddItem: (item: Omit<MasterBahanBaku, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  canEdit: boolean;
}

export const MasterBahanBakuManager: React.FC<MasterBahanBakuManagerProps> = ({
  items,
  onAddItem,
  onDeleteItem,
  canEdit,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [merekBarang, setMerekBarang] = useState('');
  const [kategori, setKategori] = useState<ExpenseCategory>('Beans');
  const [satuan, setSatuan] = useState('Kg');
  const [tempatPembelian, setTempatPembelian] = useState('');
  const [hargaSatuan, setHargaSatuan] = useState<number | ''>('');

  const filteredItems = items.filter(
    (i) =>
      i.merekBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.tempatPembelian.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merekBarang.trim()) return;

    onAddItem({
      merekBarang: merekBarang.trim(),
      kategori,
      satuan: satuan.trim(),
      tempatPembelian: tempatPembelian.trim() || 'Pusat Roastery / Supplier',
      hargaSatuan: Number(hargaSatuan) || 0,
    });

    setMerekBarang('');
    setHargaSatuan('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-stone-800" />
            <h3 className="font-bold text-base text-stone-900">Master Bahan Baku Resmi (Purchase Holding)</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-bold">
              {filteredItems.length} Katalog
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Daftar harga standar &amp; satuan bahan baku resmi (Khusus diedit oleh Purchase Holding)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Print Langsung Katalog Master Bahan Baku"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print</span>
          </button>

          <button
            onClick={() => exportMasterToPdf(filteredItems)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Download PDF Katalog Master Bahan Baku"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            <span>PDF</span>
          </button>

          {canEdit && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Tutup Form' : 'Tambah Bahan Baku Baru'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add New Master Item Form */}
      {showAddForm && canEdit && (
        <form onSubmit={handleSubmit} className="p-4 bg-purple-50/30 border-b border-stone-200 grid grid-cols-1 sm:grid-cols-6 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">Merek / Nama Bahan Baku</label>
            <input
              type="text"
              placeholder="Contoh: Susu Greenfield 1L"
              value={merekBarang}
              onChange={(e) => setMerekBarang(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value as ExpenseCategory)}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">Satuan</label>
            <input
              type="text"
              placeholder="Kg / Liter / Dus"
              value={satuan}
              onChange={(e) => setSatuan(e.target.value)}
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">Harga Satuan (Rp)</label>
            <input
              type="number"
              placeholder="0"
              value={hargaSatuan}
              onChange={(e) => setHargaSatuan(e.target.value === '' ? '' : Number(e.target.value))}
              min="0"
              required
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Simpan ke Master
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="p-3 bg-white border-b border-stone-200">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari bahan baku, kategori, supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-100 text-stone-600 uppercase tracking-wider border-b border-stone-200 text-[10px] font-semibold">
              <th className="py-3 px-4">Nama Bahan Baku</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Satuan</th>
              <th className="py-3 px-4 text-right">Harga Standar Holding</th>
              <th className="py-3 px-4">Tempat Pembelian / Supplier</th>
              {canEdit && <th className="py-3 px-4 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-stone-800">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-stone-900 flex items-center space-x-2">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>{item.merekBarang}</span>
                </td>

                <td className="py-3 px-4">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    {item.kategori}
                  </span>
                </td>

                <td className="py-3 px-4 text-stone-700 font-medium">
                  {item.satuan}
                </td>

                <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">
                  {formatRupiah(item.hargaSatuan)}
                </td>

                <td className="py-3 px-4 text-stone-500">
                  {item.tempatPembelian}
                </td>

                {canEdit && (
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        if (confirm(`Hapus bahan baku ${item.merekBarang} dari katalog pusat?`)) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
