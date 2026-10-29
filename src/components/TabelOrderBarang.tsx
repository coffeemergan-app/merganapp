import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Package,
  Plus,
  Printer,
  Trash2,
  Truck,
} from 'lucide-react';
import { formatDate } from '../utils/format';
import { exportOrdersToPdf } from '../utils/export';
import { BranchOrder } from '../types';

interface TabelOrderBarangProps {
  orders: BranchOrder[];
  branchName: string;
  canCreateOrder: boolean;
  canUpdateStatus: boolean;
  canDelete?: boolean;
  onOpenForm: () => void;
  onUpdateStatus: (orderId: string, status: BranchOrder['status']) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const TabelOrderBarang: React.FC<TabelOrderBarangProps> = ({
  orders,
  branchName,
  canCreateOrder,
  canUpdateStatus,
  canDelete = false,
  onOpenForm,
  onUpdateStatus,
  onDeleteOrder,
}) => {
  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
        <div>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-stone-800" />
            <h3 className="font-bold text-base text-stone-900">Daftar Order Restok Cabang &rarr; Holding</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold">
              {orders.length} Order
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Pesanan bahan baku dari {branchName} ke Purchase Pusat Holding
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Print Langsung Tabel Order"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print</span>
          </button>

          <button
            onClick={() => exportOrdersToPdf(orders, branchName)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Download PDF Tabel Order Restok"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>PDF</span>
          </button>

          {canCreateOrder && (
            <button
              onClick={onOpenForm}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Order Restok Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="divide-y divide-stone-200">
        {orders.length === 0 ? (
          <div className="py-10 text-center text-stone-400 text-xs font-medium">
            Belum ada permintaan order bahan baku. {canCreateOrder ? 'Gunakan tombol di atas untuk mengajukan permintaan restok.' : ''}
          </div>
        ) : (
          orders.map((ord) => (
            <div key={ord.id} className="p-4 sm:p-5 hover:bg-stone-50/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 tracking-wider font-mono">
                      {ord.nomorOrder}
                    </span>
                    <div className="text-[11px] text-stone-500">
                      Pemohon: <span className="text-stone-800 font-semibold">{ord.pemohon}</span> • {formatDate(ord.tanggal)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {ord.urgensi === 'Mendesak / Stok Kritis' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      <span>MENDESAK</span>
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      ord.status === 'SELESAI / TERKIRIM'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : ord.status === 'DIPROSES PURCHASE'
                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                        : 'bg-amber-50 text-amber-700 border-amber-300'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 mb-3">
                <div className="text-[11px] font-semibold text-stone-600 mb-2">Item Permintaan:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-lg border border-stone-200 text-xs shadow-2xs">
                      <div className="font-bold text-stone-900">{it.merekBarang}</div>
                      <div className="text-[11px] text-blue-700 font-mono font-semibold">
                        {it.kuantitas} {it.satuan} <span className="text-stone-500 font-normal">({it.kategori})</span>
                      </div>
                      {it.catatan && <div className="text-[10px] text-stone-500 mt-0.5 italic">"{it.catatan}"</div>}
                    </div>
                  ))}
                </div>
                {ord.catatan && (
                  <div className="text-[11px] text-stone-500 mt-2.5 pt-2 border-t border-stone-200">
                    <span className="text-stone-700 font-semibold">Catatan Cabang:</span> {ord.catatan}
                  </div>
                )}
              </div>

              {/* Status Action Buttons for Holding Purchase */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-stone-400 font-mono">
                  ID: {ord.id} • Cabang: {ord.branchId.toUpperCase()}
                </div>

                <div className="flex items-center space-x-2">
                  {canUpdateStatus && ord.status === 'MENUNGGU KONFIRMASI' && (
                    <button
                      onClick={() => onUpdateStatus(ord.id, 'DIPROSES PURCHASE')}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 transition cursor-pointer shadow-2xs"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Proses Pesanan</span>
                    </button>
                  )}

                  {canUpdateStatus && ord.status === 'DIPROSES PURCHASE' && (
                    <button
                      onClick={() => onUpdateStatus(ord.id, 'SELESAI / TERKIRIM')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 transition cursor-pointer shadow-2xs"
                    >
                      <Truck className="w-3 h-3" />
                      <span>Tandai Terkirim</span>
                    </button>
                  )}

                  {ord.status === 'SELESAI / TERKIRIM' && (
                    <div className="flex items-center space-x-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Selesai Terkirim</span>
                    </div>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => {
                        if (confirm('Hapus order ini?')) onDeleteOrder(ord.id);
                      }}
                      className="text-stone-400 hover:text-rose-600 text-xs p-1 ml-2 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
