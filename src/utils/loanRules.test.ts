import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkDateRangeOverlap,
  validateLoanRequest,
  filterSarprasItems,
  calculateInventoryStats,
  generateLoanCode,
  formatIndonesianDate,
} from './loanRules';
import { SarprasItem, LoanRequest } from '../types';

test('checkDateRangeOverlap correctly flags overlapping times', () => {
  // Overlapping
  assert.equal(
    checkDateRangeOverlap(
      '2026-11-10T08:00:00',
      '2026-11-10T12:00:00',
      '2026-11-10T10:00:00',
      '2026-11-10T14:00:00'
    ),
    true
  );

  // Non-overlapping (B starts after A ends)
  assert.equal(
    checkDateRangeOverlap(
      '2026-11-10T08:00:00',
      '2026-11-10T10:00:00',
      '2026-11-10T10:00:00',
      '2026-11-10T12:00:00'
    ),
    false
  );
});

test('validateLoanRequest handles valid and invalid payloads', () => {
  const invalid = validateLoanRequest({
    borrowerName: '',
    borrowerNipOrId: '',
    borrowerPhone: '123',
    purpose: '',
    startDate: '',
    endDate: '',
    items: [],
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.borrowerName);
  assert.ok(invalid.errors.items);

  const valid = validateLoanRequest({
    borrowerName: 'Budi Santoso, S.Pd',
    borrowerNipOrId: '198501152010011002',
    borrowerPhone: '081234567890',
    purpose: 'Kegiatan Asesmen Standar Nasional Berbasis Komputer',
    startDate: '2026-11-12',
    endDate: '2026-11-14',
    items: [{ itemId: 'item-1', quantity: 2 }],
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('validateLoanRequest rejects end date before start date', () => {
  const invalidDate = validateLoanRequest({
    borrowerName: 'Siti Aminah, M.Pd',
    borrowerNipOrId: '199203102018022001',
    borrowerPhone: '081298765432',
    purpose: 'Rapat Koordinasi Guru',
    startDate: '2026-11-20',
    endDate: '2026-11-18',
    items: [{ itemId: 'item-1', quantity: 1 }],
  });
  assert.equal(invalidDate.valid, false);
  assert.ok(invalidDate.errors.endDate);
});

test('filterSarprasItems filters by query, category, location, and availability', () => {
  const sampleItems: SarprasItem[] = [
    {
      id: '1',
      code: 'PRJ-01',
      name: 'Proyektor Epson EB-E01',
      type: 'barang',
      category: 'Elektronik & Multimedia',
      location: 'Gudang Pusat',
      totalQuantity: 5,
      availableQuantity: 3,
      unit: 'Unit',
      condition: 'Baik',
      picName: 'Pak Hadi',
      picPhone: '0811111111',
      description: 'Proyektor 3300 lumens HDMI',
      createdAt: '2026-01-01',
    },
    {
      id: '2',
      code: 'RNG-AULA',
      name: 'Aula Graha Cendekia',
      type: 'ruang',
      category: 'Ruangan & Aula',
      location: 'Gedung Utama Lt 2',
      totalQuantity: 1,
      availableQuantity: 0,
      unit: 'Ruang',
      condition: 'Baik',
      picName: 'Pak Hadi',
      picPhone: '0811111111',
      description: 'Aula serbaguna kapasitas 300 orang',
      createdAt: '2026-01-01',
    },
    {
      id: '3',
      code: 'MIC-WL',
      name: 'Wireless Microphone Set',
      type: 'barang',
      category: 'Elektronik & Multimedia',
      location: 'Ruang Guru',
      totalQuantity: 2,
      availableQuantity: 0,
      unit: 'Set',
      condition: 'Dalam Perawatan',
      picName: 'Bu Dewi',
      picPhone: '0822222222',
      description: 'Microphone UHF dual receiver',
      createdAt: '2026-01-01',
    },
  ];

  // Query filter
  const qResult = filterSarprasItems(sampleItems, 'epson', 'all', 'all', 'all', 'all');
  assert.equal(qResult.length, 1);
  assert.equal(qResult[0].code, 'PRJ-01');

  // Type filter
  const roomResult = filterSarprasItems(sampleItems, '', 'all', 'all', 'all', 'ruang');
  assert.equal(roomResult.length, 1);
  assert.equal(roomResult[0].id, '2');

  // Availability filter (tersedia)
  const availResult = filterSarprasItems(sampleItems, '', 'all', 'all', 'tersedia', 'all');
  assert.equal(availResult.length, 1);
  assert.equal(availResult[0].id, '1');

  // Perawatan filter
  const perResult = filterSarprasItems(sampleItems, '', 'all', 'all', 'perawatan', 'all');
  assert.equal(perResult.length, 1);
  assert.equal(perResult[0].id, '3');
});

test('calculateInventoryStats computes correct aggregated figures', () => {
  const items: SarprasItem[] = [
    {
      id: '1',
      code: 'A',
      name: 'Laptop',
      type: 'barang',
      category: 'Elektronik & Multimedia',
      location: 'Lab',
      totalQuantity: 10,
      availableQuantity: 6,
      unit: 'Unit',
      condition: 'Baik',
      picName: 'Admin',
      picPhone: '',
      description: '',
      createdAt: '',
    },
    {
      id: '2',
      code: 'B',
      name: 'Lab Bahasa',
      type: 'ruang',
      category: 'Ruangan & Aula',
      location: 'Gedung B',
      totalQuantity: 1,
      availableQuantity: 1,
      unit: 'Ruang',
      condition: 'Baik',
      picName: 'Admin',
      picPhone: '',
      description: '',
      createdAt: '',
    },
  ];

  const loans: LoanRequest[] = [
    {
      id: 'l1',
      loanCode: 'PINJAM-2026-0001',
      borrowerName: 'Guru A',
      borrowerRole: 'Guru',
      borrowerNipOrId: '12345',
      borrowerPhone: '08123',
      borrowerEmail: '',
      departmentOrClass: 'IPA',
      purpose: 'Mengajar',
      items: [{ itemId: '1', itemName: 'Laptop', itemCode: 'A', type: 'barang', quantity: 4, unit: 'Unit' }],
      startDate: '2026-11-10',
      startTime: '08:00',
      endDate: '2026-11-10',
      endTime: '12:00',
      status: 'Sedang Dipinjam',
      createdAt: '2026-11-09',
    },
    {
      id: 'l2',
      loanCode: 'PINJAM-2026-0002',
      borrowerName: 'Guru B',
      borrowerRole: 'Guru',
      borrowerNipOrId: '54321',
      borrowerPhone: '08124',
      borrowerEmail: '',
      departmentOrClass: 'Bahasa',
      purpose: 'Seminar',
      items: [],
      startDate: '2026-11-12',
      startTime: '09:00',
      endDate: '2026-11-12',
      endTime: '15:00',
      status: 'Menunggu Persetujuan',
      createdAt: '2026-11-09',
    },
  ];

  const stats = calculateInventoryStats(items, loans);
  assert.equal(stats.totalItems, 2);
  assert.equal(stats.totalGoods, 1);
  assert.equal(stats.totalRooms, 1);
  assert.equal(stats.totalStockUnits, 11);
  assert.equal(stats.availableStockUnits, 7);
  assert.equal(stats.borrowedStockUnits, 4);
  assert.equal(stats.pendingLoans, 1);
  assert.equal(stats.activeLoans, 1);
  assert.equal(stats.utilizationRatePercentage, 36); // 4 / 11 * 100 = 36%
});

test('generateLoanCode matches expected format', () => {
  const code = generateLoanCode();
  assert.match(code, /^PINJAM-\d{4}-\d{4}$/);
});

test('formatIndonesianDate produces readable output', () => {
  const formatted = formatIndonesianDate('2026-11-15T14:30:00', true);
  assert.ok(formatted.includes('15 November 2026'));
  assert.ok(formatted.includes('14:30 WIB'));
});
