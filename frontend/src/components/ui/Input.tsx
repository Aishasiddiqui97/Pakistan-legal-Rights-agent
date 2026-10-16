import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'cosmic';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, variant = 'default', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isCosmic = variant === 'cosmic';

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-xs font-semibold uppercase tracking-wider',
              isCosmic ? 'text-slate-300' : 'text-slate-700 dark:text-slate-300'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className={cn(
                'absolute left-3.5 flex items-center pointer-events-none',
                isCosmic ? 'text-slate-400' : 'text-slate-400 dark:text-slate-500'
              )}
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full min-h-[44px] rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              isCosmic
                ? 'bg-white/[0.04] text-white placeholder:text-slate-500 backdrop-blur-xl focus:ring-purple-400/30 focus:border-purple-400/80 shadow-inner'
                : 'bg-white dark:bg-[#120B2E] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-purple-500/20 dark:focus:ring-purple-400/30 focus:border-purple-500 dark:focus:border-purple-400',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              error
                ? isCosmic
                  ? 'border-rose-500/50 focus:ring-rose-500/30 text-rose-200 bg-rose-950/20'
                  : 'border-rose-400 dark:border-rose-500/50 focus:ring-rose-500 text-rose-900 dark:text-rose-200 bg-rose-50/30 dark:bg-rose-950/20'
                : isCosmic
                ? 'border-white/[0.12] hover:border-white/[0.22]'
                : 'border-slate-300 dark:border-purple-500/30 hover:border-slate-400 dark:hover:border-purple-400',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon && <div className="absolute right-3 flex items-center">{rightIcon}</div>}
        </div>
        {error ? (
          <p
            id={`${inputId}-error`}
            className={cn('text-xs font-medium flex items-center gap-1', isCosmic ? 'text-rose-400' : 'text-rose-600 dark:text-rose-400')}
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className={cn('text-xs', isCosmic ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400')}
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
