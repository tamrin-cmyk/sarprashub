import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  User,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SarprasItem, LoanRequest, LoanItemDetail } from '../types';
import { validateLoanRequest, generateLoanCode } from '../utils/loanRules';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableItems: SarprasItem[];
  preSelectedItem?: SarprasItem | null;
  onSubmitLoan: (newLoan: LoanRequest) => void;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  availableItems,
  preSelectedItem,
  onSubmitLoan,
}) => {
  // Form State
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerRole, setBorrowerRole] = useState<'Guru' | 'Staf' | 'Siswa' | 'Tamu / Umum'>('Guru');
  const [borrowerNipOrId, setBorrowerNipOrId] = useState('');
  const [borrowerPhone, setBorrowerPhone] = useState('');
  const [borrowerEmail, setBorrowerEmail] = useState('');
  const [departmentOrClass, setDepartmentOrClass] = useState('');
  const [purpose, setPurpose] = useState('');

  // Default dates: today
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState('08:00');
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState('16:00');

  // Items to borrow
  const [selectedItems, setSelectedItems] = useState<LoanItemDetail[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedItemToAdd, setSelectedItemToAdd] = useState<string>('');

  // Initialize pre-selected item
  useEffect(() => {
    if (preSelectedItem) {
      setSelectedItems([
        {
          itemId: preSelectedItem.id,
          itemName: preSelectedItem.name,
          itemCode: preSelectedItem.code,
          type: preSelectedItem.type,
          quantity: 1,
          unit: preSelectedItem.unit,
        },
      ]);
    } else if (availableItems.length > 0 && selectedItems.length === 0) {
      const first = availableItems.find(
        (i) => i.availableQuantity > 0 && i.condition !== 'Dalam Perawatan'
      );
      if (first) {
        setSelectedItems([
          {
            itemId: first.id,
            itemName: first.name,
            itemCode: first.code,
            type: first.type,
            quantity: 1,
            unit: first.unit,
          },
        ]);
      }
    }
  }, [preSelectedItem, isOpen]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!selectedItemToAdd) return;
    const target = availableItems.find((i) => i.id === selectedItemToAdd);
    if (!target) return;

    if (selectedItems.some((i) => i.itemId === target.id)) {
      alert('Barang atau ruangan ini sudah ditambahkan ke daftar pengajuan.');
      return;
    }

    setSelectedItems([
      ...selectedItems,
      {
        itemId: target.id,
        itemName: target.name,
        itemCode: target.code,
        type: target.type,
        quantity: 1,
        unit: target.unit,
      },
    ]);
    setSelectedItemToAdd('');
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.itemId !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    const target = availableItems.find((i) => i.id === itemId);
    const maxQty = target ? target.availableQuantity : 1;
    const boundedQty = Math.max(1, Math.min(qty, maxQty));

    setSelectedItems(
      selectedItems.map((item) =>
        item.itemId === itemId ? { ...item, quantity: boundedQty } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLoanRequest({
      borrowerName,
      borrowerNipOrId,
      borrowerPhone,
      purpose,
      startDate,
      endDate,
      items: selectedItems.map((i) => ({ itemId: i.itemId, quantity: i.quantity })),
    });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});

    const newLoan: LoanRequest = {
      id: `loan-${Date.now()}`,
      loanCode: generateLoanCode(),
      borrowerName: borrowerName.trim(),
      borrowerRole,
      borrowerNipOrId: borrowerNipOrId.trim(),
      borrowerPhone: borrowerPhone.trim(),
      borrowerEmail: borrowerEmail.trim() || `${borrowerName.toLowerCase().replace(/\s+/g, '.')}@sekolah.sch.id`,
      departmentOrClass: departmentOrClass.trim() || 'Umum',
      purpose: purpose.trim(),
      items: selectedItems,
      startDate,
      startTime,
      endDate,
      endTime,
      status: 'Menunggu Persetujuan',
      createdAt: `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
    };

    onSubmitLoan(newLoan);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-modal rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-6 text-slate-800">
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Formulir Pengajuan Peminjaman Online</h3>
              <p className="text-xs text-slate-500">
                Lengkapi identitas dan sarana yang dibutuhkan untuk ditinjau oleh Admin Sarpras
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup Formulir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Borrower Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Data Peminjam (Guru / Staf / Siswa)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Contoh: Dra. Sri Wahyuni, M.Pd"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:border-indigo-500 text-xs sm:text-sm outline-none"
                />
                {validationErrors.borrowerName && (
                  <p className="text-xs text-rose-500 mt-1">{validationErrors.borrowerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Peran / Kategori Peminjam <span className="text-rose-500">*</span>
                </label>
                <select
                  value={borrowerRole}
                  onChange={(e) => setBorrowerRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:border-indigo-500 text-xs sm:text-sm outline-none cursor-pointer"
                >
                  <option value="Guru">Guru / Tenaga Pendidik</option>
                  <option value="Staf">Staf Tenaga Kependidikan / Tata Usaha</option>
                  <option value="Siswa">Siswa / Pengurus OSIS</option>
                  <option value="Tamu / Umum">Komite Sekolah / Mitra Eksternal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  NIP / NIK / NISN / No. Identitas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={borrowerNipOrId}
                  onChange={(e) => setBorrowerNipOrId(e.target.value)}
                  placeholder="Contoh: 198204152006041005"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:border-indigo-500 text-xs sm:text-sm outline-none font-mono"
                />
                {validationErrors.borrowerNipOrId && (
                  <p className="text-xs text-rose-500 mt-1">{validationErrors.borrowerNipOrId}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Departemen / Unit / Kelas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={departmentOrClass}
                  onChange={(e) => setDepartmentOrClass(e.target.value)}
                  placeholder="Contoh: Guru Matematika / OSIS / TU"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:border-indigo-500 text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={borrowerPhone}
                  onChange={(e) => setBorrowerPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:border-indigo-500 text-xs sm:text-sm outline-none"
                />
                {validationErrors.borrowerPhone && (
                  <p className="text-xs text-rose-500 mt-1">{validationErrors.borrowerPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Institusi (Opsional)
                </label>
                <input
                  type="email"
                  value={borrowerEmail}
                  onChange={(e) => setBorrowerEmail(e.target.value)}
                  placeholder="nama@sekolah.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:border-indigo-500 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Items to Borrow */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Sarana / Prasarana yang Diajukan
                </h4>
              </div>
            </div>

            {/* List of currently selected items */}
            <div className="space-y-2.5">
              {selectedItems.length === 0 ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center">
                  Belum ada barang atau ruangan yang dipilih.
                </div>
              ) : (
                selectedItems.map((sel) => {
                  const masterItem = availableItems.find((i) => i.id === sel.itemId);
                  const maxAvail = masterItem ? masterItem.availableQuantity : 1;

                  return (
                    <div
                      key={sel.itemId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {sel.itemCode}
                          </span>
                          <span className="text-xs font-semibold text-purple-600 capitalize">
                            {sel.type}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900">{sel.itemName}</h5>
                        <p className="text-[11px] text-slate-500">
                          Maksimal tersedia saat ini: {maxAvail} {sel.unit}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {sel.type === 'barang' ? (
                          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                            <label className="text-[11px] font-medium text-slate-600">
                              Jumlah:
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={maxAvail}
                              value={sel.quantity}
                              onChange={(e) =>
                                handleUpdateQuantity(sel.itemId, parseInt(e.target.value) || 1)
                              }
                              className="w-14 px-2 py-1 bg-slate-50 text-slate-900 rounded text-xs text-center border border-slate-200 outline-none"
                            />
                            <span className="text-xs text-slate-600 font-medium">{sel.unit}</span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
                            1 Ruangan Penuh
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(sel.itemId)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                          title="Hapus dari daftar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add more item dropdown */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <select
                value={selectedItemToAdd}
                onChange={(e) => setSelectedItemToAdd(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-xs focus:bg-white focus:border-indigo-500 outline-none"
              >
                <option value="">+ Tambah sarana / alat lain ke formulir...</option>
                {availableItems
                  .filter((i) => i.availableQuantity > 0 && i.condition !== 'Dalam Perawatan')
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.code}] {item.name} ({item.availableQuantity} {item.unit} Tersedia)
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!selectedItemToAdd}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
              >
                <Plus className="w-4 h-4" />
                <span>Tambahkan</span>
              </button>
            </div>
          </div>

          {/* Section 3: Schedule Date and Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Waktu & Durasi Peminjaman
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-emerald-700 block">Jadwal Mulai Pinjam</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Tanggal</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 border border-slate-200 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Pukul</label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 border border-slate-200 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-teal-700 block">Rencana Pengembalian</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Tanggal</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 border border-slate-200 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Pukul</label>
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 border border-slate-200 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            {validationErrors.endDate && (
              <p className="text-xs text-rose-500">{validationErrors.endDate}</p>
            )}
          </div>

          {/* Section 4: Purpose */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
              4. Keperluan / Rincian Acara
            </h4>

            <textarea
              required
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Jelaskan secara singkat tujuan peminjaman, nama kegiatan, atau agenda yang akan dilaksanakan..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 text-slate-900 border border-slate-200 focus:bg-white focus:border-indigo-500 text-xs sm:text-sm outline-none"
            />
            {validationErrors.purpose && (
              <p className="text-xs text-rose-500">{validationErrors.purpose}</p>
            )}
          </div>

          {/* SOP Acceptance Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px] sm:text-xs">
              Dengan mengirimkan formulir ini, saya menyatakan bertanggung jawab penuh atas pemakaian dan 
              kebersihan sarana prasarana yang dipinjam serta bersedia mematuhi jadwal pengembalian tepat waktu.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kirim Pengajuan Online</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
