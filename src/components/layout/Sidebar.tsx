import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Target, 
  ClipboardCheck, 
  TrendingUp, 
  GraduationCap, 
  FileText, 
  AlertTriangle,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  branchCount: number;
  openIssuesCount: number;
  pendingEscalationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  branchCount,
  openIssuesCount,
  pendingEscalationCount 
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      desc: ''
    },
    {
      id: 'branches',
      label: 'Cabang & Diagnosa',
      icon: Store,
      badge: branchCount,
      desc: ''
    },
    {
      id: 'actionplan',
      label: 'Aksi Perbaikan',
      icon: Target,
      desc: ''
    },
    {
      id: 'fieldvisit',
      label: 'Kunjungan & Coaching',
      icon: ClipboardCheck,
      badge: openIssuesCount > 0 ? `${openIssuesCount} Temuan` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      desc: 'Log lapangan & pembinaan'
    },
    {
      id: 'performance',
      label: 'Monitoring Kinerja',
      icon: TrendingUp,
      desc: 'Grafik Sales, Margin & Opex'
    },
    {
      id: 'graduation',
      label: 'Status Kelulusan DPK',
      icon: GraduationCap,
      desc: 'Target exit DPK & Best Practice'
    },
    {
      id: 'reports',
      label: 'Laporan Manajer Bisnis',
      icon: FileText,
      desc: 'Rekap eksekutif siap cetak'
    },
    {
      id: 'escalations',
      label: 'Eskalasi Kendala Berat',
      icon: AlertTriangle,
      badge: pendingEscalationCount > 0 ? `${pendingEscalationCount} Belum Disetujui` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse',
      desc: 'Pengajuan keputusan ke BM'
    },
    {
      id: 'settings',
      label: 'Pengaturan & Data',
      icon: Settings,
      desc: 'Database, cadangan & akun'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 min-h-[calc(100vh-4rem)] p-4 hidden md:block no-print">
      <div className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <div className={`text-xs font-semibold ${isActive ? 'text-emerald-200' : 'text-slate-200'}`}>
                    {item.label}
                  </div>
                  {item.desc ? (
                    <div className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</div>
                  ) : null}
                </div>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-400'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Fokus Supervisor DPK
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Prioritaskan kunjungan ke cabang berkategori <b>Kritis</b> & pastikan komitmen KTB tercapai setiap minggu.
        </p>
      </div>
    </aside>
  );
};
