import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Key, 
  Link as LinkIcon, 
  Cloud, 
  CheckCircle2, 
  User, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { SupabaseService } from '../../services/supabase';
import { UserAccount } from '../../types/auth';

interface SettingsAndDataProps {
  currentUser: UserAccount;
  onDataChange: () => void;
  onOpenProfileModal: () => void;
}

export const SettingsAndData: React.FC<SettingsAndDataProps> = ({
  currentUser,
  onDataChange,
  onOpenProfileModal
}) => {
  const creds = SupabaseService.getCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(creds.supabaseUrl);
  const [supabaseKey, setSupabaseKey] = useState(creds.supabaseAnonKey);
  const [isCloudConnected, setIsCloudConnected] = useState(SupabaseService.isConfigured());
  const [cloudStatusMsg, setCloudStatusMsg] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveCloudConfig = async () => {
    SupabaseService.setCredentials(supabaseUrl, supabaseKey);
    setIsTesting(true);
    setCloudStatusMsg('Sedang menguji koneksi ke Supabase...');
    const res = await SupabaseService.testConnection();
    setIsTesting(false);
    setCloudStatusMsg(res.message);
    setIsCloudConnected(res.success);
    if (res.success) {
      showToast('Koneksi Supabase Aktif & Tersimpan!');
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

  const handleExport = () => {
    const dataStr = StorageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_spv_dpk_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('File cadangan JSON berhasil diunduh!');
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
          showToast('Data berhasil dipulihkan dari file JSON!');
          onDataChange();
        } else {
          alert('Format data JSON tidak valid');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset data ke default contoh toko? Semua perubahan tersimpan akan dikembalikan ke data awal.')) {
      StorageService.resetToDefaults();
      onDataChange();
      showToast('Data telah direset ke contoh default');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-emerald-400" />
          Pengaturan Sistem & Manajemen Data
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Kelola database cloud Supabase, ekspor file cadangan, serta pengaturan profil dan keamanan akun.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Cloud Database Supabase */}
        <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Database Cloud (Supabase)
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 ${
              isCloudConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
              {isCloudConnected ? 'Cloud Online' : 'Belum Terhubung'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Data tersimpan di server PostgreSQL Supabase secara otomatis dan tersinkron saat dibuka di laptop maupun smartphone.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-400" /> URL Project Supabase
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xxxxxxxx.supabase.co"
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Anon Public Key
              </label>
              <textarea
                rows={2}
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            {cloudStatusMsg && (
              <div className={`p-3 rounded-xl border text-xs ${
                isCloudConnected ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                {cloudStatusMsg}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveCloudConfig}
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 transition-all flex items-center gap-1.5"
              >
                {isTesting ? 'Menguji...' : 'Simpan & Tes Koneksi'}
              </button>

              {isCloudConnected && (
                <button
                  type="button"
                  onClick={handleSyncToCloud}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-950 transition-all flex items-center gap-1.5"
                >
                  <Cloud className="w-4 h-4" />
                  {isSyncing ? 'Mengunggah...' : 'Upload Data ke Cloud'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Cadangan Data (Backup & Restore JSON) */}
        <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" />
              Cadangan Manual (File JSON)
            </h3>
            <span className="text-[11px] text-slate-500">Arsip Offline</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Unduh salinan lengkap data toko, target, coaching, dan laporan ke file di laptop Anda untuk arsip bulanan pribadi atau untuk dipulihkan saat berganti perangkat.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-200">Ekspor File Cadangan</div>
                <div className="text-[11px] text-slate-400">Unduh seluruh database ke file .json</div>
              </div>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Download className="w-4 h-4" /> Unduh JSON
              </button>
            </div>

            <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-200">Pulihkan dari File Cadangan</div>
                <div className="text-[11px] text-slate-400">Impor data dari file .json cadangan Anda</div>
              </div>
              <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto">
                <Upload className="w-4 h-4" /> Pilih File JSON
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Card 3: Profil & Keamanan Akun */}
        <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              Profil Akun & Keamanan
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Username Login:</span>
              <strong className="text-emerald-400 font-mono">{currentUser.username}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Nama Lengkap:</span>
              <strong className="text-slate-200">{currentUser.fullName}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Jabatan:</span>
              <strong className="text-slate-200">{currentUser.roleTitle}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Manajer Bisnis (Atasan):</span>
              <strong className="text-slate-200">{currentUser.businessManager}</strong>
            </div>
          </div>

          <button
            onClick={onOpenProfileModal}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Ubah Profil, Username & Password
          </button>
        </div>

        {/* Card 4: Reset Data Bawaan */}
        <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Reset Data Sistem
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Jika Anda ingin mengosongkan data percobaan dan mengembalikan aplikasi ke kondisi awal contoh toko retail bawaan.
          </p>

          <button
            onClick={handleReset}
            className="w-full py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 text-xs font-bold border border-rose-800/60 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset ke Data Default
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 sm:bottom-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          {toastMsg}
        </div>
      )}
    </div>
  );
};
