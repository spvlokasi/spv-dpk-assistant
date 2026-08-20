import React from 'react';

interface BasmalahRatingProps {
  score: number;
  category: 'internal' | 'eksternal';
  onChangeScore: (score: number) => void;
}

export const BasmalahRating: React.FC<BasmalahRatingProps> = ({ score, category, onChangeScore }) => {
  const isInternal = category === 'internal';

  const getScoreLabel = (s: number) => {
    if (isInternal) {
      if (s === 1) return '🔴 Kritis (1)';
      if (s === 2) return '🟠 Kurang (2)';
      if (s === 3) return '🟡 Standar (3)';
      if (s === 4) return '🟢 Baik (4)';
      return '🌟 Ekselen (5)';
    }
    if (s === 1) return '🔴 Berat Sekali (1)';
    if (s === 2) return '🟠 Menantang (2)';
    if (s === 3) return '🟡 Cukup Stabil (3)';
    if (s === 4) return '🟢 Mendukung (4)';
    return '🌟 Sangat Aman (5)';
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800/80">
      <div className="flex items-center gap-1 sm:gap-1.5">
        <span className="text-[10px] text-slate-500 mr-1 font-medium hidden sm:inline">
          {isInternal ? 'Penilaian:' : 'Kondisi:'}
        </span>
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isActive = starValue <= score;
          const activeBg = isInternal ? 'bg-emerald-500/20 border-emerald-500/40 shadow-emerald-500/20' : 'bg-amber-500/20 border-amber-500/40 shadow-amber-500/20';
          const glowColor = isInternal ? 'drop-shadow-[0_0_3px_rgba(16,185,129,0.8)]' : 'drop-shadow-[0_0_3px_rgba(245,158,11,0.8)]';

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChangeScore(starValue)}
              className="group relative p-0.5 transition-all duration-200 hover:scale-125 focus:outline-none"
              title={`Beri Nilai ${starValue} / 5`}
            >
              <div className={`w-6 h-6 rounded-lg p-0.5 flex items-center justify-center transition-all ${
                isActive ? `${activeBg} border scale-105 shadow-sm` : 'bg-slate-800/40 border border-slate-800 opacity-40 hover:opacity-80'
              }`}>
                <img
                  src="/logo.png"
                  alt={`Skor ${starValue}`}
                  className={`w-full h-full object-contain transition-all ${isActive ? `filter-none ${glowColor}` : 'grayscale'}`}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-right">
        <span className={`text-[11px] font-semibold ${score <= 2 ? 'text-rose-400' : score === 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
};
