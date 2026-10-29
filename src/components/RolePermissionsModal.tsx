import React from 'react';
import {
  CheckCircle2,
  Lock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Store,
  Truck,
  UserCheck,
  X,
} from 'lucide-react';
import { User } from '../types';

interface RolePermissionsModalProps {
  users: User[];
  currentUser: User;
  onClose: () => void;
  onSwitchUser: (user: User) => void;
}

export const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({
  users,
  currentUser,
  onClose,
  onSwitchUser,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Struktur Hak Akses &amp; Otorisasi Akun ({users.length} Akun)
              </h2>
              <p className="text-xs text-stone-500">
                Matriks hak akses sistem Toko Kopi Mergan (Owner, Purchase Holding, Kepala Toko &amp; Purchase Cabang).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-stone-500">Akun Anda Saat Ini:</span>
              <span className="font-bold text-stone-900 text-xs">{currentUser.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                {currentUser.roleLabel}
              </span>
            </div>
            <span className="text-[11px] text-stone-500 font-mono font-semibold">
              Cabang: {currentUser.branchId === 'all' ? 'Holding (Semua Cabang)' : currentUser.branchId}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users.map((u) => {
              const isCurrent = u.id === currentUser.id;
              const isHolding = u.role === 'OWNER_HOLDING' || u.role === 'PURCHASE_HOLDING';

              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-xl border transition ${
                    isCurrent
                      ? 'bg-amber-50/50 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900 text-xs">{u.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-600 text-white">
                            Aktif
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 font-mono font-semibold">
                        @{u.username} • Pass: {u.password}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200 shrink-0">
                      {u.roleLabel}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 mb-3">{u.roleDescription}</p>

                  <div className="space-y-1 pt-2 border-t border-stone-100">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                      Hak Akses Spesifik:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(u.permissions || []).map((perm, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 flex items-center space-x-1 border border-stone-200 font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{perm}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {!isCurrent && (
                    <div className="mt-3 pt-2 border-t border-stone-100 flex justify-end">
                      <button
                        onClick={() => {
                          onSwitchUser(u);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-stone-900 hover:bg-black text-white text-[11px] font-bold transition cursor-pointer flex items-center space-x-1 shadow-2xs"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>Beralih ke Akun Ini</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 flex justify-end bg-stone-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg transition shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
