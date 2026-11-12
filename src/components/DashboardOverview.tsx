import React, { useState } from 'react';
import {
  Package,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  MoreVertical,
  Printer,
  FileText,
  Boxes,
  Sparkles,
  ChevronRight,
  Monitor,
  Building,
  Tv,
  Eye,
  Check,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { SarprasItem, LoanRequest, AppNotification } from '../types';

interface DashboardOverviewProps {
  items: SarprasItem[];
  loans: LoanRequest[];
  notifications: AppNotification[];
  isAdmin: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenNewLoanModal: () => void;
  onOpenLabelModal: (itemId?: string) => void;
  onPreviewLoanCard: (loan: LoanRequest) => void;
  onRequireAdminAuth: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  items,
  loans,
  notifications,
  isAdmin,
  onNavigateTab,
  onOpenNewLoanModal,
  onOpenLabelModal,
  onPreviewLoanCard,
  onRequireAdminAuth,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'pending' | 'maintenance'>('all');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Calculation Metrics
  const totalItemsCount = items.reduce((acc, itm) => acc + itm.totalQuantity, 0);
  const totalAvailableCount = items.reduce((acc, itm) => acc + itm.availableQuantity, 0);
  const activeLoansCount = loans.filter(
    (l) => l.status === 'Sedang Dipinjam' || l.status === 'Disetujui'
  ).length;
  const pendingLoansCount = loans.filter((l) => l.status === 'Menunggu Persetujuan').length;
  const completedLoansCount = loans.filter((l) => l.status === 'Selesai').length;

  // Stock status counts for donut chart
  const inStockCount = items.filter((i) => i.availableQuantity > 2).length;
  const lowStockCount = items.filter((i) => i.availableQuantity > 0 && i.availableQuantity <= 2).length;
  const outOfStockCount = items.filter((i) => i.availableQuantity === 0).length;

  // Filtered table items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      item.code.toLowerCase().includes(tableSearch.toLowerCase()) ||
      item.location.toLowerCase().includes(tableSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(tableSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'active') return item.availableQuantity > 0 && item.condition === 'Baik';
    if (filterTab === 'pending') return item.availableQuantity < item.totalQuantity;
    if (filterTab === 'maintenance') return item.condition !== 'Baik';
    return true;
  });

  const toggleSelectRow = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === filteredItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredItems.map((i) => i.id));
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. Header Greeting Card with 3D Parcel Box Graphic (Matching Top of Image) */}
      <div className="clay-card rounded-3xl p-6 sm:p-8 bg-white/95 border border-slate-200/90 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isAdmin ? 'Selamat Datang, Admin Sarpras 👋' : 'Selamat Datang, Pengunjung 👋'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              Berikut pantauan terkini ketersediaan sarana prasarana sekolah, status sirkulasi permohonan, dan jadwal peminjaman ruang hari ini.
            </p>
          </div>

          {/* 3D Isometric Parcel Box matching image top-right */}
          <div className="hidden sm:flex items-center justify-center shrink-0">
            <div className="relative group hover:scale-105 transition-transform duration-300">
              <div className="w-32 h-28 relative">
                <div className="absolute -bottom-2 left-4 right-4 h-6 bg-slate-300/50 rounded-full blur-md" />
                <div className="w-28 h-24 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 rounded-2xl shadow-lg border border-amber-300/80 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 w-5 bg-amber-500/30 border-x border-amber-500/20" />
                  <div className="w-14 h-6 border-b-3 border-slate-800 rounded-b-full transform rotate-[-4deg] relative">
                    <div className="absolute right-0 bottom-[-4px] w-2 h-2 border-r-3 border-b-3 border-slate-800 transform rotate-[45deg]" />
                  </div>
                  <span className="text-[9px] font-black tracking-widest text-amber-900/70 uppercase mt-2">
                    SARPRAS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards in a Row (Matching image strip) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          {/* Card 1: Total Products */}
          <div className="clay-card p-4 sm:p-5 rounded-2xl bg-white/80 border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12%</span>
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[11px] text-slate-500 font-semibold block">Total Sarpras</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {totalItemsCount} <span className="text-xs font-normal text-slate-400">unit</span>
              </span>
            </div>
          </div>

          {/* Card 2: Active Listings */}
          <div className="clay-card p-4 sm:p-5 rounded-2xl bg-white/80 border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+10%</span>
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[11px] text-slate-500 font-semibold block">Unit Siap Pakai</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {totalAvailableCount} <span className="text-xs font-normal text-slate-400">tersedia</span>
              </span>
            </div>
          </div>

          {/* Card 3: Peminjaman Aktif */}
          <div className="clay-card p-4 sm:p-5 rounded-2xl bg-white/80 border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-purple-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{pendingLoansCount} Baru</span>
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[11px] text-slate-500 font-semibold block">Sirkulasi Aktif</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeLoansCount} <span className="text-xs font-normal text-slate-400">berjalan</span>
              </span>
            </div>
          </div>

          {/* Card 4: Selesai Dikembalikan */}
          <div className="clay-card p-4 sm:p-5 rounded-2xl bg-white/80 border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18%</span>
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[11px] text-slate-500 font-semibold block">Total Transaksi Selesai</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {completedLoansCount + 28} <span className="text-xs font-normal text-slate-400">riwayat</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Section (Matching Image Structure) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Product Listings Table + Donut & Activity (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Product Listings Card matching exact image */}
          <div className="clay-card rounded-3xl p-5 sm:p-6 bg-white/95 border border-slate-200/90 space-y-5">
            {/* Header: Title + Search with filter icon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Katalog Inventaris & Sirkulasi
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Pantau stok, lokasi penempatan, dan status ketersediaan sarana prasarana.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
                <button
                  onClick={() => setTableSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Filter className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Filter Pills matching image */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilterTab('active')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  filterTab === 'active'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tersedia ({items.filter((i) => i.availableQuantity > 0 && i.condition === 'Baik').length})
              </button>
              <button
                onClick={() => setFilterTab('pending')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  filterTab === 'pending'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Dipinjam Sebagian ({items.filter((i) => i.availableQuantity < i.totalQuantity).length})
              </button>
              <button
                onClick={() => setFilterTab('maintenance')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  filterTab === 'maintenance'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Perawatan ({items.filter((i) => i.condition !== 'Baik').length})
              </button>
            </div>

            {/* Table matching the image structure */}
            <div className="overflow-x-auto -mx-5 sm:mx-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          filteredItems.length > 0 &&
                          selectedItemIds.length === filteredItems.length
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Sarpras</th>
                    <th className="py-3 px-4">Kode Aset</th>
                    <th className="py-3 px-4">Kategori & Lokasi</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredItems.slice(0, 7).map((item) => {
                    const isSelected = selectedItemIds.includes(item.id);
                    const isPartiallyLoaned = item.availableQuantity < item.totalQuantity && item.availableQuantity > 0;
                    const isMaintenance = item.condition !== 'Baik';

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(item.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                SKU: {item.code}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          {item.code}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-800 font-semibold">{item.category}</div>
                          <div className="text-[10px] text-slate-400">{item.location}</div>
                        </td>
                        <td className="py-3 px-4">
                          {isMaintenance ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                              Inactive
                            </span>
                          ) : isPartiallyLoaned ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                              Draft
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onOpenLabelModal(item.id)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Cetak Label Barcode"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onNavigateTab('catalog')}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Lihat Detail"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom bulk actions */}
            {selectedItemIds.length > 0 && (
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-800">
                <span className="font-semibold">
                  {selectedItemIds.length} item sarpras terpilih
                </span>
                <button
                  onClick={() => onOpenLabelModal()}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Label Pilihan</span>
                </button>
              </div>
            )}
          </div>

          {/* Under Table: Two Cards side-by-side (Inventory Overview Donut + Recent Activity) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donut Chart matching image */}
            <div className="clay-card rounded-3xl p-5 bg-white/95 border border-slate-200/90 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-slate-900">Inventory Overview</h3>
                <span className="text-[11px] font-semibold text-slate-500 px-2 py-1 rounded-lg bg-slate-100">
                  Semua Sarpras
                </span>
              </div>

              <div className="flex items-center gap-6 my-auto py-2">
                {/* SVG Donut */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeDasharray="65 100"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      strokeDasharray="20 100"
                      strokeDashoffset="-67"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="3.5"
                      strokeDasharray="10 100"
                      strokeDashoffset="-89"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-black text-slate-900 leading-none">
                      {totalItemsCount}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                      Total Unit
                    </span>
                  </div>
                </div>

                {/* Donut Legend matching image */}
                <div className="space-y-2 flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-600 font-medium">In Stock</span>
                    </div>
                    <span className="font-bold text-slate-900">{inStockCount} item (89%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-slate-600 font-medium">Low Stock</span>
                    </div>
                    <span className="font-bold text-slate-900">{lowStockCount} item (8%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="text-slate-600 font-medium">Out of Stock</span>
                    </div>
                    <span className="font-bold text-slate-900">{outOfStockCount} item (3%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity stream matching image */}
            <div className="clay-card rounded-3xl p-5 bg-white/95 border border-slate-200/90 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
                <button
                  onClick={() => onNavigateTab('circulation')}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View all</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {loans.slice(0, 4).map((loan, idx) => (
                  <div key={loan.id || idx} className="flex items-center gap-3 text-xs">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-blue-50 text-blue-600'
                          : idx === 1
                          ? 'bg-purple-50 text-purple-600'
                          : idx === 2
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {idx === 0 ? (
                        <Package className="w-4 h-4" />
                      ) : idx === 1 ? (
                        <Clock className="w-4 h-4" />
                      ) : idx === 2 ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 truncate">
                        {loan.borrowerName} • {loan.items[0]?.itemName || 'Sarpras'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate">
                        Kode: {loan.loanCode} • Status: {loan.status}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {idx === 0 ? '2 mins ago' : idx === 1 ? '12 mins ago' : `${idx * 20}m ago`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions + Sales Performance + Top Categories + Grow Promo (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Card matching image */}
          <div className="clay-card rounded-3xl p-5 bg-white/95 border border-slate-200/90 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">Quick Actions</h3>

            <div className="space-y-2">
              <button
                onClick={onOpenNewLoanModal}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left cursor-pointer group border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Ajukan Peminjaman</span>
                    <span className="text-[10px] text-slate-400 block font-normal">Buat formulir permohonan baru</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onOpenLabelModal()}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left cursor-pointer group border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Cetak Label Barcode</span>
                    <span className="text-[10px] text-slate-400 block font-normal">Generate label stiker QR & barcode</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  const approvedLoan = loans.find((l) => l.status === 'Disetujui' || l.status === 'Sedang Dipinjam');
                  if (approvedLoan) {
                    onPreviewLoanCard(approvedLoan);
                  } else {
                    onNavigateTab('circulation');
                  }
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left cursor-pointer group border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Cetak Kartu PDF</span>
                    <span className="text-[10px] text-slate-400 block font-normal">Unduh surat izin peminjaman resmi</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  if (!isAdmin) {
                    onRequireAdminAuth();
                  } else {
                    onNavigateTab('inventory');
                  }
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left cursor-pointer group border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Kelola Master Data</span>
                    <span className="text-[10px] text-slate-400 block font-normal">Update stok dan ruangan</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          {/* Sales / Usage Performance Wave Chart matching image */}
          <div className="clay-card rounded-3xl p-5 bg-white/95 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Performa Utilisasi</h3>
                <span className="text-[10px] text-slate-400 font-medium">Sirkulasi & pemakaian</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded-md bg-slate-100">
                7 hari terakhir
              </span>
            </div>

            <div>
              <div className="text-xl font-black text-slate-900">
                94.8% <span className="text-xs font-normal text-slate-500">efisiensi</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>↑ 18% vs minggu lalu</span>
              </span>
            </div>

            {/* Smooth SVG wave chart matching image */}
            <div className="h-20 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
                <defs>
                  <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,60 Q40,75 80,45 T160,35 T240,20 T300,10 L300,80 L0,80 Z"
                  fill="url(#waveGradient)"
                />
                <path
                  d="M0,60 Q40,75 80,45 T160,35 T240,20 T300,10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="10" r="4" fill="#2563eb" />
                <circle cx="300" cy="10" r="8" fill="#3b82f6" fillOpacity="0.3" />
              </svg>
            </div>
          </div>

          {/* Top Categories Card matching image */}
          <div className="clay-card rounded-3xl p-5 bg-white/95 border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-900">Top Kategori Sarpras</h3>
              <button
                onClick={() => onNavigateTab('catalog')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Tv className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800">Elektronik & Multimedia</span>
                  </div>
                  <span className="font-bold text-slate-900">42%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Building className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800">Ruangan & Aula</span>
                  </div>
                  <span className="font-bold text-slate-900">28%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Monitor className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800">Laboratorium CBT</span>
                  </div>
                  <span className="font-bold text-slate-900">18%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Grow Your Business Promo matching bottom right of image */}
          <div className="clay-card rounded-3xl p-5 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/60 border border-blue-100/80 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900">Digitalisasi Sarpras Terpadu</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                Sistem barcode terintegrasi dengan tanda tangan digital pada kartu peminjaman PDF otomatis.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('reports')}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Lihat Analitik Lengkap →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Banner: Optimize Your Listings (Matching Bottom of Image) */}
      <div className="clay-card rounded-3xl p-5 sm:p-6 bg-white/95 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Optimalisasi Inventaris & Pemeliharaan Rutin
            </h4>
            <p className="text-xs text-slate-500 font-normal">
              Pastikan seluruh aset diberi label barcode dan diverifikasi berkala oleh petugas penanggung jawab (PIC).
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('catalog')}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          Lihat Panduan SOP →
        </button>
      </div>
    </div>
  );
};
