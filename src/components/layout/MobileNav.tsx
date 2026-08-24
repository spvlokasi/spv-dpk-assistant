import React from 'react';
import { Target, ClipboardCheck, TrendingUp, ShoppingBag, AlertTriangle, LayoutDashboard, Store } from 'lucide-react';
import { UserAccount } from '../../types/auth';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser?: UserAccount;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, currentUser }) => {
  const isKtb = currentUser?.username.startsWith('ktb.') || currentUser?.roleTitle === 'Kepala Toko';

  const ktbTabs = [
    { id: 'catalog', label: 'Promo', icon: ShoppingBag },
    { id: 'actionplan', label: 'Action Plan', icon: Target },
    { id: 'performance', label: 'Kinerja', icon: TrendingUp },
    { id: 'escalations', label: 'Eskalasi', icon: AlertTriangle },
    { id: 'fieldvisit', label: 'Supervisi', icon: ClipboardCheck }
  ];

  const spvTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'branches', label: 'Cabang', icon: Store },
    { id: 'catalog', label: 'Promo', icon: ShoppingBag },
    { id: 'actionplan', label: 'Action Plan', icon: Target },
    { id: 'performance', label: 'Kinerja', icon: TrendingUp }
  ];

  const tabs = isKtb ? ktbTabs : spvTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 md:hidden no-print">
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-1'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
