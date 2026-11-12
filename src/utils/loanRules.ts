import { SarprasItem, LoanRequest, LoanStatus } from '../types';

/**
 * Validates date-time range overlap
 */
export function checkDateRangeOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = new Date(startA).getTime();
  const aEnd = new Date(endA).getTime();
  const bStart = new Date(startB).getTime();
  const bEnd = new Date(endB).getTime();

  if (isNaN(aStart) || isNaN(aEnd) || isNaN(bStart) || isNaN(bEnd)) {
    return false;
  }
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Formats a short timestamp into readable Indonesian date
 */
export function formatIndonesianDate(dateStr: string, includeTime = false): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    if (includeTime) {
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
    }
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Validates a new loan request payload
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateLoanRequest(data: {
  borrowerName: string;
  borrowerNipOrId: string;
  borrowerPhone: string;
  purpose: string;
  startDate: string;
  endDate: string;
  items: { itemId: string; quantity: number }[];
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.borrowerName || data.borrowerName.trim().length < 3) {
    errors.borrowerName = 'Nama peminjam minimal 3 karakter.';
  }

  if (!data.borrowerNipOrId || data.borrowerNipOrId.trim().length < 3) {
    errors.borrowerNipOrId = 'NIP / NIK / ID Identitas wajib diisi.';
  }

  if (!data.borrowerPhone || data.borrowerPhone.trim().length < 8) {
    errors.borrowerPhone = 'Nomor WhatsApp / HP wajib valid (min. 8 digit).';
  }

  if (!data.purpose || data.purpose.trim().length < 5) {
    errors.purpose = 'Tujuan peminjaman minimal 5 karakter.';
  }

  if (!data.startDate) {
    errors.startDate = 'Tanggal mulai peminjaman wajib dipilih.';
  }

  if (!data.endDate) {
    errors.endDate = 'Tanggal selesai peminjaman wajib dipilih.';
  }

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate).getTime();
    const end = new Date(data.endDate).getTime();
    if (end < start) {
      errors.endDate = 'Tanggal selesai tidak boleh sebelum tanggal mulai.';
    }
  }

  if (!data.items || data.items.length === 0) {
    errors.items = 'Minimal pilih 1 barang atau ruangan untuk dipinjam.';
  } else {
    for (const item of data.items) {
      if (item.quantity <= 0) {
        errors.items = 'Jumlah pinjam harus lebih dari 0.';
        break;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Filter items according to search text, category, location, status, and type
 */
export function filterSarprasItems(
  items: SarprasItem[],
  query: string,
  category: string,
  location: string,
  availability: string,
  type: string
): SarprasItem[] {
  const q = query.trim().toLowerCase();

  return items.filter((item) => {
    // Type match
    if (type !== 'all' && item.type !== type) {
      return false;
    }

    // Category match
    if (category !== 'all' && item.category !== category) {
      return false;
    }

    // Location match
    if (location !== 'all' && item.location !== location) {
      return false;
    }

    // Availability status match
    if (availability !== 'all') {
      if (availability === 'tersedia') {
        if (item.availableQuantity <= 0 || item.condition === 'Dalam Perawatan') {
          return false;
        }
      } else if (availability === 'habis') {
        if (item.availableQuantity > 0) return false;
      } else if (availability === 'perawatan') {
        if (item.condition !== 'Dalam Perawatan') return false;
      }
    }

    // Search query match across code, name, description, location
    if (q) {
      const matchName = item.name.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchLoc && !matchDesc && !matchCat) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculates dashboard statistics for reports
 */
export interface InventoryStatistics {
  totalItems: number;
  totalRooms: number;
  totalGoods: number;
  totalStockUnits: number;
  availableStockUnits: number;
  borrowedStockUnits: number;
  pendingLoans: number;
  activeLoans: number;
  approvedLoans: number;
  completedLoans: number;
  rejectedLoans: number;
  totalLoans: number;
  utilizationRatePercentage: number;
}

export function calculateInventoryStats(
  items: SarprasItem[],
  loans: LoanRequest[]
): InventoryStatistics {
  const totalItems = items.length;
  const totalRooms = items.filter((i) => i.type === 'ruang').length;
  const totalGoods = items.filter((i) => i.type === 'barang').length;

  const totalStockUnits = items.reduce((sum, item) => sum + item.totalQuantity, 0);
  const availableStockUnits = items.reduce((sum, item) => sum + item.availableQuantity, 0);
  const borrowedStockUnits = Math.max(0, totalStockUnits - availableStockUnits);

  const pendingLoans = loans.filter((l) => l.status === 'Menunggu Persetujuan').length;
  const approvedLoans = loans.filter((l) => l.status === 'Disetujui').length;
  const activeLoans = loans.filter((l) => l.status === 'Sedang Dipinjam').length;
  const completedLoans = loans.filter((l) => l.status === 'Selesai').length;
  const rejectedLoans = loans.filter((l) => l.status === 'Ditolak').length;
  const totalLoans = loans.length;

  const utilizationRatePercentage = totalStockUnits > 0
    ? Math.round((borrowedStockUnits / totalStockUnits) * 100)
    : 0;

  return {
    totalItems,
    totalRooms,
    totalGoods,
    totalStockUnits,
    availableStockUnits,
    borrowedStockUnits,
    pendingLoans,
    activeLoans,
    approvedLoans,
    completedLoans,
    rejectedLoans,
    totalLoans,
    utilizationRatePercentage,
  };
}

/**
 * Generates an automated unique loan reference code
 */
export function generateLoanCode(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PINJAM-${year}-${randomNum}`;
}
