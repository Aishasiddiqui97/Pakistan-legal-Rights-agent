import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Copy, Check, BookOpen } from 'lucide-react';
import { ChatMessage } from '@/types/chat';
import { LegalConfidenceBadge } from '@/components/ui/Badge';
import { CitationCard } from '@/features/evidence/components/CitationCard';
import { EvidenceSnippetViewer } from '@/features/evidence/components/EvidenceSnippetViewer';
import { formatRelativeTime } from '@/lib/utils';

export interface ChatMessageBubbleProps {
  message: ChatMessage;
  onSelectSuggestedQuestion?: (question: string) => void;
  onRetry?: () => void;
}

export function ChatMessageBubble({
  message,
  onSelectSuggestedQuestion: _onSelectSuggestedQuestion,
  onRetry: _onRetry,
}: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // User Message: Clean GPT-style right-aligned rounded bubble
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex justify-end w-full max-w-3xl ml-auto text-left"
      >
        <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-3.5 bg-slate-100 dark:bg-[#1E173E] text-slate-900 dark:text-slate-100 text-sm sm:text-[15px] leading-relaxed border border-slate-200/60 dark:border-white/[0.08] shadow-2xs break-words whitespace-pre-wrap">
          {message.content}
        </div>
      </motion.div>
    );
  }

  // Assistant Message: Clean GPT-style conversational flow directly on canvas
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-start gap-3.5 sm:gap-4 max-w-3xl mr-auto text-left w-full py-1"
    >
      {/* Subtle Avatar */}
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/20">
        <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>

      <div className="flex-1 space-y-3.5 min-w-0">
        {/* Main Content Body */}
        <div className="text-slate-800 dark:text-slate-100 text-sm sm:text-[15px] leading-relaxed whitespace-pre-line space-y-3 font-normal">
          {message.content}
        </div>

        {/* Citations (if present) - clean, compact cards */}
        {message.citations && message.citations.length > 0 && (
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Statutory Sources ({message.citations.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {message.citations.map((citation) => (
                <CitationCard key={citation.id} citation={citation} />
              ))}
            </div>
          </div>
        )}

        {/* Evidence Passages (collapsible) */}
        {message.evidenceSnippets && message.evidenceSnippets.length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowEvidence(!showEvidence)}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showEvidence ? 'Hide' : 'View'} retrieved statutory snippets ({message.evidenceSnippets.length})</span>
            </button>
            {showEvidence && (
              <div className="mt-2">
                <EvidenceSnippetViewer snippets={message.evidenceSnippets} />
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions Bar (GPT-style) */}
        <div className="flex items-center gap-3 pt-1 text-slate-400">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer py-1 px-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            title="Copy response"
            aria-label="Copy response"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {message.confidenceLevel && (
            <LegalConfidenceBadge confidence={message.confidenceLevel} />
          )}

          <span className="text-[11px] text-slate-400 ml-auto">
            {formatRelativeTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
