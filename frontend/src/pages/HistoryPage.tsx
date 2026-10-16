import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderKanban } from 'lucide-react';
import { ConversationList } from '@/features/conversations/components/ConversationList';
import { useConversations } from '@/features/conversations/hooks/useConversations';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export function HistoryPage() {
  const { conversations, isLoading, deleteConversation } = useConversations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-left relative z-10"
    >
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90 dark:border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-500/20 shadow-2xs">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
              Saved Consultations & Inquiries
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pl-11">
            Review past consultations, referenced Pakistan statutory enactments, and procedural recommendations.
          </p>
        </div>

        <Link to="/assistant">
          <Button variant="purple" size="md" leftIcon={<Plus className="w-4 h-4" />} className="shadow-sm shadow-purple-600/20 hover:scale-[1.02] active:scale-[0.98] transition-transform">
            New Legal Inquiry
          </Button>
        </Link>
      </div>

      {/* Main List */}
      <ConversationList
        conversations={conversations}
        isLoading={isLoading}
        onDelete={deleteConversation}
      />
    </motion.div>
  );
}
