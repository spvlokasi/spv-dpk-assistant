import React, { useRef } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { Branch } from '../../../types';

interface BranchIdentityFieldsProps {
  formData: Partial<Branch>;
  onFormDataChange: (data: Partial<Branch>) => void;
}

export const BranchIdentityFields: React.FC<BranchIdentityFieldsProps> = ({
  formData, onFormDataChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 600 / img.width;
        canvas.width = 600; canvas.height = img.height * scale;
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
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Kode Cabang:</label>
          <input type="text" required value={formData.code || ''} onChange={(e) => onFormDataChange({ ...formData, code: e.target.value })} placeholder="Contoh: M3017" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Nama Toko Basmalah:</label>
          <input type="text" required value={formData.name || ''} onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })} placeholder="Contoh: TokoBASMALAH Bugih" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold" />
        </div>
      </div>

      <div>
        <label className="block text-slate-400 mb-1 font-semibold">Foto Depan Toko:</label>
        <div className="flex items-center gap-3">
          {formData.imageUrl ? (<div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0"><img src={formData.imageUrl} alt="Toko" className="w-full h-full object-cover" /></div>) : (<div className="w-16 h-12 rounded-lg bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0"><ImageIcon className="w-5 h-5" /></div>)}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /><span>Pilih Foto Toko</span></button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Kepala Toko (KTB):</label>
          <input type="text" required value={formData.kepalaToko || ''} onChange={(e) => onFormDataChange({ ...formData, kepalaToko: e.target.value })} placeholder="Nama KTB" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">SPV Area (Wilayah):</label>
          <input type="text" value={formData.spvArea || ''} onChange={(e) => onFormDataChange({ ...formData, spvArea: e.target.value })} placeholder="Nama SPV Area" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">📅 Tanggal Masuk DPK:</label>
          <input type="date" required value={formData.entryDate || ''} onChange={(e) => onFormDataChange({ ...formData, entryDate: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Target Tanggal Lulus:</label>
          <input type="date" value={formData.targetGraduationDate || ''} onChange={(e) => onFormDataChange({ ...formData, targetGraduationDate: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div>
        <label className="block text-slate-400 mb-1 font-semibold">Alamat Lengkap Cabang:</label>
        <input type="text" value={formData.address || ''} onChange={(e) => onFormDataChange({ ...formData, address: e.target.value })} placeholder="Jalan, RT/RW, Kecamatan..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
      </div>
    </div>
  );
};
