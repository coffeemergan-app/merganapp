import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle,
  Clock,
  ExternalLink,
  Layers,
  Package,
  PackageCheck,
  Truck,
} from 'lucide-react';
import { Branch, BranchOrder, MasterBahanBaku } from '../types';

interface PurchaseHoldingDashboardProps {
  orders: BranchOrder[];
  branches: Branch[];
  masterBahanBaku: MasterBahanBaku[];
  onUpdateOrderStatus: (orderId: string, status: BranchOrder['status']) => void;
  onOpenMaster: () => void;
  onSelectBranch: (branchId: string) => void;
}

export const PurchaseHoldingDashboard: React.FC<PurchaseHoldingDashboardProps> = ({
  orders,
  branches,
  masterBahanBaku,
  onUpdateOrderStatus,
  onOpenMaster,
  onSelectBranch,
}) => {
  const pendingOrders = orders.filter((o) => o.status === 'MENUNGGU KONFIRMASI');
  const processingOrders = orders.filter((o) => o.status === 'DIPROSES PURCHASE');
  const completedOrders = orders.filter((o) => o.status === 'SELESAI / TERKIRIM');
  const urgentOrders = orders.filter(
    (o) => o.urgensi === 'Mendesak / Stok Kritis' && o.status !== 'SELESAI / TERKIRIM'
  );

  return (
    <div className="space-y-6 mb-8">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <Truck className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-stone-900">
              Dashboard Purchase Holding &amp; Distribusi Bahan Baku
            </h2>
          </div>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Pusat kendali suplai bahan baku untuk <b>Pusat Sumbawa</b>,{' '}
            <b>Cabang Urip Sumoharjo</b>, dan <b>Cabang Madiun</b>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
            title="Print Dashboard Purchase Holding"
          >
            <span>Print Dashboard</span>
          </button>
          <button
            type="button"
            onClick={onOpenMaster}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer shrink-0"
          >
            <Layers className="w-4 h-4" />
            <span>Kelola Master Bahan Baku ({masterBahanBaku.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Katalog Bahan Baku */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-500">Katalog Bahan Baku</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 tracking-tight font-mono">
            {masterBahanBaku.length} Item
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Terhubung ke seluruh cabang &amp; purchase
          </div>
        </div>

        {/* Menunggu Konfirmasi */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-500">Menunggu Konfirmasi</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 tracking-tight font-mono">
            {pendingOrders.length} Order
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {urgentOrders.length > 0 ? (
              <span className="text-rose-600 font-bold">
                ⚠️ {urgentOrders.length} order stok kritis!
              </span>
            ) : (
              'Tidak ada stok kritis'
            )}
          </div>
        </div>

        {/* Sedang Diproses */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-500">Sedang Dipacking / Kirim</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700 tracking-tight font-mono">
            {processingOrders.length} Order
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Armada ekspedisi / kargo holding
          </div>
        </div>

        {/* Selesai / Terkirim */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-500">Selesai / Diterima Cabang</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
            {completedOrders.length} Order
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Barang telah sampai di outlet
          </div>
        </div>
      </div>

      {/* Restock Order Pipeline */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
              <Package className="w-4 h-4 text-purple-600" />
              <span>Pipeline Permintaan Restok dari 3 Cabang</span>
            </h3>
            <p className="text-xs text-stone-500">
              Ubah status order untuk memberi tahu cabang mengenai proses pengiriman.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 text-stone-400 text-xs">
            Belum ada permintaan order dari cabang.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((ord) => {
              const bInfo = branches.find((b) => b.id === ord.branchId);

              let statusBadge = 'bg-amber-50 text-amber-800 border-amber-300';
              if (ord.status === 'DIPROSES PURCHASE') {
                statusBadge = 'bg-blue-50 text-blue-800 border-blue-300';
              } else if (ord.status === 'SELESAI / TERKIRIM') {
                statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-300';
              }

              return (
                <div
                  key={ord.id}
                  className="bg-stone-50/50 border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-800">
                        {ord.nomorOrder}
                      </span>
                      <span className="text-xs font-semibold text-stone-800 px-2 py-0.5 rounded bg-white border border-stone-200">
                        {bInfo?.name || ord.branchId}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                        {ord.status}
                      </span>
                      {ord.urgensi === 'Mendesak / Stok Kritis' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Mendesak / Kritis</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-800">
                      <b>Daftar Item:</b>{' '}
                      {ord.items
                        .map(
                          (item) =>
                            `${item.merekBarang} (${item.kuantitas} ${item.satuan})`
                        )
                        .join(', ')}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-500">
                      <span>Pemohon: {ord.pemohon}</span>
                      <span>Tanggal: {ord.tanggal}</span>
                      {ord.catatan && <span className="italic">"{ord.catatan}"</span>}
                    </div>
                  </div>

                  {/* Actions to update status */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {ord.status === 'MENUNGGU KONFIRMASI' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(ord.id, 'DIPROSES PURCHASE')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Proses &amp; Packing</span>
                      </button>
                    )}

                    {ord.status === 'DIPROSES PURCHASE' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(ord.id, 'SELESAI / TERKIRIM')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Selesaikan Pengiriman</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectBranch(ord.branchId)}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold transition flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Lihat Cabang</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
