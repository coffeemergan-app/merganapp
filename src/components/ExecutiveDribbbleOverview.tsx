import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Info,
  Layers,
  Lock,
  Package,
  Plus,
  Printer,
  Shield,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { Branch, BranchOrder, DailyExpense, ShiftRekap, User } from '../types';
import { formatRupiah } from '../utils/format';
import { exportShiftsToPdf } from '../utils/export';

interface ExecutiveDribbbleOverviewProps {
  branch: Branch;
  branches: Branch[];
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  currentUser: User;
  shifts: ShiftRekap[];
  expenses: DailyExpense[];
  orders: BranchOrder[];
  onOpenKasirModal: () => void;
  onOpenBelanjaModal: () => void;
  onOpenOrderModal: () => void;
  onOpenHtmlModal: () => void;
  onOpenRulesModal: () => void;
  onOpenUserManagementModal?: () => void;
  onOpenPermissionsModal?: () => void;
  onNavigateTab: (tab: 'KASIR' | 'BELANJA' | 'ORDER' | 'ABSENSI' | 'GAJI' | 'MASTER') => void;
  canInputKasir: boolean;
  canInputBelanja: boolean;
  canInputOrder: boolean;
  canConfirmOrder?: boolean;
  canEditMaster?: boolean;
}

export const ExecutiveDribbbleOverview: React.FC<ExecutiveDribbbleOverviewProps> = ({
  branch,
  branches,
  activeBranchId,
  onSelectBranch,
  currentUser,
  shifts,
  expenses,
  orders,
  onOpenKasirModal,
  onOpenBelanjaModal,
  onOpenOrderModal,
  onOpenHtmlModal,
  onOpenRulesModal,
  onOpenUserManagementModal,
  onOpenPermissionsModal,
  onNavigateTab,
  canInputKasir,
  canInputBelanja,
  canInputOrder,
  canConfirmOrder = false,
  canEditMaster = false,
}) => {
  // Mode Holding: Owner Holding & Purchase Holding view ALL branches consolidated
  const isOwnerHolding = currentUser.role === 'OWNER_HOLDING';
  const isPurchaseHolding = currentUser.role === 'PURCHASE_HOLDING';
  const isOwnerCabang = currentUser.role === 'OWNER_CABANG';
  const isKepalaToko = currentUser.role === 'KEPALA_TOKO';
  const isPurchaseCabang = currentUser.role === 'PURCHASE_CABANG';
  const isHoldingUser = isOwnerHolding || isPurchaseHolding;

  // Filter state for holding view: 'all' or specific branch
  const [holdingFilter, setHoldingFilter] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'shift' | 'expense' | 'order'>('all');

  // CONSOLIDATED CALCULATIONS (ALL 3 BRANCHES COMBINED)
  const totalCashAll = shifts.reduce((s, x) => s + (x.cash || 0), 0);
  const totalQrisAll = shifts.reduce((s, x) => s + (x.qris || 0), 0);
  const totalIncomeAll = totalCashAll + totalQrisAll;
  const totalExpenseAll = expenses.reduce((s, x) => s + (x.totalBiaya || 0), 0);
  const totalNetAll = totalIncomeAll - totalExpenseAll;
  const totalMarginAll = totalIncomeAll > 0 ? ((totalNetAll / totalIncomeAll) * 100).toFixed(1) : '0';
  const totalPendingOrdersAll = orders.filter((o) => o.status === 'MENUNGGU KONFIRMASI').length;
  const totalCriticalOrdersAll = orders.filter(
    (o) => o.urgensi === 'Mendesak / Stok Kritis' && o.status !== 'SELESAI / TERKIRIM'
  ).length;

  // BRANCH SPECIFIC CALCULATIONS
  const targetBranchId = isHoldingUser && holdingFilter !== 'all' ? holdingFilter : branch.id;
  const branchShifts = shifts.filter((s) => s.branchId === targetBranchId);
  const branchExpenses = expenses.filter((e) => e.branchId === targetBranchId);
  const branchOrders = orders.filter((o) => o.branchId === targetBranchId);

  const branchCash = branchShifts.reduce((s, x) => s + (x.cash || 0), 0);
  const branchQris = branchShifts.reduce((s, x) => s + (x.qris || 0), 0);
  const branchIncome = branchCash + branchQris;
  const branchExpense = branchExpenses.reduce((s, x) => s + (x.totalBiaya || 0), 0);
  const branchNet = branchIncome - branchExpense;
  const branchMargin = branchIncome > 0 ? ((branchNet / branchIncome) * 100).toFixed(1) : '0';
  const branchPendingOrders = branchOrders.filter((o) => o.status === 'MENUNGGU KONFIRMASI').length;
  const branchCriticalOrders = branchOrders.filter(
    (o) => o.urgensi === 'Mendesak / Stok Kritis' && o.status !== 'SELESAI / TERKIRIM'
  ).length;

  // Active KPI numbers to show in Top Metric Cards
  const showAllBranches = isHoldingUser && holdingFilter === 'all';
  const activeIncome = showAllBranches ? totalIncomeAll : branchIncome;
  const activeCash = showAllBranches ? totalCashAll : branchCash;
  const activeQris = showAllBranches ? totalQrisAll : branchQris;
  const activeExpense = showAllBranches ? totalExpenseAll : branchExpense;
  const activeNet = showAllBranches ? totalNetAll : branchNet;
  const activeMargin = showAllBranches ? totalMarginAll : branchMargin;
  const activePendingOrders = showAllBranches ? totalPendingOrdersAll : branchPendingOrders;
  const activeCriticalOrders = showAllBranches ? totalCriticalOrdersAll : branchCriticalOrders;
  const activeShiftCount = showAllBranches ? shifts.length : branchShifts.length;
  const activeExpenseCount = showAllBranches ? expenses.length : branchExpenses.length;

  // Multi-Cabang Breakdown Cards Data
  const branchCardsData = branches.map((b) => {
    const sList = shifts.filter((s) => s.branchId === b.id);
    const eList = expenses.filter((e) => e.branchId === b.id);
    const oList = orders.filter((o) => o.branchId === b.id);

    const cIncome = sList.reduce((acc, s) => acc + (s.cash || 0) + (s.qris || 0), 0);
    const cExpense = eList.reduce((acc, e) => acc + (e.totalBiaya || 0), 0);
    const cNet = cIncome - cExpense;
    const cMargin = cIncome > 0 ? Math.round((cNet / cIncome) * 100) : 0;
    const cPending = oList.filter((o) => o.status === 'MENUNGGU KONFIRMASI').length;

    let badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
    let dotColor = 'bg-amber-500';
    if (b.id === 'urip') {
      badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      dotColor = 'bg-emerald-500';
    } else if (b.id === 'madiun') {
      badgeColor = 'bg-blue-50 text-blue-800 border-blue-300';
      dotColor = 'bg-blue-500';
    }

    return {
      branch: b,
      income: cIncome,
      expense: cExpense,
      net: cNet,
      margin: cMargin,
      shiftCount: sList.length,
      expenseCount: eList.length,
      pendingOrders: cPending,
      badgeColor,
      dotColor,
    };
  });

  // Consolidated activity timeline / transactions
  interface ActivityItem {
    id: string;
    date: string;
    branchId: string;
    branchName: string;
    type: 'shift' | 'expense' | 'order';
    title: string;
    nominal: number;
    nominalFormatted: string;
    pic: string;
    note: string;
    status: string;
    statusColor: string;
  }

  const activities: ActivityItem[] = [];

  // Shifts
  const currentShiftsPool = isHoldingUser && holdingFilter === 'all' ? shifts : branchShifts;
  currentShiftsPool.forEach((s) => {
    const b = branches.find((x) => x.id === s.branchId);
    activities.push({
      id: `shift-${s.id}`,
      date: s.tanggal,
      branchId: s.branchId,
      branchName: b?.shortName || s.branchId,
      type: 'shift',
      title: `Rekap Kasir: ${s.shift}`,
      nominal: (s.cash || 0) + (s.qris || 0),
      nominalFormatted: formatRupiah((s.cash || 0) + (s.qris || 0)),
      pic: s.person,
      note: `Cash: ${formatRupiah(s.cash || 0)} | QRIS: ${formatRupiah(s.qris || 0)}${s.catatan ? ` • ${s.catatan}` : ''}`,
      status: 'Kasir Selesai',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    });
  });

  // Expenses
  const currentExpensesPool = isHoldingUser && holdingFilter === 'all' ? expenses : branchExpenses;
  currentExpensesPool.forEach((e) => {
    const b = branches.find((x) => x.id === e.branchId);
    activities.push({
      id: `expense-${e.id}`,
      date: e.tanggal,
      branchId: e.branchId,
      branchName: b?.shortName || e.branchId,
      type: 'expense',
      title: `Belanja: ${e.rincianBarang}`,
      nominal: e.totalBiaya || 0,
      nominalFormatted: formatRupiah(e.totalBiaya || 0),
      pic: e.personPurchase,
      note: `${e.kuantitas} ${e.satuan} (${e.kategori})${e.supplier ? ` • Toko: ${e.supplier}` : ''}`,
      status: 'Belanja Terkunci',
      statusColor: 'bg-rose-50 text-rose-700 border-rose-200',
    });
  });

  // Orders
  const currentOrdersPool = isHoldingUser && holdingFilter === 'all' ? orders : branchOrders;
  currentOrdersPool.forEach((o) => {
    const b = branches.find((x) => x.id === o.branchId);
    const itemNames = o.items?.map((it) => `${it.merekBarang} (${it.kuantitas} ${it.satuan})`).join(', ') || 'Restok Bahan Baku';
    activities.push({
      id: `order-${o.id}`,
      date: o.tanggal,
      branchId: o.branchId,
      branchName: b?.shortName || o.branchId,
      type: 'order',
      title: `Order: ${o.nomorOrder}`,
      nominal: 0,
      nominalFormatted: `${o.items?.length || 0} Jenis Barang`,
      pic: o.pemohon,
      note: `${itemNames} • Urgensi: ${o.urgensi}`,
      status: o.status,
      statusColor:
        o.status === 'SELESAI / TERKIRIM'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : o.status === 'DIPROSES PURCHASE'
          ? 'bg-blue-50 text-blue-700 border-blue-200'
          : 'bg-amber-50 text-amber-700 border-amber-200',
    });
  });

  // Sort activities by date descending
  activities.sort((a, b) => (a.date < b.date ? 1 : -1));

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'all') return true;
    return act.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* 1. SIMPLE EXECUTIVE HEADER BANNER */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 bg-stone-900 text-white rounded-xl shadow-xs">
              <Building2 className="w-5 h-5 text-amber-400" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {isHoldingUser
                ? 'Dashboard Konsolidasi Holding Toko Kopi Mergan'
                : `Dashboard Operasional ${branch.name}`}
            </h1>
          </div>

          <p className="text-xs text-stone-500 mt-1 max-w-3xl">
            {isHoldingUser ? (
              <span>
                Menyatukan seluruh data finansial &amp; logistik <b>3 Cabang</b>: Pusat Sumbawa, Cabang Urip Sumoharjo, dan Cabang Madiun dalam satu layar audit terpadu.
              </span>
            ) : (
              <span>
                {branch.address} • Telp: {branch.phone || '0812-3456-7890'} • PIC: {branch.headStore || 'Kepala Toko'}
              </span>
            )}
          </p>

          {/* Role & Permissions Status Badge */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full font-bold bg-stone-900 text-white flex items-center space-x-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser.name} ({currentUser.roleLabel})</span>
            </span>

            {isOwnerHolding && (
              <span className="px-2.5 py-1 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Full Akses Semua Cabang (Mode Audit Read-Only / Tidak Bisa Edit)</span>
              </span>
            )}

            {isPurchaseHolding && (
              <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                <Package className="w-3 h-3 text-emerald-600" />
                <span>Purchase Holding: Kelola Master Bahan Baku &amp; Konfirmasi Order</span>
              </span>
            )}

            {isOwnerCabang && (
              <span className="px-2.5 py-1 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Owner Cabang: Monitoring Audit (Read-Only)</span>
              </span>
            )}

            {isKepalaToko && (
              <span className="px-2.5 py-1 rounded-full font-bold bg-blue-50 text-blue-800 border border-blue-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                <span>Kepala Toko: Input Kasir, Absensi &amp; Gaji Cabang</span>
              </span>
            )}

            {isPurchaseCabang && (
              <span className="px-2.5 py-1 rounded-full font-bold bg-rose-50 text-rose-800 border border-rose-300 flex items-center space-x-1">
                <ShoppingBag className="w-3 h-3 text-rose-600" />
                <span>Purchase Cabang: Input Belanja Harian &amp; Order Restok</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Tools: Branch Filter Pill for Holding + Print/Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {isHoldingUser && (
            <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <span className="text-[11px] font-bold text-stone-500 px-2">Lihat:</span>
              <button
                onClick={() => setHoldingFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  holdingFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                Semua Cabang (Satu Layar)
              </button>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setHoldingFilter(b.id);
                    onSelectBranch(b.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    holdingFilter === b.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {b.shortName}
                </button>
              ))}
            </div>
          )}

          {/* Quick PDF & Print buttons */}
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 flex items-center space-x-1.5 shadow-2xs transition cursor-pointer"
            title="Cetak Laporan Konsolidasi"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Print</span>
          </button>

          <button
            onClick={() => exportShiftsToPdf(showAllBranches ? shifts : branchShifts, showAllBranches ? 'Konsolidasi Seluruh Cabang' : branch.name)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-stone-200 text-xs font-bold text-rose-700 flex items-center space-x-1.5 shadow-2xs transition cursor-pointer"
            title="Unduh Laporan PDF"
          >
            <Download className="w-4 h-4 text-rose-600" />
            <span>PDF</span>
          </button>

          {isOwnerHolding && onOpenUserManagementModal && (
            <button
              onClick={onOpenUserManagementModal}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-xs font-bold text-white flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Atur Akun</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. 4 SIMPLE, CLEAN KPI CARDS IN RUPIAH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Omzet Kasir */}
        <div className="bg-white rounded-2xl p-4.5 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {showAllBranches ? 'Omzet Kasir (3 Cabang)' : 'Omzet Kasir Cabang'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight font-mono">
              {formatRupiah(activeIncome)}
            </h2>
            <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
              <span>Tunai: <b>{formatRupiah(activeCash)}</b></span>
              <span>•</span>
              <span>QRIS: <b>{formatRupiah(activeQris)}</b></span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>{activeShiftCount} shift tercatat</span>
              <button
                onClick={() => onNavigateTab('KASIR')}
                className="text-amber-700 font-bold hover:underline inline-flex items-center"
              >
                Buka Kasir <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Total Belanja Operasional */}
        <div className="bg-white rounded-2xl p-4.5 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-rose-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {showAllBranches ? 'Belanja Purchase (3 Cabang)' : 'Belanja Purchase Cabang'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-rose-700 tracking-tight font-mono">
              {formatRupiah(activeExpense)}
            </h2>
            <div className="mt-1 text-[11px] text-stone-500">
              <span>{activeExpenseCount} nota belanja bahan baku &amp; operasional</span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span className="text-emerald-700 font-semibold">Terkunci per hari</span>
              <button
                onClick={() => onNavigateTab('BELANJA')}
                className="text-rose-700 font-bold hover:underline inline-flex items-center"
              >
                Buka Belanja <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Laba Bersih Operasional */}
        <div className="bg-white rounded-2xl p-4.5 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {showAllBranches ? 'Laba Bersih Konsolidasi' : 'Laba Bersih Cabang'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
              {formatRupiah(activeNet)}
            </h2>
            <div className="mt-1 flex items-center space-x-1.5 text-[11px]">
              <span className="px-1.5 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Margin {activeMargin}%
              </span>
              <span className="text-stone-400">dari total omzet</span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>Kasir dikurangi Belanja</span>
              <span className="text-emerald-700 font-bold">Surplus Sehat</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pengadaan & Order Bahan Baku */}
        <div className="bg-white rounded-2xl p-4.5 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Order Restok Bahan Baku
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight font-mono">
              {activePendingOrders} <span className="text-sm font-semibold text-stone-500 font-sans">Menunggu</span>
            </h2>
            <div className="mt-1 text-[11px] text-stone-500 flex items-center space-x-1">
              {activeCriticalOrders > 0 ? (
                <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  {activeCriticalOrders} Stok Kritis!
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold">Stok cabang aman</span>
              )}
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>Logistik &amp; Holding</span>
              <button
                onClick={() => onNavigateTab('ORDER')}
                className="text-blue-700 font-bold hover:underline inline-flex items-center"
              >
                Cek Order <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MULTI-CABANG CONSOLIDATION GRID (SEMUA CABANG JADI SATU UNTUK HOLDING) */}
      {isHoldingUser && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-stone-900">Performa 3 Cabang Toko Kopi Mergan</h3>
              <p className="text-xs text-stone-500">Perbandingan real-time omzet, belanja, dan laba operasional antar cabang</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
              3 Cabang Terkoneksi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branchCardsData.map((bData) => (
              <div
                key={bData.branch.id}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  holdingFilter === bData.branch.id
                    ? 'ring-2 ring-amber-500 border-amber-400 shadow-md'
                    : 'border-stone-200/80 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${bData.dotColor}`}></span>
                      <h4 className="font-black text-base text-stone-900">{bData.branch.name}</h4>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">{bData.branch.address}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bData.badgeColor}`}>
                    {bData.branch.shortName}
                  </span>
                </div>

                {/* Branch Financial Metrics in Rupiah */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Omzet Kasir:</span>
                    <span className="font-mono font-bold text-stone-900">{formatRupiah(bData.income)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Belanja Purchase:</span>
                    <span className="font-mono font-bold text-rose-700">{formatRupiah(bData.expense)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-stone-100 font-bold">
                    <span className="text-stone-700">Laba Bersih:</span>
                    <span className="font-mono text-emerald-700">{formatRupiah(bData.net)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
                    <span>Margin: <b className="text-stone-700">{bData.margin}%</b></span>
                    <span>Order Restok: <b className="text-amber-700">{bData.pendingOrders} antri</b></span>
                  </div>
                </div>

                {/* Audit Cabang Button */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectBranch(bData.branch.id);
                      setHoldingFilter(bData.branch.id);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-stone-50 hover:bg-stone-900 hover:text-white border border-stone-200 text-xs font-bold text-stone-800 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Fokus Audit {bData.branch.shortName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ROLE-TAILORED QUICK ACTIONS PANEL */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-stone-900">Aksi Cepat Berdasarkan Hak Akses Anda</h3>
            <p className="text-xs text-stone-500">Tombol operasional disesuaikan dengan peran aktif: <b className="text-stone-900">{currentUser.roleLabel}</b></p>
          </div>
          <button
            onClick={() => onOpenPermissionsModal && onOpenPermissionsModal()}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center space-x-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Lihat Aturan Hak Akses (RBAC)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Action 1: Input Kasir */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${canInputKasir ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400' : 'bg-stone-50 border-stone-200 opacity-60'}`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">Rekap Kasir Harian</span>
                <span className="p-1 rounded bg-white text-stone-700 border border-stone-200"><Banknote className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Input shift pagi &amp; malam, penerimaan cash &amp; QRIS per tanggal.</p>
            </div>
            <div className="mt-3">
              {canInputKasir ? (
                <button
                  onClick={onOpenKasirModal}
                  className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Input Rekap Kasir</span>
                </button>
              ) : (
                <div className="py-1.5 px-2 rounded bg-stone-200 text-stone-500 text-[10px] text-center font-medium">
                  Hanya Kepala Toko
                </div>
              )}
            </div>
          </div>

          {/* Action 2: Input Belanja Purchase */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${canInputBelanja ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400' : 'bg-stone-50 border-stone-200 opacity-60'}`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">Belanja Bahan Baku</span>
                <span className="p-1 rounded bg-white text-stone-700 border border-stone-200"><ShoppingBag className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Input nota belanja harian. Otomatis mengunci kolom belanja kasir harian.</p>
            </div>
            <div className="mt-3">
              {canInputBelanja ? (
                <button
                  onClick={onOpenBelanjaModal}
                  className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Input Belanja Harian</span>
                </button>
              ) : (
                <div className="py-1.5 px-2 rounded bg-stone-200 text-stone-500 text-[10px] text-center font-medium">
                  Hanya Purchase Cabang
                </div>
              )}
            </div>
          </div>

          {/* Action 3: Order Restok ke Holding */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${canInputOrder || canConfirmOrder ? 'bg-blue-50/50 border-blue-200 hover:border-blue-400' : 'bg-stone-50 border-stone-200 opacity-60'}`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">Order Barang Restok</span>
                <span className="p-1 rounded bg-white text-stone-700 border border-stone-200"><Package className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Permintaan restok bahan baku dari cabang ke logistik Holding.</p>
            </div>
            <div className="mt-3">
              {canInputOrder ? (
                <button
                  onClick={onOpenOrderModal}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Order Bahan Baku</span>
                </button>
              ) : canConfirmOrder ? (
                <button
                  onClick={() => onNavigateTab('ORDER')}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <span>Konfirmasi Order ({totalPendingOrdersAll})</span>
                </button>
              ) : (
                <div className="py-1.5 px-2 rounded bg-stone-200 text-stone-500 text-[10px] text-center font-medium">
                  Purchase Cabang &amp; Holding
                </div>
              )}
            </div>
          </div>

          {/* Action 4: Master Bahan Baku atau User Management */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${isOwnerHolding || isPurchaseHolding ? 'bg-purple-50/50 border-purple-200 hover:border-purple-400' : 'bg-stone-50 border-stone-200 opacity-60'}`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">
                  {isOwnerHolding ? 'Manajemen Pengguna' : 'Master Bahan Baku'}
                </span>
                <span className="p-1 rounded bg-white text-stone-700 border border-stone-200"><Layers className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {isOwnerHolding
                  ? 'Atur akun login owner, purchase, dan kepala toko seluruh cabang.'
                  : 'Katalog harga acuan & spesifikasi bahan baku resmi holding.'}
              </p>
            </div>
            <div className="mt-3">
              {isOwnerHolding ? (
                <button
                  onClick={() => onOpenUserManagementModal && onOpenUserManagementModal()}
                  className="w-full py-2 px-3 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kelola Semua Akun</span>
                </button>
              ) : isPurchaseHolding ? (
                <button
                  onClick={() => onNavigateTab('MASTER')}
                  className="w-full py-2 px-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <span>Kelola Master Bahan Baku</span>
                </button>
              ) : (
                <div className="py-1.5 px-2 rounded bg-stone-200 text-stone-500 text-[10px] text-center font-medium">
                  Khusus Tim Holding
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Read-Only Banner for Owner Holding & Owner Cabang */}
        {(isOwnerHolding || isOwnerCabang) && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start space-x-2 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Mode Audit Read-Only Aktif</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Akun Owner Holding dan Owner Cabang memiliki akses baca penuh terhadap seluruh metrik, laporan keuangan, dan slip gaji, namun transaksi operasional dikunci dari pengeditan langsung demi menjaga transparansi kasir dan purchase.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. SIMPLE RECENT ACTIVITY TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-stone-900">
              {showAllBranches ? 'Riwayat Aktivitas Terkini (Seluruh Cabang)' : `Riwayat Aktivitas Terkini ${branch.name}`}
            </h3>
            <p className="text-xs text-stone-500">Daftar rekap kasir, belanja harian purchase, dan order restok</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Filter pills */}
            <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                  filterType === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('shift')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                  filterType === 'shift' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Kasir
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                  filterType === 'expense' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Belanja
              </button>
              <button
                onClick={() => setFilterType('order')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                  filterType === 'order' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Order
              </button>
            </div>

            <button
              onClick={() => onOpenHtmlModal()}
              className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-semibold cursor-pointer"
              title="Download Bundle HTML"
            >
              Kode HTML
            </button>
            <button
              onClick={() => onOpenRulesModal()}
              className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-semibold cursor-pointer"
              title="Firebase Security Rules"
            >
              Security Rules
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50/80 text-stone-500 font-semibold border-b border-stone-100">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-3">Cabang</th>
                <th className="py-3 px-3">Aktivitas Operasional</th>
                <th className="py-3 px-3 text-right">Nominal (Rupiah)</th>
                <th className="py-3 px-3">PIC / Petugas</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    Belum ada riwayat aktivitas yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredActivities.slice(0, 15).map((act) => {
                  let branchBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                  if (act.branchId === 'urip') {
                    branchBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  } else if (act.branchId === 'madiun') {
                    branchBadge = 'bg-blue-50 text-blue-800 border-blue-200';
                  }

                  return (
                    <tr key={act.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-stone-500 whitespace-nowrap">
                        {act.date}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${branchBadge}`}>
                          {act.branchName}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-stone-900">{act.title}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{act.note}</div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-stone-900 whitespace-nowrap">
                        {act.nominalFormatted}
                      </td>
                      <td className="py-3.5 px-3 text-stone-600">
                        <span className="font-semibold">{act.pic}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${act.statusColor}`}>
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
