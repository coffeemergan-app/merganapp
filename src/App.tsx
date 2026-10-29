import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Download,
  FileCode,
  Flame,
  HelpCircle,
  Info,
  Layers,
  LayoutGrid,
  Lock,
  LogOut,
  Moon,
  Package,
  Phone,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  Sun,
  Truck,
  UserCheck,
  Users,
} from 'lucide-react';
import { DashboardStats } from './components/DashboardStats';
import { ExecutiveDribbbleOverview } from './components/ExecutiveDribbbleOverview';
import { FirebaseRulesModal } from './components/FirebaseRulesModal';
import { FormAbsensiKaryawan } from './components/FormAbsensiKaryawan';
import { FormBelanjaHarian } from './components/FormBelanjaHarian';
import { FormGajiKaryawan } from './components/FormGajiKaryawan';
import { FormOrderBarangCabang } from './components/FormOrderBarangCabang';
import { FormRekapKasir } from './components/FormRekapKasir';
import { HoldingDashboard } from './components/HoldingDashboard';
import { HtmlBundleModal } from './components/HtmlBundleModal';
import { LoginForm } from './components/LoginForm';
import { LogoMergan } from './components/LogoMergan';
import { MasterBahanBakuManager } from './components/MasterBahanBakuManager';
import { Navbar } from './components/Navbar';
import { PurchaseHoldingDashboard } from './components/PurchaseHoldingDashboard';
import { RolePermissionsModal } from './components/RolePermissionsModal';
import { TabelAbsensiKaryawan } from './components/TabelAbsensiKaryawan';
import { TabelBelanjaHarian } from './components/TabelBelanjaHarian';
import { TabelGajiKaryawan } from './components/TabelGajiKaryawan';
import { TabelOrderBarang } from './components/TabelOrderBarang';
import { TabelRekapKasir } from './components/TabelRekapKasir';
import { UserManagementModal } from './components/UserManagementModal';
import { StorageService } from './services/storage';
import {
  AbsensiRecord,
  Branch,
  BranchOrder,
  DailyExpense,
  GajiRecord,
  KaryawanRecord,
  MasterBahanBaku,
  ShiftRekap,
  User,
} from './types';

