import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Banknote,
  Building2,
  CheckCircle,
  CreditCard,
  DollarSign,
  Package,
  Printer,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { Branch, BranchOrder, DailyExpense, ShiftRekap } from '../types';
import { formatRupiah } from '../utils/format';

interface HoldingDashboardProps {
  branches: Branch[];
  shifts: ShiftRekap[];
  expenses: DailyExpense[];
  orders: BranchOrder[];
  canConfirmOrder?: boolean;
  onSelectBranch: (branchId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: BranchOrder['status']) => void;
}

export const HoldingDashboard: React.FC<HoldingDashboardProps> = ({
  branches,
  shifts,
  expenses,
  orders,
  canConfirmOrder = false,
  onSelectBranch,
  onUpdateOrderStatus,
}) => {
  // Total Consolidated Metrics
  const totalCash = shifts.reduce((acc, s) => acc + (s.cash || 0), 0);
  const totalQris = shifts.reduce((acc, s) => acc + (s.qris || 0), 0);
  const totalOmzet = totalCash + totalQris;
  const totalExpense = expenses.reduce((acc, e) => acc + (e.totalBiaya || 0), 0);
  const netProfit = totalOmzet - totalExpense;
  const marginPercent = totalOmzet > 0 ? ((netProfit / totalOmzet) * 100).toFixed(1) : '0';

  const pendingOrders = orders.filter((o) => o.status === 'MENUNGGU KONFIRMASI');
  const criticalOrders = orders.filter(
    (o) => o.urgensi === 'Mendesak / Stok Kritis' && o.status !== 'SELESAI / TERKIRIM'
  );

  // Branch Breakdown Calculations
  const branchMetrics = branches.map((b) => {
    const branchShifts = shifts.filter((s) => s.branchId === b.id);
    const branchExpenses = expenses.filter((e) => e.branchId === b.id);
    const branchOrders = orders.filter((o) => o.branchId === b.id);

    const bCash = branchShifts.reduce((acc, s) => acc + (s.cash || 0), 0);
    const bQris = branchShifts.reduce((acc, s) => acc + (s.qris || 0), 0);
    const bOmzet = bCash + bQris;
    const bExpense = branchExpenses.reduce((acc, e) => acc + (e.totalBiaya || 0), 0);
    const bNet = bOmzet - bExpense;
    const bMargin = bOmzet > 0 ? Math.round((bNet / bOmzet) * 100) : 0;
    const bPendingOrders = branchOrders.filter((o) => o.status === 'MENUNGGU KONFIRMASI').length;

    return {
      branch: b,
      omzet: bOmzet,
      cash: bCash,
      qris: bQris,
      expense: bExpense,
      net: bNet,
      margin: bMargin,
      shiftCount: branchShifts.length,
      pendingOrders: bPendingOrders,
    };
  });

  return (
    <div className="space-y-6 mb-8">
      {/* Executive Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-stone-900">
              Dashboard Konsolidasi Holding Toko Kopi Mergan
            </h2>
          </div>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Ikhtisar performa finansial gabungan 3 cabang: <b>Pusat Sumbawa</b>,{' '}
            <b>Cabang Urip Sumoharjo</b>, dan <b>Cabang Madiun</b>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
            title="Print Ringkasan Konsolidasi Holding"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print Laporan Holding</span>
          </button>
          <span className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 font-semibold flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>3 Cabang Aktif</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            Margin Bersih: {marginPercent}%
          </span>
        </div>
      </div>

      {/* Top Level Holding KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Omzet Konsolidasi */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-500">Total Omzet Gabungan</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 tracking-tight font-mono">
            {formatRupiah(totalOmzet)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center space-x-2">
            <span>Cash: {formatRupiah(totalCash)}</span>
            <span>•</span>
            <span>QRIS: {formatRupiah(totalQris)}</span>
          </div>
        </div>

        {/* Total Belanja Operasional */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-500">Total Belanja Cabang</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 tracking-tight font-mono">
            {formatRupiah(totalExpense)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Dari {expenses.length} nota belanja harian
          </div>
        </div>

        {/* Laba Bersih Konsolidasian */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-500">Laba Bersih Konsolidasi</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
            {formatRupiah(netProfit)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Margin Holding: <span className="text-emerald-700 font-bold">{marginPercent}%</span>
          </div>
        </div>

        {/* Order Restok Cabang */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-500">Order Restok Cabang</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700 tracking-tight font-mono">
            {orders.length} Order
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center space-x-1.5">
            {pendingOrders.length > 0 ? (
              <span className="text-amber-700 font-bold">
                {pendingOrders.length} butuh konfirmasi
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold">Semua terproses</span>
            )}
            {criticalOrders.length > 0 && (
              <span className="text-rose-600 font-bold ml-1">
                ({criticalOrders.length} kritis!)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Branch Comparison Breakdown */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Perbandingan Finansial &amp; Kontribusi Lintas Cabang</span>
            </h3>
            <p className="text-xs text-stone-500">
              Klik nama cabang untuk beralih langsung ke detail operasional cabang tersebut.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branchMetrics.map((bm) => (
            <div
              key={bm.branch?.id || Math.random()}
              className="bg-stone-50/50 border border-stone-200 hover:border-amber-400 rounded-xl p-4 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{bm.branch?.name || 'Cabang'}</h4>
                    <p className="text-[11px] text-stone-500">{bm.branch?.address || ''}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    {bm.margin}% Margin
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="flex items-center space-x-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                      <span>Total Omzet:</span>
                    </span>
                    <span className="font-bold text-stone-900">{formatRupiah(bm.omzet)}</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-500 text-[11px]">
                    <span className="pl-5">Tunai (Cash):</span>
                    <span className="text-emerald-700 font-semibold">{formatRupiah(bm.cash)}</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-500 text-[11px]">
                    <span className="pl-5">QRIS / EDC:</span>
                    <span className="text-blue-700 font-semibold">{formatRupiah(bm.qris)}</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600 pt-1 border-t border-stone-200">
                    <span className="flex items-center space-x-1.5">
                      <ShoppingCart className="w-3.5 h-3.5 text-rose-600" />
                      <span>Belanja Operasional:</span>
                    </span>
                    <span className="font-bold text-rose-700">{formatRupiah(bm.expense)}</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-900 pt-1 border-t border-stone-200">
                    <span className="font-semibold">Laba Bersih Cabang:</span>
                    <span
                      className={`font-black ${bm.net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}
                    >
                      {formatRupiah(bm.net)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[10px] text-stone-500">
                  {bm.pendingOrders > 0 ? (
                    <span className="text-amber-700 font-semibold flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>{bm.pendingOrders} order butuh restok</span>
                    </span>
                  ) : (
                    <span>Stok &amp; Order Aman</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectBranch(bm.branch.id)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>Buka Cabang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Restock Orders Section */}
      {pendingOrders.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-stone-900">
                Permintaan Restok Menunggu Konfirmasi ({pendingOrders.length})
              </h3>
            </div>
            <span className="text-[11px] text-stone-500">
              {canConfirmOrder
                ? 'Purchase Holding dapat langsung konfirmasi order'
                : 'Mode Audit: Konfirmasi dilakukan oleh Purchase Holding'}
            </span>
          </div>

          <div className="space-y-2">
            {pendingOrders.map((ord) => {
              const bInfo = branches.find((b) => b.id === ord.branchId);
              return (
                <div
                  key={ord.id}
                  className="bg-white border border-stone-200 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-800">
                        {ord.nomorOrder}
                      </span>
                      <span className="text-xs font-bold text-stone-800 px-2 py-0.5 rounded bg-stone-100">
                        {bInfo?.shortName || ord.branchId}
                      </span>
                      {ord.urgensi === 'Mendesak / Stok Kritis' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Mendesak
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-700 mt-1">
                      {ord.items.map((i) => `${i.merekBarang} (${i.kuantitas} ${i.satuan})`).join(', ')}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Diajukan oleh {ord.pemohon} • {ord.tanggal}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {canConfirmOrder ? (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(ord.id, 'DIPROSES PURCHASE')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Setujui &amp; Kirim</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded">
                        Read-Only Audit
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
