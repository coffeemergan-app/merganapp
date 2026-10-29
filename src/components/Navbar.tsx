import React from 'react';
import {
  FileCode,
  Flame,
  LogOut,
  ShieldCheck,
  Store,
  UserCheck,
  Users,
} from 'lucide-react';
import { Branch, User } from '../types';
import { LogoMergan } from './LogoMergan';

interface NavbarProps {
  branches: Branch[];
  activeBranchId: string;
  onSelectBranch: (branchId: string) => void;
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  onOpenHtmlModal: () => void;
  onOpenRulesModal: () => void;
  onOpenPermissionsModal: () => void;
  onOpenUserManagementModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  branches,
  activeBranchId,
  onSelectBranch,
  currentUser,
  users,
  onSelectUser,
  onOpenHtmlModal,
  onOpenRulesModal,
  onOpenPermissionsModal,
  onOpenUserManagementModal,
  onLogout,
}) => {
  const isOwnerHolding = currentUser.role === 'OWNER_HOLDING';
  const isHolding = isOwnerHolding || currentUser.role === 'PURCHASE_HOLDING';

  const fallbackBranch: Branch = {
    id: activeBranchId || 'sumbawa',
    name: 'Toko Kopi Mergan (Pusat Sumbawa)',
    shortName: 'Pusat Sumbawa',
    city: 'Sumbawa',
    address: 'Jl. Hasanuddin No. 18',
    accentColor: '#D97706',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-400',
    themeClass: 'amber',
  };

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0] || fallbackBranch;

  // Dynamic theme accent border for current branch (Light Mode)
  let branchPillClass = 'bg-amber-50 border-amber-300 text-amber-800';
  if (activeBranch.id === 'urip') {
    branchPillClass = 'bg-emerald-50 border-emerald-300 text-emerald-800';
  } else if (activeBranch.id === 'madiun') {
    branchPillClass = 'bg-blue-50 border-blue-300 text-blue-800';
  }

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand with Official Toko Kopi Mergan vector in Dark text */}
          <div className="flex items-center space-x-3 shrink-0">
            <LogoMergan size="sm" variant="dark" />
            <div className="hidden sm:block pl-2 border-l border-stone-200">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${branchPillClass}`}>
                {activeBranch.shortName}
              </span>
            </div>
          </div>

          {/* Center Navigation Shortcuts */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Owner Holding User Management Button */}
            {isOwnerHolding && (
              <button
                onClick={onOpenUserManagementModal}
                className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              >
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Pengaturan Akun ({users.length})</span>
              </button>
            )}

            <button
              onClick={onOpenHtmlModal}
              className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-600" />
              <span>Kode HTML</span>
            </button>

            <button
              onClick={onOpenRulesModal}
              className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <span>Firebase Rules</span>
            </button>

            <button
              onClick={onOpenPermissionsModal}
              className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hak Akses</span>
            </button>
          </div>

          {/* Right Controls: Branch, User, Logout */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Branch Selector */}
            <div className="flex items-center space-x-1.5 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-700 shadow-2xs">
              <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              {isHolding ? (
                <select
                  value={activeBranchId}
                  onChange={(e) => onSelectBranch(e.target.value)}
                  className="bg-transparent text-stone-900 font-bold focus:outline-none cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id} className="bg-white text-stone-900">
                      {b.shortName}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="font-bold text-stone-900 truncate max-w-[100px] sm:max-w-none">
                  {activeBranch?.shortName || activeBranchId}
                </span>
              )}
            </div>

            {/* Quick Switch Account Dropdown */}
            <div className="flex items-center space-x-1.5 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-700 shadow-2xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const target = users.find((u) => u.id === e.target.value);
                  if (target) onSelectUser(target);
                }}
                className="bg-transparent text-stone-900 font-bold focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[150px] truncate"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-white text-stone-900">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              title="Keluar / Ganti Akun"
              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition cursor-pointer flex items-center justify-center shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
