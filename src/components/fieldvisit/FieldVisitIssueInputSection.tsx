import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { OperationalIssue } from '../../types';
import { FieldVisitIssueItem } from './FieldVisitIssueItem';

interface FieldVisitIssueInputSectionProps {
  issues: OperationalIssue[];
  onAddIssue: (issue: OperationalIssue) => void;
  onRemoveIssue: (id: string) => void;
}

export const FieldVisitIssueInputSection: React.FC<FieldVisitIssueInputSectionProps> = ({
  issues, onAddIssue, onRemoveIssue
}) => {
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<OperationalIssue['category']>('display_planogram');
  const [severity, setSeverity] = useState<OperationalIssue['severity']>('sedang');
  const [solution, setSolution] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const processImageFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600; canvas.height = img.height * (600 / img.width);
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!desc.trim()) return;
    onAddIssue({ id: `issue-${Date.now()}`, description: desc.trim(), category, severity, immediateSolution: solution.trim(), photoUrl: photo, resolved: false });
    setDesc(''); setSolution(''); setPhoto(undefined);
  };

  return (
    <div className="pt-3 border-t border-slate-800 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-amber-400">⚠️ Temuan Deviasi & Solusi Lapangan:</span>
        <span className="text-[11px] text-slate-400 font-mono">{issues.length} Temuan Dicatat</span>
      </div>
      {issues.length > 0 && (<div className="space-y-2">{issues.map((issue) => (<FieldVisitIssueItem key={issue.id} issue={issue} onRemove={onRemoveIssue} />))}</div>)}
      <div className="bg-slate-850/60 p-3 rounded-xl border border-slate-800 space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Deskripsi temuan deviasi..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500" />
          <input type="text" value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Solusi langsung..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <select value={severity} onChange={(e) => setSeverity(e.target.value as any)} className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"><option value="ringan">Ringan</option><option value="sedang">Sedang</option><option value="kritis">Kritis</option></select>
            <button type="button" onClick={() => cameraInputRef.current?.click()} className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-1 font-semibold" title="Buka Kamera HP Langsung"><Camera className="w-3.5 h-3.5" /><span>Kamera 📸</span></button>
            <button type="button" onClick={() => galleryInputRef.current?.click()} className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl flex items-center gap-1 font-semibold" title="Pilih dari Galeri/File"><ImageIcon className="w-3.5 h-3.5" /><span>Galeri</span></button>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => processImageFile(e.target.files?.[0])} className="hidden" />
            <input ref={galleryInputRef} type="file" accept="image/*" onChange={(e) => processImageFile(e.target.files?.[0])} className="hidden" />
            {photo && (<div className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700"><span className="text-[10px] text-emerald-400 font-semibold">✓ Foto Terlampir</span><button type="button" onClick={() => setPhoto(undefined)} className="text-rose-400 p-0.5"><Trash2 className="w-3 h-3" /></button></div>)}
          </div>
          <button type="button" onClick={handleAdd} disabled={!desc.trim()} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1 shadow"><Plus className="w-3.5 h-3.5" /><span>Tambah</span></button>
        </div>
      </div>
    </div>
  );
};
