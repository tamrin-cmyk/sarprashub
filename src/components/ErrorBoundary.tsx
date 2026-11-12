import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Ignore extension-related errors if possible
      const isExtensionError =
        this.state.error?.stack?.includes('chrome-extension://') ||
        this.state.error?.message?.includes('Cannot set property fetch');

      if (isExtensionError) {
        return this.props.children;
      }

      return (
        <div className="min-h-screen bg-[#eef2f9] flex items-center justify-center p-6 text-slate-800">
          <div className="clay-card max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Terjadi Kendala pada Sesi
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aplikasi mendeteksi adanya gangguan dari ekstensi peramban atau script pihak ketiga.
                Silakan muat ulang halaman untuk melanjutkan.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Muat Ulang Aplikasi</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
