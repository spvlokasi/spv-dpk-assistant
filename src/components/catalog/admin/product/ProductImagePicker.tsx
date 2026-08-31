import React, { useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface ProductImagePickerProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

export const ProductImagePicker: React.FC<ProductImagePickerProps> = ({ imageUrl, setImageUrl }) => {
  const camRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 400; c.height = img.height * (400 / img.width);
        c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
        setImageUrl(c.toDataURL('image/jpeg', 0.6));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="text-slate-400 font-semibold mb-1 block">Foto Produk Promo:</label>
      <div className="flex items-center gap-2">
        {imageUrl ? (
          <img src={imageUrl} alt="Produk" className="w-12 h-12 object-cover rounded-lg border border-slate-700" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
            <ImageIcon className="w-4 h-4" />
          </div>
        )}
        <button type="button" onClick={() => camRef.current?.click()} className="px-2.5 py-1.5 bg-emerald-600/20 text-emerald-300 rounded-xl border border-emerald-500/40 font-semibold flex items-center gap-1">
          <Camera className="w-3.5 h-3.5" /><span>Kamera 📸</span>
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className="px-2.5 py-1.5 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 font-semibold">
          Pilih File
        </button>
        <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleImage(e.target.files?.[0])} className="hidden" />
        <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} className="hidden" />
      </div>
    </div>
  );
};
