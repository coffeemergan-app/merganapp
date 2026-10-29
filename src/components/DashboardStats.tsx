import React from 'react';
import { ArrowDownRight, ArrowUpRight, Banknote, CreditCard, DollarSign, PackageCheck, ShoppingCart } from 'lucide-react';
import { formatRupiah } from '../utils/format';
import { BranchOrder, DailyExpense, ShiftRekap } from '../types';

interface DashboardStatsProps {
  shifts: ShiftRekap[];
  expenses: DailyExpense[];
  orders: BranchOrder[];
  branchName: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  shifts,
  expenses,
  orders,
  branchName,
}) => {
  const totalCash = shifts.reduce((acc, s) => acc + (s.cash || 0), 0);
  const totalQris = shifts.reduce((acc, s) => acc + (s.qris || 0), 0);
  const totalOmzet = totalCash + totalQris;
  const totalExpense = expenses.reduce((acc, e) => acc + (e.totalBiaya || 0), 0);
  const netBersih = totalOmzet - totalExpense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
      {/* Total Omzet */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-stone-500">Total Omzet Kasir</span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Banknote className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-stone-900 tracking-tight font-mono">{formatRupiah(totalOmzet)}</div>
        <div className="text-[11px] text-stone-500 mt-1 flex items-center">
          <span className="text-amber-700 font-bold mr-1">{shifts.length} shift</span> di {branchName}
        </div>
      </div>

      {/* Cash */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-stone-500">Penerimaan Tunai (Cash)</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Banknote className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-emerald-700 tracking-tight font-mono">{formatRupiah(totalCash)}</div>
        <div className="text-[11px] text-stone-500 mt-1 flex items-center">
          <ArrowUpRight className="w-3 h-3 text-emerald-600 mr-1" />
          <span>{totalOmzet > 0 ? Math.round((totalCash / totalOmzet) * 100) : 0}% dari total omzet</span>
        </div>
      </div>

      {/* QRIS */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative overflow-hidden group hover:border-blue-400 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-stone-500">QRIS / Non-Tunai</span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-blue-700 tracking-tight font-mono">{formatRupiah(totalQris)}</div>
        <div className="text-[11px] text-stone-500 mt-1 flex items-center">
          <ArrowUpRight className="w-3 h-3 text-blue-600 mr-1" />
          <span>{totalOmzet > 0 ? Math.round((totalQris / totalOmzet) * 100) : 0}% dari total omzet</span>
        </div>
      </div>

      {/* Belanja Operasional */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative overflow-hidden group hover:border-rose-400 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-stone-500">Total Belanja Cabang</span>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-rose-700 tracking-tight font-mono">{formatRupiah(totalExpense)}</div>
        <div className="text-[11px] text-stone-500 mt-1 flex items-center">
          <ArrowDownRight className="w-3 h-3 text-rose-600 mr-1" />
          <span>{expenses.length} nota belanja</span>
        </div>
      </div>

      {/* Net Bersih */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative overflow-hidden group hover:border-stone-400 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-stone-500">Sisa Net / Margin Toko</span>
          <div className="p-1.5 rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-xl font-black tracking-tight font-mono ${netBersih >= 0 ? 'text-stone-900' : 'text-rose-600'}`}>
          {formatRupiah(netBersih)}
        </div>
        <div className="text-[11px] text-stone-500 mt-1 flex items-center">
          <span className={netBersih >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
            {netBersih >= 0 ? 'Surplus Kas' : 'Defisit Operasional'}
          </span>
        </div>
      </div>
    </div>
  );
};
