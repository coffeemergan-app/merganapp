import { firebaseConfig } from '../config/firebase';
import { INITIAL_MASTER_BAHAN_BAKU } from '../data/initialData';

export function generateStandaloneHtmlBundle(): string {
  const firebaseConfigStr = JSON.stringify(firebaseConfig, null, 2);
  const masterBahanJson = JSON.stringify(INITIAL_MASTER_BAHAN_BAKU);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Toko Kopi Mergan - Sistem Kasir, Operasional & Purchase Holding</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .bg-stone-850 { background-color: #201e1b; }
    .bg-stone-925 { background-color: #121110; }
  </style>
</head>
<body class="bg-stone-50 text-stone-900 min-h-screen flex flex-col antialiased">

  <!-- FIREBASE CONFIGURATION INJECTED -->
  <script>
    window.FIREBASE_CONFIG = ${firebaseConfigStr};
    console.log("Firebase Mergan Config Initialized:", window.FIREBASE_CONFIG.projectId);
  </script>

  <!-- APP CONTAINER -->
  <div id="app" class="flex-1 flex flex-col"></div>

  <!-- CORE STANDALONE SCRIPT -->
  <script>
    // --- 1. INITIAL DATA & PRE-CONFIGURED ACCOUNTS (11 AKUN) ---
    const INITIAL_BRANCHES = [
      { id: 'sumbawa', name: 'Toko Kopi Mergan (Pusat Sumbawa)', shortName: 'Pusat Sumbawa', city: 'Sumbawa', theme: 'amber' },
      { id: 'urip', name: 'Toko Kopi Mergan (Cabang Urip Sumoharjo)', shortName: 'Cabang Urip', city: 'Surabaya', theme: 'emerald' },
      { id: 'madiun', name: 'Toko Kopi Mergan (Cabang Madiun)', shortName: 'Cabang Madiun', city: 'Madiun', theme: 'blue' }
    ];

    const INITIAL_USERS = [
      { id: 'u1', username: 'owner_holding', name: 'Bpk. Haryanto (Owner Holding)', role: 'OWNER_HOLDING', branchId: 'all', password: 'holding123', label: 'Owner Holding' },
      { id: 'u2', username: 'purchase_holding', name: 'Andi (Purchase Holding)', role: 'PURCHASE_HOLDING', branchId: 'all', password: 'holding123', label: 'Purchase Holding' },
      { id: 'u3', username: 'owner_sumbawa', name: 'Bpk. Hendra (Owner Pusat Sumbawa)', role: 'OWNER_CABANG', branchId: 'sumbawa', password: 'sumbawa123', label: 'Owner Sumbawa' },
      { id: 'u4', username: 'owner_urip', name: 'Ibu Maya (Owner Cabang Urip)', role: 'OWNER_CABANG', branchId: 'urip', password: 'urip123', label: 'Owner Urip' },
      { id: 'u5', username: 'owner_madiun', name: 'Bpk. Fajar (Owner Cabang Madiun)', role: 'OWNER_CABANG', branchId: 'madiun', password: 'madiun123', label: 'Owner Madiun' },
      { id: 'u6', username: 'kepala_sumbawa', name: 'Budi Santoso (Kepala Toko Sumbawa)', role: 'KEPALA_TOKO', branchId: 'sumbawa', password: 'sumbawa123', label: 'Kepala Sumbawa' },
      { id: 'u7', username: 'kepala_urip', name: 'Rian Pratama (Kepala Toko Urip)', role: 'KEPALA_TOKO', branchId: 'urip', password: 'urip123', label: 'Kepala Urip' },
      { id: 'u8', username: 'kepala_madiun', name: 'Dimas Anggara (Kepala Toko Madiun)', role: 'KEPALA_TOKO', branchId: 'madiun', password: 'madiun123', label: 'Kepala Madiun' },
      { id: 'u9', username: 'purchase_sumbawa', name: 'Citra (Purchase Cabang Sumbawa)', role: 'PURCHASE_CABANG', branchId: 'sumbawa', password: 'sumbawa123', label: 'Purchase Sumbawa' },
      { id: 'u10', username: 'purchase_urip', name: 'Eka (Purchase Cabang Urip)', role: 'PURCHASE_CABANG', branchId: 'urip', password: 'urip123', label: 'Purchase Urip' },
      { id: 'u11', username: 'purchase_madiun', name: 'Tio (Purchase Cabang Madiun)', role: 'PURCHASE_CABANG', branchId: 'madiun', password: 'madiun123', label: 'Purchase Madiun' }
    ];

    const RAW_MASTER_BAHAN = ${masterBahanJson};

    // LocalStorage State Management
    function loadStorage(key, fallback) {
      const data = localStorage.getItem('html_bundle_v5_' + key);
      return data ? JSON.parse(data) : fallback;
    }
    function saveStorage(key, value) {
      localStorage.setItem('html_bundle_v5_' + key, JSON.stringify(value));
    }

    let state = {
      currentUser: loadStorage('currentUser', null),
      activeBranchId: loadStorage('activeBranchId', 'sumbawa'),
      activeTab: 'KASIR', // KASIR, BELANJA, ORDER, MASTER
      shifts: loadStorage('shifts', [
        { id: 's1', branchId: 'sumbawa', tanggal: '2026-10-27', hari: 'Hari Ini', person: 'Rizky (Barista)', shift: 'Shift 1 (Pagi)', cash: 1850000, qris: 1420000, belanjaKasir: 150000, totalNet: 3120000, catatan: 'Ramai pengunjung pagi' },
        { id: 's2', branchId: 'urip', tanggal: '2026-10-27', hari: 'Hari Ini', person: 'Fahri (Barista)', shift: 'Shift 1 (Pagi)', cash: 1450000, qris: 1890000, belanjaKasir: 95000, totalNet: 3245000, catatan: 'Banyak order take-away' },
        { id: 's3', branchId: 'madiun', tanggal: '2026-10-27', hari: 'Hari Ini', person: 'Wahyu (Barista)', shift: 'Shift 1 (Pagi)', cash: 1200000, qris: 1350000, belanjaKasir: 80000, totalNet: 2470000, catatan: 'Operasional lancar' }
      ]),
      expenses: loadStorage('expenses', [
        { id: 'e1', branchId: 'sumbawa', tanggal: '2026-10-27', shift: 'Shift 1 (Pagi)', rincianBarang: 'Galon Cleo 19L', kategori: 'Cleo', hargaSatuan: 15750, kuantitas: 5, satuan: 'galon', totalBiaya: 78750, personPurchase: 'Citra (Purchase Sumbawa)' },
        { id: 'e2', branchId: 'urip', tanggal: '2026-10-27', shift: 'Shift 1 (Pagi)', rincianBarang: 'Greenfield', kategori: 'Freshmilk', hargaSatuan: 455000, kuantitas: 1, satuan: 'crtn', totalBiaya: 455000, personPurchase: 'Eka (Purchase Urip)' },
        { id: 'e3', branchId: 'madiun', tanggal: '2026-10-27', shift: 'Shift 1 (Pagi)', rincianBarang: 'Dairy Champ', kategori: 'SKM', hargaSatuan: 454500, kuantitas: 1, satuan: 'crtn', totalBiaya: 454500, personPurchase: 'Tio (Purchase Madiun)' }
      ]),
      orders: loadStorage('orders', [
        { id: 'o1', nomorOrder: 'ORD/SUMBAWA/001', branchId: 'sumbawa', tanggal: '2026-10-27', pemohon: 'Citra (Purchase Sumbawa)', urgensi: 'Biasa', status: 'MENUNGGU KONFIRMASI', items: 'Mergan House Bend (15 kg), Cup INJT + Lid (2 crtn)' },
        { id: 'o2', nomorOrder: 'ORD/URIP/002', branchId: 'urip', tanggal: '2026-10-27', pemohon: 'Eka (Purchase Urip)', urgensi: 'Mendesak / Stok Kritis', status: 'DIPROSES PURCHASE', items: 'Gula Aren Lumbung 33 (8 pcs), Hazelnut Dripp (2 crtn)' }
      ]),
      masterBahan: loadStorage('masterBahan', RAW_MASTER_BAHAN),
      modalOpen: null // 'KASIR', 'BELANJA', 'ORDER'
    };

    function formatRupiah(num) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
    }

    function renderOfficialLogo(size) {
      const boxClass = size === 'sm' ? 'w-8 h-8 border-2 text-[9px]' : 'w-11 h-11 border-[2.5px] text-xs';
      const textClass = size === 'sm' ? 'text-xl tracking-wider' : 'text-3xl tracking-widest';
      return \`
        <div class="inline-flex items-center space-x-2 select-none">
          <div class="\${boxClass} border-white flex flex-col items-center justify-center font-bold text-white shrink-0">
            <span>toko</span>
            <span class="-mt-0.5">kopi.</span>
          </div>
          <span class="\${textClass} font-black text-white uppercase tracking-widest font-sans">
            MERGAN
          </span>
        </div>
      \`;
    }

    // --- 2. RENDER FUNCTIONS ---
    function render() {
      const appEl = document.getElementById('app');

      // Check if user is logged in
      if (!state.currentUser) {
        appEl.innerHTML = renderLogin();
        return;
      }

      const branchTheme = state.activeBranchId === 'urip' ? 'from-emerald-950/20' : state.activeBranchId === 'madiun' ? 'from-blue-950/20' : 'from-amber-950/20';

      appEl.className = 'flex-1 flex flex-col bg-gradient-to-b ' + branchTheme + ' via-stone-900 to-stone-950';
      appEl.innerHTML = \`
        \${renderNavbar()}
        <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          \${renderHeader()}
          \${renderDashboard()}
          \${renderTabs()}
          \${renderTabContent()}
        </main>
        \${renderModal()}
        <footer class="border-t border-stone-800 bg-stone-950 py-4 text-center text-xs text-stone-500">
          Toko Kopi Mergan &copy; 2026. File HTML Standalone Lengkap dengan Daftar 51 Bahan Baku & 11 Akun Resmi.
        </footer>
      \`;
    }

    // --- LOGIN FORM ---
    function renderLogin() {
      return \`
        <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
          <div class="max-w-5xl w-full">
            <div class="text-center mb-6">
              <div class="inline-block p-4 bg-black rounded-2xl border border-stone-800 shadow-2xl mb-3">
                \${renderOfficialLogo('md')}
              </div>
              <h1 class="text-xl font-black text-white">Sistem Kasir, Operasional & Purchase Holding</h1>
              <p class="text-xs text-stone-400">Pusat Sumbawa • Cabang Urip Sumoharjo • Cabang Madiun</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
              <!-- Left Form -->
              <div class="md:col-span-5 bg-stone-850 border border-stone-800 p-6 rounded-2xl shadow-xl">
                <h2 class="text-sm font-bold text-white mb-4 pb-2 border-b border-stone-700">Login Pengguna</h2>
                <form onsubmit="handleLoginSubmit(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs font-semibold text-stone-300 mb-1">Username</label>
                    <input id="inputUser" type="text" placeholder="owner_holding" required class="w-full px-3 py-2 text-xs bg-stone-800 border border-stone-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-stone-300 mb-1">Password</label>
                    <input id="inputPass" type="password" placeholder="holding123" required class="w-full px-3 py-2 text-xs bg-stone-800 border border-stone-700 rounded-lg text-white" />
                  </div>
                  <button type="submit" class="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition cursor-pointer">
                    Masuk ke Sistem
                  </button>
                </form>
              </div>

              <!-- Right Quick Select 11 Accounts -->
              <div class="md:col-span-7 bg-stone-850 border border-stone-800 p-6 rounded-2xl shadow-xl">
                <h3 class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Pilih 11 Akun Resmi (1-Click Login):</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[400px] overflow-y-auto pr-1">
                  \${INITIAL_USERS.map(u => \`
                    <div class="bg-stone-900 border border-stone-800 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition">
                      <div>
                        <div class="flex items-center justify-between">
                          <span class="text-xs font-bold text-white">\${u.name}</span>
                          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">\${u.label}</span>
                        </div>
                        <p class="text-[10px] text-stone-400 mt-1 font-mono">user: <b class="text-amber-300">\${u.username}</b></p>
                      </div>
                      <button onclick="quickLogin('\${u.id}')" class="mt-2.5 py-1 px-2 text-[10px] font-bold rounded bg-amber-600/80 hover:bg-amber-500 text-white text-center cursor-pointer transition">
                        Masuk Langsung
                      </button>
                    </div>
                  \`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    // --- NAVBAR ---
    function renderNavbar() {
      const u = state.currentUser;
      const isHolding = u.role === 'OWNER_HOLDING' || u.role === 'PURCHASE_HOLDING';
      const curBranch = INITIAL_BRANCHES.find(b => b.id === state.activeBranchId) || INITIAL_BRANCHES[0];

      return \`
        <header class="bg-black border-b border-stone-800 sticky top-0 z-30 shadow-md">
          <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              \${renderOfficialLogo('sm')}
              <span class="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">\${curBranch.shortName}</span>
            </div>

            <div class="flex items-center space-x-3 text-xs">
              \${isHolding ? \`
                <select onchange="changeBranch(this.value)" class="bg-stone-900 text-white font-semibold px-2 py-1.5 rounded-lg border border-stone-700">
                  \${INITIAL_BRANCHES.map(b => \`<option value="\${b.id}" \${b.id === state.activeBranchId ? 'selected' : ''}>\${b.shortName}</option>\`).join('')}
                </select>
              \` : \`
                <span class="px-2.5 py-1 rounded bg-stone-900 text-white font-bold border border-stone-700">\${curBranch.shortName}</span>
              \`}

              <div class="hidden sm:block text-right">
                <p class="font-bold text-white text-xs">\${u.name}</p>
                <p class="text-[10px] text-stone-400">@\${u.username} (\${u.role})</p>
              </div>

              <button onclick="handleLogout()" class="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 font-bold hover:bg-rose-900 transition cursor-pointer">
                Keluar
              </button>
            </div>
          </div>
        </header>
      \`;
    }

    // --- HEADER WITH FAST INPUT BUTTONS & BRANCH THEMES ---
    function renderHeader() {
      const u = state.currentUser;
      const canInputKasir = u.role === 'KEPALA_TOKO' || u.role === 'OWNER_HOLDING';
      const canInputBelanja = u.role === 'KEPALA_TOKO' || u.role === 'PURCHASE_CABANG' || u.role === 'OWNER_HOLDING';
      const curBranch = INITIAL_BRANCHES.find(b => b.id === state.activeBranchId) || INITIAL_BRANCHES[0];

      let themeBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      let themeLabel = 'Warm Amber & Gold Roastery';
      if (curBranch.id === 'urip') {
        themeBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
        themeLabel = 'Fresh Mint & Emerald Espresso';
      } else if (curBranch.id === 'madiun') {
        themeBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
        themeLabel = 'Modern Sapphire & Cyber Wave';
      }

      return \`
        <div class="p-5 rounded-2xl bg-stone-850/80 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-lg font-black text-white">\${curBranch.name}</h1>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border \${themeBadge}">\${themeLabel}</span>
            </div>
            <p class="text-xs text-stone-400 mt-1">Input langsung rekap shift & belanja harian tanpa berpindah halaman.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            \${canInputKasir ? \`
              <button onclick="openModal('KASIR')" class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow transition cursor-pointer">
                + Input Shift Kasir
              </button>
            \` : ''}
            \${canInputBelanja ? \`
              <button onclick="openModal('BELANJA')" class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition cursor-pointer">
                + Input Belanja Bahan
              </button>
            \` : ''}
            <button onclick="openModal('ORDER')" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition cursor-pointer">
              + Order Restok ke Holding
            </button>
          </div>
        </div>
      \`;
    }

    // --- DASHBOARD STATS ---
    function renderDashboard() {
      const isHolding = state.currentUser.role === 'OWNER_HOLDING';
      const bShifts = state.shifts.filter(s => isHolding || s.branchId === state.activeBranchId);
      const bExp = state.expenses.filter(e => isHolding || e.branchId === state.activeBranchId);

      const totalCash = bShifts.reduce((a, b) => a + (b.cash || 0), 0);
      const totalQris = bShifts.reduce((a, b) => a + (b.qris || 0), 0);
      const totalOmzet = totalCash + totalQris;
      const totalBelanja = bExp.reduce((a, b) => a + (b.totalBiaya || 0), 0);
      const net = totalOmzet - totalBelanja;

      return \`
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-stone-850 p-4 rounded-xl border border-stone-800">
            <span class="text-xs text-stone-400">Total Omzet Kasir</span>
            <div class="text-xl font-black text-white mt-1">\${formatRupiah(totalOmzet)}</div>
            <div class="text-[11px] text-stone-400 mt-1">\${bShifts.length} shift tercatat</div>
          </div>
          <div class="bg-stone-850 p-4 rounded-xl border border-stone-800">
            <span class="text-xs text-stone-400">Tunai / Cash on Hand</span>
            <div class="text-xl font-black text-emerald-400 mt-1">\${formatRupiah(totalCash)}</div>
            <div class="text-[11px] text-stone-400 mt-1">QRIS: \${formatRupiah(totalQris)}</div>
          </div>
          <div class="bg-stone-850 p-4 rounded-xl border border-stone-800">
            <span class="text-xs text-stone-400">Belanja Bahan & Operasional</span>
            <div class="text-xl font-black text-rose-400 mt-1">\${formatRupiah(totalBelanja)}</div>
            <div class="text-[11px] text-stone-400 mt-1">\${bExp.length} transaksi belanja</div>
          </div>
          <div class="bg-stone-850 p-4 rounded-xl border border-stone-800">
            <span class="text-xs text-stone-400">Laba Bersih Operasional</span>
            <div class="text-xl font-black \${net >= 0 ? 'text-amber-400' : 'text-rose-400'} mt-1">\${formatRupiah(net)}</div>
            <div class="text-[11px] text-stone-400 mt-1">Margin: \${totalOmzet > 0 ? Math.round((net/totalOmzet)*100) : 0}%</div>
          </div>
        </div>
      \`;
    }

    // --- TABS ---
    function renderTabs() {
      const tabs = [
        { id: 'KASIR', label: 'Rekap Kasir (' + state.shifts.length + ')' },
        { id: 'BELANJA', label: 'Belanja Operasional (' + state.expenses.length + ')' },
        { id: 'ORDER', label: 'Order Restok Holding (' + state.orders.length + ')' },
        { id: 'MASTER', label: 'Master Bahan Baku (' + state.masterBahan.length + ' Item Resmi)' }
      ];

      return \`
        <div class="flex items-center space-x-2 border-b border-stone-800 mb-6 overflow-x-auto text-xs font-bold">
          \${tabs.map(t => \`
            <button onclick="setTab('\${t.id}')" class="px-4 py-2.5 rounded-t-lg transition cursor-pointer \${state.activeTab === t.id ? 'border-b-2 border-amber-500 text-amber-400 bg-stone-850' : 'text-stone-400 hover:text-white'}">
              \${t.label}
            </button>
          \`).join('')}
        </div>
      \`;
    }

    // --- TAB CONTENTS ---
    function renderTabContent() {
      const isHolding = state.currentUser.role === 'OWNER_HOLDING' || state.currentUser.role === 'PURCHASE_HOLDING';
      const bShifts = state.shifts.filter(s => isHolding || s.branchId === state.activeBranchId);
      const bExp = state.expenses.filter(e => isHolding || e.branchId === state.activeBranchId);
      const bOrd = state.orders.filter(o => isHolding || o.branchId === state.activeBranchId);

      if (state.activeTab === 'KASIR') {
        return \`
          <div class="bg-stone-850 rounded-2xl border border-stone-800 overflow-hidden shadow">
            <div class="p-4 border-b border-stone-800 flex items-center justify-between">
              <h3 class="font-bold text-sm text-white">Tabel Rekap Kasir Shift</h3>
              <button onclick="window.print()" class="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-semibold">Cetak Laporan</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-stone-900 text-stone-400 border-b border-stone-800">
                  <tr>
                    <th class="p-3">Tanggal / Hari</th>
                    <th class="p-3">Shift</th>
                    <th class="p-3">Kasir</th>
                    <th class="p-3 text-right">Cash</th>
                    <th class="p-3 text-right">QRIS</th>
                    <th class="p-3 text-right">Pengeluaran Kasir</th>
                    <th class="p-3 text-right font-bold text-white">Total Net</th>
                    <th class="p-3">Catatan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-300">
                  \${bShifts.length === 0 ? '<tr><td colspan="8" class="p-4 text-center text-stone-500">Belum ada data shift kasir.</td></tr>' :
                    bShifts.map(s => \`
                      <tr class="hover:bg-stone-800/40">
                        <td class="p-3 font-medium text-white">\${s.tanggal} <span class="text-stone-400">(\${s.hari})</span></td>
                        <td class="p-3">\${s.shift}</td>
                        <td class="p-3">\${s.person}</td>
                        <td class="p-3 text-right text-emerald-400 font-semibold">\${formatRupiah(s.cash)}</td>
                        <td class="p-3 text-right text-blue-400 font-semibold">\${formatRupiah(s.qris)}</td>
                        <td class="p-3 text-right text-rose-400">\${formatRupiah(s.belanjaKasir)}</td>
                        <td class="p-3 text-right font-bold text-amber-400">\${formatRupiah(s.totalNet)}</td>
                        <td class="p-3 text-stone-400 text-[11px]">\${s.catatan || '-'}</td>
                      </tr>
                    \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        \`;
      }

      if (state.activeTab === 'BELANJA') {
        return \`
          <div class="bg-stone-850 rounded-2xl border border-stone-800 overflow-hidden shadow">
            <div class="p-4 border-b border-stone-800">
              <h3 class="font-bold text-sm text-white">Tabel Pengeluaran Belanja Operasional Harian</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-stone-900 text-stone-400 border-b border-stone-800">
                  <tr>
                    <th class="p-3">Tanggal</th>
                    <th class="p-3">Rincian Barang</th>
                    <th class="p-3">Kategori</th>
                    <th class="p-3 text-right">Harga Satuan</th>
                    <th class="p-3 text-center">Jumlah</th>
                    <th class="p-3 text-right font-bold text-white">Total Biaya</th>
                    <th class="p-3">Petugas</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-300">
                  \${bExp.length === 0 ? '<tr><td colspan="7" class="p-4 text-center text-stone-500">Belum ada data belanja operasional.</td></tr>' :
                    bExp.map(e => \`
                      <tr class="hover:bg-stone-800/40">
                        <td class="p-3">\${e.tanggal}</td>
                        <td class="p-3 font-semibold text-white">\${e.rincianBarang}</td>
                        <td class="p-3"><span class="px-2 py-0.5 rounded bg-stone-800 text-amber-300 text-[10px]">\${e.kategori}</span></td>
                        <td class="p-3 text-right">\${formatRupiah(e.hargaSatuan)}</td>
                        <td class="p-3 text-center">\${e.kuantitas} \${e.satuan}</td>
                        <td class="p-3 text-right font-bold text-rose-400">\${formatRupiah(e.totalBiaya)}</td>
                        <td class="p-3 text-stone-400">\${e.personPurchase}</td>
                      </tr>
                    \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        \`;
      }

      if (state.activeTab === 'ORDER') {
        return \`
          <div class="bg-stone-850 rounded-2xl border border-stone-800 overflow-hidden shadow">
            <div class="p-4 border-b border-stone-800">
              <h3 class="font-bold text-sm text-white">Daftar Permintaan Restok ke Purchase Holding</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-stone-900 text-stone-400 border-b border-stone-800">
                  <tr>
                    <th class="p-3">No. Order</th>
                    <th class="p-3">Cabang</th>
                    <th class="p-3">Tanggal</th>
                    <th class="p-3">Daftar Item</th>
                    <th class="p-3">Status</th>
                    <th class="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-300">
                  \${bOrd.length === 0 ? '<tr><td colspan="6" class="p-4 text-center text-stone-500">Belum ada order restok.</td></tr>' :
                    bOrd.map(o => \`
                      <tr class="hover:bg-stone-800/40">
                        <td class="p-3 font-mono font-bold text-amber-400">\${o.nomorOrder}</td>
                        <td class="p-3 font-bold text-white capitalize">\${o.branchId}</td>
                        <td class="p-3 text-stone-400">\${o.tanggal}</td>
                        <td class="p-3 text-stone-200">\${o.items}</td>
                        <td class="p-3">
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold \${o.status === 'SELESAI / TERKIRIM' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}">
                            \${o.status}
                          </span>
                        </td>
                        <td class="p-3 text-right">
                          \${isHolding && o.status !== 'SELESAI / TERKIRIM' ? \`
                            <button onclick="updateOrderStatus('\${o.id}', 'SELESAI / TERKIRIM')" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]">
                              Tandai Kirim
                            </button>
                          \` : '<span class="text-stone-500 text-[10px]">Tersinkron</span>'}
                        </td>
                      </tr>
                    \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        \`;
      }

      if (state.activeTab === 'MASTER') {
        return \`
          <div class="bg-stone-850 rounded-2xl border border-stone-800 overflow-hidden shadow">
            <div class="p-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-sm text-white">Master Bahan Baku Resmi Toko Kopi Mergan</h3>
                <p class="text-xs text-stone-400">Total \${state.masterBahan.length} item baku sesuai lampiran resmi holding</p>
              </div>
            </div>
            <div class="overflow-x-auto max-h-[550px]">
              <table class="w-full text-xs text-left">
                <thead class="bg-stone-900 text-stone-400 border-b border-stone-800 sticky top-0">
                  <tr>
                    <th class="p-3">Kategori</th>
                    <th class="p-3">Merek Barang</th>
                    <th class="p-3">Satuan</th>
                    <th class="p-3">Tempat Pembelian / Supplier</th>
                    <th class="p-3 text-right">Harga Resmi Satuan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-300">
                  \${state.masterBahan.map(m => \`
                    <tr class="hover:bg-stone-800/40">
                      <td class="p-3"><span class="px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-semibold text-[10px]">\${m.kategori}</span></td>
                      <td class="p-3 font-semibold text-white">\${m.merekBarang}</td>
                      <td class="p-3 text-stone-400">\${m.satuan}</td>
                      <td class="p-3 text-stone-400">\${m.tempatPembelian || '-'}</td>
                      <td class="p-3 text-right font-bold text-amber-400">\${m.hargaSatuan > 0 ? formatRupiah(m.hargaSatuan) : '<span class="text-stone-500 font-normal">Opsional</span>'}</td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        \`;
      }

      return '';
    }

    // --- MODAL POPUP FOR DIRECT INPUT (No page navigation!) ---
    function renderModal() {
      if (!state.modalOpen) return '';

      if (state.modalOpen === 'KASIR') {
        return \`
          <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div class="bg-stone-850 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 class="text-base font-bold text-white mb-4">Input Rekap Kasir Shift</h3>
              <form onsubmit="handleKasirSubmit(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-stone-300 mb-1">Tanggal</label>
                  <input id="mkTanggal" type="date" required value="\${new Date().toISOString().slice(0, 10)}" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                </div>
                <div>
                  <label class="block text-stone-300 mb-1">Shift</label>
                  <select id="mkShift" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white">
                    <option>Shift 1 (Pagi 07:00 - 15:00)</option>
                    <option>Shift 2 (Malam 15:00 - 23:00)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-stone-300 mb-1">Nama Kasir</label>
                  <input id="mkPerson" type="text" required placeholder="Contoh: Rizky" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-stone-300 mb-1">Uang Tunai (Cash)</label>
                    <input id="mkCash" type="number" required placeholder="0" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                  </div>
                  <div>
                    <label class="block text-stone-300 mb-1">QRIS / Non-Tunai</label>
                    <input id="mkQris" type="number" required placeholder="0" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                  </div>
                </div>
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label class="block text-stone-300 font-semibold">Belanja Kasir (Rp) 🔒</label>
                    <span class="text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">Terkunci Otomatis (Purchase)</span>
                  </div>
                  <input id="mkBelanja" type="number" readonly value="\${state.expenses.filter(e => e.branchId === state.activeBranchId && e.tanggal === new Date().toISOString().slice(0, 10)).reduce((s, e) => s + (e.totalBiaya || 0), 0)}" class="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded text-amber-400 font-bold cursor-not-allowed select-none" />
                  <p class="text-[10px] text-stone-400 mt-1">Nilai belanja tersinkron otomatis dari nota tim Purchase pada tanggal ini. Kasir tidak dapat mengubah langsung.</p>
                </div>
                <div class="flex justify-end space-x-2 pt-3 border-t border-stone-800">
                  <button type="button" onclick="closeModal()" class="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-semibold">Batal</button>
                  <button type="submit" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold">Simpan Shift</button>
                </div>
              </form>
            </div>
          </div>
        \`;
      }

      if (state.modalOpen === 'BELANJA') {
        return \`
          <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div class="bg-stone-850 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 class="text-base font-bold text-white mb-4">Input Belanja Bahan Baku Harian</h3>
              <form onsubmit="handleBelanjaSubmit(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-stone-300 mb-1">Pilih dari Master Bahan Baku</label>
                  <select id="mbMasterSelect" onchange="autoFillBelanja(this.value)" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white">
                    <option value="">-- Pilih Bahan Baku Resmi --</option>
                    \${state.masterBahan.map((m, idx) => \`<option value="\${idx}">\${m.merekBarang} (\${m.kategori}) - \${m.satuan}</option>\`).join('')}
                  </select>
                </div>
                <div>
                  <label class="block text-stone-300 mb-1">Rincian Barang</label>
                  <input id="mbBarang" type="text" required placeholder="Contoh: Mergan House Bend" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-stone-300 mb-1">Kategori</label>
                    <select id="mbKategori" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white">
                      <option>Beans</option>
                      <option>Freshmilk</option>
                      <option>UHT</option>
                      <option>SKM</option>
                      <option>Syrup</option>
                      <option>Cair</option>
                      <option>Krimer</option>
                      <option>Powder</option>
                      <option>Topping</option>
                      <option>Non Bahan Baku</option>
                      <option>Cleo</option>
                      <option>Cup</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-stone-300 mb-1">Satuan</label>
                    <input id="mbSatuan" type="text" required placeholder="kg / crtn / dus" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-stone-300 mb-1">Harga Satuan (Rp)</label>
                    <input id="mbHarga" type="number" required placeholder="165000" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                  </div>
                  <div>
                    <label class="block text-stone-300 mb-1">Kuantitas</label>
                    <input id="mbQty" type="number" required value="1" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                  </div>
                </div>
                <div>
                  <label class="block text-stone-300 mb-1">Petugas Pembeli</label>
                  <input id="mbPetugas" type="text" required placeholder="Nama petugas purchase / kepala toko" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                </div>
                <div class="flex justify-end space-x-2 pt-3 border-t border-stone-800">
                  <button type="button" onclick="closeModal()" class="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-semibold">Batal</button>
                  <button type="submit" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold">Simpan Belanja</button>
                </div>
              </form>
            </div>
          </div>
        \`;
      }

      if (state.modalOpen === 'ORDER') {
        return \`
          <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div class="bg-stone-850 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 class="text-base font-bold text-white mb-4">Buat Order Restok ke Purchase Holding</h3>
              <form onsubmit="handleOrderSubmit(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block text-stone-300 mb-1">Pilih Barang dari Master Resmi</label>
                  <select id="moItem" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white">
                    \${state.masterBahan.map(m => \`<option value="\${m.merekBarang} (\${m.satuan})">\${m.merekBarang} - \${m.satuan}</option>\`).join('')}
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-stone-300 mb-1">Kuantitas Dibutuhkan</label>
                    <input id="moQty" type="number" required placeholder="10" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                  </div>
                  <div>
                    <label class="block text-stone-300 mb-1">Urgensi</label>
                    <select id="moUrgent" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white">
                      <option>Biasa</option>
                      <option>Mendesak / Stok Kritis</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-stone-300 mb-1">Catatan Pengiriman</label>
                  <input id="moNote" type="text" placeholder="Catatan ke tim purchase holding" class="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white" />
                </div>
                <div class="flex justify-end space-x-2 pt-3 border-t border-stone-800">
                  <button type="button" onclick="closeModal()" class="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-semibold">Batal</button>
                  <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold">Kirim Order Restok</button>
                </div>
              </form>
            </div>
          </div>
        \`;
      }

      return '';
    }

    // --- 3. EVENT HANDLERS ---
    function handleLoginSubmit(e) {
      e.preventDefault();
      const uVal = document.getElementById('inputUser').value.trim().toLowerCase();
      const pVal = document.getElementById('inputPass').value.trim();
      const found = INITIAL_USERS.find(u => u.username.toLowerCase() === uVal);
      if (!found) {
        alert('Username tidak ditemukan.');
        return;
      }
      if (found.password && found.password !== pVal) {
        alert('Password salah.');
        return;
      }
      state.currentUser = found;
      if (found.branchId !== 'all') state.activeBranchId = found.branchId;
      saveStorage('currentUser', state.currentUser);
      saveStorage('activeBranchId', state.activeBranchId);
      render();
    }

    function quickLogin(userId) {
      const found = INITIAL_USERS.find(u => u.id === userId);
      if (found) {
        state.currentUser = found;
        if (found.branchId !== 'all') state.activeBranchId = found.branchId;
        saveStorage('currentUser', state.currentUser);
        saveStorage('activeBranchId', state.activeBranchId);
        render();
      }
    }

    function handleLogout() {
      state.currentUser = null;
      saveStorage('currentUser', null);
      render();
    }

    function changeBranch(bId) {
      state.activeBranchId = bId;
      saveStorage('activeBranchId', bId);
      render();
    }

    function setTab(tab) {
      state.activeTab = tab;
      render();
    }

    function openModal(modal) {
      state.modalOpen = modal;
      render();
    }

    function closeModal() {
      state.modalOpen = null;
      render();
    }

    function autoFillBelanja(idx) {
      if (idx === '') return;
      const item = state.masterBahan[parseInt(idx, 10)];
      if (item) {
        document.getElementById('mbBarang').value = item.merekBarang;
        document.getElementById('mbKategori').value = item.kategori;
        document.getElementById('mbSatuan').value = item.satuan;
        document.getElementById('mbHarga').value = item.hargaSatuan || 0;
      }
    }

    function handleKasirSubmit(e) {
      e.preventDefault();
      const cash = parseFloat(document.getElementById('mkCash').value) || 0;
      const qris = parseFloat(document.getElementById('mkQris').value) || 0;
      const tgl = document.getElementById('mkTanggal').value;
      const dailyExpenses = state.expenses.filter(exp => exp.branchId === state.activeBranchId && exp.tanggal === tgl);
      const autoBelanja = dailyExpenses.reduce((s, exp) => s + (exp.totalBiaya || 0), 0);
      const newShift = {
        id: 'shift-' + Date.now(),
        branchId: state.activeBranchId,
        tanggal: tgl,
        hari: 'Hari Ini',
        shift: document.getElementById('mkShift').value,
        person: document.getElementById('mkPerson').value,
        cash: cash,
        qris: qris,
        belanjaKasir: autoBelanja,
        totalNet: cash + qris - autoBelanja,
        catatan: 'Tersinkron belanja purchase: ' + dailyExpenses.length + ' nota'
      };
      state.shifts.unshift(newShift);
      saveStorage('shifts', state.shifts);
      closeModal();
    }

    function handleBelanjaSubmit(e) {
      e.preventDefault();
      const harga = parseFloat(document.getElementById('mbHarga').value) || 0;
      const qty = parseFloat(document.getElementById('mbQty').value) || 0;
      const newExp = {
        id: 'exp-' + Date.now(),
        branchId: state.activeBranchId,
        tanggal: new Date().toISOString().slice(0, 10),
        shift: 'Shift 1 (Pagi)',
        rincianBarang: document.getElementById('mbBarang').value,
        kategori: document.getElementById('mbKategori').value,
        satuan: document.getElementById('mbSatuan').value,
        hargaSatuan: harga,
        kuantitas: qty,
        totalBiaya: harga * qty,
        personPurchase: document.getElementById('mbPetugas').value
      };
      state.expenses.unshift(newExp);
      saveStorage('expenses', state.expenses);
      closeModal();
    }

    function handleOrderSubmit(e) {
      e.preventDefault();
      const itemText = document.getElementById('moItem').value;
      const qty = document.getElementById('moQty').value;
      const count = state.orders.length + 1;
      const newOrd = {
        id: 'ord-' + Date.now(),
        nomorOrder: 'ORD/' + state.activeBranchId.toUpperCase() + '/' + String(count).padStart(3, '0'),
        branchId: state.activeBranchId,
        tanggal: new Date().toISOString().slice(0, 10),
        pemohon: state.currentUser ? state.currentUser.name : 'Purchase Cabang',
        urgensi: document.getElementById('moUrgent').value,
        status: 'MENUNGGU KONFIRMASI',
        items: itemText + ' x ' + qty + (document.getElementById('moNote').value ? ' [' + document.getElementById('moNote').value + ']' : '')
      };
      state.orders.unshift(newOrd);
      saveStorage('orders', state.orders);
      closeModal();
    }

    function updateOrderStatus(id, newStatus) {
      const idx = state.orders.findIndex(o => o.id === id);
      if (idx !== -1) {
        state.orders[idx].status = newStatus;
        saveStorage('orders', state.orders);
        render();
      }
    }

    // Init App
    render();
  </script>
</body>
</html>`;
}
