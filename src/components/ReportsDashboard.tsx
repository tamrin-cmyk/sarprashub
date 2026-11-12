import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Printer,
  Calendar,
  Layers,
  Package,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { SarprasItem, LoanRequest } from '../types';
import { calculateInventoryStats } from '../utils/loanRules';

interface ReportsDashboardProps {
  items: SarprasItem[];
  loans: LoanRequest[];
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ items, loans }) => {
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all');

  const stats = calculateInventoryStats(items, loans);

  // Calculate Most Borrowed Items Leaderboard
  const itemUsageCount: Record<string, { name: string; type: string; count: number; code: string }> = {};

  loans.forEach((loan) => {
    loan.items.forEach((item) => {
      if (!itemUsageCount[item.itemId]) {
        itemUsageCount[item.itemId] = {
          name: item.itemName,
          type: item.type,
          count: 0,
          code: item.itemCode,
        };
      }
      itemUsageCount[item.itemId].count += item.quantity;
    });
  });

  const topBorrowed = Object.values(itemUsageCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Category Distribution
  const categoryStats: Record<string, number> = {};
  items.forEach((item) => {
    categoryStats[item.category] = (categoryStats[item.category] || 0) + item.totalQuantity;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Kode Peminjaman',
      'Nama Peminjam',
      'Peran',
      'NIP/ID',
      'WhatsApp',
      'Item Sarpras',
      'Tgl Mulai',
      'Tgl Selesai',
      'Status',
      'Tujuan',
    ];

    const rows = loans.map((l) => [
      l.loanCode,
      `"${l.borrowerName}"`,
      l.borrowerRole,
      l.borrowerNipOrId,
      l.borrowerPhone,
      `"${l.items.map((i) => `${i.itemName} (${i.quantity})`).join(', ')}"`,
      `${l.startDate} ${l.startTime}`,
      `${l.endDate} ${l.endTime}`,
      l.status,
      `"${l.purpose.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Peminjaman_Sarpras_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner (White theme) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-teal-200 bg-gradient-to-r from-white via-teal-50/50 to-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold shadow-2xs">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Pusat Pelaporan & Analisis Pemanfaatan Sarpras</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pelaporan Komprehensif <span className="text-gradient-emerald">Penggunaan Inventaris</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Pantau metrik utilisasi sarana prasarana, frekuensi peminjaman aset, performa ruangan,
            serta rekapitulasi data riwayat untuk akuntabilitas institusi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-bold shadow-md shadow-teal-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="card-3d-tilt glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Aset Sarpras</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalItems}</p>
          <p className="text-[11px] text-slate-500">
            {stats.totalGoods} Barang • {stats.totalRooms} Ruangan
          </p>
        </div>

        <div className="card-3d-tilt glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Tingkat Utilisasi</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">
            {stats.utilizationRatePercentage}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${stats.utilizationRatePercentage}%` }}
            />
          </div>
        </div>

        <div className="card-3d-tilt glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Unit Aktif Dipinjam</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-700">
            {stats.borrowedStockUnits}
          </p>
          <p className="text-[11px] text-slate-500">
            {stats.availableStockUnits} unit siap digunakan
          </p>
        </div>

        <div className="card-3d-tilt glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Pengajuan</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-cyan-600">{stats.totalLoans}</p>
          <p className="text-[11px] text-slate-500">
            {stats.approvedLoans + stats.activeLoans} Disetujui/Aktif
          </p>
        </div>
      </div>

      {/* Analytics Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Most Borrowed */}
        <div className="card-3d-tilt glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Sarpras Paling Sering Dipinjam</span>
            </h3>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Top 5 Terpopuler
            </span>
          </div>

          <div className="space-y-3.5">
            {topBorrowed.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Belum ada riwayat peminjaman.</p>
            ) : (
              topBorrowed.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] border border-slate-200">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 truncate max-w-[220px]">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                        {item.code}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-600">{item.count} Kali Dipinjam</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (item.count / (topBorrowed[0]?.count || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stock Breakdown per Category */}
        <div className="card-3d-tilt glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Distribusi Inventaris per Kategori</span>
            </h3>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Unit
            </span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(categoryStats).map(([cat, count], idx) => {
              const maxStock = stats.totalStockUnits || 1;
              const pct = Math.round((count / maxStock) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{cat}</span>
                    <span className="text-slate-500">
                      <span className="font-bold text-slate-900">{count} unit</span> ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comprehensive Log Table */}
      <div className="glass-panel rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Rekapitulasi Lengkap Riwayat Peminjaman</span>
          </h3>
          <span className="text-xs text-slate-500">Total {loans.length} Berkas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-3 px-4">No. Pengajuan</th>
                <th className="py-3 px-4">Peminjam</th>
                <th className="py-3 px-4">Item Sarpras</th>
                <th className="py-3 px-4">Rentang Waktu</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Petugas / Reviewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                    {loan.loanCode}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{loan.borrowerName}</span>
                    <span className="text-[11px] text-slate-500">
                      {loan.borrowerRole} • {loan.departmentOrClass}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-700">
                      {loan.items.map((i) => `${i.itemName} (${i.quantity})`).join(', ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {loan.startDate} s.d {loan.endDate}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        loan.status === 'Disetujui'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : loan.status === 'Sedang Dipinjam'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-300'
                          : loan.status === 'Selesai'
                          ? 'bg-slate-100 text-slate-700 border border-slate-300'
                          : loan.status === 'Menunggu Persetujuan'
                          ? 'bg-amber-50 text-amber-700 border border-amber-300'
                          : 'bg-rose-50 text-rose-700 border border-rose-300'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {loan.approvedBy || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
