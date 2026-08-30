import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import './index.css';

// Bersihkan Service Worker, Cache lama, & data dummy legacy otomatis
if (typeof window !== 'undefined') {
  try {
    const rawV = localStorage.getItem('spv_dpk_promo_vouchers');
    if (rawV && (rawV.includes('vouch-1') || rawV.includes('BERKAH5K'))) {
      localStorage.removeItem('spv_dpk_promo_vouchers');
      sessionStorage.removeItem('spv_dpk_promo_vouchers');
    }
    const rawP = localStorage.getItem('spv_dpk_promo_products');
    if (rawP && rawP.includes('prod-1')) {
      localStorage.removeItem('spv_dpk_promo_products');
      sessionStorage.removeItem('spv_dpk_promo_products');
    }
  } catch {}

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((r) => r.unregister());
    }).catch(() => {});
  }
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((k) => caches.delete(k));
    }).catch(() => {});
  }
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);