export const App: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>(() => StorageService.getBranches());
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => StorageService.isAuthenticated());

  const [activeBranchId, setActiveBranchId] = useState<string>(() => {
    const user = StorageService.getCurrentUser();
    if (user && user.branchId && user.branchId !== 'all') {
      return user.branchId;
    }
    return StorageService.getActiveBranchId() || 'sumbawa';
  });

  const [shifts, setShifts] = useState<ShiftRekap[]>(() => StorageService.getShifts());
  const [expenses, setExpenses] = useState<DailyExpense[]>(() => StorageService.getExpenses());
  const [orders, setOrders] = useState<BranchOrder[]>(() => StorageService.getOrders());
  const [masterBahanBaku, setMasterBahanBaku] = useState<MasterBahanBaku[]>(() =>
    StorageService.getMasterBahanBaku()
  );
  const [karyawanList, setKaryawanList] = useState<KaryawanRecord[]>(() =>
    StorageService.getKaryawan()
  );
  const [absensiList, setAbsensiList] = useState<AbsensiRecord[]>(() => StorageService.getAbsensi());
  const [gajiList, setGajiList] = useState<GajiRecord[]>(() => StorageService.getGaji());

  type TabType = 'OVERVIEW' | 'KASIR' | 'BELANJA' | 'ORDER' | 'ABSENSI' | 'GAJI' | 'MASTER';
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Kolom Form toggle state (bisa diperluas atau dilipat)
  const [showFormColumn, setShowFormColumn] = useState<boolean>(true);

  // Input Modals (Fast direct entry popup when needed)
  const [showKasirModal, setShowKasirModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAbsenModal, setShowAbsenModal] = useState(false);
  const [showGajiModal, setShowGajiModal] = useState(false);

  // System Modals
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);

  useEffect(() => {
    const loadedBranches = StorageService.getBranches();
    const loadedUsers = StorageService.getUsers();
    setBranches(loadedBranches);
    setUsers(loadedUsers);

    const user = StorageService.getCurrentUser();
    setCurrentUser(user);

    const savedBranchId = StorageService.getActiveBranchId();
    if (user.branchId !== 'all') {
      setActiveBranchId(user.branchId);
    } else {
      setActiveBranchId(savedBranchId || 'sumbawa');
    }

    setShifts(StorageService.getShifts());
    setExpenses(StorageService.getExpenses());
    setOrders(StorageService.getOrders());
    setMasterBahanBaku(StorageService.getMasterBahanBaku());
    setKaryawanList(StorageService.getKaryawan());
    setAbsensiList(StorageService.getAbsensi());
    setGajiList(StorageService.getGaji());
  }, []);

  const defaultBranchFallback: Branch = {
    id: activeBranchId || 'sumbawa',
    name: 'Toko Kopi Mergan (Pusat Sumbawa)',
    shortName: 'Pusat Sumbawa',
    city: 'Sumbawa Besar',
    address: 'Jl. Hasanuddin No. 18, Sumbawa Besar',
    accentColor: '#D97706',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-300',
    themeClass: 'amber',
  };

  const activeBranch =
    branches.find((b) => b.id === activeBranchId) || branches[0] || defaultBranchFallback;
  const branchDisplayName = activeBranch?.name || defaultBranchFallback.name;
  const branchShortDisplayName = activeBranch?.shortName || defaultBranchFallback.shortName;

  // STRICT RBAC CONSTANTS
  const isOwnerHolding = currentUser.role === 'OWNER_HOLDING';
  const isPurchaseHolding = currentUser.role === 'PURCHASE_HOLDING';
  const isOwnerCabang = currentUser.role === 'OWNER_CABANG';
  const isKepalaToko = currentUser.role === 'KEPALA_TOKO';
  const isPurchaseCabang = currentUser.role === 'PURCHASE_CABANG';

  // Specific permissions
  const canInputKasir = isKepalaToko;
  const canInputAbsensi = isKepalaToko;
  const canInputGaji = isKepalaToko;
  const canInputBelanja = isPurchaseCabang;
  const canInputOrder = isPurchaseCabang;
  const canEditMaster = isPurchaseHolding;
  const canConfirmOrder = isPurchaseHolding;

  // Clean White Theme styling accents
  let themeStyles = {
    accentBorder: 'border-amber-300',
    accentText: 'text-amber-800',
    accentBg: 'bg-amber-50',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
    tabActive: 'border-amber-600 text-amber-800 bg-amber-50/50 font-bold',
    themeName: 'Pusat Sumbawa (Gold Warm)',
  };

  if (activeBranch.id === 'urip') {
    themeStyles = {
      accentBorder: 'border-emerald-300',
      accentText: 'text-emerald-800',
      accentBg: 'bg-emerald-50',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      tabActive: 'border-emerald-600 text-emerald-800 bg-emerald-50/50 font-bold',
      themeName: 'Cabang Urip Sumoharjo (Emerald Botanic)',
    };
  } else if (activeBranch.id === 'madiun') {
    themeStyles = {
      accentBorder: 'border-blue-300',
      accentText: 'text-blue-800',
      accentBg: 'bg-blue-50',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-300',
      tabActive: 'border-blue-600 text-blue-800 bg-blue-50/50 font-bold',
      themeName: 'Cabang Madiun (Sapphire Wave)',
    };
  }

  // Authentication Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    StorageService.setCurrentUser(user);

    if (user.branchId !== 'all') {
      setActiveBranchId(user.branchId);
      StorageService.setActiveBranchId(user.branchId);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    StorageService.logout();
  };

  const handleSelectBranch = (branchId: string) => {
    if (isOwnerHolding || isPurchaseHolding) {
      setActiveBranchId(branchId);
      StorageService.setActiveBranchId(branchId);
    }
  };

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    if (user.branchId !== 'all') {
      setActiveBranchId(user.branchId);
      StorageService.setActiveBranchId(user.branchId);
    }
  };

  const handleSaveUsers = (updatedUsers: User[]) => {
    StorageService.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    const updatedCur = updatedUsers.find((u) => u.id === currentUser.id);
    if (updatedCur) {
      setCurrentUser(updatedCur);
    }
  };

  // Handlers for Shifts (Kasir)
  const handleAddShift = (shiftData: Omit<ShiftRekap, 'id' | 'createdAt'>) => {
    const created = StorageService.addShift(shiftData);
    setShifts([created, ...shifts]);
  };

  const handleDeleteShift = (id: string) => {
    StorageService.deleteShift(id);
    setShifts(shifts.filter((s) => s.id !== id));
  };

  // Handlers for Expenses (Belanja)
  const handleAddExpense = (expenseData: Omit<DailyExpense, 'id' | 'createdAt'>) => {
    const created = StorageService.addExpense(expenseData);
    setExpenses([created, ...expenses]);
  };

  const handleDeleteExpense = (id: string) => {
    StorageService.deleteExpense(id);
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Handlers for Orders
  const handleAddOrder = (orderData: Omit<BranchOrder, 'id' | 'createdAt' | 'nomorOrder'>) => {
    const created = StorageService.addOrder(orderData);
    setOrders([created, ...orders]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: BranchOrder['status']) => {
    StorageService.updateOrderStatus(orderId, status);
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleDeleteOrder = (orderId: string) => {
    StorageService.deleteOrder(orderId);
    setOrders(orders.filter((o) => o.id !== orderId));
  };

  // Handlers for Master Bahan Baku
  const handleAddMasterItem = (itemData: Omit<MasterBahanBaku, 'id'>) => {
    const created = StorageService.addMasterBahanBaku(itemData);
    setMasterBahanBaku([created, ...masterBahanBaku]);
  };

  const handleDeleteMasterItem = (id: string) => {
    StorageService.deleteMasterBahanBaku(id);
    setMasterBahanBaku(masterBahanBaku.filter((m) => m.id !== id));
  };

  // Handlers for Absensi
  const handleAddAbsensi = (record: Omit<AbsensiRecord, 'id' | 'createdAt'>) => {
    const created = StorageService.addAbsensi(record);
    setAbsensiList([created, ...absensiList]);
  };

  const handleDeleteAbsensi = (id: string) => {
    StorageService.deleteAbsensi(id);
    setAbsensiList(absensiList.filter((a) => a.id !== id));
  };

  // Handlers for Gaji
  const handleAddGaji = (record: Omit<GajiRecord, 'id' | 'createdAt' | 'nomorSlip'>) => {
    const created = StorageService.addGaji(record);
    setGajiList([created, ...gajiList]);
  };

  const handleUpdateGajiStatus = (id: string, statusBayar: GajiRecord['statusBayar']) => {
    StorageService.updateGajiStatus(id, statusBayar);
    setGajiList(gajiList.map((g) => (g.id === id ? { ...g, statusBayar } : g)));
  };

  const handleDeleteGaji = (id: string) => {
    StorageService.deleteGaji(id);
    setGajiList(gajiList.filter((g) => g.id !== id));
  };

  // Filtered dataset according to active branch
  const currentBranchShifts = shifts.filter((s) => s.branchId === activeBranchId);
  const currentBranchExpenses = expenses.filter((e) => e.branchId === activeBranchId);
  const currentBranchOrders = orders.filter((o) => o.branchId === activeBranchId);
  const currentBranchKaryawan = karyawanList.filter((k) => k.branchId === activeBranchId);
  const currentBranchAbsensi = absensiList.filter((a) => a.branchId === activeBranchId);
  const currentBranchGaji = gajiList.filter((g) => g.branchId === activeBranchId);

  // If user is not logged in, render the login form
  if (!isLoggedIn) {
    return <LoginForm users={users} onLogin={handleLogin} />;
  }

  // Component to render inside the dynamic Form Column based on activeTab & user permissions
  const renderDynamicFormColumn = () => {
    switch (activeTab) {
      case 'KASIR':
        if (canInputKasir) {
          return (
            <FormRekapKasir
              branchId={activeBranchId}
              branchName={branchShortDisplayName}
              onAddShift={handleAddShift}
              isInline={true}
              expenses={expenses}
            />
          );
        }
        return (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-stone-800 font-bold text-sm pb-2 border-b border-stone-200">
              <Lock className="w-4 h-4 text-stone-500" />
              <span>Panel Audit Kasir Harian</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Mode Akses Audit Read-Only:</strong>
              <p className="mt-1">
                Akun <b>{currentUser.roleLabel}</b> memiliki hak penuh untuk memantau data rekap kasir, namun <i>tidak diizinkan mengedit/menginput transaksi kasir</i>. Formulir rekap kasir harian secara eksklusif diinput oleh <b>Kepala Toko Cabang</b>.
              </p>
            </div>
            <div className="text-xs text-stone-600 space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span>Total Shift Kasir:</span>
                <span className="font-bold text-stone-900">{currentBranchShifts.length} Shift</span>
              </div>
              <div className="flex justify-between">
                <span>Cabang Aktif:</span>
                <span className="font-bold text-stone-900">{branchShortDisplayName}</span>
              </div>
            </div>
          </div>
        );

      case 'BELANJA':
        if (canInputBelanja) {
          return (
            <FormBelanjaHarian
              branchId={activeBranchId}
              branchName={branchShortDisplayName}
              masterBahanBaku={masterBahanBaku}
              onAddExpense={handleAddExpense}
              isInline={true}
            />
          );
        }
        return (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-stone-800 font-bold text-sm pb-2 border-b border-stone-200">
              <Lock className="w-4 h-4 text-stone-500" />
              <span>Panel Audit Belanja Operasional</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-900 leading-relaxed">
              <strong>Mode Akses Audit Read-Only:</strong>
              <p className="mt-1">
                Pengeluaran belanja harian toko dicatat secara langsung oleh <b>Purchase Cabang</b>. Akun Anda memiliki izin audit penuh tanpa kemampuan mengubah nota.
              </p>
            </div>
            <div className="text-xs text-stone-600 space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span>Total Transaksi Belanja:</span>
                <span className="font-bold text-stone-900">{currentBranchExpenses.length} Nota</span>
              </div>
              <div className="flex justify-between">
                <span>Petugas Berwenang:</span>
                <span className="font-bold text-stone-900">Purchase Cabang ({branchShortDisplayName})</span>
              </div>
            </div>
          </div>
        );

      case 'ORDER':
        if (canInputOrder) {
          return (
            <FormOrderBarangCabang
              branchId={activeBranchId}
              branchName={branchShortDisplayName}
              masterBahanBaku={masterBahanBaku}
              onAddOrder={handleAddOrder}
              isInline={true}
            />
          );
        }
        return (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-stone-800 font-bold text-sm pb-2 border-b border-stone-200">
              <Lock className="w-4 h-4 text-stone-500" />
              <span>Panel Monitoring Order Restok</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 leading-relaxed">
              <strong>Informasi Alur Pengadaan:</strong>
              <p className="mt-1">
                Permintaan restok diajukan oleh <b>Purchase Cabang</b> dan diproses/dikonfirmasi oleh <b>Purchase Holding</b>.
              </p>
            </div>
            <div className="text-xs text-stone-600 space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span>Jumlah Order Cabang:</span>
                <span className="font-bold text-stone-900">{currentBranchOrders.length} Order</span>
              </div>
              <div className="flex justify-between">
                <span>Otoritas Konfirmasi:</span>
                <span className="font-bold text-stone-900">Purchase Holding</span>
              </div>
            </div>
          </div>
        );

      case 'ABSENSI':
        if (canInputAbsensi) {
          return (
            <FormAbsensiKaryawan
              branchId={activeBranchId}
              branchName={branchShortDisplayName}
              karyawanList={currentBranchKaryawan}
              onSave={handleAddAbsensi}
              isInline={true}
            />
          );
        }
        return (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-stone-800 font-bold text-sm pb-2 border-b border-stone-200">
              <Lock className="w-4 h-4 text-stone-500" />
              <span>Panel Audit Presensi Staf</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              <strong>Presensi Harian Toko:</strong>
              <p className="mt-1">
                Formulir kehadiran, jam masuk/pulang, dan perizinan staf diinput oleh <b>Kepala Toko Cabang</b>.
              </p>
            </div>
            <div className="text-xs text-stone-600 space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span>Jumlah Staf Toko:</span>
                <span className="font-bold text-stone-900">{currentBranchKaryawan.length} Karyawan</span>
              </div>
              <div className="flex justify-between">
                <span>Catatan Presensi:</span>
                <span className="font-bold text-stone-900">{currentBranchAbsensi.length} Data</span>
              </div>
            </div>
          </div>
        );

      case 'GAJI':
        if (canInputGaji) {
          return (
            <FormGajiKaryawan
              branchId={activeBranchId}
              branchName={branchShortDisplayName}
              karyawanList={currentBranchKaryawan}
              currentUserName={currentUser.name}
              onSave={handleAddGaji}
              isInline={true}
            />
          );
        }
        return (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-stone-800 font-bold text-sm pb-2 border-b border-stone-200">
              <Lock className="w-4 h-4 text-stone-500" />
              <span>Panel Audit Penggajian &amp; Slip</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              <strong>Administrasi Payroll Cabang:</strong>
              <p className="mt-1">
                Perhitungan gaji pokok, tunjangan, potongan kasbon, dan pencetakan slip gaji ditugaskan kepada <b>Kepala Toko Cabang</b>.
              </p>
            </div>
            <div className="text-xs text-stone-600 space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span>Slip Gaji Terbit:</span>
                <span className="font-bold text-stone-900">{currentBranchGaji.length} Slip</span>
              </div>
              <div className="flex justify-between">
                <span>Status Audit:</span>
                <span className="font-bold text-emerald-700">Tersinkron Holding</span>
              </div>
            </div>
          </div>
        );

      case 'MASTER':
        return (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-stone-800 font-bold text-sm pb-2 border-b border-stone-200">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Katalog Bahan Baku Resmi</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-900 leading-relaxed">
              <strong>Otoritas Purchase Holding:</strong>
              <p className="mt-1">
                {canEditMaster
                  ? 'Anda memiliki wewenang penuh untuk menambah dan mengedit harga serta spesifikasi bahan baku.'
                  : 'Katalog harga standar holding dikendalikan oleh Purchase Holding. Cabang menggunakan katalog ini sebagai acuan resmi belanja dan order.'}
              </p>
            </div>
            <div className="text-xs text-stone-600 space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span>Total Master Bahan Baku:</span>
                <span className="font-bold text-purple-900">{masterBahanBaku.length} Item Resmi</span>
              </div>
              <div className="flex justify-between">
                <span>Sumber Data:</span>
                <span className="font-bold text-stone-900">List Dokumen Lampiran</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#8c9299] p-2 sm:p-4 lg:p-6 flex items-center justify-center font-sans antialiased text-stone-900 transition-colors duration-200">
      {/* Main Dribbble Tablet / Canvas Container with Ultra-Smooth Rounded Edges */}
      <div className="w-full max-w-[1580px] bg-[#f8f9fa] rounded-[32px] sm:rounded-[40px] shadow-2xl border border-white/60 overflow-hidden flex flex-col md:flex-row min-h-[92vh]">
        {/* LEFT FLOATING NAVIGATION RAIL / DOCK */}
        <aside className="w-full md:w-20 shrink-0 bg-[#f8f9fa] border-b md:border-b-0 md:border-r border-stone-200/80 p-3.5 flex flex-row md:flex-col items-center justify-between">
          {/* Top Logo Mark in Red Circle */}
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-xs cursor-pointer transition transform hover:scale-105"
              title="Toko Kopi Mergan - Portfolio Overview"
            >
              <span className="font-black text-xs tracking-tighter">KM</span>
            </button>
          </div>

          {/* Center Vertical Icon Dock with Rounded Pill Container */}
          <div className="bg-[#f0f2f5] p-1.5 rounded-full flex flex-row md:flex-col items-center gap-1.5 shadow-2xs my-2 md:my-0">
            {/* 1. Overview */}
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                activeTab === 'OVERVIEW'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-white/80'
              }`}
              title="Portfolio Overview"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* 2. Kasir (Activity) */}
            <button
              onClick={() => setActiveTab('KASIR')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                activeTab === 'KASIR'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-white/80'
              }`}
              title="Kasir Harian (Activity)"
            >
              <Calendar className="w-4 h-4" />
            </button>

            {/* 3. Belanja (Key Metrics) */}
            <button
              onClick={() => setActiveTab('BELANJA')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                activeTab === 'BELANJA'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-white/80'
              }`}
              title="Belanja & Rekap Bulanan (Key Metrics)"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            {/* 4. Orders */}
            <button
              onClick={() => setActiveTab('ORDER')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                activeTab === 'ORDER'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-white/80'
              }`}
              title="Order Restok Cabang ke Holding"
            >
              <Package className="w-4 h-4" />
            </button>

            {/* 5. Absensi (Reports) */}
            <button
              onClick={() => setActiveTab('ABSENSI')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                activeTab === 'ABSENSI'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-white/80'
              }`}
              title="Presensi Staf Karyawan"
            >
              <UserCheck className="w-4 h-4" />
            </button>

            {/* 6. Gaji & Slip */}
            <button
              onClick={() => setActiveTab('GAJI')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                activeTab === 'GAJI'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-white/80'
              }`}
              title="Penggajian & Slip Gaji Staf"
            >
              <Banknote className="w-4 h-4" />
            </button>

            {/* 7. Master Bahan Baku */}
            <button
              onClick={() => setActiveTab('MASTER')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                activeTab === 'MASTER'
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-white/80'
              }`}
              title="Katalog Master Bahan Baku"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* 8. Pengaturan Akun */}
            <button
              onClick={() => {
                if (isOwnerHolding) {
                  setShowUserManagementModal(true);
                } else {
                  setShowPermissionsModal(true);
                }
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-white/80 transition cursor-pointer"
              title="Pengaturan Akun & Hak Akses"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Dock with Support & User Avatar */}
          <div className="flex flex-row md:flex-col items-center gap-2">
            <button
              onClick={() => setShowPermissionsModal(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition cursor-pointer"
              title="Hak Akses & Bantuan"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User Avatar Circle with Ring */}
            <div
              onClick={() => setShowPermissionsModal(true)}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-stone-800 to-amber-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-stone-200 hover:ring-amber-500 transition cursor-pointer shadow-xs"
              title={`${currentUser.name} (${currentUser.roleLabel})`}
            >
              <span>{currentUser.name.slice(0, 2).toUpperCase()}</span>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT CANVAS */}
        <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-7 overflow-y-auto">
          {/* TOP NAVIGATION BAR (Exact Match to Image Header) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            {/* Left Pill Navigation Group */}
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`px-5 py-2 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-[#18181b] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-semibold'
                }`}
              >
                Portfolio Overview
              </button>

              <button
                onClick={() => setActiveTab('KASIR')}
                className={`px-4 py-2 rounded-full font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'KASIR'
                    ? 'bg-[#18181b] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Activity (Kasir)
              </button>

              <button
                onClick={() => setActiveTab('BELANJA')}
                className={`px-4 py-2 rounded-full font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'BELANJA'
                    ? 'bg-[#18181b] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Key Metrics (Belanja)
              </button>

              <button
                onClick={() => setActiveTab('ORDER')}
                className={`px-4 py-2 rounded-full font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'ORDER'
                    ? 'bg-[#18181b] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Orders
              </button>

              <button
                onClick={() => setActiveTab('ABSENSI')}
                className={`px-4 py-2 rounded-full font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'ABSENSI'
                    ? 'bg-[#18181b] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Reports
              </button>

              <button
                onClick={() => setActiveTab('MASTER')}
                className={`px-4 py-2 rounded-full font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'MASTER'
                    ? 'bg-[#18181b] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Master
              </button>
            </div>

            {/* Right Tools: Search, Notification with Red Badge, Info, Sun/Moon, Branch */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Search Icon */}
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className="w-9 h-9 rounded-full bg-white border border-stone-200/80 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition cursor-pointer shadow-2xs"
                title="Pencarian"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notification Bell with Red Badge & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-9 h-9 rounded-full bg-white border border-stone-200/80 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition cursor-pointer relative shadow-2xs"
                  title="Notifikasi Operasional"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-1 ring-white"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 rounded-2xl shadow-xl p-3 z-50 animate-scale-up text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="font-bold text-stone-900">Notifikasi Realtime</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                        3 Baru
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition">
                        <p className="font-semibold text-stone-900">Belanja Kasir Terkunci</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          Sinkron otomatis dari pembelian Purchase per tanggal hari ini.
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition">
                        <p className="font-semibold text-stone-900">Order Restok Bahan Baku</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          {orders.filter((o) => o.status === 'MENUNGGU KONFIRMASI').length} permintaan restok menunggu konfirmasi Holding.
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition">
                        <p className="font-semibold text-stone-900">Slip Gaji Staf Toko</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          Honorarium dan slip gaji periode ini siap diunduh PDF / dicetak.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Circle */}
              <button
                onClick={() => setShowPermissionsModal(true)}
                className="w-9 h-9 rounded-full bg-white border border-stone-200/80 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition cursor-pointer shadow-2xs"
                title="Informasi Hak Akses RBAC"
              >
                <Info className="w-4 h-4" />
              </button>

              {/* Sun / Moon Theme Toggle Pill */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center bg-[#f0f2f5] p-1 rounded-full border border-stone-200 shadow-2xs cursor-pointer"
                title="Toggle Mode Tema"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                    !isDarkMode ? 'bg-white text-amber-600 shadow-2xs' : 'text-stone-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                    isDarkMode ? 'bg-stone-800 text-white shadow-2xs' : 'text-stone-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Branch Selector Pill */}
              <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200/80 text-xs shadow-2xs">
                <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {isOwnerHolding || isPurchaseHolding ? (
                  <select
                    value={activeBranchId}
                    onChange={(e) => handleSelectBranch(e.target.value)}
                    className="bg-transparent text-stone-900 font-bold focus:outline-none cursor-pointer text-xs"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id} className="bg-white text-stone-900">
                        {b.shortName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="font-bold text-stone-900 text-xs">
                    {activeBranch.shortName}
                  </span>
                )}
              </div>

              {/* User Switcher Dropdown & Logout */}
              <div className="flex items-center space-x-1 bg-white px-2.5 py-1.5 rounded-full border border-stone-200/80 text-xs shadow-2xs">
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const found = users.find((u) => u.id === e.target.value);
                    if (found) handleSelectUser(found);
                  }}
                  className="bg-transparent text-stone-900 font-semibold focus:outline-none cursor-pointer max-w-[120px] truncate"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleLogout}
                  className="text-stone-400 hover:text-rose-600 transition p-0.5"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC VIEW ROUTING: OVERVIEW (DRIBBBLE VIEW) vs OPERATIONAL SUBVIEWS */}
          {activeTab === 'OVERVIEW' ? (
            <ExecutiveDribbbleOverview
              branch={activeBranch}
              branches={branches}
              activeBranchId={activeBranchId}
              onSelectBranch={handleSelectBranch}
              currentUser={currentUser}
              shifts={shifts}
              expenses={expenses}
              orders={orders}
              onOpenKasirModal={() => setShowKasirModal(true)}
              onOpenBelanjaModal={() => setShowExpenseModal(true)}
              onOpenOrderModal={() => setShowOrderModal(true)}
              onOpenHtmlModal={() => setShowHtmlModal(true)}
              onOpenRulesModal={() => setShowRulesModal(true)}
              onOpenUserManagementModal={() => setShowUserManagementModal(true)}
              onOpenPermissionsModal={() => setShowPermissionsModal(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              canInputKasir={canInputKasir}
              canInputBelanja={canInputBelanja}
              canInputOrder={canInputOrder}
              canConfirmOrder={canConfirmOrder}
              canEditMaster={canEditMaster}
            />
          ) : (
            <div className="space-y-6">
              {/* Branch Sub-view Header Banner */}
              <div
                className={`p-4 sm:p-5 rounded-2xl bg-white border ${themeStyles.accentBorder} shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-stone-900 text-white rounded-xl shadow-xs shrink-0">
                    <LogoMergan size="sm" variant="light" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-base sm:text-lg text-stone-900 tracking-tight">
                        {branchDisplayName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${themeStyles.badgeClass}`}
                      >
                        {themeStyles.themeName}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {activeBranch.address} • Telp: {activeBranch.phone || '0812-3456-7890'} • Kepala Toko:{' '}
                      {activeBranch.headStore || 'Budi Santoso'}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
                      <span>
                        Login sebagai: <b className="text-stone-900">{currentUser.name}</b>
                      </span>
                      <span>•</span>
                      <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {currentUser.roleLabel}
                      </span>
                      <span>•</span>
                      <span className="text-stone-500 italic">
                        {isOwnerHolding || isOwnerCabang
                          ? 'Mode Audit Read-Only'
                          : isPurchaseHolding
                          ? 'Edit Master & Konfirmasi Order'
                          : isKepalaToko
                          ? 'Input Kasir, Absen & Gaji'
                          : 'Input Belanja & Order Cabang'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons according to permissions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {canInputKasir && (
                    <button
                      type="button"
                      onClick={() => setShowKasirModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Input Kasir</span>
                    </button>
                  )}

                  {canInputAbsensi && (
                    <button
                      type="button"
                      onClick={() => setShowAbsenModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Input Absen</span>
                    </button>
                  )}

                  {canInputGaji && (
                    <button
                      type="button"
                      onClick={() => setShowGajiModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Banknote className="w-3.5 h-3.5" />
                      <span>Input Slip Gaji</span>
                    </button>
                  )}

                  {canInputBelanja && (
                    <button
                      type="button"
                      onClick={() => setShowExpenseModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Input Belanja Cabang</span>
                    </button>
                  )}

                  {canInputOrder && (
                    <button
                      type="button"
                      onClick={() => setShowOrderModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Order Restok ke Holding</span>
                    </button>
                  )}
                </div>
              </div>

              {/* INTEGRATED PAGE LAYOUT: KOLOM FORM DINAMIS + TABEL UTAMA */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFormColumn(!showFormColumn)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 transition cursor-pointer shadow-2xs"
                >
                  {showFormColumn ? (
                    <>
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Tutup Kolom Form</span>
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span>Buka Kolom Form</span>
                    </>
                  )}
                </button>
              </div>

              <div className={`grid grid-cols-1 ${showFormColumn ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-6 items-start`}>
                {/* Kolom Form Dinamis (Left Column) */}
                {showFormColumn && (
                  <div className="lg:col-span-4 xl:col-span-4 space-y-4">
                    {renderDynamicFormColumn()}
                  </div>
                )}

                {/* Area Tabel Utama (Right Column / Full width) */}
                <div className={`${showFormColumn ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-12'} space-y-4`}>
                  {activeTab === 'KASIR' && (
                    <TabelRekapKasir
                      shifts={currentBranchShifts}
                      branchName={branchShortDisplayName}
                      onOpenForm={() => setShowKasirModal(true)}
                      onDeleteShift={handleDeleteShift}
                      canManage={canInputKasir}
                    />
                  )}

                  {activeTab === 'BELANJA' && (
                    <TabelBelanjaHarian
                      expenses={currentBranchExpenses}
                      branchName={branchShortDisplayName}
                      onOpenForm={() => setShowExpenseModal(true)}
                      onDeleteExpense={handleDeleteExpense}
                      canManage={canInputBelanja}
                      branches={branches}
                      activeBranchId={activeBranchId}
                      onSelectBranch={handleSelectBranch}
                      isHolding={isOwnerHolding || isPurchaseHolding}
                    />
                  )}

                  {activeTab === 'ORDER' && (
                    <TabelOrderBarang
                      orders={currentBranchOrders}
                      branchName={branchShortDisplayName}
                      canCreateOrder={canInputOrder}
                      canUpdateStatus={canConfirmOrder}
                      canDelete={isPurchaseHolding}
                      onOpenForm={() => setShowOrderModal(true)}
                      onUpdateStatus={handleUpdateOrderStatus}
                      onDeleteOrder={handleDeleteOrder}
                    />
                  )}

                  {activeTab === 'ABSENSI' && (
                    <TabelAbsensiKaryawan
                      absensiList={currentBranchAbsensi}
                      branchName={branchShortDisplayName}
                      userRole={currentUser.role}
                      canInput={canInputAbsensi}
                      onOpenForm={() => setShowAbsenModal(true)}
                      onDelete={handleDeleteAbsensi}
                    />
                  )}

                  {activeTab === 'GAJI' && (
                    <TabelGajiKaryawan
                      gajiList={currentBranchGaji}
                      branchName={branchShortDisplayName}
                      userRole={currentUser.role}
                      canInput={canInputGaji}
                      onOpenForm={() => setShowGajiModal(true)}
                      onUpdateStatus={handleUpdateGajiStatus}
                      onDelete={handleDeleteGaji}
                    />
                  )}

                  {activeTab === 'MASTER' && (
                    <MasterBahanBakuManager
                      items={masterBahanBaku}
                      onAddItem={handleAddMasterItem}
                      onDeleteItem={handleDeleteMasterItem}
                      canEdit={canEditMaster}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SLEEK BOTTOM FOOTER INSIDE CANVAS */}
          <footer className="mt-auto pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
            <div className="flex items-center space-x-2">
              <LogoMergan size="sm" variant="dark" />
              <span>• Pusat Sumbawa • Cabang Urip • Cabang Madiun</span>
            </div>

            <div className="flex items-center space-x-3 text-stone-600">
              <button
                onClick={() => setShowHtmlModal(true)}
                className="hover:text-amber-800 transition flex items-center space-x-1 cursor-pointer font-medium"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-600" />
                <span>Download HTML</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setShowRulesModal(true)}
                className="hover:text-orange-800 transition flex items-center space-x-1 cursor-pointer font-medium"
              >
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>Firebase Rules</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setShowPermissionsModal(true)}
                className="hover:text-emerald-800 transition flex items-center space-x-1 cursor-pointer font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hak Akses RBAC</span>
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* Pop-up Modals (For fast pop-up access) */}
      {showKasirModal && canInputKasir && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <FormRekapKasir
            branchId={activeBranchId}
            branchName={branchShortDisplayName}
            onAddShift={handleAddShift}
            onClose={() => setShowKasirModal(false)}
            isModal={true}
            expenses={expenses}
          />
        </div>
      )}

      {showExpenseModal && canInputBelanja && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <FormBelanjaHarian
            branchId={activeBranchId}
            branchName={branchShortDisplayName}
            masterBahanBaku={masterBahanBaku}
            onAddExpense={handleAddExpense}
            onClose={() => setShowExpenseModal(false)}
            isModal={true}
          />
        </div>
      )}

      {showOrderModal && canInputOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <FormOrderBarangCabang
            branchId={activeBranchId}
            branchName={branchShortDisplayName}
            masterBahanBaku={masterBahanBaku}
            onAddOrder={handleAddOrder}
            onClose={() => setShowOrderModal(false)}
            isModal={true}
          />
        </div>
      )}

      {showAbsenModal && canInputAbsensi && (
        <FormAbsensiKaryawan
          branchId={activeBranchId}
          branchName={branchShortDisplayName}
          karyawanList={currentBranchKaryawan}
          onSave={handleAddAbsensi}
          onCancel={() => setShowAbsenModal(false)}
          isInline={false}
        />
      )}

      {showGajiModal && canInputGaji && (
        <FormGajiKaryawan
          branchId={activeBranchId}
          branchName={branchShortDisplayName}
          karyawanList={currentBranchKaryawan}
          currentUserName={currentUser.name}
          onSave={handleAddGaji}
          onCancel={() => setShowGajiModal(false)}
          isInline={false}
        />
      )}

      {/* System Modals */}
      {showHtmlModal && <HtmlBundleModal onClose={() => setShowHtmlModal(false)} />}
      {showRulesModal && <FirebaseRulesModal onClose={() => setShowRulesModal(false)} />}
      {showPermissionsModal && (
        <RolePermissionsModal
          users={users}
          currentUser={currentUser}
          onClose={() => setShowPermissionsModal(false)}
          onSwitchUser={handleSelectUser}
        />
      )}
      {showUserManagementModal && isOwnerHolding && (
        <UserManagementModal
          users={users}
          branches={branches}
          currentUser={currentUser}
          onClose={() => setShowUserManagementModal(false)}
          onSaveUsers={handleSaveUsers}
        />
      )}
    </div>
  );
};

export default App;
