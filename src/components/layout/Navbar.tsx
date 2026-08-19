import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  ShieldAlert, 
  UserCheck, 
  CheckCircle2,
  Database,
  X,
  Key,
  Link as LinkIcon,
  Cloud,
  LogOut,
  User
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { SupabaseService } from '../../services/supabase';
import { UserAccount } from '../../types/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  escalationCount: number;
  onDataChange: () => void;
  currentUser: UserAccount;
  onOpenProfileModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  escalationCount,
  onDataChange,
  currentUser,
  onOpenProfileModal,
  onLogout
}) => {
  const [showBackupMenu, setShowBackupMenu] = useState(false);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Cloud credentials state
  const creds = SupabaseService.getCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(creds.supabaseUrl);
  const [supabaseKey, setSupabaseKey] = useState(creds.supabaseAnonKey);
  const [isCloudConnected, setIsCloudConnected] = useState(SupabaseService.isConfigured());
  const [cloudStatusMsg, setCloudStatusMsg] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleExport = () => {
    const dataStr = StorageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_spv_dpk_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Data berhasil diekspor!');
    setShowBackupMenu(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importAllData(content);
        if (success) {
          showToast('Data berhasil dipulihkan!');
          onDataChange();
        } else {
          alert('Format data JSON tidak valid');
        }
      }
    };
    reader.readAsText(file);
    setShowBackupMenu(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset data ke default contoh toko? Semua perubahan tersimpan akan dikembalikan ke data awal.')) {
      StorageService.resetToDefaults();
      onDataChange();
      showToast('Data telah direset ke contoh default');
      setShowBackupMenu(false);
    }
  };

  // Cloud Actions
  const handleSaveCloudConfig = async () => {
    SupabaseService.setCredentials(supabaseUrl, supabaseKey);
    setIsTesting(true);
    setCloudStatusMsg('Sedang menguji koneksi ke Supabase...');
    const res = await SupabaseService.testConnection();
    setIsTesting(false);
    setCloudStatusMsg(res.message);
    setIsCloudConnected(res.success);
    if (res.success) {
      showToast('Koneksi Supabase Aktif!');
    }
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    const payload = {
      branches: StorageService.getBranches(),
      milestones: StorageService.getMilestones(),
      visits: StorageService.getVisits(),
      performance: StorageService.getPerformance(),
      graduations: StorageService.getGraduations(),
      escalations: StorageService.getEscalations()
    };
    const res = await SupabaseService.syncLocalToCloud(payload);
    setIsSyncing(false);
    showToast(res.message);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-850 border border-slate-700/80 p-1 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <img src="/logo.png" alt="Logo Basmalah" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">SPV DPK</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Sistem Pendampingan & Turnaround Toko</p>
            </div>
          </div>

          {/* Quick Info & Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cloud Supabase Status Button */}
            <button
              onClick={() => setShowCloudModal(true)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isCloudConnected
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Pengaturan Database Cloud Supabase"
            >
              <Database className={`w-4 h-4 ${isCloudConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isCloudConnected ? 'Cloud Online' : 'Setup Cloud'}</span>
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            </button>

            {/* Escalation Alert Shortcut */}
            <button
              onClick={() => setActiveTab('escalations')}
              className={`relative p-2 rounded-xl text-sm flex items-center gap-1.5 transition-colors ${
                activeTab === 'escalations' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Tiket Eskalasi ke Manajer Bisnis"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline text-xs font-medium">Eskalasi BM</span>
              {escalationCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {escalationCount}
                </span>
              )}
            </button>

            {/* Backup & Tools Menu */}
            <div className="relative">
              <button
                onClick={() => setShowBackupMenu(!showBackupMenu)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">Cadangan</span>
              </button>

              {showBackupMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Penyimpanan Lokal
                  </div>
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    Ekspor Cadangan (JSON)
                  </button>
                  <label className="w-full px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    Pulihkan Data (Impor JSON)
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    onClick={handleReset}
                    className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset ke Data Default
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar Badge with Dropdown & Click to Edit */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
              <button
                onClick={onOpenProfileModal}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 transition-colors text-left group"
                title="Klik untuk Edit Profil, Username & Password"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-700/40 border border-emerald-500/40 flex items-center justify-center group-hover:border-emerald-400 transition-colors">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {currentUser.username}
                  </div>
                  <div className="text-[10px] text-emerald-400 line-clamp-1">{currentUser.roleTitle}</div>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                title="Keluar (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Supabase Configuration Modal */}
      {showCloudModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                Integrasi Cloud Database (Supabase)
              </h3>
              <button
                onClick={() => setShowCloudModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Hubungkan aplikasi dengan database PostgreSQL Supabase (Gratis 500 MB / 1 GB) agar data cabang, coaching, dan metrik tersinkronisasi secara online dan dapat diakses dari mana saja.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-400" /> Project URL Supabase
                </label>
                <input
                  type="text"
                  placeholder="https://xxxxxxxx.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" /> Project Anon Public Key
                </label>
                <textarea
                  rows={2}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              {cloudStatusMsg && (
                <div className={`p-3 rounded-xl border text-xs ${
                  isCloudConnected ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  {cloudStatusMsg}
                </div>
              )}

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Langkah Cepat Setup Supabase:</div>
                <div>1. Buka <strong>supabase.com</strong> & buat project baru gratis.</div>
                <div>2. Salin isi file <strong>supabase_schema.sql</strong> ke <i>SQL Editor</i> Supabase & klik Run.</div>
                <div>3. Salin Project URL & Anon Key di menu <i>Project Settings &gt; API</i> ke kolom di atas.</div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800 flex-wrap">
                {isCloudConnected && (
                  <button
                    type="button"
                    onClick={handleSyncToCloud}
                    disabled={isSyncing}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Cloud className="w-4 h-4" />
                    {isSyncing ? 'Menyinkronkan...' : 'Upload Data Lokal ke Cloud'}
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowCloudModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCloudConfig}
                    disabled={isTesting}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950 flex items-center gap-1.5"
                  >
                    {isTesting ? 'Menguji...' : 'Simpan & Tes Koneksi'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 sm:bottom-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          {toastMsg}
        </div>
      )}
    </header>
  );
};
