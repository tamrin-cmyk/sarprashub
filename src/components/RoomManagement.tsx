import React, { useState } from 'react';
import {
  Building,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  MapPin,
  ShieldCheck,
  DoorOpen,
  CalendarCheck2,
} from 'lucide-react';
import { SarprasItem, LoanRequest } from '../types';

interface RoomManagementProps {
  items: SarprasItem[];
  loans: LoanRequest[];
  onUpdateItem: (item: SarprasItem) => void;
  onAddItem: (item: SarprasItem) => void;
  onOpenLabelModal: (itemId?: string) => void;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({
  items,
  loans,
  onUpdateItem,
  onAddItem,
  onOpenLabelModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  // Filter only room items
  const rooms = items.filter((item) => item.type === 'ruang');

  const buildings = ['Semua', ...Array.from(new Set(rooms.map((r) => r.location)))];

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.picName && room.picName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBuilding = selectedBuilding === 'Semua' || room.location === selectedBuilding;
    const matchesStatus =
      selectedStatus === 'Semua' ||
      (selectedStatus === 'available' && room.availableQuantity > 0 && room.condition === 'Baik') ||
      (selectedStatus === 'occupied' && room.availableQuantity === 0 && room.condition === 'Baik') ||
      (selectedStatus === 'maintenance' && room.condition !== 'Baik');

    return matchesSearch && matchesBuilding && matchesStatus;
  });

  const handleToggleMaintenance = (room: SarprasItem) => {
    const newCondition = room.condition === 'Dalam Perawatan' ? 'Baik' : 'Dalam Perawatan';
    const newAvailable = newCondition === 'Dalam Perawatan' ? 0 : room.totalQuantity;
    onUpdateItem({
      ...room,
      condition: newCondition as any,
      availableQuantity: newAvailable,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="clay-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Manajemen Sarana Gedung, Aula & Laboratorium</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Ruangan & Lokasi Fasilitas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Kelola data master ruangan serbaguna, laboratorium CBT, ruang rapat eksekutif, dan fasilitas olahraga. Pantau kapasitas, PIC penanggung jawab, dan jadwal pemakaian.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onOpenLabelModal()}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Cetak Label Ruangan</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="clay-card p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama ruang, kode, atau PIC..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>Lokasi:</span>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium cursor-pointer"
            >
              {buildings.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="available">Siap Pakai</option>
              <option value="occupied">Sedang Digunakan</option>
              <option value="maintenance">Dalam Perawatan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="clay-card p-12 text-center rounded-3xl border border-slate-200 space-y-4 bg-white/95">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Belum Ada Data Ruangan & Fasilitas</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Basis data ruangan saat ini masih kosong agar dapat diisi secara manual. Tambahkan aula, laboratorium, atau ruang rapat baru melalui menu Data Inventaris dengan memilih tipe "Ruangan".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            const isMaintenance = room.condition === 'Dalam Perawatan';
            const isOccupied = !isMaintenance && room.availableQuantity === 0;
            const isAvailable = !isMaintenance && room.availableQuantity > 0;

            // Find active loans using this room
            const activeLoan = loans.find(
              (l) =>
                (l.status === 'Disetujui' || l.status === 'Sedang Dipinjam') &&
                l.items.some((itm) => itm.itemId === room.id)
            );

            return (
              <div
                key={room.id}
                className="clay-card overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all"
              >
                <div>
                {/* Photo & Badges */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[11px] font-mono font-bold text-blue-700 shadow-sm">
                      {room.code}
                    </span>
                    {room.capacity && (
                      <span className="px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{room.capacity} Orang</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-white font-medium drop-shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-amber-300" />
                      <span>{room.location}</span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${
                        isAvailable
                          ? 'bg-emerald-500 text-white'
                          : isOccupied
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {isAvailable ? 'Siap Pakai' : isOccupied ? 'Sedang Digunakan' : 'Perawatan'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
                    {room.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>

                  {/* Active reservation alert if any */}
                  {activeLoan && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Peminjaman Aktif ({activeLoan.loanCode})</span>
                      </div>
                      <p className="text-[11px]">
                        Pemohon: <strong>{activeLoan.borrowerName}</strong> ({activeLoan.startDate} s.d {activeLoan.endDate})
                      </p>
                    </div>
                  )}

                  {/* PIC Info */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Penanggung Jawab (PIC):</span>
                      <span className="font-semibold text-slate-800">{room.picName}</span>
                    </div>
                    {room.picPhone && (
                      <a
                        href={`https://wa.me/${room.picPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Hubungi WhatsApp PIC"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenLabelModal(room.id)}
                  className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  Cetak Label
                </button>
                <button
                  onClick={() => handleToggleMaintenance(room)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isMaintenance
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {isMaintenance ? 'Aktifkan Kembali' : 'Set Perawatan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
