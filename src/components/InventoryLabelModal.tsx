import React, { useState } from 'react';
import {
  X,
  Printer,
  QrCode,
  Barcode,
  Check,
  Building,
  Tag,
  Copy,
  SlidersHorizontal,
  FileCheck,
} from 'lucide-react';
import { SarprasItem } from '../types';

interface InventoryLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SarprasItem[];
  preSelectedItemId?: string;
}

export const InventoryLabelModal: React.FC<InventoryLabelModalProps> = ({
  isOpen,
  onClose,
  items,
  preSelectedItemId,
}) => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() => {
    if (preSelectedItemId) return [preSelectedItemId];
    return items.map((i) => i.id);
  });
  const [labelSize, setLabelSize] = useState<'standard' | 'compact'>('standard');
  const [includeQR, setIncludeQR] = useState(true);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItemIds(items.map((i) => i.id));
  };

  const deselectAll = () => {
    setSelectedItemIds([]);
  };

  const selectedItems = items.filter((i) => selectedItemIds.includes(i.id));

  // Generates unique faux barcode stripes based on code string
  const renderBarcodeBars = (code: string) => {
    const bars = [];
    for (let i = 0; i < code.length * 4; i++) {
      const charCode = code.charCodeAt(i % code.length);
      const isThick = (charCode + i) % 3 === 0;
      const width = isThick ? 3 : 1.5;
      bars.push(
        <div
          key={i}
          className="bg-slate-900 inline-block h-7"
          style={{ width: `${width}px`, marginRight: `${(i % 2) + 1.2}px` }}
        />
      );
    }
    return bars;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Non-print) */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-xs">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Cetak Label & Barcode Aset Inventaris</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  {selectedItems.length} Label Terpilih
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Format stiker aset standar instansi siap cetak pada kertas stiker / HVS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => window.print()}
              disabled={selectedItems.length === 0}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Stiker Label</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Options Toolbar (Non-print) */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Pilih Item:</span>
            <button
              onClick={selectAll}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
            >
              Pilih Semua ({items.length})
            </button>
            <button
              onClick={deselectAll}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
            >
              Bersihkan
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={includeQR}
                onChange={(e) => setIncludeQR(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Sertakan QR Code</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Ukuran:</span>
              <button
                onClick={() => setLabelSize('standard')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  labelSize === 'standard' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Standar
              </button>
              <button
                onClick={() => setLabelSize('compact')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  labelSize === 'compact' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Kompak
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Printable Label Sheet */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/70 print:p-0 print:bg-white">
          {selectedItems.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Barcode className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Belum ada aset yang dipilih</p>
              <p className="text-xs text-slate-500">Pilih satu atau lebih aset untuk mencetak label stiker.</p>
              <button
                onClick={selectAll}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer"
              >
                Pilih Semua Aset
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3 print:m-0">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between print:rounded-lg print:border-black print:break-inside-avoid"
                  style={{ minHeight: labelSize === 'standard' ? '190px' : '150px' }}
                >
                  {/* Top Header */}
                  <div className="border-b-2 border-slate-800 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">
                        S
                      </div>
                      <span className="font-extrabold text-[11px] tracking-wider text-slate-900 uppercase">
                        SARPRASHUB • MILIK INSTANSI
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                      {item.type === 'barang' ? 'BARANG INVENTARIS' : 'RUANG / FASILITAS'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="text-xs font-mono font-black text-blue-700 tracking-wide">
                        {item.code}
                      </div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-600 flex items-center gap-2 pt-0.5">
                        <span>Lokasi: <strong>{item.location}</strong></span>
                        <span>•</span>
                        <span>Kategori: <strong>{item.category}</strong></span>
                      </div>
                    </div>

                    {/* QR Code Simulation */}
                    {includeQR && (
                      <div className="w-16 h-16 bg-slate-50 border border-slate-300 rounded-lg p-1 shrink-0 flex flex-col items-center justify-center">
                        <QrCode className="w-11 h-11 text-slate-900" />
                        <span className="text-[8px] font-mono text-slate-600 font-bold">VERIFIED</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Barcode */}
                  <div className="border-t border-slate-200 pt-2 flex flex-col items-center justify-center">
                    <div className="overflow-hidden flex items-center justify-center">
                      {renderBarcodeBars(item.code)}
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-800 mt-0.5">
                      *{item.code}*
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
