import React from 'react';
import { FileText, Percent, Database } from 'lucide-react';
import { EvidenceSnippet } from '@/types/evidence';
import { cn } from '@/lib/utils';

export interface EvidenceSnippetViewerProps {
  snippets: EvidenceSnippet[];
  className?: string;
}

export function EvidenceSnippetViewer({ snippets, className }: EvidenceSnippetViewerProps) {
  if (!snippets || snippets.length === 0) return null;

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Retrieved Evidence Passages ({snippets.length})</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {snippets.map((snip) => (
          <div
            key={snip.id}
            className="rounded-lg border border-slate-200/80 dark:border-purple-500/20 bg-slate-50/70 dark:bg-[#0D0722]/80 p-3 text-left space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-white flex items-center gap-1.5 truncate max-w-[240px]">
                <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                {snip.sourceDocument}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-500/30">
                <Percent className="w-3 h-3" />
                {Math.round(snip.relevanceConfidence * 100)}% Match
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-mono bg-white dark:bg-[#160E36] p-2 rounded border border-slate-200/50 dark:border-purple-500/20">
              "{snip.snippetText}"
            </p>

            {snip.pageOrArticle && (
              <p className="text-[11px] text-slate-400 dark:text-slate-400">Reference: {snip.pageOrArticle}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
