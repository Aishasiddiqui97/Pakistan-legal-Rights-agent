import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, AlertCircle } from 'lucide-react';
import { ChatMessage } from '@/types/chat';
import { LegalJurisdiction, LegalTopic } from '@/types/evidence';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatComposer } from './ChatComposer';
import { Button } from '@/components/ui/Button';

export interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string, jurisdiction: LegalJurisdiction, topic?: LegalTopic) => void;
  onNewConversation?: () => void;
  error?: string | null;
  onRetry?: () => void;
}

export function ChatContainer({
  messages,
  isLoading,
  onSendMessage,
  onNewConversation: _onNewConversation,
  error,
  onRetry,
}: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full w-full relative z-10 min-h-0">
      {/* Full-width scrollable container so the scrollbar sits in the far right corner */}
      <div className="flex-1 w-full overflow-y-auto gpt-scrollbar">
        {messages.length === 0 ? (
          /* GPT-style Minimal Centered Welcome State without prompt cards */
          <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto px-4 text-center my-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-purple-600/25">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
                What legal question can I help with?
              </h2>
            </motion.div>
          </div>
        ) : (
          /* Message List centered in max-w-3xl */
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
            {messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                onSelectSuggestedQuestion={(q) => onSendMessage(q, message.jurisdiction || 'sindh')}
                onRetry={onRetry}
              />
            ))}

            {/* GPT-style Minimal Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3.5 max-w-3xl mr-auto text-left py-2"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/20">
                  <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 pt-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200 text-sm flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
                {onRetry && (
                  <Button variant="outline" size="sm" onClick={onRetry} className="text-xs">
                    Retry
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Floating Bottom Composer Bar centered in max-w-3xl */}
      <div className="w-full shrink-0 p-4 pt-2 bg-gradient-to-t from-[#F8FAFC] dark:from-[#0A051B] via-[#F8FAFC]/95 dark:via-[#0A051B]/95 to-transparent">
        <div className="max-w-3xl mx-auto w-full">
          <ChatComposer onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
