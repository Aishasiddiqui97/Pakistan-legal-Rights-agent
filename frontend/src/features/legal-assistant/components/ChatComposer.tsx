import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Sparkles, Scale } from 'lucide-react';
import { LegalJurisdiction, LegalTopic } from '@/types/evidence';
import { cn } from '@/lib/utils';

export interface ChatComposerProps {
  onSendMessage: (content: string, jurisdiction: LegalJurisdiction, topic?: LegalTopic) => void;
  isLoading?: boolean;
  initialJurisdiction?: LegalJurisdiction;
  placeholder?: string;
}

export function ChatComposer({
  onSendMessage,
  isLoading = false,
  initialJurisdiction = 'sindh',
  placeholder = 'Ask anything about Pakistan legal rights, tenancy, labour...',
}: ChatComposerProps) {
  const [content, setContent] = useState('');
  const [jurisdiction] = useState<LegalJurisdiction>(initialJurisdiction);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height smoothly based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 28), 200)}px`;
    }
  }, [content]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() || isLoading) return;

    onSendMessage(content.trim(), jurisdiction);
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasText = content.trim().length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-2 text-left">
      {/* GPT-style Floating Rounded Input Box */}
      <div
        className={cn(
          'relative rounded-3xl bg-white dark:bg-[#150D33] border transition-all duration-200',
          'border-slate-200/90 dark:border-white/10 shadow-lg dark:shadow-2xl shadow-slate-200/40 dark:shadow-purple-950/60',
          'focus-within:border-purple-500/80 dark:focus-within:border-purple-400 focus-within:ring-3 focus-within:ring-purple-500/10',
          'p-3 sm:p-3.5 flex flex-col justify-between'
        )}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className="w-full resize-none text-sm sm:text-[15px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent focus:outline-none leading-relaxed px-1 py-0.5 no-scrollbar overflow-y-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          aria-label="Message Legal Assistant"
        />

        {/* Bottom Tools & Circular Send Button */}
        <div className="flex items-center justify-between pt-2">
          {/* Subtle Left Tag */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200/60 dark:border-purple-500/20">
              <Scale className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span>Pakistan Law</span>
            </span>
          </div>

          {/* Circular Upward Arrow Send Button (GPT Style) */}
          <motion.button
            whileHover={hasText && !isLoading ? { scale: 1.06 } : {}}
            whileTap={hasText && !isLoading ? { scale: 0.94 } : {}}
            type="button"
            onClick={() => handleSubmit()}
            disabled={!hasText || isLoading}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0',
              hasText && !isLoading
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/30 cursor-pointer'
                : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-spin text-purple-300" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.4]" />
            )}
          </motion.button>
        </div>
      </div>

      {/* GPT-style Minimal Disclaimer */}
      <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 font-normal">
        LegalAI is an AI assistant and can make mistakes. Verify important legal matters with licensed legal professionals.
      </p>
    </div>
  );
}
