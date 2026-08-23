import React from 'react';
import { Branch, FieldVisit } from '../../types';

interface FieldVisitGeneralSectionProps {
  branches: Branch[];
  formData: FieldVisit;
  onFormChange: (updated: Partial<FieldVisit>) => void;
}

export const FieldVisitGeneralSection: React.FC<FieldVisitGeneralSectionProps> = ({
  branches,
  formData,
  onFormChange
}) => {
  return (
    <div className="space-y-3.5 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Cabang Dikunjungi:</label>
          <select value={formData.branchId} onChange={(e) => onFormChange({ branchId: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold">
            {branches.map((b) => (<option key={b.id} value={b.id}>[{b.code}] {b.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Tanggal Kunjungan:</label>
          <input type="date" value={formData.date} onChange={(e) => onFormChange({ date: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Jam Kunjungan:</label>
          <input type="text" value={formData.time} onChange={(e) => onFormChange({ time: e.target.value })} placeholder="09:30" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div>
        <label className="block text-slate-400 mb-1 font-semibold">Agenda Utama Kunjungan:</label>
        <input type="text" value={formData.agenda} onChange={(e) => onFormChange({ agenda: e.target.value })} placeholder="Contoh: Audit Display & Kebersihan / Coaching KTB Target Harian" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Materi Coaching KTB:</label>
          <textarea rows={2} value={formData.katokCoachingTopic} onChange={(e) => onFormChange({ katokCoachingTopic: e.target.value })} placeholder="Hal penting yang dibahas bersama KTB..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Komitmen Tindakan KTB:</label>
          <textarea rows={2} value={formData.katokCommitment} onChange={(e) => onFormChange({ katokCommitment: e.target.value })} placeholder="Janji perbaikan konkret dari KTB..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Arahan untuk Kru Toko / Kasir:</label>
          <input type="text" value={formData.crewCoachingTopic} onChange={(e) => onFormChange({ crewCoachingTopic: e.target.value })} placeholder="Contoh: Penawaran produk kasir & sapa pelanggan" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Kesimpulan Akhir Kunjungan:</label>
          <input type="text" value={formData.summaryConclusion} onChange={(e) => onFormChange({ summaryConclusion: e.target.value })} placeholder="Contoh: Toko membaik, display rapi, KTB berkomitmen" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
        </div>
      </div>
    </div>
  );
};
