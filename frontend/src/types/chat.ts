import { LegalCitation, EvidenceSnippet, LegalJurisdiction, LegalTopic, EvidenceConfidence } from './evidence';

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  jurisdiction?: LegalJurisdiction;
  topic?: LegalTopic;
  confidenceLevel?: EvidenceConfidence;
  citations?: LegalCitation[];
  evidenceSnippets?: EvidenceSnippet[];
  suggestedQuestions?: string[];
  isStreaming?: boolean;
}

export interface ConversationSummary {
  id: string;
  title: string;
  lastMessagePreview: string;
  jurisdiction: LegalJurisdiction;
  topic: LegalTopic;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail extends ConversationSummary {
  messages: ChatMessage[];
}

export interface SendMessagePayload {
  conversationId?: string; // If omitted, backend starts a new conversation
  content: string;
  jurisdiction: LegalJurisdiction;
  topic?: LegalTopic;
}

export interface SendMessageResponse {
  conversationId: string;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}
