import React, { useState } from 'react';
import {
  Settings,
  Shield,
  KeyRound,
  User,
  Bell,
  Database,
  Lock,
  LogOut,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Building,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface UserSettingsViewProps {
  isAdmin: boolean;
  onRequireAdminAuth: () => void;
  onLogoutAdmin: () => void;
  onOpenChangePassword: () => void;
  onResetData: () => void;
  totalItems: number;
  totalLoans: number;
}

export const UserSettingsView: React.FC<UserSettingsViewProps> = ({
  isAdmin,
  onRequireAdminAuth,
  onLogoutAdmin,
  onOpenChangePassword,
  onResetData,
  totalItems,
  totalLoans,
}) => {
  const [enableSound, setEnableSound] = useState(true);
  const [autoEmailNotify, setAutoEmailNotify] = useState(true);
  const [instituteName, setInstituteName] = useState('SMK Negeri 1 Sarpras Indonesia');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      items: localStorage.getItem('sarpras_items'),
      loans: localStorage.getItem('sarpras_loans'),
      notifications: localStorage.getItem('sarpras_notifications'),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sarpras_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="clay-card p-6 sm:p-8 rounded-3xl bg-white/95 border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Settings className="w-3.5 h-3.5" />
            <span>Konfigurasi & Pengaturan Sistem SarprasHub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pengaturan Pengguna & Hak Akses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
            Kelola identitas akun, kredensial keamanan admin, preferensi notifikasi real-time, dan pemeliharaan basis data inventaris.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs ${
              isAdmin
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}
          >
            {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
            <span>{isAdmin ? 'Otoritas: Admin Pengelola' : 'Otoritas: Pengguna Publik'}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Role & Security */}
        <div className="md:col-span-1 space-y-6">
          {/* Admin Security Card */}
          <div className="clay-card p-5 sm:p-6 rounded-3xl bg-white/95 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Keamanan Admin</h3>
                <span className="text-[10px] text-slate-400">Proteksi login & password</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isAdmin
                ? 'Sesi Admin sedang aktif. Anda memiliki hak akses penuh untuk persetujuan transaksi, pengembalian aset, dan pengelolaan data master.'
                : 'Masuk dengan kredensial pengelola sarpras untuk membuka menu Data Inventaris, Ruangan, dan persetujuan pengajuan.'}
            </p>

            <div className="space-y-2 pt-2">
              {isAdmin ? (
                <>
                  <button
                    onClick={onOpenChangePassword}
                    className="w-full py-2.5 px-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Ubah Password Admin</span>
                  </button>
                  <button
                    onClick={onLogoutAdmin}
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-colors border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Akun Admin</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onRequireAdminAuth}
                  className="w-full py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login Sebagai Admin</span>
                </button>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">Kredensial Bawaan:</span>
              <div>Username: <code className="text-purple-600 font-mono font-bold">admin</code></div>
              <div>Password: <code className="text-purple-600 font-mono font-bold">admin123</code></div>
            </div>
          </div>

          {/* Database & Data Stats */}
          <div className="clay-card p-5 sm:p-6 rounded-3xl bg-white/95 border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Penyimpanan Lokal</h3>
                <span className="text-[10px] text-slate-400">LocalStorage Browser</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600 font-medium">Data Inventaris:</span>
                <span className="font-bold text-slate-900">{totalItems} aset</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600 font-medium">Transaksi Peminjaman:</span>
                <span className="font-bold text-slate-900">{totalLoans} berkas</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleExportBackup}
                className="w-full py-2 px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Export Cadangan (JSON)</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Apakah Anda yakin ingin mengatur ulang data kembali ke contoh awal? Semua perubahan data yang belum dicadangkan akan kembali ke default.')) {
                    onResetData();
                  }
                }}
                className="w-full py-2 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Data ke Contoh Default</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: General Settings Form */}
        <div className="md:col-span-2 space-y-6">
          <form
            onSubmit={handleSaveGeneral}
            className="clay-card p-6 sm:p-7 rounded-3xl bg-white/95 border border-slate-200/90 space-y-6"
          >
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Profil & Preferensi Lembaga
              </h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Informasi ini ditampilkan pada cetak kartu peminjaman PDF resmi dan label barcode aset.
              </p>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Perubahan preferensi berhasil disimpan.</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Instansi / Sekolah:
                </label>
                <input
                  type="text"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Gedung & Lokasi Kampus:
                </label>
                <input
                  type="text"
                  defaultValue="Jl. Pendidikan No. 45, Kompleks Sarpras Terpadu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kepala Urusan Sarana & Prasarana (Kaur Sarpras):
                </label>
                <input
                  type="text"
                  defaultValue="Dr. H. Sulaiman, M.Pd (NIP. 19780512 200312 1 002)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>Notifikasi Real-Time & Audio</span>
                </h4>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Suara Notifikasi & Toast Pop-up
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Tampilkan notifikasi pop-up saat ada permohonan baru atau persetujuan admin.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableSound}
                    onChange={(e) => setEnableSound(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Integrasi Notifikasi Status Peminjaman
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Kirimkan pembaruan otomatis ke dasbor pemohon saat barang siap diambil.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoEmailNotify}
                    onChange={(e) => setAutoEmailNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </form>

          {/* System Spec & Version Card */}
          <div className="clay-card p-5 rounded-3xl bg-slate-50/90 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">SarprasHub Ecosystem v2.8 (Build 2026.04)</span>
                <span className="text-slate-500 text-[11px]">
                  React 19 • Vite • Tailwind 4 • Print Engine PDF Auto-Sign
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Status: <span className="text-emerald-600 font-bold">ONLINE & PERSISTENT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
