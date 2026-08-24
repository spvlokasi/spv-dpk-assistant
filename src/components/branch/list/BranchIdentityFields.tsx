import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, Upload, Phone } from 'lucide-react';
import { Branch } from '../../../types';

interface BranchIdentityFieldsProps {
  formData: Partial<Branch>;
  onFormDataChange: (data: Partial<Branch>) => void;
}

export const BranchIdentityFields: React.FC<BranchIdentityFieldsProps> = ({
  formData, onFormDataChange
}) => {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const processImageFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600; canvas.height = img.height * (600 / img.width);
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        onFormDataChange({ ...formData, imageUrl: canvas.toDataURL('image/jpeg', 0.6) });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="block text-slate-400 mb-1 font-semibold">Kode Cabang:</label><input type="text" required value={formData.code || ''} onChange={(e) => onFormDataChange({ ...formData, code: e.target.value })} placeholder="Contoh: M3017" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono" /></div>
        <div><label className="block text-slate-400 mb-1 font-semibold">Nama Toko Basmalah:</label><input type="text" required value={formData.name || ''} onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })} placeholder="Contoh: TokoBASMALAH Bugih" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold" /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Foto Depan Toko:</label>
          <div className="flex items-center gap-2">
            {formData.imageUrl ? (<div className="relative w-12 h-10 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0"><img src={formData.imageUrl} alt="Toko" className="w-full h-full object-cover" /></div>) : (<div className="w-12 h-10 rounded-lg bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0"><ImageIcon className="w-4 h-4" /></div>)}
            <button type="button" onClick={() => cameraRef.current?.click()} className="px-2 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 font-semibold border border-emerald-500/40 flex items-center gap-1"><Camera className="w-3.5 h-3.5" /><span>Kamera</span></button>
            <button type="button" onClick={() => galleryRef.current?.click()} className="px-2 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-semibold border border-slate-700 flex items-center gap-1"><Upload className="w-3.5 h-3.5" /><span>Pilih</span></button>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={(e) => processImageFile(e.target.files?.[0])} className="hidden" />
            <input ref={galleryRef} type="file" accept="image/*" onChange={(e) => processImageFile(e.target.files?.[0])} className="hidden" />
          </div>
        </div>
        <div>
          <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-400" /><span>No. WhatsApp Toko / Kasir:</span></label>
          <input type="text" value={formData.phone || ''} onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })} placeholder="Contoh: 081234567890" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="block text-slate-400 mb-1 font-semibold">Kepala Toko (KTB):</label><input type="text" required value={formData.kepalaToko || ''} onChange={(e) => onFormDataChange({ ...formData, kepalaToko: e.target.value })} placeholder="Nama KTB" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" /></div>
        <div><label className="block text-slate-400 mb-1 font-semibold">SPV Area (Wilayah):</label><input type="text" value={formData.spvArea || ''} onChange={(e) => onFormDataChange({ ...formData, spvArea: e.target.value })} placeholder="Nama SPV Area" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="block text-slate-400 mb-1 font-semibold">📅 Tanggal Masuk DPK:</label><input type="date" required value={formData.entryDate || ''} onChange={(e) => onFormDataChange({ ...formData, entryDate: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" /></div>
        <div><label className="block text-slate-400 mb-1 font-semibold">Alamat Lengkap Cabang:</label><input type="text" value={formData.address || ''} onChange={(e) => onFormDataChange({ ...formData, address: e.target.value })} placeholder="Jalan, RT/RW, Kecamatan..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" /></div>
      </div>
    </div>
  );
};
