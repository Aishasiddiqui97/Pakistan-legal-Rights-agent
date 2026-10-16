import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-purple-500/30 bg-white/60 dark:bg-[#120B2E]/60 backdrop-blur-sm max-w-md mx-auto my-6',
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-purple-950/60 flex items-center justify-center text-slate-500 dark:text-purple-300 mb-4 border border-slate-200 dark:border-purple-500/20">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="purple" size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
