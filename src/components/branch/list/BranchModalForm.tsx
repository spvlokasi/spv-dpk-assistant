import React, { useRef } from 'react';
import { X, Image as ImageIcon, Upload } from 'lucide-react';
import { Branch, DpkCategory, DpkStatus } from '../../../types';

interface BranchModalFormProps {
  show: boolean;
  editingBranch: Branch | null;
  formData: Partial<Branch>;
  onClose: () => void;
  onFormDataChange: (data: Partial<Branch>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BranchModalForm: React.FC<BranchModalFormProps> = ({
  show,
  editingBranch,
  formData,
  onClose,
  onFormDataChange,
  onSubmit
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        onFormDataChange({ ...formData, imageUrl: dataUrl });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            {editingBranch ? 'Edit Data Cabang DPK' : 'Daftarkan Cabang DPK Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              Foto Tampak Depan Toko (Opsional / Background Card)
            </label>
            <div className="flex items-center gap-3">
              {formData.imageUrl ? (
                <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 group">
                  <img src={formData.imageUrl} alt="Toko" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onFormDataChange({ ...formData, imageUrl: '' })}
                    className="absolute inset-0 bg-black/70 flex items-center justify-center text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                  >
                    Hapus
                  </button>
                </div>
              ) : null}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                Pilih Foto dari Perangkat
              </button>

              <input
                type="text"
                placeholder="Atau masukkan URL foto (/stores/bugih.jpg)..."
                value={formData.imageUrl || ''}
                onChange={(e) => onFormDataChange({ ...formData, imageUrl: e.target.value })}
                className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kode Cabang *</label>
              <input
                type="text"
                required
                placeholder="Contoh: M3017"
                value={formData.code}
                onChange={(e) => onFormDataChange({ ...formData, code: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Cabang Toko *</label>
              <input
                type="text"
                required
                placeholder="Contoh: TokoBASMALAH Bugih"
                value={formData.name}
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kepala Toko Basmalah (KTB) *</label>
              <input
                type="text"
                required
                placeholder="Nama KTB"
                value={formData.kepalaToko}
                onChange={(e) => onFormDataChange({ ...formData, kepalaToko: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">SPV Area (Wilayah)</label>
              <input
                type="text"
                placeholder="Nama SPV Area"
                value={formData.spvArea}
                onChange={(e) => onFormDataChange({ ...formData, spvArea: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-400 mb-1">📅 Tanggal Masuk DPK *</label>
              <input
                type="date"
                required
                value={formData.entryDate}
                onChange={(e) => onFormDataChange({ ...formData, entryDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Tanggal Lulus</label>
              <input
                type="date"
                value={formData.targetGraduationDate}
                onChange={(e) => onFormDataChange({ ...formData, targetGraduationDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Status Progres DPK</label>
              <select
                value={formData.status}
                onChange={(e) => onFormDataChange({ ...formData, status: e.target.value as DpkStatus })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
              >
                <option value="akut">🔴 Akut (Penanganan Darurat)</option>
                <option value="kritis">🔴 Kritis (Intervensi Khusus)</option>
                <option value="dalam_progres">🟡 Dalam Progres (Pendampingan)</option>
                <option value="existing">🏢 Existing (Pemantauan Rutin)</option>
                <option value="cabang_baru">🆕 Cabang Baru (Masa Adaptasi)</option>
                <option value="siap_lulus">🟢 Siap Lulus (Hasil Membaik)</option>
                <option value="lulus_dpk">🎓 Lulus DPK (Turnaround Berhasil)</option>
              </select>
            </div>

          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Alamat Lengkap Cabang</label>
            <input
              type="text"
              placeholder="Jalan, RT/RW, Kecamatan, Kabupaten..."
              value={formData.address}
              onChange={(e) => onFormDataChange({ ...formData, address: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Laba Bersih (Rp/hari)</label>
              <input
                type="number"
                value={formData.targetSalesPerDay}
                onChange={(e) => onFormDataChange({ ...formData, targetSalesPerDay: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Margin Profit (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.targetMarginPct}
                onChange={(e) => onFormDataChange({ ...formData, targetMarginPct: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 text-blue-400 font-mono text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Biaya Maks (Rp/bln)</label>
              <input
                type="number"
                value={formData.targetMaxOpexPerMonth}
                onChange={(e) => onFormDataChange({ ...formData, targetMaxOpexPerMonth: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 text-rose-400 font-mono text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all active:scale-95"
            >
              {editingBranch ? 'Simpan Perubahan' : 'Daftarkan Cabang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
