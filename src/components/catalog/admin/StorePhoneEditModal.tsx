import React, { useState } from 'react';
import { X, Phone, CheckCircle2 } from 'lucide-react';
import { Branch } from '../../../types';
import { StorageService } from '../../../services/storage';
import { useToast } from '../../../context/ToastContext';

interface StorePhoneEditModalProps {
  branch: Branch;
  onSaved: () => void;
  onClose: () => void;
}

export const StorePhoneEditModal: React.FC<StorePhoneEditModalProps> = ({
  branch, onSaved, onClose
}) => {
  const { showToast } = useToast();
  const [phone, setPhone] = useState(branch.phone || '');
  const initialHours = branch.deliveryHours || '07:00 - 20:30';
  const [openTime, setOpenTime] = useState(() => initialHours.split('-')[0]?.trim() || '07:00');
  const [closeTime, setCloseTime] = useState(() => initialHours.split('-')[1]?.trim() || '20:30');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated: Branch = {
        ...branch,
        phone: phone.trim(),
        deliveryHours: `${openTime.trim()} - ${closeTime.trim()}`
      };
      await StorageService.saveBranch(updated);
      showToast('No. WhatsApp & Jam Antar Toko berhasil disimpan!', 'success');
      onSaved();
      onClose();
    } catch {
      showToast('Gagal memperbarui pengaturan toko', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Phone className="w-4 h-4" /><span>Atur No. WA & Jam Antar</span>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Nama Toko:</label>
            <p className="text-slate-200 font-bold text-xs bg-slate-800 px-3 py-2 rounded-xl border border-slate-700">[{branch.code}] {branch.name}</p>
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Nomor WhatsApp Kasir Penerima Order:</label>
            <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contoh: 081234567890" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Jam Buka Antar:</label>
              <input type="time" required value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-xs focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Jam Tutup Antar:</label>
              <input type="time" required value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-xs focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Batal</button>
            <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /><span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span></button>
          </div>
        </form>
      </div>
    </div>
  );
};
