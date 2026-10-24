import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
  };
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', title?: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 5));

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toastMethods = {
    success: (message: string, title = 'Success', duration = 4000) =>
      showToast(message, 'success', title, duration),
    error: (message: string, title = 'Action Failed', duration = 5000) =>
      showToast(message, 'error', title, duration),
    warning: (message: string, title = 'Attention', duration = 4500) =>
      showToast(message, 'warning', title, duration),
    info: (message: string, title = 'Notification', duration = 4000) =>
      showToast(message, 'info', title, duration),
  };

  // Safe global window.alert interceptor so all native alerts become top-right flash notifications
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg: any) => {
      const message = String(msg ?? '');
      const isError = /fail|error|wrong|invalid|denied|cannot|rejected/i.test(message);
      if (isError) {
        toastMethods.error(message);
      } else {
        toastMethods.success(message);
      }
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          wrapper: 'bg-[#0B231A]/95 dark:bg-[#071912]/95 border-emerald-500/40 text-emerald-100 shadow-[0_12px_32px_rgba(16,185,129,0.22)]',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          accent: 'bg-emerald-400',
        };
      case 'error':
        return {
          wrapper: 'bg-[#290E14]/95 dark:bg-[#1C090D]/95 border-rose-500/40 text-rose-100 shadow-[0_12px_32px_rgba(244,63,94,0.22)]',
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          accent: 'bg-rose-400',
        };
      case 'warning':
        return {
          wrapper: 'bg-[#281806]/95 dark:bg-[#1A0E03]/95 border-amber-500/40 text-amber-100 shadow-[0_12px_32px_rgba(245,158,11,0.22)]',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          accent: 'bg-amber-400',
        };
      case 'info':
      default:
        return {
          wrapper: 'bg-[#0B192C]/95 dark:bg-[#081220]/95 border-teal-500/40 text-teal-100 shadow-[0_12px_32px_rgba(0,129,112,0.22)]',
          icon: <Info className="w-5 h-5 text-teal-400 shrink-0" />,
          accent: 'bg-teal-400',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ ...toastMethods, toast: toastMethods, showToast, removeToast }}>
      {children}

      {/* Floating Top-Right Flash Notification Container */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 sm:top-5 sm:right-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((item) => {
          const styles = getToastStyles(item.type);
          return (
            <div
              key={item.id}
              role="alert"
              className={`toast-enter pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 ${styles.wrapper}`}
            >
              <div className="pt-0.5">{styles.icon}</div>
              <div className="flex-1 min-w-0 pr-1">
                {item.title && (
                  <h4 className="font-bold text-xs tracking-wide uppercase opacity-90 mb-0.5">
                    {item.title}
                  </h4>
                )}
                <p className="text-xs leading-relaxed font-medium break-words">
                  {item.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(item.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
