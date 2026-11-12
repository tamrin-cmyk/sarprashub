import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  FileCheck,
  FileX,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { LoanRequest } from '../types';
import { formatIndonesianDate } from '../utils/loanRules';

interface AdminApprovalProps {
  loans: LoanRequest[];
  onApproveLoan: (loanId: string, adminNotes?: string) => void;
  onRejectLoan: (loanId: string, reason: string) => void;
  onMarkHandover: (loanId: string) => void;
  onMarkReturned: (loanId: string) => void;
}

export const AdminApproval: React.FC<AdminApprovalProps> = ({
  loans,
  onApproveLoan,
  onRejectLoan,
  onMarkHandover,
  onMarkReturned,
}) => {
  const [filterTab, setFilterTab] = useState<string>('Menunggu Persetujuan');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Rejection modal state
  const [rejectingLoan, setRejectingLoan] = useState<LoanRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Approval modal state (for optional notes)
  const [approvingLoan, setApprovingLoan] = useState<LoanRequest | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('Peminjaman disetujui. Harap menjaga keutuhan sarana prasarana.');

  const pendingCount = loans.filter((l) => l.status === 'Menunggu Persetujuan').length;
  const approvedCount = loans.filter((l) => l.status === 'Disetujui').length;
  const activeCount = loans.filter((l) => l.status === 'Sedang Dipinjam').length;
  const completedCount = loans.filter((l) => l.status === 'Selesai').length;

  const filteredLoans = loans.filter((l) => {
    if (filterTab !== 'all' && l.status !== filterTab) return false;
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchName = l.borrowerName.toLowerCase().includes(q);
      const matchCode = l.loanCode.toLowerCase().includes(q);
      const matchDept = l.departmentOrClass.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchDept) return false;
    }
    return true;
  });

  const confirmReject = () => {
    if (!rejectingLoan) return;
    if (!rejectionReason.trim()) {
      alert('Mohon cantumkan alasan penolakan permohonan.');
      return;
    }
    onRejectLoan(rejectingLoan.id, rejectionReason.trim());
    setRejectingLoan(null);
    setRejectionReason('');
  };

  const confirmApprove = () => {
    if (!approvingLoan) return;
    onApproveLoan(approvingLoan.id, approvalNotes.trim());
    setApprovingLoan(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner (White theme) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-200 bg-gradient-to-r from-white via-purple-50/50 to-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold shadow-2xs">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Portal Manajemen & Otorisasi Sarpras</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Persetujuan & Kontrol <span className="text-gradient-primary">Peminjaman Sarpras</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Tinjau permohonan online, verifikasi ketersediaan barang/ruangan, berikan catatan resmi,
            dan kelola serah-terima hingga pengembalian sarana prasarana.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap gap-2.5">
          <div className="p-3 rounded-2xl bg-white border border-amber-300 text-center min-w-[100px] shadow-xs">
            <span className="block text-2xl font-black text-amber-600">{pendingCount}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Perlu Review
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-emerald-300 text-center min-w-[100px] shadow-xs">
            <span className="block text-2xl font-black text-emerald-600">{approvedCount}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Disetujui
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-indigo-300 text-center min-w-[100px] shadow-xs">
            <span className="block text-2xl font-black text-indigo-600">{activeCount}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Aktif Dipinjam
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Tab Controls */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Cari peminjam, kode pengajuan, atau unit kerja..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 text-xs sm:text-sm outline-none focus:bg-white focus:border-purple-500 shadow-inner"
          />

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'Menunggu Persetujuan', label: `Antrean (${pendingCount})`, badge: pendingCount },
              { id: 'Disetujui', label: `Disetujui (${approvedCount})` },
              { id: 'Sedang Dipinjam', label: `Aktif Dipinjam (${activeCount})` },
              { id: 'Selesai', label: `Selesai (${completedCount})` },
              { id: 'all', label: 'Semua Status' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterTab === tab.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredLoans.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200 space-y-3 bg-white shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Tidak ada antrean dalam kategori ini</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Semua permohonan peminjaman sarana prasarana telah selesai diproses.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredLoans.map((loan) => (
            <div
              key={loan.id}
              className={`card-3d-tilt glass-panel rounded-3xl border p-6 sm:p-7 space-y-5 transition-all shadow-xs hover:shadow-xl bg-white ${
                loan.status === 'Menunggu Persetujuan'
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : 'border-slate-200'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                    {loan.loanCode}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      loan.status === 'Menunggu Persetujuan'
                        ? 'bg-amber-50 text-amber-700 border border-amber-300'
                        : loan.status === 'Disetujui'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : loan.status === 'Sedang Dipinjam'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-300'
                        : loan.status === 'Selesai'
                        ? 'bg-slate-100 text-slate-700 border border-slate-300'
                        : 'bg-rose-50 text-rose-700 border border-rose-300'
                    }`}
                  >
                    {loan.status}
                  </span>
                  <span className="text-xs text-slate-500">Masuk: {loan.createdAt}</span>
                </div>

                {/* Priority Status Badge */}
                {loan.status === 'Menunggu Persetujuan' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Menunggu Keputusan Otorisasi</span>
                  </span>
                )}
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                {/* Borrower details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block">
                    Peminjam
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm">{loan.borrowerName}</h4>
                  <p className="text-slate-700">
                    {loan.borrowerRole} • {loan.departmentOrClass}
                  </p>
                  <p className="text-slate-500">NIP/ID: {loan.borrowerNipOrId}</p>
                  <p className="text-slate-500">WhatsApp: {loan.borrowerPhone}</p>
                </div>

                {/* Schedule */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block">
                    Periode Peminjaman
                  </span>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Mulai:</span>
                    <span className="font-bold text-slate-900">
                      {formatIndonesianDate(loan.startDate)} {loan.startTime || '08:00'} WIB
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Selesai:</span>
                    <span className="font-bold text-slate-900">
                      {formatIndonesianDate(loan.endDate)} {loan.endTime || '16:00'} WIB
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block">
                    Item Sarpras Diminta
                  </span>
                  <ul className="space-y-1.5">
                    {loan.items.map((i, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-200"
                      >
                        <span className="text-slate-800 font-medium truncate max-w-[150px]">
                          {i.itemName}
                        </span>
                        <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px]">
                          {i.quantity} {i.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Purpose */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="text-slate-500 font-semibold mr-1.5">Keperluan Acara:</span>
                <span>{loan.purpose}</span>
              </div>

              {/* Action Buttons for Admin */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
                {loan.status === 'Menunggu Persetujuan' && (
                  <>
                    <button
                      onClick={() => {
                        setRejectingLoan(loan);
                        setRejectionReason('');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tolak Permohonan</span>
                    </button>
                    <button
                      onClick={() => {
                        setApprovingLoan(loan);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui Peminjaman</span>
                    </button>
                  </>
                )}

                {loan.status === 'Disetujui' && (
                  <button
                    onClick={() => onMarkHandover(loan.id)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>Konfirmasi Serah Terima (Sedang Dipinjam)</span>
                  </button>
                )}

                {loan.status === 'Sedang Dipinjam' && (
                  <button
                    onClick={() => onMarkReturned(loan.id)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Konfirmasi Sarpras Selesai / Dikembalikan</span>
                  </button>
                )}

                {loan.status === 'Selesai' && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pengembalian diverifikasi oleh petugas pada {loan.returnedAt || 'selesai'}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal (White theme) */}
      {rejectingLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md glass-modal rounded-3xl p-6 sm:p-7 border border-rose-200 bg-white space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <FileX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tolak Pengajuan Sarpras</h3>
                <p className="text-xs text-slate-500">{rejectingLoan.loanCode} • {rejectingLoan.borrowerName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Alasan Penolakan <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Contoh: Jadwal ruangan bentrok dengan agenda asesmen provinsi, atau stok barang sedang dalam kalibrasi teknis..."
                className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-300 focus:bg-white focus:border-rose-500 text-xs outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setRejectingLoan(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/25 flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Kirim Penolakan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Notes Modal (White theme) */}
      {approvingLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md glass-modal rounded-3xl p-6 sm:p-7 border border-emerald-200 bg-white space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Setujui Peminjaman Sarpras</h3>
                <p className="text-xs text-slate-500">{approvingLoan.loanCode} • {approvingLoan.borrowerName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Catatan / Instruksi Petugas (Opsional)
              </label>
              <textarea
                rows={3}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Tuliskan petunjuk khusus pengambilan kunci / pengecekan kabel..."
                className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-300 focus:bg-white focus:border-emerald-500 text-xs outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
              Setelah disetujui, peminjam akan menerima notifikasi otomatis secara real-time dan 
              dapat langsung mencetak Kartu Peminjaman PDF resmi.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setApprovingLoan(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmApprove}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Persetujuan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
