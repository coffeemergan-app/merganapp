import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Check,
  Edit2,
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { Branch, User, UserRole } from '../types';

interface UserManagementModalProps {
  users: User[];
  branches: Branch[];
  currentUser: User;
  onClose: () => void;
  onSaveUsers: (users: User[]) => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  users,
  branches,
  currentUser,
  onClose,
  onSaveUsers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');

  // Form state for Add/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('PURCHASE_CABANG');
  const [formBranchId, setFormBranchId] = useState('sumbawa');
  const [formRoleLabel, setFormRoleLabel] = useState('');
  const [formRoleDescription, setFormRoleDescription] = useState('');
  const [formPermissions, setFormPermissions] = useState<string>('');

  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [successMsg, setSuccessMsg] = useState('');

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAddForm = () => {
    setEditingUserId(null);
    setFormName('');
    setFormUsername('');
    setFormPassword('mergan123');
    setFormEmail('');
    setFormRole('PURCHASE_CABANG');
    setFormBranchId('sumbawa');
    setFormRoleLabel('Purchase Cabang');
    setFormRoleDescription('Pengadaan bahan baku lokal & buat permintaan order ke holding');
    setFormPermissions('Input Belanja Harian, Buat Order Restok ke Holding, Cek Katalog Harga');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (u: User) => {
    setEditingUserId(u.id);
    setFormName(u.name);
    setFormUsername(u.username);
    setFormPassword(u.password || '');
    setFormEmail(u.email || '');
    setFormRole(u.role);
    setFormBranchId(u.branchId);
    setFormRoleLabel(u.roleLabel);
    setFormRoleDescription(u.roleDescription);
    setFormPermissions((u.permissions || []).join(', '));
    setIsFormOpen(true);
  };

  const handleRoleChangeInForm = (role: UserRole) => {
    setFormRole(role);
    if (role === 'OWNER_HOLDING') {
      setFormBranchId('all');
      setFormRoleLabel('Owner Holding');
      setFormRoleDescription('Full akses seluruh cabang & konsolidasi (Mode Audit Read-Only, Tanpa Izin Edit)');
      setFormPermissions('Full Akses Konsolidasi 3 Cabang (Read-Only), Audit Total Omzet, Belanja, Gaji & Absensi, Kelola Hak Akses Pengguna');
    } else if (role === 'PURCHASE_HOLDING') {
      setFormBranchId('all');
      setFormRoleLabel('Purchase Holding');
      setFormRoleDescription('Pengadaan barang baku holding. Full akses logistik; HANYA BISA EDIT Master Bahan Baku & Konfirmasi Order Barang.');
      setFormPermissions('Bisa Edit & Tambah List Master Bahan Baku, Bisa Konfirmasi Status Order Barang Cabang, Monitor Stok Kritis Cabang');
    } else if (role === 'OWNER_CABANG') {
      setFormRoleLabel(`Owner Cabang ${formBranchId}`);
      setFormRoleDescription('Full akses monitoring finansial & operasional cabang (Mode Audit Read-Only, Tanpa Izin Edit)');
      setFormPermissions('Full Akses Audit Cabang, Audit Kasir Harian, Audit Belanja & Order, Audit Absensi & Slip Gaji');
    } else if (role === 'KEPALA_TOKO') {
      setFormRoleLabel(`Kepala Toko ${formBranchId}`);
      setFormRoleDescription('Operasional toko cabang. Izin Input: Form Rekap Kasir Harian, Absen Karyawan, dan Gaji Karyawan.');
      setFormPermissions('Input Form Rekap Kasir Harian, Input Form Absen Karyawan Harian, Input Form Gaji Karyawan & Slip');
    } else if (role === 'PURCHASE_CABANG') {
      setFormRoleLabel(`Purchase Cabang ${formBranchId}`);
      setFormRoleDescription('Pengadaan cabang. Izin Input: Belanja Harian Cabang dan Order Barang Restok ke Holding.');
      setFormPermissions('Input Form Belanja Harian Cabang, Input Form Order Barang ke Holding, Cek Master Katalog Harga');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formUsername.trim() || !formName.trim()) {
      alert('Nama dan Username wajib diisi.');
      return;
    }

    const permsArray = formPermissions
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (editingUserId) {
      // Edit Existing
      const updated = users.map((u) => {
        if (u.id === editingUserId) {
          return {
            ...u,
            name: formName.trim(),
            username: formUsername.trim().toLowerCase(),
            password: formPassword.trim(),
            email: formEmail.trim(),
            role: formRole,
            branchId: formRole === 'OWNER_HOLDING' || formRole === 'PURCHASE_HOLDING' ? 'all' : formBranchId,
            roleLabel: formRoleLabel.trim() || formRole,
            roleDescription: formRoleDescription.trim(),
            permissions: permsArray,
          };
        }
        return u;
      });
      onSaveUsers(updated);
      setSuccessMsg(`Akun "${formName}" berhasil diperbarui.`);
    } else {
      // Add New
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formName.trim(),
        username: formUsername.trim().toLowerCase(),
        password: formPassword.trim(),
        email: formEmail.trim(),
        role: formRole,
        branchId: formRole === 'OWNER_HOLDING' || formRole === 'PURCHASE_HOLDING' ? 'all' : formBranchId,
        roleLabel: formRoleLabel.trim() || formRole,
        roleDescription: formRoleDescription.trim(),
        permissions: permsArray,
      };
      onSaveUsers([...users, newUser]);
      setSuccessMsg(`Akun "${formName}" berhasil ditambahkan.`);
    }

    setIsFormOpen(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (userId === currentUser.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus akun "${userName}"?`)) {
      const updated = users.filter((u) => u.id !== userId);
      onSaveUsers(updated);
      setSuccessMsg(`Akun "${userName}" berhasil dihapus.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.branchId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesBranch = branchFilter === 'ALL' || u.branchId === branchFilter;

    return matchesSearch && matchesRole && matchesBranch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  Pengaturan &amp; Manajemen Seluruh Akun (Owner Holding)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Total: {users.length} Akun
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Kelola hak akses RBAC, tambah akun baru, ubah password, dan atur penugasan cabang.
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

        {/* Action & Filter Toolbar */}
        <div className="p-4 bg-white border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Cari nama, user, cabang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">Semua Peran</option>
              <option value="OWNER_HOLDING">Owner Holding</option>
              <option value="PURCHASE_HOLDING">Purchase Holding</option>
              <option value="OWNER_CABANG">Owner Cabang</option>
              <option value="KEPALA_TOKO">Kepala Toko</option>
              <option value="PURCHASE_CABANG">Purchase Cabang</option>
            </select>

            {/* Branch Filter */}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">Semua Lokasi</option>
              <option value="all">Holding (Pusat)</option>
              <option value="sumbawa">Pusat Sumbawa</option>
              <option value="urip">Cabang Urip</option>
              <option value="madiun">Cabang Madiun</option>
            </select>
          </div>

          <button
            onClick={handleOpenAddForm}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        </div>

        {successMsg && (
          <div className="mx-4 mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* User Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200 font-bold">
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">Peran / Role</th>
                  <th className="p-3">Cabang / Wilayah</th>
                  <th className="p-3">Password</th>
                  <th className="p-3">Hak Akses Utama</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400">
                      Tidak ditemukan akun yang cocok dengan pencarian / filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isCurrentUser = u.id === currentUser.id;
                    const showPass = showPasswords[u.id] || false;

                    let roleBadge = 'bg-stone-100 text-stone-700 border-stone-200';
                    if (u.role === 'OWNER_HOLDING') {
                      roleBadge = 'bg-purple-50 text-purple-800 border-purple-200';
                    } else if (u.role === 'PURCHASE_HOLDING') {
                      roleBadge = 'bg-orange-50 text-orange-800 border-orange-200';
                    } else if (u.role === 'OWNER_CABANG') {
                      roleBadge = 'bg-indigo-50 text-indigo-800 border-indigo-200';
                    } else if (u.role === 'PURCHASE_CABANG') {
                      roleBadge = 'bg-cyan-50 text-cyan-800 border-cyan-200';
                    } else {
                      roleBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    }

                    return (
                      <tr key={u.id} className="hover:bg-stone-50/80 transition">
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-stone-900">{u.name}</span>
                            {isCurrentUser && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white">
                                Anda
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-amber-800 font-semibold">
                            @{u.username}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadge}`}>
                            {u.roleLabel || u.role}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="capitalize font-semibold text-stone-700">
                            {u.branchId === 'all' ? 'Holding (Semua Cabang)' : u.branchId}
                          </span>
                        </td>

                        <td className="p-3 font-mono">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-stone-700 font-bold">
                              {showPass ? u.password : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(u.id)}
                              className="text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
                            >
                              {showPass ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(u.permissions || []).slice(0, 2).map((perm, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-700"
                              >
                                {perm}
                              </span>
                            ))}
                            {(u.permissions || []).length > 2 && (
                              <span className="text-[9px] text-stone-400 font-bold">
                                +{(u.permissions || []).length - 2} lagi
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenEditForm(u)}
                              title="Edit Akun"
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 transition cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {!isCurrentUser && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                title="Hapus Akun"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form: Add / Edit User */}
        {isFormOpen && (
          <div className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scale-up">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-amber-600" />
                  <span>{editingUserId ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}</span>
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Citra (Purchase Cabang Sumbawa)"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Username</label>
                    <input
                      type="text"
                      required
                      placeholder="purchase_sumbawa"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Password</label>
                    <input
                      type="text"
                      required
                      placeholder="Password login"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Peran (Role)</label>
                    <select
                      value={formRole}
                      onChange={(e) => handleRoleChangeInForm(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="OWNER_HOLDING">Owner Holding</option>
                      <option value="PURCHASE_HOLDING">Purchase Holding</option>
                      <option value="OWNER_CABANG">Owner Cabang</option>
                      <option value="KEPALA_TOKO">Kepala Toko Cabang</option>
                      <option value="PURCHASE_CABANG">Purchase Cabang</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Penugasan Cabang</label>
                    <select
                      value={formBranchId}
                      onChange={(e) => setFormBranchId(e.target.value)}
                      disabled={formRole === 'OWNER_HOLDING' || formRole === 'PURCHASE_HOLDING'}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    >
                      <option value="sumbawa">Pusat Sumbawa</option>
                      <option value="urip">Cabang Urip</option>
                      <option value="madiun">Cabang Madiun</option>
                      {(formRole === 'OWNER_HOLDING' || formRole === 'PURCHASE_HOLDING') && (
                        <option value="all">Semua Cabang (Holding)</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Label Jabatan</label>
                  <input
                    type="text"
                    value={formRoleLabel}
                    onChange={(e) => setFormRoleLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Deskripsi Wewenang</label>
                  <input
                    type="text"
                    value={formRoleDescription}
                    onChange={(e) => setFormRoleDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Daftar Hak Akses (Pisahkan tanda koma)
                  </label>
                  <textarea
                    rows={2}
                    value={formPermissions}
                    onChange={(e) => setFormPermissions(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs"
                  >
                    Simpan Akun
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 bg-stone-50/50">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Setiap akun memiliki proteksi granular dan sinkron dengan Firebase.</span>
          </div>
          <button
            onClick={onClose}
            className="mt-2 sm:mt-0 px-4 py-1.5 bg-stone-900 hover:bg-black text-white font-bold rounded-lg cursor-pointer transition shadow-xs"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
