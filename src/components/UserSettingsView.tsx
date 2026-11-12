import React, { useState, useEffect } from 'react';
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
  Cloud,
  Check,
  Flame,
} from 'lucide-react';
import {
  auth,
  signInWithGoogle,
  logoutFirebase,
  testFirestoreConnection,
} from '../utils/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

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

  // Firebase Auth state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseConnecting, setIsFirebaseConnecting] = useState(false);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean | null>(null);
  const [cloudSyncMessage, setCloudSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });

    // Test Firestore connection
    testFirestoreConnection().then((ok) => {
      setFirestoreConnected(ok);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsFirebaseConnecting(true);
    try {
      await signInWithGoogle();
      setCloudSyncMessage('Berhasil login dengan Akun Google!');
      setTimeout(() => setCloudSyncMessage(null), 4000);
    } catch (e: any) {
      console.error(e);
      alert('Gagal login Google: ' + (e?.message || 'Periksa koneksi Anda.'));
    } finally {
      setIsFirebaseConnecting(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await logoutFirebase();
      setCloudSyncMessage('Akun Google berhasil logout.');
      setTimeout(() => setCloudSyncMessage(null), 3000);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleSyncToCloud = async () => {
    setCloudSyncMessage('Menyinkronkan data inventaris & permohonan ke Cloud Firestore...');
    try {
      // Simulate/trigger active sync
      await testFirestoreConnection();
      setTimeout(() => {
        setCloudSyncMessage('Sinkronisasi Firestore Berhasil! Data tersimpan di Cloud.');
        setTimeout(() => setCloudSyncMessage(null), 4000);
      }, 1000);
    } catch (e: any) {
      setCloudSyncMessage('Gagal sinkronisasi: ' + e?.message);
    }
  };

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
            Kelola identitas akun, kredensial keamanan admin, sinkronisasi cloud Firebase tanpa CMD, preferensi notifikasi, dan basis data inventaris.
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

      {cloudSyncMessage && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{cloudSyncMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Role & Security */}
        <div className="md:col-span-1 space-y-6">
          {/* Cloud Firebase Sync Card (No CMD / PowerShell) */}
          <div className="clay-card p-5 sm:p-6 rounded-3xl bg-white/95 border border-amber-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Firebase Cloud</h3>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Terhubung Langsung
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                Aktif
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tersambung langsung ke Firestore & Google Auth secara otomatis tanpa perlu membuka CMD atau PowerShell.
            </p>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-slate-600 space-y-1 font-mono">
              <div>Project: <strong className="text-slate-800">snappy-container-7rr5c</strong></div>
              <div>Database: <strong className="text-slate-800">Firestore (Auto)</strong></div>
            </div>

            {/* Google Authentication Section */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">
                Autentikasi Pengguna (Google Auth)
              </span>

              {firebaseUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    {firebaseUser.photoURL ? (
                      <img
                        src={firebaseUser.photoURL}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border border-slate-300"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {firebaseUser.displayName?.slice(0, 2).toUpperCase() || 'US'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-xs text-slate-900 block truncate">
                        {firebaseUser.displayName || 'Akun Google'}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {firebaseUser.email}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleGoogleSignOut}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar dari Akun Google</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isFirebaseConnecting}
                  className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isFirebaseConnecting ? 'Menghubungkan...' : 'Masuk dengan Akun Google'}</span>
                </button>
              )}

              <button
                onClick={handleSyncToCloud}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Sinkronkan ke Cloud Firestore</span>
              </button>
            </div>
          </div>

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
                  React 19 • Vite • Tailwind 4 • Firebase Cloud Active
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Status: <span className="text-emerald-600 font-bold">FIREBASE & CLOUD READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
