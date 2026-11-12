import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Building2,
  Package,
  Users,
  Info,
  Phone,
  CalendarCheck,
} from 'lucide-react';
import { SarprasItem } from '../types';
import { filterSarprasItems } from '../utils/loanRules';

interface ItemCatalogProps {
  items: SarprasItem[];
  onSelectItemForLoan: (item: SarprasItem) => void;
  onOpenNewLoanModal: () => void;
}

const CATEGORIES: { label: string; value: string; icon: string }[] = [
  { label: 'Semua Kategori', value: 'all', icon: '✨' },
  { label: 'Elektronik & Multimedia', value: 'Elektronik & Multimedia', icon: '💻' },
  { label: 'Ruangan & Aula', value: 'Ruangan & Aula', icon: '🏛️' },
  { label: 'Laboratorium', value: 'Laboratorium', icon: '🔬' },
  { label: 'Olahraga', value: 'Olahraga', icon: '⚽' },
  { label: 'Perlengkapan Acara', value: 'Perlengkapan Acara', icon: '🎤' },
  { label: 'Kendaraan Operasional', value: 'Kendaraan Operasional', icon: '🚐' },
];

export const ItemCatalog: React.FC<ItemCatalogProps> = ({
  items,
  onSelectItemForLoan,
  onOpenNewLoanModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [detailModalItem, setDetailModalItem] = useState<SarprasItem | null>(null);

  // Extract distinct locations
  const locations = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.location) set.add(item.location);
    });
    return Array.from(set).sort();
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return filterSarprasItems(
      items,
      searchQuery,
      selectedCategory,
      selectedLocation,
      selectedAvailability,
      selectedType
    );
  }, [items, searchQuery, selectedCategory, selectedLocation, selectedAvailability, selectedType]);

  // Quick stats
  const totalAvailable = items.reduce((sum, i) => sum + i.availableQuantity, 0);
  const totalItemsCount = items.length;
  const availableRoomsCount = items.filter(
    (i) => i.type === 'ruang' && i.availableQuantity > 0 && i.condition !== 'Dalam Perawatan'
  ).length;

  return (
    <div className="space-y-8 pb-16">
      {/* 3D Glass Hero Banner (White theme) */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 glass-panel border border-indigo-100 shadow-lg bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/60">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sistem Peminjaman Terbuka & Real-time untuk Guru & Staf</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Eksplorasi & Pinjam <br />
              <span className="text-gradient-primary">Sarana Prasarana Sekolah</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Cek stok ketersediaan barang dan ruang secara transparan, ajukan permohonan secara mandiri, 
              dapatkan persetujuan admin instan, dan cetak kartu bukti peminjaman digital resmi.
            </p>
          </div>

          {/* Quick Metrics Badges in 3D Card Style */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:w-96">
            <div className="card-3d-tilt glass-panel-light p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 text-center bg-white shadow-xs">
              <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">
                {totalItemsCount}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Master Sarpras</span>
            </div>
            <div className="card-3d-tilt glass-panel-light p-3.5 sm:p-4 rounded-2xl border border-emerald-200 text-center bg-emerald-50/50 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {totalAvailable}
              </span>
              <span className="text-[11px] sm:text-xs text-emerald-700 font-medium">Unit Tersedia</span>
            </div>
            <div className="card-3d-tilt glass-panel-light p-3.5 sm:p-4 rounded-2xl border border-indigo-200 text-center bg-indigo-50/50 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-extrabold text-indigo-700">
                {availableRoomsCount}
              </span>
              <span className="text-[11px] sm:text-xs text-indigo-600 font-medium">Ruang Siap Pakai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm bg-white">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama barang, ruangan, kode aset (misal: proyektor, aula, sound)..."
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-xs px-2 py-1 bg-slate-200 rounded-md cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Type Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Jenis
            </button>
            <button
              onClick={() => setSelectedType('barang')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedType === 'barang'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Barang
            </button>
            <button
              onClick={() => setSelectedType('ruang')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedType === 'ruang'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Ruangan
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500/30'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Dropdown Filters: Location and Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lokasi Penempatan</span>
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white text-slate-800 border border-slate-200 text-xs focus:border-indigo-500 outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">Semua Lokasi Gedung & Gudang</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status Ketersediaan</span>
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white text-slate-800 border border-slate-200 text-xs focus:border-indigo-500 outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">Semua Status</option>
              <option value="tersedia">✅ Tersedia untuk Dipinjam</option>
              <option value="habis">❌ Sedang Penuh / Dipinjam</option>
              <option value="perawatan">⚠️ Dalam Perawatan / Maintenance</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLocation('all');
                setSelectedAvailability('all');
                setSelectedType('all');
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors border border-slate-200 text-center cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        </div>
      </div>

      {/* Item Count Notice */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs sm:text-sm text-slate-500">
          Menampilkan <span className="font-bold text-slate-900">{filteredItems.length}</span> dari total{' '}
          <span className="font-bold text-slate-900">{items.length}</span> sarana & prasarana
        </p>
      </div>

      {/* Grid of 3D Cards */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200 space-y-4 bg-white">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Tidak ada inventaris yang cocok</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau reset filter kategori, lokasi, dan status ketersediaan.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLocation('all');
              setSelectedAvailability('all');
              setSelectedType('all');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Bersihkan Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isAvailable = item.availableQuantity > 0 && item.condition !== 'Dalam Perawatan';
            const isMaintenance = item.condition === 'Dalam Perawatan';

            return (
              <div
                key={item.id}
                className="card-3d-tilt group glass-panel rounded-3xl overflow-hidden border border-slate-200/90 hover:border-indigo-400/60 bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges Container */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-white/95 text-indigo-900 border border-indigo-200 backdrop-blur-md shadow-xs">
                        {item.code}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/95 text-slate-700 border border-slate-200 backdrop-blur-md flex items-center gap-1 shadow-xs">
                        {item.type === 'ruang' ? (
                          <>
                            <Building2 className="w-3 h-3 text-purple-600" />
                            <span>Ruang</span>
                          </>
                        ) : (
                          <>
                            <Package className="w-3 h-3 text-cyan-600" />
                            <span>Barang</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Availability Tag on Top Right */}
                    <div className="absolute top-3 right-3">
                      {isMaintenance ? (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Perawatan</span>
                        </span>
                      ) : isAvailable ? (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>
                            {item.availableQuantity} {item.unit} Siap
                          </span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white shadow-sm flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Dipinjam Penuh</span>
                        </span>
                      )}
                    </div>

                    {/* Capacity badge for rooms */}
                    {item.type === 'ruang' && item.capacity && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 text-purple-900 border border-purple-200 text-xs font-medium flex items-center gap-1 backdrop-blur-md shadow-xs">
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span>Kapasitas {item.capacity} Orang</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {item.name}
                      </h2>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Location and PIC */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate text-slate-700">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate text-slate-700">
                          PIC: {item.picName} ({item.picPhone})
                        </span>
                      </div>
                    </div>

                    {/* Stock meter */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Ketersediaan Stok</span>
                        <span className="font-bold text-slate-800">
                          {item.availableQuantity} / {item.totalQuantity} {item.unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.availableQuantity === 0
                              ? 'bg-rose-500'
                              : item.availableQuantity < item.totalQuantity * 0.4
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((item.availableQuantity / item.totalQuantity) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setDetailModalItem(item)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Detail</span>
                  </button>

                  <button
                    onClick={() => onSelectItemForLoan(item)}
                    disabled={!isAvailable}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isAvailable
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{isAvailable ? 'Pinjam Sekarang' : 'Tidak Tersedia'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Detail Modal (White theme) */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl glass-modal rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {detailModalItem.category} • {detailModalItem.code}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {detailModalItem.name}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={detailModalItem.imageUrl}
                alt={detailModalItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Deskripsi Spesifikasi
                </h4>
                <p className="leading-relaxed">{detailModalItem.description}</p>
              </div>

              {detailModalItem.features && detailModalItem.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Fitur & Kelengkapan
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {detailModalItem.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Lokasi Penyimpanan:</span>
                  <span className="font-semibold text-slate-900">{detailModalItem.location}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Penanggung Jawab (PIC):</span>
                  <span className="font-semibold text-slate-900">
                    {detailModalItem.picName} ({detailModalItem.picPhone})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setDetailModalItem(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const itm = detailModalItem;
                  setDetailModalItem(null);
                  onSelectItemForLoan(itm);
                }}
                disabled={
                  detailModalItem.availableQuantity <= 0 ||
                  detailModalItem.condition === 'Dalam Perawatan'
                }
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                Ajukan Pinjam Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
