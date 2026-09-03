import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Sisi Kiri (Desktop) / Header Banner (Mobile): Foto Toko Asli */}
      <div className="relative w-full h-48 sm:h-64 lg:h-auto lg:w-1/2 xl:w-7/12 overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src="/login-bg.jpg"
          alt="Interior Toko Basmalah"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Sisi Kanan: Form Login Asli Toko Basmalah (Lebih Terang & Bersih) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 bg-slate-50 relative -mt-6 sm:-mt-8 lg:mt-0 rounded-t-3xl lg:rounded-none z-10 min-w-0">
        <div className="w-full max-w-md space-y-6">
          {/* Logo & Judul Asli */}
          <div className="text-center space-y-2">
            <img
              src="/logo.png"
              alt="Logo Basmalah"
              className="h-20 sm:h-24 w-auto max-w-[170px] object-contain drop-shadow-md mx-auto hover:scale-105 transition-transform"
            />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Dalam Pengawasan Khusus
            </h1>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Sistem Digital Toko
            </p>
          </div>

          {/* Kotak Form Login */}
          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-3.5 pr-10 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer"
              >
                <span>{isLoading ? 'Memverifikasi...' : 'Login'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} Toko Basmalah &bull; Tempat belanja yang baik
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
