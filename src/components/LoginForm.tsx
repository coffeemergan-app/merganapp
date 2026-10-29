import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  Package,
  Shield,
  ShieldCheck,
  Store,
  Truck,
  User as UserIcon,
} from 'lucide-react';
import { User } from '../types';
import { LogoMergan } from './LogoMergan';

interface LoginFormProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<
    'ALL' | 'HOLDING' | 'OWNER' | 'KEPALA' | 'PURCHASE_CABANG'
  >('ALL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Silakan masukkan username akun.');
      return;
    }

    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!matchedUser) {
      setErrorMsg(`Akun dengan username "${username}" tidak ditemukan.`);
      return;
    }

    if (password && matchedUser.password && matchedUser.password !== password) {
      setErrorMsg('Password salah. Periksa kembali password Anda.');
      return;
    }

    onLogin(matchedUser);
  };

  const handleQuickLogin = (user: User) => {
    setUsername(user.username);
    setPassword(user.password || '');
    onLogin(user);
  };

  const filteredUsers = users.filter((u) => {
    if (selectedRoleFilter === 'HOLDING') {
      return u.role === 'OWNER_HOLDING' || u.role === 'PURCHASE_HOLDING';
    }
    if (selectedRoleFilter === 'OWNER') {
      return u.role === 'OWNER_CABANG';
    }
    if (selectedRoleFilter === 'KEPALA') {
      return u.role === 'KEPALA_TOKO';
    }
    if (selectedRoleFilter === 'PURCHASE_CABANG') {
      return u.role === 'PURCHASE_CABANG';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full">
        {/* Brand Header with Official Toko Kopi Mergan Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-md mb-4">
            <LogoMergan size="xl" variant="dark" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Sistem Kasir, Operasional &amp; Purchase Holding
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-lg mx-auto">
            Platform terpadu untuk monitoring omzet harian, belanja bahan baku operasional, absensi, slip gaji, dan permintaan restok lintas cabang.
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold">
            <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800">
              ● Pusat Sumbawa (Gold)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800">
              ● Cabang Urip Sumoharjo (Emerald)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-300 text-blue-800">
              ● Cabang Madiun (Sapphire)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Login Form (Left Column) */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-lg">
            <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-stone-100">
              <Lock className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-stone-900">Form Login Akun</h2>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-300 text-xs text-rose-800">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Username Akun
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: owner_holding"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-9 pr-10 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Sistem</span>
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-stone-100 text-[11px] text-stone-500 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>11 Akun Terproteksi RBAC &amp; Terkoneksi ke Firebase.</span>
            </div>
          </div>

          {/* Quick Access Account Selector (Right Column) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Daftar Akun Resmi ({users.length} Akun)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Gunakan tombol &quot;Masuk Langsung&quot; untuk menguji alur kerja peran mana pun.
                </p>
              </div>

              {/* Filter tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-stone-100 border border-stone-200 p-1 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedRoleFilter('ALL')}
                  className={`px-2 py-1 rounded cursor-pointer font-semibold ${
                    selectedRoleFilter === 'ALL'
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Semua ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoleFilter('HOLDING')}
                  className={`px-2 py-1 rounded cursor-pointer font-semibold ${
                    selectedRoleFilter === 'HOLDING'
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Holding
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoleFilter('OWNER')}
                  className={`px-2 py-1 rounded cursor-pointer font-semibold ${
                    selectedRoleFilter === 'OWNER'
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Owner
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoleFilter('KEPALA')}
                  className={`px-2 py-1 rounded cursor-pointer font-semibold ${
                    selectedRoleFilter === 'KEPALA'
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Kepala Toko
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoleFilter('PURCHASE_CABANG')}
                  className={`px-2 py-1 rounded cursor-pointer font-semibold ${
                    selectedRoleFilter === 'PURCHASE_CABANG'
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Purchase Cabang
                </button>
              </div>
            </div>

            {/* List of Accounts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredUsers.map((user) => {
                let badgeColor = 'bg-stone-100 text-stone-700 border-stone-200';
                let icon = <Store className="w-3.5 h-3.5 text-stone-500" />;

                if (user.role === 'OWNER_HOLDING') {
                  badgeColor = 'bg-purple-50 text-purple-800 border-purple-200';
                  icon = <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />;
                } else if (user.role === 'PURCHASE_HOLDING') {
                  badgeColor = 'bg-orange-50 text-orange-800 border-orange-200';
                  icon = <Truck className="w-3.5 h-3.5 text-orange-600" />;
                } else if (user.role === 'OWNER_CABANG') {
                  badgeColor = 'bg-indigo-50 text-indigo-800 border-indigo-200';
                  icon = <Store className="w-3.5 h-3.5 text-indigo-600" />;
                } else if (user.role === 'KEPALA_TOKO') {
                  badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  icon = <UserIcon className="w-3.5 h-3.5 text-emerald-600" />;
                } else if (user.role === 'PURCHASE_CABANG') {
                  badgeColor = 'bg-cyan-50 text-cyan-800 border-cyan-200';
                  icon = <Package className="w-3.5 h-3.5 text-cyan-600" />;
                }

                return (
                  <div
                    key={user.id}
                    className="bg-white border border-stone-200 rounded-xl p-3.5 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} flex items-center space-x-1`}>
                          {icon}
                          <span>{user.roleLabel}</span>
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {user.username}
                        </span>
                      </div>

                      <div className="font-bold text-xs text-stone-900 mb-1">
                        {user.name}
                      </div>

                      <p className="text-[11px] text-stone-500 line-clamp-2 mb-2">
                        {user.roleDescription}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div className="text-[10px] font-mono text-stone-500">
                        Pass: <span className="font-semibold text-stone-700">{user.password}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickLogin(user)}
                        className="bg-stone-900 hover:bg-black text-white text-[11px] font-bold px-3 py-1 rounded-md transition shadow-2xs cursor-pointer flex items-center space-x-1"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>Masuk Langsung</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
