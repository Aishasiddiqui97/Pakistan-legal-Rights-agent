import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DisclaimerBannerProps {
  className?: string;
  variant?: 'banner' | 'inline' | 'compact';
  dismissible?: boolean;
}

export function DisclaimerBanner({
  className,
  variant = 'banner',
  dismissible = false,
}: DisclaimerBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-purple-950/30 border border-slate-200 dark:border-purple-500/20 rounded-md',
          className
        )}
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>Legal information only. Does not replace advice from a licensed advocate.</span>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Legal Disclaimer"
      className={cn(
        'relative bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-500/30 text-amber-950 dark:text-amber-200 px-4 py-3 rounded-xl text-xs sm:text-sm',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1 text-left">
          <p className="font-semibold text-amber-900 dark:text-amber-200">
            Important Legal Information Notice — Pakistan Jurisdiction
          </p>
          <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed text-xs">
            Pakistan Legal Rights Agent is an independent AI-powered legal assistant designed to clarify laws,
            statutes, and procedural rights under Pakistan and Federal law. This tool is not an official government portal,
            and provides legal information, not licensed legal advice or an attorney-client relationship. If you are
            facing active litigation, arrest, or eviction, consult a qualified advocate of the High
            Courts of Pakistan or legal aid authorities.
          </p>
        </div>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-700 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white rounded hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
            aria-label="Dismiss disclaimer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
