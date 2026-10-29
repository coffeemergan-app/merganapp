import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart2,
  Bell,
  Box,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Filter,
  Flame,
  HelpCircle,
  Info,
  Layers,
  Moon,
  Package,
  Plus,
  Printer,
  Radio,
  Search,
  Send,
  Shield,
  ShoppingBag,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Wallet,
  X,
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
  onNavigateTab: (tab: 'KASIR' | 'BELANJA' | 'ORDER' | 'ABSENSI' | 'GAJI' | 'MASTER') => void;
  canInputKasir: boolean;
  canInputBelanja: boolean;
  canInputOrder: boolean;
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
  onNavigateTab,
  canInputKasir,
  canInputBelanja,
  canInputOrder,
}) => {
  // Currency mode toggle: USD vs IDR (defaulting to USD matching image, or IDR)
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'IDR'>('USD');
  const [activeDay, setActiveDay] = useState<string>('Sun');
  const [transactionTimeframe, setTransactionTimeframe] = useState('This Week');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(['tx-2']);

  // Convert Rp to USD equivalent for the concept (rate approx 1 USD = Rp 15.500)
  const rate = 15500;
  const toDisplay = (idr: number) => {
    if (currencyMode === 'IDR') {
      return formatRupiah(idr);
    }
    const val = (idr / rate).toFixed(2);
    return `$${parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  // Aggregated calculations for current branch
  const currentShifts = shifts.filter((s) => s.branchId === branch.id);
  const currentExpenses = expenses.filter((e) => e.branchId === branch.id);

  const totalCash = currentShifts.reduce((s, x) => s + (x.cash || 0), 0);
  const totalQris = currentShifts.reduce((s, x) => s + (x.qris || 0), 0);
  const totalIncome = totalCash + totalQris;
  const totalExpense = currentExpenses.reduce((s, x) => s + (x.totalBiaya || 0), 0);
  const netBalance = totalIncome - totalExpense;

  // Chart data simulation points per day
  const chartDays = [
    { day: 'Wed', users: '12k', val: 12, displayVal: '$78.4' },
    { day: 'Thu', users: '15k', val: 15, displayVal: '$95.2' },
    { day: 'Fri', users: '18k', val: 18, displayVal: '$112.0' },
    { day: 'Sat', users: '24k', val: 24, displayVal: '$148.5' },
    { day: 'Sun', users: '28k', val: 28, displayVal: '$126.3' },
    { day: 'Mon', users: '19k', val: 19, displayVal: '$104.2' },
    { day: 'Tue', users: '21k', val: 21, displayVal: '$118.0' },
  ];

  const currentChartPoint = chartDays.find((c) => c.day === activeDay) || chartDays[4];

  // Combined Recent Transactions list
  const recentTransactions = [
    {
      id: 'tx-1',
      activity: 'Restok Sirup Vanilla & Hazelnut',
      type: 'expense',
      price: currencyMode === 'USD' ? '$24.99' : 'Rp 387.000',
      date: '12 Apr 2026',
      time: '10:45 AM',
      note: 'Supplier Toko Bahan Kue',
      status: 'Failed',
      statusColor: 'text-rose-600 bg-rose-50 border-rose-200',
      iconColor: 'bg-blue-500 text-white',
    },
    {
      id: 'tx-2',
      activity: 'Rekap Kasir Shift Pagi (Siti)',
      type: 'income',
      price: currencyMode === 'USD' ? '$320.00' : 'Rp 4.960.000',
      date: '10 Apr 2026',
      time: '08:30 PM',
      note: 'Penerimaan Cash + QRIS 42 Struk',
      status: 'Successful',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      iconColor: 'bg-rose-500 text-white',
    },
    {
      id: 'tx-3',
      activity: 'Belanja Susu Diamond Fresh Milk',
      type: 'expense',
      price: currencyMode === 'USD' ? '$76.20' : 'Rp 1.181.000',
      date: '14 Apr 2026',
      time: '07:10 PM',
      note: '10 Karton untuk Barista',
      status: 'Pending',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
      iconColor: 'bg-emerald-500 text-white',
    },
    {
      id: 'tx-4',
      activity: 'Rekap Kasir Shift Malam (Rian)',
      type: 'income',
      price: currencyMode === 'USD' ? '$149.30' : 'Rp 2.314.000',
      date: '11 Apr 2026',
      time: '11:15 PM',
      note: 'Shift penutupan toko harian',
      status: 'Successful',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      iconColor: 'bg-indigo-500 text-white',
    },
  ];

  const toggleSelectTx = (id: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllTx = () => {
    if (selectedTransactions.length === recentTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(recentTransactions.map((t) => t.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP ROW: 4 HORIZONTAL CARDS (INCLUDING VIBRANT PINK-ORANGE GRADIENT CARD) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Invest for your future */}
        <div className="bg-white rounded-2xl p-4.5 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-stone-900">Invest for your future</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Target Omzet &amp; Profit Toko</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => onNavigateTab('KASIR')}
              className="px-3.5 py-1.5 rounded-full bg-[#f4f5f6] hover:bg-stone-200 text-xs font-bold text-stone-800 transition cursor-pointer"
            >
              {currencyMode === 'USD' ? '$254.32' : 'Rp 3.940.000'}
            </button>
          </div>
        </div>

        {/* Card 2: Early for kids */}
        <div className="bg-white rounded-2xl p-4.5 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-stone-900">Early for kids</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Pengadaan &amp; Pelatihan Staf</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
              <Smile className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => onNavigateTab('BELANJA')}
              className="px-3.5 py-1.5 rounded-full bg-[#f4f5f6] hover:bg-stone-200 text-xs font-bold text-stone-800 transition cursor-pointer"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Card 3: Balance your budget */}
        <div className="bg-white rounded-2xl p-4.5 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-stone-900">Balance your budget</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Audit Kasir &amp; Purchase</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => onNavigateTab('GAJI')}
              className="px-3.5 py-1.5 rounded-full bg-[#f4f5f6] hover:bg-stone-200 text-xs font-bold text-stone-800 transition cursor-pointer"
            >
              April 2026
            </button>
          </div>
        </div>

        {/* Card 4: Retire on your terms (Signature Vibrant Gradient Card with Soundwave) */}
        <div className="rounded-2xl p-4.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-white tracking-wide">Retire on your terms</p>
              <p className="text-[11px] text-pink-100 mt-0.5">Holding Multi-Cabang Mergan</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Radio className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between relative z-10">
            <button
              onClick={() => onNavigateTab('ORDER')}
              className="px-4 py-1.5 rounded-full bg-white text-stone-900 text-xs font-bold shadow-xs hover:bg-stone-100 transition cursor-pointer"
            >
              Explore
            </button>

            {/* Soundwave / Frequency bar visualization */}
            <div className="flex items-end space-x-0.5 h-8 opacity-80">
              {[8, 14, 20, 26, 30, 24, 18, 12, 16, 22, 28, 24, 18, 14, 10, 6].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full transition-all duration-300"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: 3 MAIN WIDGETS (CURRENT PRICE, ACTIVE USERS CHART, 2x2 METRICS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Current Price Trading Card (3.5 cols) */}
        <div className="lg:col-span-3.5 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400">Current Price</span>
              {/* Currency Dropdown Pill */}
              <button
                onClick={() => setCurrencyMode(currencyMode === 'USD' ? 'IDR' : 'USD')}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <span className="w-4 h-3 bg-red-600 rounded-2xs inline-block relative overflow-hidden">
                  <span className="absolute top-0 left-0 w-2 h-1.5 bg-blue-800"></span>
                </span>
                <span>{currencyMode}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>
            </div>

            <div className="mt-2.5">
              <h2 className="text-2xl font-black text-stone-900 tracking-tight font-mono">
                {currencyMode === 'USD' ? '114.72 USD' : formatRupiah(1147200)}
              </h2>
            </div>

            {/* 2x3 Metric Grid with separator */}
            <div className="mt-4 p-3 bg-stone-50/70 rounded-xl border border-stone-200/70 grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-stone-200/50 pb-1.5">
                <span className="text-stone-400 font-sans text-[11px]">Open</span>
                <span className="font-bold text-stone-800">124.9</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200/50 pb-1.5">
                <span className="text-stone-400 font-sans text-[11px]">Vol</span>
                <span className="font-bold text-stone-800">32.6M</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200/50 pb-1.5">
                <span className="text-stone-400 font-sans text-[11px]">High</span>
                <span className="font-bold text-stone-800">115.1</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200/50 pb-1.5">
                <span className="text-stone-400 font-sans text-[11px]">P/E</span>
                <span className="font-bold text-stone-800">12.4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-sans text-[11px]">Low</span>
                <span className="font-bold text-stone-800">36.7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-sans text-[11px]">Mkt Cap</span>
                <span className="font-bold text-stone-800">6.004T</span>
              </div>
            </div>
          </div>

          {/* Sell / Buy Action Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <button
              onClick={onOpenBelanjaModal}
              disabled={!canInputBelanja}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                canInputBelanja
                  ? 'bg-[#18181b] hover:bg-black text-white shadow-xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>Sell</span>
            </button>
            <button
              onClick={onOpenKasirModal}
              disabled={!canInputKasir}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                canInputKasir
                  ? 'bg-[#f0f2f5] hover:bg-stone-200 text-stone-900 border border-stone-200'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
              }`}
            >
              <span>Buy</span>
            </button>
          </div>
        </div>

        {/* Center Column: Active Users Area Chart Widget (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Active Users</h3>
                <p className="text-[11px] text-stone-400">View your income in a certain period of time</p>
              </div>
            </div>

            {/* SVG Area Chart with curve & gradient fill */}
            <div className="relative mt-4 h-36 w-full">
              {/* Y Axis Guide Marks */}
              <div className="absolute left-0 top-0 bottom-4 w-7 flex flex-col justify-between text-[10px] text-stone-400 font-mono">
                <span>30k</span>
                <span>20k</span>
                <span>10k</span>
                <span>0k</span>
              </div>

              {/* Chart Canvas Area */}
              <div className="ml-8 h-full relative">
                {/* Horizontal dotted grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-dashed border-stone-200 w-full"></div>
                  <div className="border-b border-dashed border-stone-200 w-full"></div>
                  <div className="border-b border-dashed border-stone-200 w-full"></div>
                  <div className="border-b border-stone-200 w-full"></div>
                </div>

                {/* Smooth Curve SVG */}
                <svg className="w-full h-28 overflow-visible" viewBox="0 0 350 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                      <stop offset="70%" stopColor="#fb923c" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d="M 0,75 L 45,70 L 90,65 L 135,45 L 180,20 L 225,50 L 270,55 L 315,50 L 350,55 L 350,100 L 0,100 Z"
                    fill="url(#areaGradient)"
                  />
                  {/* Smooth curve line */}
                  <path
                    d="M 0,75 C 25,73 35,68 45,70 C 65,72 75,67 90,65 C 110,63 120,48 135,45 C 155,42 165,22 180,20 C 195,18 210,48 225,50 C 245,52 255,54 270,55 C 290,56 300,51 315,50 C 330,49 340,54 350,55"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />
                  {/* Active highlight vertical dashed indicator */}
                  <line
                    x1="180"
                    y1="20"
                    x2="180"
                    y2="100"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {/* Active Data point dot */}
                  <circle cx="180" cy="20" r="3.5" fill="#18181b" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* Floating Tooltip Pill ($126.3) */}
                <div
                  className="absolute -top-1 left-[51%] -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-stone-200 px-2 py-0.5 rounded-md shadow-xs text-[10px] font-bold text-stone-800 font-mono flex items-center space-x-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                  <span>{currentChartPoint.displayVal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Days of week selector pills */}
          <div className="mt-3 pt-2 flex items-center justify-between text-xs text-stone-500 pl-8">
            {chartDays.map((c) => (
              <button
                key={c.day}
                onClick={() => setActiveDay(c.day)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                  activeDay === c.day
                    ? 'bg-[#18181b] text-white font-bold shadow-xs'
                    : 'hover:bg-stone-100 text-stone-600'
                }`}
              >
                {c.day}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: 2x2 Metric Cards Grid (3.5 cols) */}
        <div className="lg:col-span-3.5 grid grid-cols-2 gap-3.5">
          {/* Top Left: Portfolio Type */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-stone-400">Portfolio Type</span>
            <div className="mt-3">
              <span className="text-sm font-bold text-stone-900 block">General</span>
              <span className="text-[10px] text-stone-400">Toko Kopi Mergan</span>
            </div>
          </div>

          {/* Top Right: Total Investment */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-400">Total Investment</span>
            </div>
            <div className="mt-1">
              <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                -1.52% Last 7 days
              </span>
              <p className="text-base font-black text-stone-900 font-mono mt-1">
                {currencyMode === 'USD' ? '$4,389.80' : formatRupiah(4389800)}
              </p>
            </div>
          </div>

          {/* Bottom Left: Net Growth Score */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-stone-400">Net Growth Score</span>
            <div className="mt-1">
              <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                -1.45% Last 7 days
              </span>
              <p className="text-base font-black text-stone-900 font-mono mt-1">
                {currencyMode === 'USD' ? '$7,320' : formatRupiah(7320000)}
              </p>
            </div>
          </div>

          {/* Bottom Right: Strategy Type */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-stone-400">Strategy Type</span>
            <div className="mt-3">
              <span className="text-sm font-bold text-stone-900 block">Steady Growth</span>
              <span className="text-[10px] text-stone-400">Multi-Cabang POS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: RECENT TRANSACTION TABLE + YOUR BALANCE & INVESTMENT CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Recent Transaction Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-stone-900">Recent Transaction</h3>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              {/* Timeframe Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 font-semibold hover:bg-stone-100 transition cursor-pointer"
                >
                  <span>{transactionTimeframe}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>

              {/* Filter Button */}
              <button
                type="button"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 font-semibold hover:bg-stone-100 transition cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
                <span>Filter</span>
              </button>

              {/* Print & PDF Buttons */}
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                title="Print Transaksi"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={() => exportShiftsToPdf(currentShifts, branch.name)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50/70 text-stone-400 font-semibold border-b border-stone-100">
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.length === recentTransactions.length}
                      onChange={selectAllTx}
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">Activity</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Note</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {recentTransactions.map((tx) => {
                  const isChecked = selectedTransactions.includes(tx.id);
                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-stone-50/60 transition-colors ${
                        isChecked ? 'bg-stone-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectTx(tx.id)}
                          className="rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-stone-900">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${tx.iconColor}`}
                          >
                            <Box className="w-3.5 h-3.5" />
                          </span>
                          <span>{tx.activity}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-stone-900">
                        {tx.price}
                      </td>
                      <td className="py-3.5 px-3 text-stone-500">
                        <div className="font-semibold text-stone-800">{tx.date}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{tx.time}</div>
                      </td>
                      <td className="py-3.5 px-3 text-stone-500 max-w-[150px] truncate">
                        {tx.note}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${tx.statusColor}`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Your Balance Card & Peach Investment Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Your Balance Dark Card with geometric watermark & actions */}
          <div className="bg-[#1c1d22] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
            {/* Geometric watermark in top right */}
            <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
              <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="6" strokeDasharray="8 8" />
                <rect x="25" y="25" width="50" height="50" stroke="white" strokeWidth="4" />
                <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="3" />
              </svg>
            </div>

            <div className="relative z-10">
              <span className="text-xs text-stone-400 font-medium tracking-wide">Your Balance</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 tracking-tight">
                {currencyMode === 'USD' ? '70,147.41 USD' : formatRupiah(70147410)}
              </h2>
            </div>

            {/* 3 Translucent Pill Quick Action Buttons */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 relative z-10">
              {/* Deposit -> Kasir */}
              <button
                onClick={onOpenKasirModal}
                disabled={!canInputKasir}
                className="py-3 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-xs flex flex-col items-center justify-center space-y-1 transition cursor-pointer text-stone-200 hover:text-white"
                title="Input Kasir (Setor Kasir)"
              >
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[11px] font-semibold">Deposit</span>
              </button>

              {/* Withdraw -> Belanja */}
              <button
                onClick={onOpenBelanjaModal}
                disabled={!canInputBelanja}
                className="py-3 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-xs flex flex-col items-center justify-center space-y-1 transition cursor-pointer text-stone-200 hover:text-white"
                title="Input Belanja (Tarik Belanja)"
              >
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-[11px] font-semibold">Withdraw</span>
              </button>

              {/* Transfer -> Order Restok (Special glowing pink pill) */}
              <button
                onClick={onOpenOrderModal}
                disabled={!canInputOrder}
                className="py-3 px-2 rounded-xl bg-gradient-to-br from-pink-500/30 to-rose-600/30 hover:from-pink-500/40 hover:to-rose-600/40 border border-pink-400/40 backdrop-blur-xs flex flex-col items-center justify-center space-y-1 transition cursor-pointer text-white"
                title="Order Restok (Transfer ke Holding)"
              >
                <div className="w-6 h-6 rounded-lg bg-pink-500/40 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-pink-200" />
                </div>
                <span className="text-[11px] font-bold">Transfer</span>
              </button>
            </div>
          </div>

          {/* Card 2: Soft Peach Card: You Invest $1226.3 in Last 30 Days */}
          <div className="rounded-2xl p-4.5 bg-gradient-to-r from-[#ffe4e6] to-[#fef3c7] border border-rose-200/50 shadow-2xs text-center flex flex-col items-center justify-center">
            <p className="text-xs text-stone-700">
              You Invest{' '}
              <span className="text-sm font-black text-stone-900 font-mono">
                {currencyMode === 'USD' ? '$1226.3' : formatRupiah(1226300)}
              </span>{' '}
              in
            </p>
            <p className="text-xs font-bold text-stone-800 mt-0.5">Last 30 Days</p>
            <p className="text-[10px] text-stone-500 mt-1">
              Akumulasi belanja operasional &amp; pengadaan bahan baku {branch.shortName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
