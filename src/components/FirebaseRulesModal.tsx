import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Flame,
  Key,
  Lock,
  Shield,
  ShieldCheck,
  X,
} from 'lucide-react';

interface FirebaseRulesModalProps {
  onClose: () => void;
}

export const FirebaseRulesModal: React.FC<FirebaseRulesModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const rulesContent = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // =========================================================================
    // 1. GLOBAL DEFAULT DENY (Zero-Trust Security)
    // =========================================================================
    match /{document=**} {
      allow read, write: if false;
    }

    // =========================================================================
    // 2. FUNGSI OTENTIKASI & HAK AKSES PERAN (RBAC MERGAN)
    // =========================================================================

    function isSignedIn() {
      return request.auth != null && request.auth.uid != null;
    }

    function isHoldingOwner() {
      return isSignedIn() && (
        request.auth.token.role == 'OWNER_HOLDING' ||
        request.auth.token.email == 'coffeemergan@gmail.com'
      );
    }

    function isPurchaseHolding() {
      return isSignedIn() && (
        request.auth.token.role == 'PURCHASE_HOLDING' ||
        isHoldingOwner()
      );
    }

    function isBranchAuthorized(targetBranchId) {
      return isSignedIn() && (
        isHoldingOwner() ||
        request.auth.token.branchId == targetBranchId
      );
    }

    function isKepalaToko(targetBranchId) {
      return isSignedIn() &&
        request.auth.token.role == 'KEPALA_TOKO' &&
        request.auth.token.branchId == targetBranchId;
    }

    function isPurchaseCabang(targetBranchId) {
      return isSignedIn() &&
        request.auth.token.role == 'PURCHASE_CABANG' &&
        request.auth.token.branchId == targetBranchId;
    }

    // =========================================================================
    // 3. KOLEKSI MASTER BAHAN BAKU (HANYA BISA DIEDIT PURCHASE HOLDING)
    // =========================================================================
    match /masterBahanBaku/{itemId} {
      allow read: if isSignedIn();
      allow write: if isPurchaseHolding();
    }

    // =========================================================================
    // 4. KOLEKSI REKAP KASIR (INPUT OLEH KEPALA TOKO CABANG)
    // =========================================================================
    match /shifts/{shiftId} {
      allow read: if isSignedIn() && isBranchAuthorized(resource.data.branchId);
      allow create: if isKepalaToko(request.resource.data.branchId);
      allow update, delete: if isKepalaToko(resource.data.branchId);
    }

    // =========================================================================
    // 5. KOLEKSI BELANJA OPERASIONAL (INPUT OLEH PURCHASE CABANG)
    // =========================================================================
    match /expenses/{expenseId} {
      allow read: if isSignedIn() && isBranchAuthorized(resource.data.branchId);
      allow create: if isPurchaseCabang(request.resource.data.branchId);
      allow update, delete: if isPurchaseCabang(resource.data.branchId);
    }

    // =========================================================================
    // 6. KOLEKSI ORDER RESTOK (INPUT PURCHASE CABANG -> KONFIRMASI PURCHASE HOLDING)
    // =========================================================================
    match /orders/{orderId} {
      allow read: if isSignedIn() && (isPurchaseHolding() || isBranchAuthorized(resource.data.branchId));
      allow create: if isPurchaseCabang(request.resource.data.branchId);
      allow update: if isPurchaseHolding() || (isPurchaseCabang(resource.data.branchId) && resource.data.status == 'MENUNGGU KONFIRMASI');
      allow delete: if isPurchaseHolding();
    }

    // =========================================================================
    // 7. KOLEKSI ABSENSI KARYAWAN (INPUT OLEH KEPALA TOKO CABANG)
    // =========================================================================
    match /absensi/{absenId} {
      allow read: if isSignedIn() && isBranchAuthorized(resource.data.branchId);
      allow create, update, delete: if isKepalaToko(request.resource.data.branchId);
    }

    // =========================================================================
    // 8. KOLEKSI GAJI KARYAWAN (INPUT OLEH KEPALA TOKO CABANG)
    // =========================================================================
    match /gaji/{gajiId} {
      allow read: if isSignedIn() && isBranchAuthorized(resource.data.branchId);
      allow create, update, delete: if isKepalaToko(request.resource.data.branchId);
    }
  }
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rulesContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([rulesContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'firestore.rules';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Firebase Security Rules (firestore.rules)
              </h2>
              <p className="text-xs text-stone-500">
                Aturan keamanan data &amp; Role-Based Access Control (RBAC) resmi Toko Kopi Mergan.
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

        {/* Action Bar */}
        <div className="p-4 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-stone-700">
            <span className="px-2.5 py-1 rounded-md bg-stone-100 text-orange-700 font-mono font-bold border border-stone-200">
              firestore.rules
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 font-mono">Project: merganapp</span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 11 Akun Terproteksi Penuh
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Aturan'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download firestore.rules</span>
            </button>
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="flex-1 p-4 overflow-y-auto bg-stone-900 font-mono text-xs text-stone-200">
          <pre className="whitespace-pre-wrap leading-relaxed select-all">
            {rulesContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Format Cloud Firestore Security Rules v2</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
