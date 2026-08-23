import React from 'react';
import { EscalationTicket, Branch } from '../../types';
import { formatDateIndo } from '../../utils/formatters';

interface ReportEscalationSectionProps {
  escalations: EscalationTicket[];
  targetBranches: Branch[];
}

export const ReportEscalationSection: React.FC<ReportEscalationSectionProps> = ({
  escalations, targetBranches
}) => {
  const targetBranchIds = new Set(targetBranches.map((b) => b.id));
  const activeEscalations = escalations.filter((e) => targetBranchIds.has(e.branchId));

  return (
    <div className="space-y-2 break-inside-avoid">
      <h3 className="text-sm font-black uppercase text-slate-950 mb-2 border-l-4 border-rose-600 pl-2">
        III. Rekapitulasi Eskalasi Kendala Berat & Permohonan Disposisi Manajer
      </h3>

      {activeEscalations.length === 0 ? (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
          ✓ <span className="font-semibold text-slate-800">Operasional Terkendali:</span> Tidak ada tiket eskalasi kendala berat yang memerlukan wewenang/tindakan khusus Manajer Bisnis pada periode ini.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800 uppercase text-[10px] border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300 w-8 text-center">No</th>
                <th className="p-2 border-r border-slate-300">Cabang & Tanggal</th>
                <th className="p-2 border-r border-slate-300">Pokok Kendala & Kronologi</th>
                <th className="p-2 border-r border-slate-300">Rekomendasi Solusi SPV</th>
                <th className="p-2 border-r border-slate-300 text-center w-24">Status</th>
                <th className="p-2 w-48">Disposisi / Arahan Manajer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activeEscalations.map((esc, idx) => (
                <tr key={esc.id} className="hover:bg-slate-50">
                  <td className="p-2 border-r border-slate-300 font-bold text-center">{idx + 1}</td>
                  <td className="p-2 border-r border-slate-300 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{esc.branchName}</div>
                    <div className="text-[10px] text-slate-500">{formatDateIndo(esc.date)}</div>
                  </td>
                  <td className="p-2 border-r border-slate-300">
                    <div className="font-bold text-slate-900">{esc.title}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">{esc.description}</div>
                  </td>
                  <td className="p-2 border-r border-slate-300 text-emerald-800 text-[11px] font-medium">
                    {esc.proposedSolution || '-'}
                  </td>
                  <td className="p-2 border-r border-slate-300 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${esc.status === 'disetujui' ? 'bg-emerald-100 text-emerald-800' : esc.status === 'ditolak' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                      {esc.status}
                    </span>
                  </td>
                  <td className="p-2 text-slate-800 text-[11px] italic bg-slate-50/50">
                    {esc.managerFeedback ? `"${esc.managerFeedback}"` : <span className="text-slate-400 not-italic">Menunggu telaah/tanda tangan</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
