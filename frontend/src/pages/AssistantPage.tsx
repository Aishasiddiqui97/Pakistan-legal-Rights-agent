import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChatContainer } from '@/features/legal-assistant/components/ChatContainer';
import { useConversations, useConversationDetail } from '@/features/conversations/hooks/useConversations';
import { ChatMessage, SendMessagePayload } from '@/types/chat';
import { LegalJurisdiction, LegalTopic } from '@/types/evidence';

export function AssistantPage() {
  const { id: conversationId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');
  const navigate = useNavigate();

  const { sendMessage, isSending } = useConversations();
  const { data: currentDetail, isLoading: isDetailLoading } = useConversationDetail(conversationId);

  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = useCallback(
    async (
      content: string,
      jurisdiction: LegalJurisdiction,
      topic?: LegalTopic
    ) => {
      setError(null);

      const tempUserMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversationId: conversationId || 'new',
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        jurisdiction,
        topic,
      };

      setActiveMessages((prev) => [...prev, tempUserMsg]);

      try {
        const payload: SendMessagePayload = {
          conversationId,
          content,
          jurisdiction,
          topic,
        };

        const response = await sendMessage(payload);

        if (!conversationId && response.conversationId) {
          navigate(`/assistant/${response.conversationId}`, { replace: true });
        }

        setActiveMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          response.userMessage,
          response.assistantMessage,
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve legal guidance. Please try again.');
      }
    },
    [conversationId, navigate, sendMessage]
  );

  // Sync messages from conversation detail
  useEffect(() => {
    if (currentDetail?.messages) {
      setActiveMessages(currentDetail.messages);
    } else if (!conversationId) {
      setActiveMessages([]);
    }
  }, [currentDetail, conversationId]);

  // Handle starter query from landing page
  useEffect(() => {
    if (initialQuery && activeMessages.length === 0 && !conversationId) {
      handleSendMessage(initialQuery, 'sindh', 'tenancy');
    }
  }, [initialQuery, activeMessages.length, conversationId, handleSendMessage]);

  const handleNewConversation = () => {
    setActiveMessages([]);
    navigate('/assistant');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col h-full min-h-0 relative z-10"
    >
      <ChatContainer
        messages={activeMessages}
        isLoading={isSending || isDetailLoading}
        onSendMessage={handleSendMessage}
        onNewConversation={handleNewConversation}
        error={error}
        onRetry={() => {
          if (activeMessages.length > 0) {
            const lastUser = [...activeMessages].reverse().find((m) => m.role === 'user');
            if (lastUser) {
              handleSendMessage(lastUser.content, lastUser.jurisdiction || 'sindh', lastUser.topic);
            }
          }
        }}
      />
    </motion.div>
  );
}
