import React from 'react';

interface LogoMerganProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  branchName?: string;
  className?: string;
  variant?: 'dark' | 'light'; // dark = black letters for white theme; light = white letters
}

export const LogoMergan: React.FC<LogoMerganProps> = ({
  size = 'md',
  showSubtitle = false,
  branchName,
  className = '',
  variant = 'dark',
}) => {
  // Dimension scales
  const scales = {
    sm: {
      boxSize: 'w-7 h-7',
      boxBorder: 'border-2',
      boxText: 'text-[8px] leading-tight',
      merganText: 'text-xl tracking-wider',
      gap: 'space-x-2',
    },
    md: {
      boxSize: 'w-9 h-9',
      boxBorder: 'border-[2.5px]',
      boxText: 'text-[10px] leading-tight',
      merganText: 'text-2xl tracking-widest',
      gap: 'space-x-2.5',
    },
    lg: {
      boxSize: 'w-12 h-12',
      boxBorder: 'border-[3px]',
      boxText: 'text-xs leading-tight',
      merganText: 'text-3xl tracking-widest',
      gap: 'space-x-3.5',
    },
    xl: {
      boxSize: 'w-16 h-16',
      boxBorder: 'border-4',
      boxText: 'text-sm font-black leading-tight',
      merganText: 'text-4xl sm:text-5xl tracking-widest',
      gap: 'space-x-4',
    },
  };

  const current = scales[size];
  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className={`flex items-center ${current.gap}`}>
        {/* Left Square Box with "toko" and "kopi." */}
        <div
          className={`${current.boxSize} ${current.boxBorder} ${
            isDark
              ? 'border-stone-900 text-stone-900 bg-white shadow-sm'
              : 'border-white text-white'
          } flex flex-col items-center justify-center font-bold shrink-0 transition-colors`}
        >
          <span className={`${current.boxText} font-bold tracking-tight`}>toko</span>
          <span className={`${current.boxText} font-bold -mt-0.5 tracking-tight`}>kopi.</span>
        </div>

        {/* Right Heavy Bold Typography "MERGAN" */}
        <div className="flex items-center">
          <span
            className={`${current.merganText} font-black ${
              isDark ? 'text-stone-900' : 'text-white'
            } font-sans uppercase`}
            style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.08em' }}
          >
            MERGAN
          </span>
        </div>
      </div>

      {/* Optional Branch / Subtitle tag */}
      {showSubtitle && (
        <div className="flex items-center space-x-1.5 mt-1 pl-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider ${
              isDark ? 'text-stone-500' : 'text-stone-400'
            }`}
          >
            {branchName || 'Sistem Terintegrasi'}
          </span>
        </div>
      )}
    </div>
  );
};
