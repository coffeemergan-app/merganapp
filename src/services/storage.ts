import {
  INITIAL_ABSENSI,
  INITIAL_BRANCHES,
  INITIAL_EXPENSES,
  INITIAL_GAJI,
  INITIAL_KARYAWAN,
  INITIAL_MASTER_BAHAN_BAKU,
  INITIAL_ORDERS,
  INITIAL_SHIFTS,
  INITIAL_USERS,
} from '../data/initialData';
import {
  AbsensiRecord,
  Branch,
  BranchOrder,
  DailyExpense,
  GajiRecord,
  KaryawanRecord,
  MasterBahanBaku,
  SetorTunai3HariRecord,
  ShiftRekap,
  User,
} from '../types';

const STORAGE_KEYS = {
  BRANCHES: 'mergan_branches_v5',
  USERS: 'mergan_users_v5',
  CURRENT_USER: 'mergan_current_user_v5',
  IS_LOGGED_IN: 'mergan_is_logged_in_v5',
  ACTIVE_BRANCH_ID: 'mergan_active_branch_id_v5',
  SHIFTS: 'mergan_shifts_v5',
  EXPENSES: 'mergan_expenses_v5',
  ORDERS: 'mergan_orders_v5',
  MASTER_BAHAN_BAKU: 'mergan_master_bahan_baku_v5',
  SETOR_TUNAI: 'mergan_setor_tunai_v5',
  KARYAWAN: 'mergan_karyawan_v5',
  ABSENSI: 'mergan_absensi_v5',
  GAJI: 'mergan_gaji_v5',
};

