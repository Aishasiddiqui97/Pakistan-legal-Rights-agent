import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Trash2,
  Search,
} from 'lucide-react';
import { ConversationSummary } from '@/types/chat';
import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/feedback/EmptyState';
import { HistoryItemSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export interface ConversationListProps {
  conversations: ConversationSummary[];
  isLoading: boolean;
  activeId?: string;
  onDelete: (id: string) => Promise<void>;
  onSelect?: (id: string) => void;
  isSidebar?: boolean;
}

export function ConversationList({
  conversations,
  isLoading,
  activeId,
  onDelete,
  onSelect,
  isSidebar = false,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ConversationSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const filtered = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessagePreview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTarget.id);
      setDeleteTarget(null);
      if (activeId === deleteTarget.id) {
        navigate('/assistant');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-2">
        <HistoryItemSkeleton />
        <HistoryItemSkeleton />
        <HistoryItemSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isSidebar ? 'Filter inquiries...' : 'Search past legal inquiries by keyword...'}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#120B2E] border border-slate-200/90 dark:border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs no-scrollbar overflow-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-6 h-6 text-slate-400" />}
          title={searchTerm ? 'No matching inquiries' : 'No saved consultations'}
          description={
            searchTerm
              ? 'Try searching with a different term such as "tenancy", "notice", or "rent".'
              : 'Consultations you initiate with the legal assistant will appear here.'
          }
          actionLabel="Start Legal Inquiry"
          onAction={() => navigate('/assistant')}
        />
      ) : (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="space-y-2.5"
        >
          {filtered.map((item) => {
            const isActive = activeId === item.id;
            return (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
                whileHover={{ y: -3, scale: 1.008 }}
                className={cn(
                  'group relative rounded-xl border p-4 transition-all flex items-start justify-between gap-3 text-left',
                  isActive
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 shadow-xs border-l-4 border-l-purple-600'
                    : 'border-slate-200/90 dark:border-purple-500/20 bg-white dark:bg-[#120B2E] hover:border-purple-400 dark:hover:border-purple-400 hover:shadow-md hover:shadow-purple-600/5'
                )}
              >
                <Link
                  to={`/assistant/${item.id}`}
                  onClick={() => onSelect && onSelect(item.id)}
                  className="flex-1 min-w-0 focus:outline-none space-y-1.5"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-200/60 dark:border-purple-500/20">
                      {item.topic}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">• {formatRelativeTime(item.updatedAt)}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate font-['Outfit']">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                    {item.lastMessagePreview}
                  </p>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteTarget(item);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                    title="Delete Conversation"
                    aria-label={`Delete conversation: ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Saved Consultation?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently delete{' '}
            <strong className="text-slate-900 dark:text-white font-semibold">"{deleteTarget?.title}"</strong>? This
            will remove the consultation history and statutory citations.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={confirmDelete}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
