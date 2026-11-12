import React from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Plus,
  ShieldAlert,
  UserCheck,
  Menu,
  Lock,
  Download,
} from 'lucide-react';
import { AppNotification } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAdmin: boolean;
  onRequireAdminAuth: () => void;
  onLogoutAdmin: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenNewLoanModal: () => void;
  onToggleMobileSidebar: () => void;
  onOpenHelpModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isAdmin,
  onRequireAdminAuth,
  onLogoutAdmin,
  notifications,
  onOpenNotifications,
  onOpenNewLoanModal,
  onToggleMobileSidebar,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-[#eef2f9]/90 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
      {/* Left: Search Bar matching image */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2.5 rounded-2xl bg-white text-slate-700 border border-slate-200 shadow-xs cursor-pointer"
          aria-label="Buka Menu Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by kode aset, nama barang, ruangan, atau PIC..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
          />
        </div>
      </div>

      {/* Right: Notification, Role, & Vivid Blue Action Button */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Role Pill Switcher */}
        <div className="hidden sm:flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => {
              if (isAdmin) onLogoutAdmin();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              !isAdmin ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Pengguna</span>
          </button>
          <button
            onClick={() => {
              if (!isAdmin) onRequireAdminAuth();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isAdmin ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAdmin ? <ShieldAlert className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-purple-600" />}
            <span>Admin</span>
          </button>
        </div>

        {/* Circular Notification Bell matching image */}
        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Lihat Notifikasi"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* Question Circle matching image */}
        <div
          title="SOP Peminjaman Sarana Prasarana"
          className="hidden md:flex w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs items-center justify-center text-slate-500"
        >
          <HelpCircle className="w-4 h-4" />
        </div>

        {/* Direct ZIP Download button for GitHub & Firebase upload */}
        <a
          href="/sarprashub-project.zip"
          download="sarprashub-project.zip"
          title="Unduh seluruh source code proyek (ZIP siap upload GitHub & Firebase)"
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-xs font-bold border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span>Unduh ZIP</span>
        </a>

        {/* Vivid Blue Button matching "+ Create Listing" in the image */}
        <button
          onClick={onOpenNewLoanModal}
          className="px-4 sm:px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Ajukan Pinjam</span>
          <span className="sm:hidden">Pinjam</span>
        </button>
      </div>
    </header>
  );
};
