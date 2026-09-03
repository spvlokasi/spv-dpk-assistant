import React from 'react';
import { MapPin, Filter, Route } from 'lucide-react';
import { Branch } from '../../types';
import { getBranchCoordinates } from '../../services/map';

interface BranchMapHeaderProps {
  branches: Branch[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  routeCount: number;
}

export const BranchMapHeader: React.FC<BranchMapHeaderProps> = ({
  branches, selectedCity, onSelectCity, selectedStatus, onSelectStatus, routeCount
}) => {
  const cities = Array.from(new Set(branches.map((b) => getBranchCoordinates(b).city))).filter(Boolean);

  return (
    <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200 text-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <select value={selectedCity} onChange={(e) => onSelectCity(e.target.value)} className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer py-1">
            <option value="all" className="bg-slate-800">Semua Wilayah</option>
            {cities.map((city) => (<option key={city} value={city} className="bg-slate-800">{city}</option>))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200 text-xs">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <select value={selectedStatus} onChange={(e) => onSelectStatus(e.target.value)} className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer py-1">
            <option value="all" className="bg-slate-800">Semua Status</option>
            <option value="kritis" className="bg-slate-800">🔴 Kritis & Akut</option>
            <option value="dalam_progres" className="bg-slate-800">🟡 Dalam Progres</option>
            <option value="siap_lulus" className="bg-slate-800">🟢 Siap Lulus</option>
          </select>
        </div>
      </div>

      <div className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs font-bold font-mono flex items-center gap-1.5">
        <Route className="w-3.5 h-3.5" /><span>{routeCount} Toko Dipilih</span>
      </div>
    </div>
  );
};
