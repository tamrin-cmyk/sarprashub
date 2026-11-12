import React from 'react';
import {
  Boxes,
  ClipboardList,
  CheckCircle2,
  Database,
  BarChart3,
  Bell,
  ShieldAlert,
  UserCheck,
  PlusCircle,
  Menu,
  X,
  LogOut,
  KeyRound,
  Lock,
} from 'lucide-react';
import { AppNotification } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdmin: boolean;
  onRequireAdminAuth: () => void;
  onLogoutAdmin: () => void;
  onOpenChangePassword: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenNewLoanModal: () => void;
  pendingLoansCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isAdmin,
  onRequireAdminAuth,
  onLogoutAdmin,
  onOpenChangePassword,
  notifications,
  onOpenNotifications,
  onOpenNewLoanModal,
  pendingLoansCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    {
      id: 'catalog',
      label: 'Katalog Sarpras',
      icon: Boxes,
      badge: null,
    },
    {
      id: 'my-loans',
      label: 'Status Peminjaman',
      icon: ClipboardList,
      badge: null,
    },
    {
      id: 'admin-approval',
      label: 'Persetujuan Admin',
      icon: CheckCircle2,
      badge: pendingLoansCount > 0 ? pendingLoansCount : null,
      adminOnly: true,
    },
    {
      id: 'admin-crud',
      label: 'Data Master Inventaris',
      icon: Database,
      adminOnly: true,
    },
    {
      id: 'reports',
      label: 'Laporan & Analitik',
      icon: BarChart3,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => setCurrentTab('catalog')}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Boxes className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Sarpras<span className="text-gradient-primary">Hub</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                  v2.6 3D
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 font-medium">
                Peminjaman Sarana, Prasarana & Inventaris Terpadu
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90">
            {navItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white animate-pulse shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Online Application Button */}
            <button
              onClick={onOpenNewLoanModal}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajukan Pinjam</span>
            </button>

            {/* Role Switcher Pill with Admin Authentication */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => {
                  if (isAdmin) {
                    onLogoutAdmin();
                  }
                }}
                title="Mode Pengguna: Guru, Staf, & Siswa"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !isAdmin
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Pengguna</span>
              </button>

              {isAdmin ? (
                <div className="flex items-center gap-1 pl-1">
                  <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white shadow-xs">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Admin Aktif</span>
                  </span>
                  <button
                    onClick={onLogoutAdmin}
                    title="Keluar dari Mode Admin"
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-rose-600 transition-colors cursor-pointer"
                    aria-label="Logout Admin"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onRequireAdminAuth}
                  title="Masuk sebagai Admin Sarpras (Perlu Password)"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span className="hidden md:inline">Admin</span>
                </button>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Lihat Notifikasi Real-time"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-modal border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 bg-white">
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onOpenNewLoanModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajukan Peminjaman Online</span>
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    onOpenChangePassword();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                  <span>Ubah Password</span>
                </button>
                <button
                  onClick={() => {
                    onLogoutAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Admin</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onRequireAdminAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                <span>Masuk sebagai Admin Sarpras</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
