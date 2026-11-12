import React, { useState } from 'react';
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  Building2,
  X,
  Save,
  Barcode,
  Printer,
} from 'lucide-react';
import { SarprasItem, ItemType, ItemCategory, ItemCondition } from '../types';

interface AdminMasterCrudProps {
  items: SarprasItem[];
  onAddItem: (newItem: SarprasItem) => void;
  onUpdateItem: (updatedItem: SarprasItem) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenLabelModal?: (itemId?: string) => void;
}

const CATEGORIES: ItemCategory[] = [
  'Elektronik & Multimedia',
  'Ruangan & Aula',
  'Laboratorium',
  'Olahraga',
  'Perlengkapan Acara',
  'Kendaraan Operasional',
];

export const AdminMasterCrud: React.FC<AdminMasterCrudProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onOpenLabelModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SarprasItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<ItemType>('barang');
  const [category, setCategory] = useState<ItemCategory>('Elektronik & Multimedia');
  const [location, setLocation] = useState('');
  const [totalQuantity, setTotalQuantity] = useState<number>(1);
  const [availableQuantity, setAvailableQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('Unit');
  const [condition, setCondition] = useState<ItemCondition>('Baik');
  const [picName, setPicName] = useState('');
  const [picPhone, setPicPhone] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [capacity, setCapacity] = useState<number>(0);

  const resetForm = () => {
    setCode('');
    setName('');
    setType('barang');
    setCategory('Elektronik & Multimedia');
    setLocation('');
    setTotalQuantity(1);
    setAvailableQuantity(1);
    setUnit('Unit');
    setCondition('Baik');
    setPicName('Petugas Sarpras');
    setPicPhone('0812-0000-0000');
    setDescription('');
    setImageUrl('');
    setCapacity(0);
    setEditingItem(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: SarprasItem) => {
    setEditingItem(item);
    setCode(item.code);
    setName(item.name);
    setType(item.type);
    setCategory(item.category);
    setLocation(item.location);
    setTotalQuantity(item.totalQuantity);
    setAvailableQuantity(item.availableQuantity);
    setUnit(item.unit);
    setCondition(item.condition);
    setPicName(item.picName);
    setPicPhone(item.picPhone);
    setDescription(item.description);
    setImageUrl(item.imageUrl || '');
    setCapacity(item.capacity || 0);
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const fallbackImage =
      type === 'ruang'
        ? 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80';

    if (editingItem) {
      // Update
      const updated: SarprasItem = {
        ...editingItem,
        code: code.trim(),
        name: name.trim(),
        type,
        category,
        location: location.trim(),
        totalQuantity: Number(totalQuantity),
        availableQuantity: Math.min(Number(availableQuantity), Number(totalQuantity)),
        unit: unit.trim() || 'Unit',
        condition,
        picName: picName.trim(),
        picPhone: picPhone.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || editingItem.imageUrl || fallbackImage,
        capacity: type === 'ruang' ? Number(capacity) : undefined,
      };
      onUpdateItem(updated);
    } else {
      // Create
      const newItem: SarprasItem = {
        id: `item-${Date.now()}`,
        code: code.trim() || `AST-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        type,
        category,
        location: location.trim() || 'Gudang Sarpras Utama',
        totalQuantity: Number(totalQuantity),
        availableQuantity: Number(availableQuantity),
        unit: unit.trim() || (type === 'ruang' ? 'Ruang' : 'Unit'),
        condition,
        picName: picName.trim() || 'Petugas Sarpras',
        picPhone: picPhone.trim() || '0812-3456-7890',
        description: description.trim(),
        imageUrl: imageUrl.trim() || fallbackImage,
        capacity: type === 'ruang' ? Number(capacity) : undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddItem(newItem);
    }

    setIsFormModalOpen(false);
    resetForm();
  };

  const handleQuickAdjustStock = (item: SarprasItem, delta: number) => {
    const newAvail = Math.max(0, Math.min(item.totalQuantity, item.availableQuantity + delta));
    onUpdateItem({
      ...item,
      availableQuantity: newAvail,
    });
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner (White theme) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-purple-50/50 to-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold shadow-2xs">
            <Database className="w-3.5 h-3.5" />
            <span>Master Data Manajemen Sarana & Prasarana</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kelola Aset & <span className="text-gradient-primary">Inventaris Sarpras</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Sistem CRUD komprehensif untuk menambah, memperbarui rincian, mengatur kuota ketersediaan,
            dan memonitor kondisi fisik setiap aset barang serta fasilitas ruangan.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenLabelModal && (
            <button
              onClick={() => onOpenLabelModal()}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Barcode className="w-4 h-4 text-blue-600" />
              <span>Cetak Label Barcode</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Aset / Ruangan Baru</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kode aset, nama barang atau lokasi gedung..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 text-xs sm:text-sm outline-none focus:bg-white focus:border-purple-500 shadow-inner"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white text-slate-800 border border-slate-200 text-xs outline-none cursor-pointer shadow-2xs"
          >
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white text-slate-800 border border-slate-200 text-xs outline-none cursor-pointer shadow-2xs"
          >
            <option value="all">Semua Kondisi</option>
            <option value="Baik">Kondisi Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Dalam Perawatan">Dalam Perawatan</option>
          </select>
        </div>
      </div>

      {/* Inventory Table (White theme) */}
      <div className="glass-panel rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-4 px-5">Kode & Nama Aset</th>
                <th className="py-4 px-4">Tipe & Kategori</th>
                <th className="py-4 px-4">Lokasi & PIC</th>
                <th className="py-4 px-4">Kondisi Fisik</th>
                <th className="py-4 px-4">Stok (Tersedia / Total)</th>
                <th className="py-4 px-5 text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-500">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">Belum ada data inventaris sarpras</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Master data masih kosong agar dapat diisi secara manual. Klik tombol di bawah untuk mendaftarkan barang atau ruangan pertama Anda.
                    </p>
                    <button
                      onClick={handleOpenAddModal}
                      className="mt-4 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Aset Pertama</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isAvailable = item.availableQuantity > 0;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Code & Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-slate-100"
                          />
                          <div>
                            <span className="font-mono font-bold text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              {item.code}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
                        </div>
                      </td>

                      {/* Type & Category */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 block truncate max-w-[140px]">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            {item.type === 'ruang' ? (
                              <Building2 className="w-3 h-3 text-purple-600" />
                            ) : (
                              <Package className="w-3 h-3 text-cyan-600" />
                            )}
                            <span className="capitalize">{item.type}</span>
                          </span>
                        </div>
                      </td>

                      {/* Location & PIC */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="text-slate-800 font-medium block truncate max-w-[130px]">
                            {item.location}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            PIC: {item.picName}
                          </span>
                        </div>
                      </td>

                      {/* Condition */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            item.condition === 'Baik'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : item.condition === 'Rusak Ringan'
                              ? 'bg-amber-50 text-amber-700 border border-amber-300'
                              : 'bg-rose-50 text-rose-700 border border-rose-300'
                          }`}
                        >
                          {item.condition}
                        </span>
                      </td>

                      {/* Stock with quick buttons */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              isAvailable ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {item.availableQuantity}
                          </span>
                          <span className="text-slate-400">/</span>
                          <span className="text-slate-700">
                            {item.totalQuantity} {item.unit}
                          </span>

                          {/* Quick Adjust Buttons */}
                          <div className="flex items-center ml-2 bg-slate-100 rounded-lg border border-slate-200">
                            <button
                              onClick={() => handleQuickAdjustStock(item, 1)}
                              title="Tambah stok tersedia (+1)"
                              className="px-2 py-0.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleQuickAdjustStock(item, -1)}
                              title="Kurangi stok tersedia (-1)"
                              className="px-2 py-0.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {onOpenLabelModal && (
                            <button
                              onClick={() => onOpenLabelModal(item.id)}
                              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all cursor-pointer"
                              title="Cetak Label Barcode Aset"
                            >
                              <Barcode className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
                            title="Edit Data Aset"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingItemId(item.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-all cursor-pointer"
                            title="Hapus Aset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal Form (White theme) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl glass-modal rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white space-y-6 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingItem ? 'Edit Data Master Sarpras' : 'Tambah Aset Sarpras Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lengkapi spesifikasi aset barang atau fasilitas ruangan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kode Aset / Barcode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Contoh: PRJ-01 atau RNG-LAB-01"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Sarpras <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setType('barang')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        type === 'barang'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      Barang / Alat
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('ruang')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        type === 'ruang'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      Ruangan / Aula
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Sarana / Prasarana <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Proyektor Laser Epson EB-L200F atau Aula Graha Nusantara"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi Penempatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Gedung A Lantai 2 / Gudang Sarpras"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Total Stok <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Tersedia Saat Ini <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={totalQuantity}
                    required
                    value={availableQuantity}
                    onChange={(e) => setAvailableQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Satuan Unit
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Unit, Ruang, Set, Buah"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kondisi Fisik Terkini
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  >
                    <option value="Baik">Kondisi Baik & Siap Digunakan</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Dalam Perawatan">Dalam Perawatan / Kalibrasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    placeholder="Contoh: Pak Hadi"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kontak WhatsApp PIC
                  </label>
                  <input
                    type="text"
                    value={picPhone}
                    onChange={(e) => setPicPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                {type === 'ruang' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kapasitas Orang (Untuk Ruangan)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                      placeholder="Contoh: 150"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Foto Aset (Opsional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deskripsi & Catatan Spesifikasi
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tuliskan kelengkapan aksesoris, kabel, spesifikasi teknis, atau syarat khusus pemakaian..."
                    className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Perbarui Data Master' : 'Simpan Aset Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (White theme) */}
      {deletingItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm glass-modal rounded-3xl p-6 border border-rose-200 bg-white text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Hapus Aset Ini?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tindakan ini akan menghapus aset sarpras dari basis data master inventaris.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingItemId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteItem(deletingItemId);
                  setDeletingItemId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/25 cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
