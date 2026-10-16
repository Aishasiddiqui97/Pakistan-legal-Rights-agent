import React, { useState } from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';
import { LegalCitation } from '@/types/evidence';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface CitationCardProps {
  citation: LegalCitation;
  className?: string;
}

export function CitationCard({ citation, className }: CitationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${citation.actTitle}, ${citation.section} (${citation.enactmentYear})\nGazette Ref: ${citation.officialGazetteRef || 'Official Records'}\n${citation.explanatoryNote}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'group rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03] p-3.5 text-left transition-colors duration-200 hover:border-purple-300 dark:hover:border-purple-500/40 space-y-2',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 px-1.5 py-0.5 rounded">
              <ShieldCheck className="w-2.5 h-2.5" />
              {citation.section}
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug truncate">
            {citation.actTitle}
          </h4>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
          title="Copy Citation"
          aria-label="Copy Citation"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Explanatory Practical Note */}
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
        {citation.explanatoryNote}
      </p>

      {/* Footer */}
      <div className="pt-1.5 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400">
        <span className="truncate max-w-[180px]">
          {citation.officialGazetteRef || 'Official Gazette of Pakistan'}
        </span>
        <span className="font-semibold text-purple-600 dark:text-purple-400">
          {citation.enactmentYear}
        </span>
      </div>
    </motion.div>
  );
}
