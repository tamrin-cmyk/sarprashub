import React, { useState } from 'react';
import {
  Search,
  FileDown,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Copy,
  Check,
  Package,
  Sparkles,
} from 'lucide-react';
import { LoanRequest, LoanStatus } from '../types';
import { formatIndonesianDate } from '../utils/loanRules';
import { downloadLoanCardPDF } from '../utils/pdfGenerator';

interface LoanStatusDashboardProps {
  loans: LoanRequest[];
  onOpenNewLoanModal: () => void;
  onPreviewLoanCard: (loan: LoanRequest) => void;
}

export const LoanStatusDashboard: React.FC<LoanStatusDashboardProps> = ({
  loans,
  onOpenNewLoanModal,
  onPreviewLoanCard,
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLoans = loans.filter((loan) => {
    // Filter status
    if (statusFilter !== 'all' && loan.status !== statusFilter) {
      return false;
    }
    // Filter search
    if (searchCode.trim()) {
      const q = searchCode.toLowerCase();
      const matchCode = loan.loanCode.toLowerCase().includes(q);
      const matchName = loan.borrowerName.toLowerCase().includes(q);
      const matchId = loan.borrowerNipOrId.toLowerCase().includes(q);
      const matchItem = loan.items.some((i) => i.itemName.toLowerCase().includes(q));
      if (!matchCode && !matchName && !matchId && !matchItem) return false;
    }
    return true;
  });

  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case 'Menunggu Persetujuan':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>Menunggu Persetujuan Admin</span>
          </span>
        );
      case 'Disetujui':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Disetujui (Siap Cetak PDF)</span>
          </span>
        );
      case 'Sedang Dipinjam':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-300 flex items-center gap-1.5 shadow-2xs">
            <Package className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sedang Aktif Dipinjam</span>
          </span>
        );
      case 'Selesai':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-slate-600" />
            <span>Selesai & Dikembalikan</span>
          </span>
        );
      case 'Ditolak':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 flex items-center gap-1.5 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Permohonan Ditolak</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header section (White theme) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-indigo-50/50 to-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparansi Pelayanan Publik Sarana Prasarana</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Dasbor Status <span className="text-gradient-primary">Peminjaman Online</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Pantau progres verifikasi permohonan Anda secara transparan. Setelah disetujui admin,
            Anda dapat langsung mengunduh dan mencetak Kartu Peminjaman Resmi dalam format PDF.
          </p>
        </div>

        <button
          onClick={onOpenNewLoanModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buat Pengajuan Baru</span>
        </button>
      </div>

      {/* Filter and Search Box */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Lacak kode peminjaman (contoh: PINJAM-2026-1082) atau nama peminjam..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 text-xs sm:text-sm outline-none focus:bg-white focus:border-indigo-500 shadow-inner"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Semua Status' },
              { id: 'Menunggu Persetujuan', label: 'Menunggu' },
              { id: 'Disetujui', label: 'Disetujui' },
              { id: 'Sedang Dipinjam', label: 'Aktif Dipinjam' },
              { id: 'Selesai', label: 'Selesai' },
              { id: 'Ditolak', label: 'Ditolak' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loans List */}
      {filteredLoans.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200 space-y-3 bg-white">
          <Clock className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Tidak ada data peminjaman ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Belum ada permohonan yang sesuai dengan filter atau kata kunci pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredLoans.map((loan) => {
            const canPrintPDF = loan.status === 'Disetujui' || loan.status === 'Sedang Dipinjam';

            return (
              <div
                key={loan.id}
                className="card-3d-tilt glass-panel rounded-3xl border border-slate-200 bg-white overflow-hidden p-6 sm:p-7 space-y-6 transition-all hover:border-slate-300 shadow-xs hover:shadow-xl"
              >
                {/* Top Bar with Code, Status, and Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
                      <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-indigo-700">
                        {loan.loanCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(loan.loanCode)}
                        className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Salin Kode Peminjaman"
                      >
                        {copiedId === loan.loanCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {getStatusBadge(loan.status)}

                    <span className="text-[11px] text-slate-500">
                      Diajukan: {loan.createdAt}
                    </span>
                  </div>

                  {/* Print / Download Button if Approved */}
                  <div className="flex items-center gap-2">
                    {canPrintPDF && (
                      <>
                        <button
                          onClick={() => onPreviewLoanCard(loan)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Pratinjau Kartu</span>
                        </button>
                        <button
                          onClick={() => downloadLoanCardPDF(loan)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
                        >
                          <FileDown className="w-4 h-4" />
                          <span>Unduh Kartu PDF</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Stepper Timeline (White theme) */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between max-w-3xl mx-auto">
                    {/* Background Progress Bar */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                    
                    {/* Step 1: Diajukan */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/30">
                        ✓
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
                        Pengajuan
                      </span>
                    </div>

                    {/* Step 2: Verifikasi Admin */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          loan.status !== 'Menunggu Persetujuan'
                            ? loan.status === 'Ditolak'
                              ? 'bg-rose-500 text-white'
                              : 'bg-emerald-500 text-white'
                            : 'bg-amber-400 text-white animate-pulse shadow-md shadow-amber-400/30'
                        }`}
                      >
                        {loan.status === 'Ditolak' ? '✕' : loan.status === 'Menunggu Persetujuan' ? '2' : '✓'}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
                        Verifikasi
                      </span>
                    </div>

                    {/* Step 3: Disetujui */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          loan.status === 'Disetujui' || loan.status === 'Sedang Dipinjam' || loan.status === 'Selesai'
                            ? 'bg-emerald-500 text-white'
                            : loan.status === 'Ditolak'
                            ? 'bg-slate-200 text-slate-400'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {loan.status === 'Disetujui' || loan.status === 'Sedang Dipinjam' || loan.status === 'Selesai' ? '✓' : '3'}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
                        Persetujuan
                      </span>
                    </div>

                    {/* Step 4: Sedang Dipinjam */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          loan.status === 'Sedang Dipinjam'
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 animate-pulse'
                            : loan.status === 'Selesai'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {loan.status === 'Selesai' ? '✓' : '4'}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
                        Dipakai
                      </span>
                    </div>

                    {/* Step 5: Selesai */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          loan.status === 'Selesai'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {loan.status === 'Selesai' ? '✓' : '5'}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
                        Selesai
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                  {/* Borrower Data */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                      Informasi Peminjam
                    </span>
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-900 text-sm">{loan.borrowerName}</p>
                      <p className="text-slate-700">
                        {loan.borrowerRole} • {loan.departmentOrClass}
                      </p>
                      <p className="text-slate-500">NIP/ID: {loan.borrowerNipOrId}</p>
                      <p className="text-slate-500">Kontak: {loan.borrowerPhone}</p>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                      Jadwal Penggunaan
                    </span>
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Mulai:</span>
                        <span className="font-semibold text-slate-900">
                          {formatIndonesianDate(loan.startDate)} pukul {loan.startTime || '08:00'} WIB
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Selesai:</span>
                        <span className="font-semibold text-slate-900">
                          {formatIndonesianDate(loan.endDate)} pukul {loan.endTime || '16:00'} WIB
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                      Sarana yang Dipinjam ({loan.items.length})
                    </span>
                    <ul className="space-y-1.5">
                      {loan.items.map((itm, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-white border border-slate-200"
                        >
                          <span className="text-slate-800 font-medium truncate max-w-[150px]">
                            {itm.itemName}
                          </span>
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                            {itm.quantity} {itm.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Purpose note */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="text-slate-500 font-semibold mr-1.5">Keperluan Kegiatan:</span>
                  <span>{loan.purpose}</span>
                </div>

                {/* Admin notes or Rejection Reason if any */}
                {loan.adminNotes && (
                  <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-indigo-800">Catatan Petugas Sarpras:</span>{' '}
                      {loan.adminNotes}
                    </div>
                  </div>
                )}

                {loan.status === 'Ditolak' && loan.rejectionReason && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-800">Alasan Penolakan:</span>{' '}
                      {loan.rejectionReason}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
