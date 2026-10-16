import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'emerald' | 'purple' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#0B192C] text-white hover:bg-[#1E293B] border border-slate-700/60 shadow-md shadow-slate-950/20 hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-emerald-500',
      emerald:
        'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-600 border border-emerald-400/30 shadow-md shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 focus-visible:ring-emerald-500',
      purple:
        'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 focus-visible:ring-purple-400',
      secondary:
        'bg-white text-slate-800 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-xs hover:shadow-sm hover:-translate-y-0.5 focus-visible:ring-slate-400 dark:bg-[#120B2E] dark:text-slate-100 dark:border-purple-500/30 dark:hover:bg-[#1A0F44] dark:hover:border-purple-400',
      outline:
        'border border-slate-300/80 bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-slate-100/80 active:bg-slate-200 focus-visible:ring-slate-400 dark:border-purple-500/30 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white',
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-slate-300 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
      danger:
        'bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-500 hover:to-rose-600 shadow-md shadow-rose-600/25 hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-rose-500',
      link: 'text-emerald-600 underline-offset-4 hover:underline p-0 h-auto font-normal active:scale-100',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 min-h-[36px] gap-1.5',
      md: 'text-sm px-4.5 py-2.5 min-h-[44px] gap-2',
      lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5 font-bold',
      icon: 'h-11 w-11 p-0 justify-center min-h-[44px]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
