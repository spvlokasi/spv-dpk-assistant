import React from 'react';
import { LayoutDashboard, Store, MapPin, Target, ClipboardCheck, TrendingUp, FileText, AlertTriangle, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  branchCount: number;
  openIssuesCount: number;
  pendingEscalationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, branchCount, openIssuesCount, pendingEscalationCount }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'branches', label: 'Cabang & Diagnosa', icon: Store, badge: branchCount || undefined, badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
    { id: 'map', label: 'Peta & Rute Supervisi', icon: MapPin },
    { id: 'actionplan', label: 'Aksi Perbaikan', icon: Target },
    { id: 'fieldvisit', label: 'Kunjungan & Coaching', icon: ClipboardCheck, badge: openIssuesCount || undefined, badgeColor: 'bg-amber-950/80 text-amber-300 border border-amber-700/60' },
    { id: 'performance', label: 'Monitoring Kinerja', icon: TrendingUp },
    { id: 'reports', label: 'Laporan Manajer Bisnis', icon: FileText },
    { id: 'escalations', label: 'Eskalasi Kendala Berat', icon: AlertTriangle, badge: pendingEscalationCount || undefined, badgeColor: 'bg-rose-950/80 text-rose-300 border border-rose-700/60' },
    { id: 'settings', label: 'Pengaturan & Data', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 min-h-[calc(100vh-4rem)] p-4 hidden md:block no-print">
      <div className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${isActive ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className={`text-xs font-semibold ${isActive ? 'text-emerald-200' : 'text-slate-200'}`}>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[11px] font-bold font-mono px-2 py-0.5 min-w-[22px] text-center rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-400'}`}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
