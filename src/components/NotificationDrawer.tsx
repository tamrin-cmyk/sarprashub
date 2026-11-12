import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  CheckCheck,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotification: (loanCode?: string) => void;
  onSimulateNewNotification: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
  onSimulateNewNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-2xs">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Pusat Notifikasi</h3>
                <p className="text-xs text-slate-500">
                  {unreadCount > 0
                    ? `${unreadCount} pemberitahuan belum dibaca`
                    : 'Semua notifikasi telah dibaca'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Toolbar */}
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={onMarkAllAsRead}
              disabled={unreadCount === 0}
              className="text-indigo-600 hover:text-indigo-700 disabled:opacity-40 flex items-center gap-1 font-semibold cursor-pointer transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Semua Dibaca</span>
            </button>

            <button
              onClick={onClearAll}
              disabled={notifications.length === 0}
              className="text-rose-600 hover:text-rose-700 disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Bell className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">Tidak ada notifikasi aktif</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Setiap pengajuan baru, persetujuan admin, atau perubahan status peminjaman akan muncul di sini secara real-time.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const getIcon = () => {
                  switch (notif.type) {
                    case 'success':
                      return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
                    case 'warning':
                      return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
                    case 'error':
                      return <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
                    default:
                      return <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />;
                  }
                };

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (notif.loanCode) {
                        onSelectNotification(notif.loanCode);
                        onClose();
                      }
                    }}
                    className={`card-3d-tilt p-4 rounded-2xl border transition-all cursor-pointer ${
                      notif.read
                        ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs'
                        : 'bg-indigo-50/70 border-indigo-200 text-indigo-950 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon()}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900">{notif.title}</h4>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" />
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                        {notif.loanCode && (
                          <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
                            <span>Lacak berkas {notif.loanCode}</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Action: Simulator */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
            <button
              onClick={onSimulateNewNotification}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 text-xs font-semibold border border-indigo-200 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Simulasi Notifikasi Pengajuan Masuk</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center font-medium">
              SarprasHub Live Real-time Broadcast System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
