export type ItemType = 'barang' | 'ruang';

export type ItemCondition = 'Baik' | 'Rusak Ringan' | 'Dalam Perawatan';

export type ItemCategory =
  | 'Elektronik & Multimedia'
  | 'Ruangan & Aula'
  | 'Laboratorium'
  | 'Olahraga'
  | 'Perlengkapan Acara'
  | 'Kendaraan Operasional';

export interface SarprasItem {
  id: string;
  code: string;
  name: string;
  type: ItemType;
  category: ItemCategory;
  location: string;
  totalQuantity: number;
  availableQuantity: number;
  unit: string; // e.g. "Unit", "Ruang", "Set", "Buah"
  condition: ItemCondition;
  picName: string;
  picPhone: string;
  imageUrl?: string;
  description: string;
  features?: string[];
  capacity?: number; // for rooms
  isRestricted?: boolean; // requires special head approval
  createdAt: string;
}

export type LoanStatus =
  | 'Menunggu Persetujuan'
  | 'Disetujui'
  | 'Ditolak'
  | 'Sedang Dipinjam'
  | 'Selesai';

export interface LoanItemDetail {
  itemId: string;
  itemName: string;
  itemCode: string;
  type: ItemType;
  quantity: number;
  unit: string;
}

export interface LoanRequest {
  id: string;
  loanCode: string;
  borrowerName: string;
  borrowerRole: 'Guru' | 'Staf' | 'Siswa' | 'Tamu / Umum';
  borrowerNipOrId: string;
  borrowerPhone: string;
  borrowerEmail: string;
  departmentOrClass: string;
  purpose: string;
  items: LoanItemDetail[];
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate: string; // YYYY-MM-DD
  endTime: string; // HH:mm
  status: LoanStatus;
  rejectionReason?: string;
  adminNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
  returnedAt?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  loanCode?: string;
}