export class StorageService {
  // Branches
  static getBranches(): Branch[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRANCHES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
        return INITIAL_BRANCHES;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
      return INITIAL_BRANCHES;
    } catch {
      return INITIAL_BRANCHES;
    }
  }

  static getBranchById(id: string): Branch | undefined {
    return this.getBranches().find((b) => b.id === id);
  }

  // Users Management
  static getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static addUser(user: User): User {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
    return user;
  }

  static updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }
    // Update session user if self-edited
    const cur = this.getCurrentUser();
    if (cur.id === updatedUser.id) {
      this.setCurrentUser(updatedUser);
    }
  }

  static deleteUser(userId: string): void {
    const users = this.getUsers().filter((u) => u.id !== userId);
    this.saveUsers(users);
  }

  static resetUsersToDefault(): User[] {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }

  // Authentication
  static isAuthenticated(): boolean {
    const status = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return status === 'true';
  }

  static getCurrentUser(): User {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.id && parsed.role) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_USERS[0]; // Default: Owner Holding
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    if (user.branchId !== 'all') {
      this.setActiveBranchId(user.branchId);
    }
  }

  static login(username: string, password?: string): { success: boolean; user?: User; message?: string } {
    const users = this.getUsers();
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!foundUser) {
      return { success: false, message: 'Username tidak ditemukan dalam sistem.' };
    }

    if (password && foundUser.password && foundUser.password !== password.trim()) {
      return { success: false, message: 'Password salah. Silakan periksa kembali.' };
    }

    this.setCurrentUser(foundUser);
    return { success: true, user: foundUser };
  }

  static logout(): void {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
  }

  static getActiveBranchId(): string {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_BRANCH_ID);
    return data || 'sumbawa';
  }

  static setActiveBranchId(branchId: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BRANCH_ID, branchId);
  }

  // Master Bahan Baku (Holding Catalog shared to all branches)
  static getMasterBahanBaku(): MasterBahanBaku[] {
    const data = localStorage.getItem(STORAGE_KEYS.MASTER_BAHAN_BAKU);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MASTER_BAHAN_BAKU, JSON.stringify(INITIAL_MASTER_BAHAN_BAKU));
      return INITIAL_MASTER_BAHAN_BAKU;
    }
    return JSON.parse(data);
  }

  static saveMasterBahanBaku(items: MasterBahanBaku[]): void {
    localStorage.setItem(STORAGE_KEYS.MASTER_BAHAN_BAKU, JSON.stringify(items));
  }

  static addMasterBahanBaku(item: Omit<MasterBahanBaku, 'id'>): MasterBahanBaku {
    const items = this.getMasterBahanBaku();
    const newItem: MasterBahanBaku = {
      ...item,
      id: `mb-${Date.now()}`,
    };
    items.unshift(newItem);
    this.saveMasterBahanBaku(items);
    return newItem;
  }

  static updateMasterBahanBaku(item: MasterBahanBaku): void {
    const items = this.getMasterBahanBaku();
    const index = items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      items[index] = item;
      this.saveMasterBahanBaku(items);
    }
  }

  static deleteMasterBahanBaku(id: string): void {
    const items = this.getMasterBahanBaku().filter((i) => i.id !== id);
    this.saveMasterBahanBaku(items);
  }

  // Shift Rekap
  static getShifts(): ShiftRekap[] {
    const data = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(INITIAL_SHIFTS));
      return INITIAL_SHIFTS;
    }
    return JSON.parse(data);
  }

  static saveShifts(shifts: ShiftRekap[]): void {
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  }

  static addShift(shift: Omit<ShiftRekap, 'id' | 'createdAt'>): ShiftRekap {
    const shifts = this.getShifts();
    const newShift: ShiftRekap = {
      ...shift,
      id: `shift-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    shifts.unshift(newShift);
    this.saveShifts(shifts);
    return newShift;
  }

  static deleteShift(id: string): void {
    const shifts = this.getShifts().filter((s) => s.id !== id);
    this.saveShifts(shifts);
  }

  // Daily Expenses
  static getExpenses(): DailyExpense[] {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(data);
  }

  static saveExpenses(expenses: DailyExpense[]): void {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  static addExpense(expense: Omit<DailyExpense, 'id' | 'createdAt'>): DailyExpense {
    const expenses = this.getExpenses();
    const newExpense: DailyExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    expenses.unshift(newExpense);
    this.saveExpenses(expenses);
    return newExpense;
  }

  static deleteExpense(id: string): void {
    const expenses = this.getExpenses().filter((e) => e.id !== id);
    this.saveExpenses(expenses);
  }

  // Branch Orders
  static getOrders(): BranchOrder[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  }

  static saveOrders(orders: BranchOrder[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  static addOrder(order: Omit<BranchOrder, 'id' | 'createdAt' | 'nomorOrder'>): BranchOrder {
    const orders = this.getOrders();
    const count = orders.length + 1;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const nomorOrder = `ORD/${order.branchId.toUpperCase()}/${dateStr}/${String(count).padStart(3, '0')}`;

    const newOrder: BranchOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      nomorOrder,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  static updateOrderStatus(orderId: string, status: BranchOrder['status']): void {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      this.saveOrders(orders);
    }
  }

  static deleteOrder(id: string): void {
    const orders = this.getOrders().filter((o) => o.id !== id);
    this.saveOrders(orders);
  }

  // Setor Tunai
  static getSetorTunai(): SetorTunai3HariRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.SETOR_TUNAI);
    return data ? JSON.parse(data) : [];
  }

  static saveSetorTunai(records: SetorTunai3HariRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.SETOR_TUNAI, JSON.stringify(records));
  }

  // Karyawan
  static getKaryawan(branchId?: string): KaryawanRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KARYAWAN);
      let list: KaryawanRecord[] = [];
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.KARYAWAN, JSON.stringify(INITIAL_KARYAWAN));
        list = INITIAL_KARYAWAN;
      } else {
        list = JSON.parse(data);
      }
      if (branchId && branchId !== 'all') {
        return list.filter((k) => k.branchId === branchId);
      }
      return list;
    } catch {
      return INITIAL_KARYAWAN;
    }
  }

  static saveKaryawan(karyawanList: KaryawanRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.KARYAWAN, JSON.stringify(karyawanList));
  }

  // Absensi Karyawan
  static getAbsensi(branchId?: string): AbsensiRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ABSENSI);
      let list: AbsensiRecord[] = [];
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ABSENSI, JSON.stringify(INITIAL_ABSENSI));
        list = INITIAL_ABSENSI;
      } else {
        list = JSON.parse(data);
      }
      if (branchId && branchId !== 'all') {
        return list.filter((a) => a.branchId === branchId);
      }
      return list;
    } catch {
      return INITIAL_ABSENSI;
    }
  }

  static saveAbsensi(list: AbsensiRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.ABSENSI, JSON.stringify(list));
  }

  static addAbsensi(item: Omit<AbsensiRecord, 'id' | 'createdAt'>): AbsensiRecord {
    const all = this.getAbsensi();
    const newRecord: AbsensiRecord = {
      ...item,
      id: `abs-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newRecord);
    this.saveAbsensi(all);
    return newRecord;
  }

  static deleteAbsensi(id: string): void {
    const all = this.getAbsensi().filter((a) => a.id !== id);
    this.saveAbsensi(all);
  }

  // Gaji Karyawan
  static getGaji(branchId?: string): GajiRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAJI);
      let list: GajiRecord[] = [];
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.GAJI, JSON.stringify(INITIAL_GAJI));
        list = INITIAL_GAJI;
      } else {
        list = JSON.parse(data);
      }
      if (branchId && branchId !== 'all') {
        return list.filter((g) => g.branchId === branchId);
      }
      return list;
    } catch {
      return INITIAL_GAJI;
    }
  }

  static saveGaji(list: GajiRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.GAJI, JSON.stringify(list));
  }

  static addGaji(item: Omit<GajiRecord, 'id' | 'createdAt' | 'nomorSlip'>): GajiRecord {
    const all = this.getGaji();
    const count = all.length + 1;
    const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
    const nomorSlip = `SLIP/${item.branchId.toUpperCase()}/${dateStr}/${String(count).padStart(3, '0')}`;

    const newRecord: GajiRecord = {
      ...item,
      id: `gaj-${Date.now()}`,
      nomorSlip,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newRecord);
    this.saveGaji(all);
    return newRecord;
  }

  static updateGajiStatus(id: string, statusBayar: GajiRecord['statusBayar']): void {
    const all = this.getGaji();
    const idx = all.findIndex((g) => g.id === id);
    if (idx !== -1) {
      all[idx].statusBayar = statusBayar;
      this.saveGaji(all);
    }
  }

  static deleteGaji(id: string): void {
    const all = this.getGaji().filter((g) => g.id !== id);
    this.saveGaji(all);
  }
}

