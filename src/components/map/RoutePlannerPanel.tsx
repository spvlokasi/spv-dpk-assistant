import React from 'react';
import { Navigation, Route, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { Branch } from '../../types';
import { calculateTotalRouteDistance, generateGoogleMapsRouteUrl } from '../../services/map';

interface RoutePlannerPanelProps {
  branches: Branch[];
  routeBranchIds: string[];
  onReorderRoute: (newIds: string[]) => void;
  onRemoveFromRoute: (id: string) => void;
  onClearRoute: () => void;
}

export const RoutePlannerPanel: React.FC<RoutePlannerPanelProps> = ({
  branches, routeBranchIds, onReorderRoute, onRemoveFromRoute, onClearRoute
}) => {
  const routeBranches = routeBranchIds.map((id) => branches.find((b) => b.id === id)).filter(Boolean) as Branch[];
  const totalKm = calculateTotalRouteDistance(routeBranches);
  const mapsUrl = generateGoogleMapsRouteUrl(routeBranches);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIds = [...routeBranchIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newIds.length) return;
    const temp = newIds[index]; newIds[index] = newIds[targetIndex]; newIds[targetIndex] = temp;
    onReorderRoute(newIds);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-white">Rencana Rute Supervisi ({routeBranches.length} Toko)</h4>
        </div>
        {routeBranches.length > 0 && (
          <button type="button" onClick={onClearRoute} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold">
            <Trash2 className="w-3.5 h-3.5" /><span>Reset</span>
          </button>
        )}
      </div>

      {routeBranches.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl space-y-1">
          <p className="font-semibold text-slate-400">Belum ada cabang dalam rute hari ini.</p>
          <p>Klik tombol <strong>"+ Ke Rute"</strong> pada pin cabang di peta untuk menyusun rute perjalanan.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {routeBranches.map((b, idx) => (
            <div key={b.id} className="p-2.5 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 font-mono">{idx + 1}</span>
                <div className="min-w-0"><h5 className="text-xs font-bold text-slate-200 truncate">{b.name}</h5><p className="text-[10px] text-slate-400">{b.code} • KTB: {b.kepalaToko}</p></div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button type="button" disabled={idx === 0} onClick={() => handleMove(idx, 'up')} className="p-1 rounded-lg hover:bg-slate-700 disabled:opacity-30 text-slate-300"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button type="button" disabled={idx === routeBranches.length - 1} onClick={() => handleMove(idx, 'down')} className="p-1 rounded-lg hover:bg-slate-700 disabled:opacity-30 text-slate-300"><ArrowDown className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => onRemoveFromRoute(b.id)} className="p-1 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Jarak Tempuh Rute:</span>
            <strong className="text-emerald-400 font-mono font-bold">{totalKm} KM (~{Math.round(totalKm * 1.8)} menit)</strong>
          </div>

          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 active:scale-95 transition-all">
            <Navigation className="w-4 h-4" /><span>Mulai Navigasi Multi-Stop (Google Maps)</span><ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
          </a>
        </div>
      )}
    </div>
  );
};
