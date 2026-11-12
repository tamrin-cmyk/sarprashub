import React from 'react';
import {
  LayoutDashboard,
  Package,
  Armchair,
  ShoppingBag,
  Repeat,
  BarChart3,
  Settings,
  Lock,
  Boxes,
  Sparkles,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdmin: boolean;
  onRequireAdminAuth: () => void;
  onLogoutAdmin: () => void;
  pendingLoansCount: number;
  totalInventoryCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isAdmin,
  onRequireAdminAuth,
  onLogoutAdmin,
  pendingLoansCount,
  totalInventoryCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'inventory',
      label: 'Data Inventaris',
      sublabel: '(+ Cetak Label)',
      icon: Package,
      badge: totalInventoryCount > 0 ? totalInventoryCount : null,
      adminOnly: true,
    },
    {
      id: 'rooms',
      label: 'Data Ruangan & Lokasi',
      icon: Armchair,
      badge: null,
      adminOnly: true,
    },
    {
      id: 'catalog',
      label: 'Katalog Peminjaman',
      sublabel: '(Publik/User)',
      icon: ShoppingBag,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'circulation',
      label: 'Sirkulasi & Transaksi',
      sublabel: '(+ Cetak Kartu)',
      icon: Repeat,
      badge: pendingLoansCount > 0 ? pendingLoansCount : null,
      adminOnly: false,
    },
    {
      id: 'reports',
      label: 'Laporan & Analitik',
      icon: BarChart3,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'settings',
      label: 'Pengaturan Pengguna',
      icon: Settings,
      badge: null,
      adminOnly: false,
    },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.adminOnly && !isAdmin) {
      onRequireAdminAuth();
      return;
    }
    setCurrentTab(item.id);
  };

  return (
    <aside className="w-64 xl:w-72 shrink-0 bg-[#f0f4fa] border-r border-[#dae4f3] flex flex-col justify-between min-h-screen p-4 sm:p-5">
      {/* Brand & Logo */}
      <div className="space-y-6">
        <div
          onClick={() => setCurrentTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group px-2 py-1"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Boxes className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-slate-900">
                Sarpras<span className="text-blue-600">Hub</span>
              </span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                v2.8
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Sistem Sarpras Terpadu</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isLocked = item.adminOnly && !isAdmin;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#e8f0fe] text-blue-700 shadow-sm shadow-blue-600/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left truncate">
                    <span className="block truncate">{item.label}</span>
                    {item.sublabel && (
                      <span className="text-[10px] text-slate-400 font-normal block leading-none">
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {isLocked && (
                    <span className="p-1 rounded-md bg-slate-200/80 text-slate-500" title="Khusus Admin">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                  {item.badge !== null && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        item.id === 'circulation'
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo Card & User Profile (Matching image) */}
      <div className="space-y-4 pt-6">
        {/* Info Card matching "Brand Your Store" in the image */}
        <div className="clay-card p-4 rounded-2xl bg-white/90 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Layanan Sarpras</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Perlu peminjaman proyektor atau aula untuk kegiatan sekolah? Ikuti tata tertib SOP peminjaman resmi.
          </p>
          <button
            onClick={() => setCurrentTab('catalog')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Katalog Lengkap</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* User Card matching "Sarah Khan - Pro Seller" in the image */}
        <div className="clay-card p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              {isAdmin ? 'AD' : 'PG'}
            </div>
            <div className="truncate">
              <span className="font-bold text-xs text-slate-900 block truncate">
                {isAdmin ? 'Admin Sarpras' : 'Pengguna Publik'}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium truncate">
                {isAdmin ? 'Otoritas Pengelola' : 'Guru & Staf'}
              </span>
            </div>
          </div>

          <div>
            {isAdmin ? (
              <button
                onClick={onLogoutAdmin}
                className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                title="Keluar dari Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onRequireAdminAuth}
                className="p-1.5 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                title="Masuk sebagai Admin"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
