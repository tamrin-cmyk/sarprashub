/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_ITEMS,
  INITIAL_LOANS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { SarprasItem, LoanRequest, AppNotification } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { ItemCatalog } from './components/ItemCatalog';
import { LoanStatusDashboard } from './components/LoanStatusDashboard';
import { AdminApproval } from './components/AdminApproval';
import { AdminMasterCrud } from './components/AdminMasterCrud';
import { RoomManagement } from './components/RoomManagement';
import { ReportsDashboard } from './components/ReportsDashboard';
import { UserSettingsView } from './components/UserSettingsView';
import { LoanModal } from './components/LoanModal';
import { LoanCardPreviewModal } from './components/LoanCardPreviewModal';
import { InventoryLabelModal } from './components/InventoryLabelModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ChangeAdminPasswordModal } from './components/ChangeAdminPasswordModal';
import { getAdminSession, saveAdminSession, clearAdminSession } from './utils/auth';
import {
  saveItemToFirestore,
  deleteItemFromFirestore,
  saveLoanToFirestore,
  subscribeToSarprasItems,
  subscribeToSarprasLoans,
  seedInitialFirestoreData,
  clearAllFirestoreData,
} from './utils/firebase';
import {
  CheckCircle2,
  AlertTriangle,
  Bell,
  Sparkles,
  X,
  Lock,
  Printer,
  ShieldCheck,
  FileText,
  Repeat,
} from 'lucide-react';

