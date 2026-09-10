import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Zap, ShieldCheck, BarChart3, LogIn, TrendingUp, Store } from 'lucide-react';
import { AuthService } from '../../services/auth';
import { UserAccount } from '../../types/auth';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    const res = await AuthService.login(username, password);
    setIsLoading(false);
    if (res.success && res.user) onLoginSuccess(res.user);
    else setErrorMsg(res.message);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      {/* ========================================================
          SISI KIRI: Desktop Only (~65% Lebar Layar)
          Otomatis Disembunyikan di Android/Mobile (hidden lg:flex)
          ======================================================== */}
      <div className="hidden lg:flex lg:w-[63%] xl:w-[66%] relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white flex-col justify-between p-10 xl:p-14 select-none">
        {/* Background Decorator & Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.2),transparent_45%)] pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: 'url("/login-bg.jpg")' }}
        />

        {/* Header Kiri: Logo Basmalah & Badge Kapsul */}
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-xl shadow-md border border-white/20">
              <img
                src="/logo.png"
                alt="Logo Basmalah"
                className="h-8 w-auto object-contain"
              />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SISTEM DPK TOKO BASMALAH
            </span>
          </div>

          {/* Headline & Subtitle */}
          <div className="max-w-xl space-y-3 pt-2">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-snug">
              Solusi Pengawasan & Operasional Toko Terpadu
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
              Kelola seluruh proses pengawasan DPK, monitoring promo sembako, dan validasi data kasir toko Anda secara cepat, aman, dan terintegrasi dalam satu platform.
            </p>
          </div>
        </div>

        {/* Area Tengah: 3 Kartu Fitur + Kartu Widget Mini */}
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 my-auto py-6 items-center">
          {/* Kolom 3 Kartu Fitur */}
          <div className="xl:col-span-7 space-y-3">
            {/* Fitur 1 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white tracking-wide">Monitoring DPK Real-time</h4>
                <p className="text-[11px] text-emerald-200/90 leading-tight truncate">Pantau stok minus, item promo, dan audit toko seketika.</p>
              </div>
            </div>

            {/* Fitur 2 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white tracking-wide">Keamanan & Validasi Akurat</h4>
                <p className="text-[11px] text-emerald-200/90 leading-tight truncate">Autentikasi akun penugasan resmi dengan sinkronisasi cloud.</p>
              </div>
            </div>

            {/* Fitur 3 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white tracking-wide">Katalog Promo & Kasir Online</h4>
                <p className="text-[11px] text-emerald-200/90 leading-tight truncate">Cetak flyer hemat, bagikan link WA belanja, dan kelola pesanan.</p>
              </div>
            </div>
          </div>

          {/* Kolom Visual Widget Mini (Kartu Digital Toko) */}
          <div className="hidden xl:block xl:col-span-5">
            <div className="relative rounded-2xl p-4 bg-gradient-to-br from-emerald-800/80 to-teal-900/90 border border-emerald-400/20 shadow-2xl backdrop-blur-lg space-y-3">
              <div className="flex items-center justify-between text-[10px] text-emerald-300 font-semibold">
                <span className="flex items-center gap-1"><Store className="w-3 h-3 text-emerald-300" /> TOKO BASMALAH</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200 flex items-center gap-1 font-mono">
                  <TrendingUp className="w-2.5 h-2.5 text-emerald-300" /> AKTIF
                </span>
              </div>
              <div className="py-1">
                <div className="text-[10px] text-emerald-200/80 uppercase tracking-wider font-semibold">Status Operasional</div>
                <div className="text-lg font-black text-white tracking-tight font-mono">TERHUBUNG CLOUD</div>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-200/80">
                <span>Tempat belanja yang baik</span>
                <span className="font-bold text-white">Jawa Timur</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Kiri */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/70">
          <span>&copy; {new Date().getFullYear()} Toko Basmalah &bull; PT Duta Bangsa Mandiri</span>
          <span className="italic font-medium">Jujur & Amanah</span>
        </div>
      </div>

      {/* ========================================================
          SISI KANAN: Form Login Bersih (Minimalis & Modern)
          Di Desktop: ~35% Lebar Layar
          Di Android/HP (Ctrl+Shift+M): 100% Lebar Layar (Langsung Fokus)
          ======================================================== */}
      <div className="w-full lg:w-[37%] xl:w-[34%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white relative z-10 min-h-screen">
        {/* Atas: Header Form & Ikon */}
        <div className="w-full max-w-sm mx-auto my-auto space-y-6">
          {/* Brand/Icon Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Ikon Pintu Masuk Hijau (Mirip tombol icon e-maal) */}
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <LogIn className="w-5 h-5" />
              </div>

              {/* Logo Basmalah Khusus Mobile (Agar di HP tetap ada identitas logo Basmalah) */}
              <div className="lg:hidden">
                <img
                  src="/logo.png"
                  alt="Logo Basmalah"
                  className="h-9 w-auto object-contain drop-shadow-sm"
                />
              </div>
            </div>

            {/* Sapaan Teks */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Selamat Datang!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Masuk ke akun Anda untuk melanjutkan.
              </p>
            </div>
          </div>

          {/* Notifikasi Error */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-shake shadow-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username..."
                  className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-10 pr-3.5 py-3 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tombol MASUK (Hijau Elegan seperti di referensi) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <span>{isLoading ? 'Memverifikasi...' : 'MASUK'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Pesan Khas Toko Basmalah */}
          <div className="text-center pt-2">
            <p className="text-xs font-medium text-emerald-600 italic">
              Jangan lupa baca Bismillah
            </p>
          </div>
        </div>

        {/* Footer Form */}
        <div className="text-center pt-6">
          <p className="text-[11px] text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Toko Basmalah &bull; Tempat belanja yang baik
          </p>
        </div>
      </div>
    </div>
  );
};

