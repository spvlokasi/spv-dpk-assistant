import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', title?: string, duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    if (duration > 0) setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
        {toasts.map((toast) => {
          const colorClass = toast.type === 'success' ? 'border-emerald-500/60 text-emerald-300'
            : toast.type === 'error' ? 'border-rose-500/60 text-rose-300'
            : toast.type === 'warning' ? 'border-amber-500/60 text-amber-300' : 'border-blue-500/60 text-blue-300';
          return (
            <div key={toast.id} className={`pointer-events-auto p-3.5 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-3 bg-slate-900/95 animate-slide-in ${colorClass}`}>
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
              </div>
              <div className="flex-1 space-y-0.5 pr-1 text-xs">
                {toast.title && <div className="font-bold text-white tracking-tight text-[13px]">{toast.title}</div>}
                <div className="text-slate-200 leading-relaxed font-medium">{toast.message}</div>
              </div>
              <button type="button" onClick={() => removeToast(toast.id)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex-shrink-0"><X className="w-4 h-4" /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