interface ToastState {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export default function App() {
  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [circulationSubTab, setCirculationSubTab] = useState<'approval' | 'tracking'>('tracking');

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const session = getAdminSession();
    return session?.loggedIn || false;
  });

  // Admin Auth Modals
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // App Data with localStorage persistence (starts empty so user can fill manually)
  const [items, setItems] = useState<SarprasItem[]>(() => {
    // One-time manual wipe check for "kosongkan datanya agar diisi manual"
    if (localStorage.getItem('sarpras_manual_mode_v2') !== 'active') {
      localStorage.removeItem('sarpras_items');
      localStorage.removeItem('sarpras_loans');
      localStorage.removeItem('sarpras_notifications');
      localStorage.setItem('sarpras_manual_mode_v2', 'active');
      return [];
    }
    const saved = localStorage.getItem('sarpras_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved items', e);
      }
    }
    return [];
  });

  const [loans, setLoans] = useState<LoanRequest[]>(() => {
    if (localStorage.getItem('sarpras_manual_mode_v2') !== 'active') {
      return [];
    }
    const saved = localStorage.getItem('sarpras_loans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved loans', e);
      }
    }
    return [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (localStorage.getItem('sarpras_manual_mode_v2') !== 'active') {
      return [];
    }
    const saved = localStorage.getItem('sarpras_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notifications', e);
      }
    }
    return [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('sarpras_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('sarpras_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('sarpras_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Real-time Cloud Firestore synchronization (without auto mock seeding)
  useEffect(() => {
    const unsubItems = subscribeToSarprasItems((cloudItems) => {
      if (cloudItems) {
        setItems(cloudItems);
      }
    });

    const unsubLoans = subscribeToSarprasLoans((cloudLoans) => {
      if (cloudLoans) {
        setLoans(cloudLoans);
      }
    });

    return () => {
      unsubItems();
      unsubLoans();
    };
  }, []);

  // Modal States
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [preSelectedItem, setPreSelectedItem] = useState<SarprasItem | null>(null);
  const [previewingLoanCard, setPreviewingLoanCard] = useState<LoanRequest | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [labelModalItemId, setLabelModalItemId] = useState<string | undefined>(undefined);

  // Live Toast State
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const newToast: ToastState = {
      id: String(Date.now()),
      title,
      message,
      type,
    };
    setToast(newToast);
    setTimeout(() => {
      setToast((prev) => (prev?.id === newToast.id ? null : prev));
    }, 4500);
  };

  // Notification helper
  const addNotification = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info',
    loanCode?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Baru saja',
      read: false,
      loanCode,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(title, message, type);
  };

  // Action: User Submits New Loan Request
  const handleAddNewLoan = (newLoan: LoanRequest) => {
    setLoans((prev) => [newLoan, ...prev]);
    saveLoanToFirestore(newLoan);

    addNotification(
      'Pengajuan Peminjaman Berhasil',
      `Permohonan ${newLoan.loanCode} atas nama ${newLoan.borrowerName} telah terkirim. Menunggu verifikasi admin.`,
      'info',
      newLoan.loanCode
    );

    // Switch to circulation tab to track
    setCurrentTab('circulation');
    setCirculationSubTab('tracking');
  };

  // Action: Admin Approves Loan
  const handleApproveLoan = (loanId: string, adminNotes?: string) => {
    let approvedCode = '';
    let approvedBorrower = '';

    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id === loanId) {
          approvedCode = loan.loanCode;
          approvedBorrower = loan.borrowerName;

          // Adjust available inventory items
          setItems((itemPrev) =>
            itemPrev.map((itm) => {
              const matchedLoanItem = loan.items.find((li) => li.itemId === itm.id);
              if (matchedLoanItem) {
                const updatedItm = {
                  ...itm,
                  availableQuantity: Math.max(0, itm.availableQuantity - matchedLoanItem.quantity),
                };
                saveItemToFirestore(updatedItm);
                return updatedItm;
              }
              return itm;
            })
          );

          const updatedLoan: LoanRequest = {
            ...loan,
            status: 'Disetujui',
            approvedBy: 'Admin Sarpras',
            approvedAt: `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            adminNotes: adminNotes || loan.adminNotes,
          };
          saveLoanToFirestore(updatedLoan);
          return updatedLoan;
        }
        return loan;
      })
    );

    addNotification(
      'Peminjaman Telah Disetujui! 🎉',
      `Berkas ${approvedCode} (${approvedBorrower}) telah disetujui admin. Kartu Peminjaman PDF dapat langsung diunduh dan dicetak.`,
      'success',
      approvedCode
    );
  };

  // Action: Admin Rejects Loan
  const handleRejectLoan = (loanId: string, reason: string) => {
    let rejectedCode = '';
    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id === loanId) {
          rejectedCode = loan.loanCode;
          const updatedLoan: LoanRequest = {
            ...loan,
            status: 'Ditolak',
            rejectionReason: reason,
          };
          saveLoanToFirestore(updatedLoan);
          return updatedLoan;
        }
        return loan;
      })
    );

    addNotification(
      'Pengajuan Ditolak',
      `Permohonan ${rejectedCode} tidak disetujui. Alasan: ${reason}`,
      'error',
      rejectedCode
    );
  };

  // Action: Mark as Handed Over (Sedang Dipinjam)
  const handleMarkHandover = (loanId: string) => {
    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id === loanId) {
          const updatedLoan: LoanRequest = {
            ...loan,
            status: 'Sedang Dipinjam',
          };
          saveLoanToFirestore(updatedLoan);
          return updatedLoan;
        }
        return loan;
      })
    );

    addNotification(
      'Sarpras Telah Diserahterimakan',
      `Status peminjaman kini aktif berjalan (Sedang Dipinjam).`,
      'info'
    );
  };

  // Action: Mark as Returned (Selesai)
  const handleMarkReturned = (loanId: string) => {
    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id === loanId) {
          // Restore items inventory count
          setItems((itemPrev) =>
            itemPrev.map((itm) => {
              const matchedLoanItem = loan.items.find((li) => li.itemId === itm.id);
              if (matchedLoanItem) {
                const restoredItm = {
                  ...itm,
                  availableQuantity: Math.min(
                    itm.totalQuantity,
                    itm.availableQuantity + matchedLoanItem.quantity
                  ),
                };
                saveItemToFirestore(restoredItm);
                return restoredItm;
              }
              return itm;
            })
          );

          const updatedLoan: LoanRequest = {
            ...loan,
            status: 'Selesai',
            returnedAt: `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
          };
          saveLoanToFirestore(updatedLoan);
          return updatedLoan;
        }
        return loan;
      })
    );

    addNotification(
      'Sarpras Berhasil Dikembalikan',
      `Pemeriksaan fisik sarana selesai. Stok inventaris telah dikembalikan ke sistem.`,
      'success'
    );
  };

  // Action: Admin Master CRUD - Add Item
  const handleAddItem = (newItem: SarprasItem) => {
    setItems((prev) => [newItem, ...prev]);
    saveItemToFirestore(newItem);
    showToast(
      'Aset Baru Ditambahkan',
      `Aset ${newItem.name} (${newItem.code}) berhasil disimpan ke master data.`,
      'success'
    );
  };

  // Action: Admin Master CRUD - Update Item
  const handleUpdateItem = (updatedItem: SarprasItem) => {
    setItems((prev) => prev.map((itm) => (itm.id === updatedItem.id ? updatedItem : itm)));
    saveItemToFirestore(updatedItem);
    showToast(
      'Data Aset Diperbarui',
      `Informasi aset ${updatedItem.code} berhasil diperbarui.`,
      'success'
    );
  };

  // Action: Admin Master CRUD - Delete Item
  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((itm) => itm.id !== itemId));
    deleteItemFromFirestore(itemId);
    showToast('Aset Dihapus', 'Aset sarana prasarana telah dihapus dari data master.', 'warning');
  };

  // Action: Open Loan Modal with Pre-selection
  const handleSelectItemForLoan = (item: SarprasItem) => {
    setPreSelectedItem(item);
    setIsLoanModalOpen(true);
  };

  // Action: Open Label Print Modal
  const handleOpenLabelModal = (itemId?: string) => {
    setLabelModalItemId(itemId);
    setIsLabelModalOpen(true);
  };

  // Action: Clear All Data (Empty database for manual entry)
  const handleClearAllData = async () => {
    localStorage.removeItem('sarpras_items');
    localStorage.removeItem('sarpras_loans');
    localStorage.removeItem('sarpras_notifications');
    localStorage.setItem('sarpras_manual_mode_v2', 'active');
    setItems([]);
    setLoans([]);
    setNotifications([]);
    await clearAllFirestoreData();
    showToast(
      'Data Berhasil Dikosongkan',
      'Seluruh data lokal dan cloud Firestore telah dihapus bersih. Siap untuk diisi manual dari nol.',
      'info'
    );
  };

  // Action: Optional Seed Demo Data
  const handleSeedDemoData = async () => {
    localStorage.setItem('sarpras_items', JSON.stringify(INITIAL_ITEMS));
    localStorage.setItem('sarpras_loans', JSON.stringify(INITIAL_LOANS));
    localStorage.setItem('sarpras_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    setItems(INITIAL_ITEMS);
    setLoans(INITIAL_LOANS);
    setNotifications(INITIAL_NOTIFICATIONS);
    await seedInitialFirestoreData(INITIAL_ITEMS, INITIAL_LOANS);
    showToast(
      'Data Contoh Dimuat',
      'Data demo/contoh sarpras dan permohonan berhasil dimuat ke sistem.',
      'success'
    );
  };

  // Action: Simulate new real-time notification
  const handleSimulateNewNotification = () => {
    const sampleNames = ['Agus Permana, S.Pd', 'Dian Anggraini, S.Kom', 'Fitri Handayani, S.Pd'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomCode = `PINJAM-2026-${Math.floor(1200 + Math.random() * 800)}`;

    addNotification(
      'Simulasi: Pengajuan Online Baru Masuk',
      `${randomName} baru saja mengajukan permohonan sarana prasarana (${randomCode}). Menunggu verifikasi admin.`,
      'info',
      randomCode
    );
  };

  // Action: Admin Auth Handlers
  const handleRequireAdminAuth = () => {
    setIsAdminLoginModalOpen(true);
  };

  const handleSuccessAdminLogin = (username: string, rememberMe: boolean) => {
    saveAdminSession(username, rememberMe);
    setIsAdmin(true);
    showToast(
      'Login Admin Berhasil',
      `Selamat datang, ${username}! Anda memiliki otoritas penuh verifikasi & inventaris.`,
      'success'
    );
  };

  const handleLogoutAdmin = () => {
    clearAdminSession();
    setIsAdmin(false);
    if (currentTab === 'inventory' || currentTab === 'rooms') {
      setCurrentTab('dashboard');
    }
    showToast(
      'Logout Berhasil',
      'Anda telah keluar dari Mode Admin. Menu inventaris dan ruangan kini terkunci.',
      'info'
    );
  };

  const handleSuccessChangePassword = () => {
    showToast(
      'Password Berhasil Diubah',
      'Kredensial keamanan admin telah diperbarui. Silakan gunakan password baru pada sesi berikutnya.',
      'success'
    );
  };

  const pendingLoansCount = loans.filter((l) => l.status === 'Menunggu Persetujuan').length;

  return (
    <div className="min-h-screen bg-[#eef2f9] text-slate-800 font-sans flex flex-row selection:bg-blue-600 selection:text-white">
      {/* Desktop Floating Left Sidebar (Lavender Pastel matching uploaded image) */}
      <div className="hidden lg:block">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isAdmin={isAdmin}
          onRequireAdminAuth={handleRequireAdminAuth}
          onLogoutAdmin={handleLogoutAdmin}
          pendingLoansCount={pendingLoansCount}
          totalInventoryCount={items.length}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl">
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={(tab) => {
                setCurrentTab(tab);
                setMobileSidebarOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isAdmin={isAdmin}
              onRequireAdminAuth={() => {
                setMobileSidebarOpen(false);
                handleRequireAdminAuth();
              }}
              onLogoutAdmin={() => {
                setMobileSidebarOpen(false);
                handleLogoutAdmin();
              }}
              pendingLoansCount={pendingLoansCount}
              totalInventoryCount={items.length}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header matching image */}
        <Header
          searchQuery={globalSearchQuery}
          setSearchQuery={(q) => {
            setGlobalSearchQuery(q);
            if (q.trim() && currentTab !== 'dashboard' && currentTab !== 'catalog') {
              setCurrentTab('catalog');
            }
          }}
          isAdmin={isAdmin}
          onRequireAdminAuth={handleRequireAdminAuth}
          onLogoutAdmin={handleLogoutAdmin}
          notifications={notifications}
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          onOpenNewLoanModal={() => {
            setPreSelectedItem(null);
            setIsLoanModalOpen(true);
          }}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Tab Routing Body */}
        <main className="flex-1 p-4 sm:p-7 max-w-[1500px] w-full mx-auto">
          {/* 1. Dashboard Overview matching image */}
          {currentTab === 'dashboard' && (
            <DashboardOverview
              items={items}
              loans={loans}
              notifications={notifications}
              isAdmin={isAdmin}
              onNavigateTab={(tab) => {
                if ((tab === 'inventory' || tab === 'rooms') && !isAdmin) {
                  handleRequireAdminAuth();
                  return;
                }
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenNewLoanModal={() => {
                setPreSelectedItem(null);
                setIsLoanModalOpen(true);
              }}
              onOpenLabelModal={handleOpenLabelModal}
              onPreviewLoanCard={(loan) => setPreviewingLoanCard(loan)}
              onRequireAdminAuth={handleRequireAdminAuth}
            />
          )}

          {/* 2. Data Inventaris (Khusus Admin) + Cetak Label */}
          {currentTab === 'inventory' && (
            isAdmin ? (
              <AdminMasterCrud
                items={items}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onOpenLabelModal={handleOpenLabelModal}
              />
            ) : (
              <div className="clay-card py-20 text-center space-y-4 max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Data Master Khusus Admin</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pengunjung tidak diizinkan mengubah, menambah, atau menghapus inventaris sarpras secara sembarangan.
                </p>
                <button
                  onClick={handleRequireAdminAuth}
                  className="w-full py-2.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Masuk sebagai Admin Sekarang
                </button>
              </div>
            )
          )}

          {/* 3. Data Ruangan & Lokasi (Khusus Admin) */}
          {currentTab === 'rooms' && (
            isAdmin ? (
              <RoomManagement
                items={items}
                loans={loans}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onOpenLabelModal={handleOpenLabelModal}
              />
            ) : (
              <div className="clay-card py-20 text-center space-y-4 max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Manajemen Ruangan Khusus Admin</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Manajemen lokasi, kapasitas ruang aula, dan pemeliharaan laboratorium memerlukan akses otorisasi petugas sarpras.
                </p>
                <button
                  onClick={handleRequireAdminAuth}
                  className="w-full py-2.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Masuk sebagai Admin Sekarang
                </button>
              </div>
            )
          )}

          {/* 4. Katalog Peminjaman (Publik/User) */}
          {currentTab === 'catalog' && (
            <ItemCatalog
              items={items}
              onSelectItemForLoan={handleSelectItemForLoan}
              onOpenNewLoanModal={() => {
                setPreSelectedItem(null);
                setIsLoanModalOpen(true);
              }}
            />
          )}

          {/* 5. Sirkulasi & Transaksi (+ Fitur Cetak Kartu) */}
          {currentTab === 'circulation' && (
            <div className="space-y-6">
              {/* Circulation Sub-Navigation Bar */}
              <div className="clay-card p-4 sm:p-5 rounded-3xl bg-white/95 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      Sirkulasi & Transaksi Peminjaman
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Pantau permohonan, verifikasi persetujuan admin, serah terima, dan cetak kartu bukti PDF otomatis.
                    </p>
                  </div>
                </div>

                {/* Sub-tabs switch */}
                <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-stretch sm:self-auto">
                  <button
                    onClick={() => setCirculationSubTab('tracking')}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      circulationSubTab === 'tracking'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Status & Cetak Kartu ({loans.length})
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => setCirculationSubTab('approval')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        circulationSubTab === 'approval'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verifikasi Admin</span>
                      {pendingLoansCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold">
                          {pendingLoansCount}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-tab view render */}
              {circulationSubTab === 'tracking' ? (
                <LoanStatusDashboard
                  loans={loans}
                  onOpenNewLoanModal={() => {
                    setPreSelectedItem(null);
                    setIsLoanModalOpen(true);
                  }}
                  onPreviewLoanCard={(loan) => setPreviewingLoanCard(loan)}
                />
              ) : (
                <AdminApproval
                  loans={loans}
                  onApproveLoan={handleApproveLoan}
                  onRejectLoan={handleRejectLoan}
                  onMarkHandover={handleMarkHandover}
                  onMarkReturned={handleMarkReturned}
                />
              )}
            </div>
          )}

          {/* 6. Laporan & Analitik */}
          {currentTab === 'reports' && (
            <ReportsDashboard items={items} loans={loans} />
          )}

          {/* 7. Pengaturan Pengguna */}
          {currentTab === 'settings' && (
            <UserSettingsView
              isAdmin={isAdmin}
              onRequireAdminAuth={handleRequireAdminAuth}
              onLogoutAdmin={handleLogoutAdmin}
              onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
              onResetData={handleClearAllData}
              onClearAllData={handleClearAllData}
              onSeedDemoData={handleSeedDemoData}
              totalItems={items.length}
              totalLoans={loans.length}
            />
          )}
        </main>

        {/* Clean Modern Footer */}
        <footer className="mt-auto border-t border-[#dae4f3] bg-[#f0f4fa]/80 backdrop-blur-md py-6 px-4 sm:px-8 text-xs text-slate-500">
          <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 font-medium">
              <span className="font-bold text-slate-800">SarprasHub</span>
              <span>•</span>
              <span>Sistem Manajemen Sarana Prasarana Digital Berbasis Soft Pastel Neumorphic</span>
            </div>
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} SarprasHub Ecosystem • Otorisasi Admin & Print Kartu PDF Otomatis.
            </p>
          </div>
        </footer>
      </div>

      {/* Online Loan Application Modal */}
      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        availableItems={items}
        preSelectedItem={preSelectedItem}
        onSubmitLoan={handleAddNewLoan}
      />

      {/* Loan Card Preview & PDF Print Modal */}
      <LoanCardPreviewModal
        loan={previewingLoanCard}
        onClose={() => setPreviewingLoanCard(null)}
      />

      {/* Barcode & Asset Sticker Label Printing Modal */}
      <InventoryLabelModal
        isOpen={isLabelModalOpen}
        onClose={() => {
          setIsLabelModalOpen(false);
          setLabelModalItemId(undefined);
        }}
        items={items}
        preSelectedItemId={labelModalItemId}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccessLogin={handleSuccessAdminLogin}
      />

      {/* Change Admin Password Modal */}
      <ChangeAdminPasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSuccessChange={handleSuccessChangePassword}
      />

      {/* Real-time Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onClearAll={() => setNotifications([])}
        onSelectNotification={() => {
          setCurrentTab('circulation');
          setCirculationSubTab('tracking');
        }}
        onSimulateNewNotification={handleSimulateNewNotification}
      />

      {/* Interactive Toast Notification Popup */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl max-w-sm animate-bounce-short text-slate-800">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          ) : (
            <Bell className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-0.5">
            <h5 className="text-xs font-bold text-slate-900">{toast.title}</h5>
            <p className="text-xs text-slate-600 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
