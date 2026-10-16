import React from 'react';
import { Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LegalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  withBadge?: boolean;
  badgeText?: string;
  isDark?: boolean;
}

export function LegalLogo({
  className,
  size = 'md',
  showSubtitle = false,
  withBadge = true,
  badgeText = 'Pakistan',
}: LegalLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl',
  };

  const scaleIconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const titleSizes = {
    sm: 'text-base font-extrabold',
    md: 'text-lg sm:text-xl font-extrabold',
    lg: 'text-xl sm:text-2xl font-black',
    xl: 'text-2xl sm:text-3xl font-black',
  };

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none text-left group', className)}>
      {/* Icon Emblem with Cosmic Glow & Scales of Justice */}
      <div className="relative shrink-0">
        <div
          className={cn(
            'flex items-center justify-center bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 text-white border border-purple-300/40 dark:border-purple-400/40 shadow-md shadow-purple-600/35 dark:shadow-[0_0_24px_rgba(139,92,246,0.45)] group-hover:scale-105 group-hover:shadow-[0_0_28px_rgba(139,92,246,0.6)] transition-all duration-300',
            iconSizes[size]
          )}
        >
          <Scale className={cn('text-white drop-shadow-sm', scaleIconSizes[size])} />
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "tracking-tight text-slate-900 dark:text-white font-['Outfit'] leading-none",
              titleSizes[size]
            )}
          >
            Legal
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 dark:from-purple-300 dark:via-indigo-200 dark:to-purple-400">
              AI
            </span>
          </span>

          {withBadge && (
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 dark:text-purple-200 bg-purple-100/90 dark:bg-purple-950/70 border border-purple-200/90 dark:border-purple-500/40 backdrop-blur-md px-2 py-0.5 rounded-full shadow-2xs group-hover:border-purple-400 transition-colors">
              {badgeText}
            </span>
          )}
        </div>

        {showSubtitle && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-purple-300/80 tracking-wide mt-0.5">
            AI-Powered Legal Rights Assistant
          </span>
        )}
      </div>
    </div>
  );
}

export default LegalLogo;
