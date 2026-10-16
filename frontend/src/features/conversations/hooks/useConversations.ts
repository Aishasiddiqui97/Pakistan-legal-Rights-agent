import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chat-service';
import { SendMessagePayload } from '@/types/chat';

export const CONVERSATIONS_QUERY_KEY = ['conversations'] as const;

export function useConversations() {
  const queryClient = useQueryClient();

  const conversationsQuery = useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: () => chatService.getConversations(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => chatService.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (payload: SendMessagePayload) => chatService.sendMessage(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['conversation', data.conversationId] });
    },
  });

  return {
    conversations: conversationsQuery.data || [],
    isLoading: conversationsQuery.isLoading,
    error: conversationsQuery.error,
    refetch: conversationsQuery.refetch,
    deleteConversation: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
  };
}

export function useConversationDetail(id?: string) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => (id ? chatService.getConversation(id) : null),
    enabled: !!id,
  });
}
