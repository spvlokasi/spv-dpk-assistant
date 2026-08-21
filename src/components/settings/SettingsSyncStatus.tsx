import React, { useState } from 'react';
import { Cloud, CheckCircle2, RefreshCw, ChevronDown, ChevronUp, Link as LinkIcon, Key } from 'lucide-react';
import { SupabaseService } from '../../services/supabase';

interface SettingsSyncStatusProps {
  isCloudConnected: boolean;
  onSync: () => void;
  isSyncing: boolean;
  onShowToast: (msg: string) => void;
}

export const SettingsSyncStatus: React.FC<SettingsSyncStatusProps> = ({
  isCloudConnected,
  onSync,
  isSyncing,
  onShowToast
}) => {
  const creds = SupabaseService.getCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(creds.supabaseUrl);
  const [supabaseKey, setSupabaseKey] = useState(creds.supabaseAnonKey);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [cloudStatusMsg, setCloudStatusMsg] = useState<string | null>(null);

  const handleSaveCloudConfig = async () => {
    SupabaseService.setCredentials(supabaseUrl, supabaseKey);
    setIsTesting(true);
    setCloudStatusMsg('Sedang menguji koneksi...');
    const res = await SupabaseService.testConnection();
    setIsTesting(false);
    setCloudStatusMsg(res.message);
    if (res.success) {
      onShowToast('Koneksi Supabase Aktif & Tersimpan!');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Cloud className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Sinkronisasi Cloud Supabase</h3>
            <p className="text-xs text-slate-400">Penyimpanan cloud multi-perangkat real-time</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
              isCloudConnected
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            {isCloudConnected ? 'Cloud Aktif' : 'Lokal Saja'}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={onSync}
          disabled={isSyncing}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-950 transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sedang Sinkronisasi...' : 'Sinkronkan Data ke Cloud Sekarang'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 p-1"
        >
          <span>Konfigurasi Kredensial URL & Key</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showAdvanced && (
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5" /> Supabase Project URL:
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyz.supabase.co"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
              <Key className="w-3.5 h-3.5" /> Supabase Anon Public Key:
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOi..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">{cloudStatusMsg}</span>
            <button
              type="button"
              onClick={handleSaveCloudConfig}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold"
            >
              {isTesting ? 'Menguji...' : 'Uji & Simpan Kredensial'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
