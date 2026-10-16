import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Scale, AlertTriangle, HelpCircle } from 'lucide-react';
import { EvidenceConfidence } from '@/types/evidence';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'statute'
    | 'precedent'
    | 'guidance'
    | 'uncertain'
    | 'neutral'
    | 'outline'
    | 'emerald'
    | 'glow-emerald';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  showDot?: boolean;
}

export function Badge({
  className,
  variant = 'neutral',
  size = 'md',
  icon,
  showDot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    statute:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-500/30 shadow-xs shadow-emerald-500/10 font-bold',
    precedent:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-300/80 dark:border-sky-500/30 shadow-xs shadow-sky-500/10 font-bold',
    guidance:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300/80 dark:border-amber-500/30 shadow-xs shadow-amber-500/10 font-bold',
    uncertain:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300/80 dark:border-rose-500/30 shadow-xs shadow-rose-500/10 font-bold',
    neutral:
      'bg-slate-100 dark:bg-purple-950/50 text-slate-700 dark:text-purple-300 border-slate-200/90 dark:border-purple-500/25 font-semibold',
    outline:
      'bg-white/80 dark:bg-white/[0.04] backdrop-blur-xs text-slate-600 dark:text-slate-300 border-slate-300/80 dark:border-purple-500/30 font-medium',
    emerald:
      'bg-emerald-600 text-white border-transparent font-bold shadow-sm',
    'glow-emerald':
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-bold',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1.5 font-bold uppercase tracking-wider',
    md: 'text-xs px-3 py-1 gap-1.5 font-bold uppercase tracking-wider',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold tracking-normal',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-all duration-200 select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {showDot && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

/**
 * Specialized badge rendering statutory certainty levels.
 */
export function LegalConfidenceBadge({ confidence }: { confidence?: EvidenceConfidence }) {
  if (!confidence) return null;

  switch (confidence) {
    case 'verified-statute':
      return (
        <Badge
          variant="statute"
          showDot
          icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
        >
          Verified Statute
        </Badge>
      );
    case 'judicial-precedent':
      return (
        <Badge variant="precedent" icon={<Scale className="w-3.5 h-3.5 text-sky-600" />}>
          Judicial Precedent
        </Badge>
      );
    case 'general-guidance':
      return (
        <Badge variant="guidance" icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}>
          General Guidance
        </Badge>
      );
    case 'insufficient-evidence':
      return (
        <Badge variant="uncertain" icon={<HelpCircle className="w-3.5 h-3.5 text-rose-600" />}>
          Insufficient Evidence
        </Badge>
      );
  }
}
