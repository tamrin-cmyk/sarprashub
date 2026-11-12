import React from 'react';
import {
  X,
  FileDown,
  Printer,
  ShieldCheck,
  Building,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { LoanRequest } from '../types';
import { formatIndonesianDate } from '../utils/loanRules';
import { downloadLoanCardPDF } from '../utils/pdfGenerator';

interface LoanCardPreviewModalProps {
  loan: LoanRequest | null;
  onClose: () => void;
}

export const LoanCardPreviewModal: React.FC<LoanCardPreviewModalProps> = ({
  loan,
  onClose,
}) => {
  if (!loan) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-300 my-6">
        {/* Modal Top Control Bar (Non-print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Pratinjau Kartu Peminjaman Resmi (PDF)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadLoanCardPDF(loan)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Unduh PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Tutup Pratinjau Kartu"
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Container */}
        <div className="p-6 sm:p-8 space-y-6 bg-slate-50 border-b border-slate-200" id="printable-loan-card">
          {/* Institution Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-indigo-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-indigo-950 tracking-tight">
                  SARPRAS<span className="text-indigo-600">HUB</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  Resmi
                </span>
              </div>
              <h2 className="text-xs font-bold text-slate-600 mt-0.5">
                DIVISI PENGELOLAAN SARANA, PRASARANA & INVENTARIS
              </h2>
              <p className="text-[11px] text-slate-500">
                Kartu Bukti Izin Pengambilan & Peminjaman Barang / Ruang
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                {loan.status.toUpperCase()}
              </span>
              <p className="font-mono text-xs font-bold text-slate-800 mt-1">{loan.loanCode}</p>
            </div>
          </div>

          {/* Barcode & Issue Details */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Kode Autentikasi Tiket
              </span>
              <span className="font-mono text-xs font-bold text-indigo-900 tracking-widest">
                {loan.loanCode}
              </span>
            </div>
            {/* Simulated barcode */}
            <div className="flex items-center gap-0.5 h-6">
              {[2, 3, 1, 4, 1, 2, 5, 2, 1, 3, 4, 2, 1, 3, 2, 4, 1, 2, 3].map((w, i) => (
                <div key={i} className="bg-slate-800 h-full" style={{ width: `${w * 1.5}px` }} />
              ))}
            </div>
          </div>

          {/* Borrower Information */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
              I. IDENTITAS PEMINJAM
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">Nama Lengkap:</span>
                <span className="font-bold text-slate-900">{loan.borrowerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Kategori & Unit:</span>
                <span className="font-semibold">{loan.borrowerRole} ({loan.departmentOrClass})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">NIP / NIK / ID:</span>
                <span className="font-mono font-medium">{loan.borrowerNipOrId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">No. WhatsApp:</span>
                <span className="font-medium">{loan.borrowerPhone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Keperluan Acara:</span>
                <span className="font-medium text-slate-800">{loan.purpose}</span>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 text-xs">
            <h4 className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] mb-1">
              II. JADWAL PENGGUNAAN SARPRAS
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-indigo-600 block text-[10px] font-semibold">Waktu Mulai:</span>
                <span className="font-bold text-indigo-950">
                  {formatIndonesianDate(loan.startDate)} pukul {loan.startTime || '08:00'} WIB
                </span>
              </div>
              <div>
                <span className="text-indigo-600 block text-[10px] font-semibold">Batas Pengembalian:</span>
                <span className="font-bold text-indigo-950">
                  {formatIndonesianDate(loan.endDate)} pukul {loan.endTime || '16:00'} WIB
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-1.5 text-xs">
            <h4 className="font-bold text-indigo-950 uppercase tracking-wider text-[11px]">
              III. DAFTAR SARANA PRASARANA
            </h4>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden text-[11px]">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="p-2">No</th>
                  <th className="p-2">Kode Aset</th>
                  <th className="p-2">Nama Barang / Ruangan</th>
                  <th className="p-2">Jenis</th>
                  <th className="p-2 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loan.items.map((itm, idx) => (
                  <tr key={idx} className="bg-white">
                    <td className="p-2 font-medium">{idx + 1}</td>
                    <td className="p-2 font-mono text-indigo-900 font-semibold">{itm.itemCode}</td>
                    <td className="p-2 font-bold text-slate-900">{itm.itemName}</td>
                    <td className="p-2 capitalize">{itm.type}</td>
                    <td className="p-2 text-right font-bold text-indigo-950">
                      {itm.quantity} {itm.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures & Official Stamp */}
          <div className="pt-4 flex items-end justify-between text-xs text-slate-700 border-t border-slate-200">
            <div className="text-center w-40">
              <span className="block text-[11px] text-slate-500 mb-10">Peminjam / Pemohon,</span>
              <span className="font-bold text-slate-900 block border-b border-slate-400 pb-0.5">
                {loan.borrowerName}
              </span>
              <span className="text-[10px] text-slate-500">Peminjam Sah</span>
            </div>

            {/* Official Stamp */}
            <div className="border-2 border-emerald-600 rounded-xl px-4 py-2 text-center text-emerald-700 bg-emerald-50/50 shadow-inner rotate-[-3deg]">
              <span className="block text-[10px] font-black tracking-widest uppercase">
                VERIFIED & APPROVED
              </span>
              <span className="block text-[8px] font-bold text-emerald-800">
                SARPRASHUB SYSTEM
              </span>
              <span className="block text-[7px] text-emerald-600">
                {loan.approvedAt || 'Sah Diverifikasi'}
              </span>
            </div>

            <div className="text-center w-40">
              <span className="block text-[11px] text-slate-500 mb-10">Petugas Sarpras,</span>
              <span className="font-bold text-slate-900 block border-b border-slate-400 pb-0.5">
                {loan.approvedBy || 'Admin Sarpras'}
              </span>
              <span className="text-[10px] text-slate-500">Pengelola Aset</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-100 px-6 py-4 flex items-center justify-between no-print">
          <p className="text-xs text-slate-500">
            Simpan atau cetak kartu ini untuk ditunjukkan saat pengambilan barang ke bagian Sarpras.
          </p>
          <button
            onClick={() => downloadLoanCardPDF(loan)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Unduh Berkas PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
