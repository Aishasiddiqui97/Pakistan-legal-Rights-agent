import { env } from '@/config/env';
import { apiClient } from './api-client';
import { API_ENDPOINTS } from './endpoints';
import {
  ChatMessage,
  ConversationDetail,
  ConversationSummary,
  SendMessagePayload,
  SendMessageResponse,
} from '@/types/chat';
import {
  INITIAL_MOCK_CONVERSATIONS,
  SINDH_LEGAL_KNOWLEDGE_BASE,
  SINDH_STATUTORY_CITATIONS,
} from './mock-data/sindh-legal-data';

export interface IChatService {
  getConversations(): Promise<ConversationSummary[]>;
  getConversation(id: string): Promise<ConversationDetail>;
  createConversation(initialMessage: SendMessagePayload): Promise<SendMessageResponse>;
  sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse>;
  deleteConversation(id: string): Promise<void>;
}

// In-memory / session store for mock conversations
const MOCK_CONVS_KEY = 'plr_mock_conversations';
const MOCK_MESSAGES_KEY = 'plr_mock_messages';

function getStoredSummaries(): ConversationSummary[] {
  try {
    const raw = sessionStorage.getItem(MOCK_CONVS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_MOCK_CONVERSATIONS;
  } catch {
    return INITIAL_MOCK_CONVERSATIONS;
  }
}

function saveStoredSummaries(list: ConversationSummary[]) {
  try {
    sessionStorage.setItem(MOCK_CONVS_KEY, JSON.stringify(list));
  } catch {}
}

function getStoredMessages(): Record<string, ChatMessage[]> {
  try {
    const raw = sessionStorage.getItem(MOCK_MESSAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  // Initialize with realistic mock messages
  const initialMessages: Record<string, ChatMessage[]> = {
    'conv-101': [
      {
        id: 'msg-1',
        conversationId: 'conv-101',
        role: 'user',
        content:
          'My landlord in Clifton Karachi disconnected our water connection and is threatening to throw our belongings out if we do not vacate in 3 days. What are my legal rights?',
        timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        jurisdiction: 'sindh',
        topic: 'tenancy',
      },
      {
        id: 'msg-2',
        conversationId: 'conv-101',
        role: 'assistant',
        content: `### Legal Assessment under Pakistan Law\n\nYour landlord's actions are **strictly unlawful** under tenancy laws and the **Sindh Rented Premises Ordinance, 1979 (SRPO 1979)**.\n\n#### 1. Unlawful Disconnection of Essential Services (Section 11)\nUnder Section 11 of SRPO 1979, no landlord can without just cause discontinue or withhold any of the amenities enjoyed by the tenant (including water, electricity, gas, or sewerage). Doing so is an offense punishable with fine and potential imprisonment.\n\n#### 2. Prohibition on Forced Self-Help Eviction (Section 15)\nA landlord cannot take the law into their own hands. A tenant can **only be evicted** through a formal ejectment application instituted before the competent **Rent Controller** of your district (e.g. Rent Controller South Karachi). Even if default or lease expiry occurred, physical eviction cannot be executed without a judicial decree signed by the Rent Controller.\n\n#### 3. Recommended Practical Steps:\n1. **Immediate Section 11 Application**: File an emergency application before the local Rent Controller for immediate restoration of your water amenity.\n2. **Police Intervention**: If physical violence or burglary is threatened, inform the territorial police station and keep copies of your lease agreement and rent receipts.\n3. **Deposit Rent in Court**: If the landlord refuses to accept rent in order to manufacture a default, deposit rent in the office of the Rent Controller under Section 10(3).`,
        timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 10000).toISOString(),
        jurisdiction: 'sindh',
        topic: 'tenancy',
        confidenceLevel: 'verified-statute',
        citations: [
          SINDH_STATUTORY_CITATIONS.sindh_rented_premises_s15,
          SINDH_STATUTORY_CITATIONS.sindh_rented_premises_s8,
        ],
        evidenceSnippets: [
          {
            id: 'snip-101',
            sourceDocument: 'The Sindh Rented Premises Ordinance, 1979',
            sectionReference: 'Section 11 & Section 15',
            snippetText:
              'No landlord shall discontinue or withhold any amenity enjoyed by the tenant without just cause. Eviction applications must be decided exclusively by the Controller.',
            relevanceConfidence: 0.98,
          },
        ],
        suggestedQuestions: [
          'How do I file a Section 11 application for water restoration in Karachi?',
          'What documents do I need to present to the Rent Controller?',
          'Can the landlord claim personal bona fide need to evict me?',
        ],
      },
    ],
  };

  return initialMessages;
}

function saveStoredMessages(map: Record<string, ChatMessage[]>) {
  try {
    sessionStorage.setItem(MOCK_MESSAGES_KEY, JSON.stringify(map));
  } catch {}
}

class MockChatService implements IChatService {
  async getConversations(): Promise<ConversationSummary[]> {
    await new Promise((r) => setTimeout(r, 200));
    return getStoredSummaries();
  }

  async getConversation(id: string): Promise<ConversationDetail> {
    await new Promise((r) => setTimeout(r, 200));
    const summaries = getStoredSummaries();
    const summary = summaries.find((s) => s.id === id);
    if (!summary) throw new Error('Conversation not found');

    const messages = getStoredMessages();
    return {
      ...summary,
      messages: messages[id] || [],
    };
  }

  async createConversation(payload: SendMessagePayload): Promise<SendMessageResponse> {
    return this.sendMessage(payload);
  }

  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    await new Promise((r) => setTimeout(r, 600)); // Natural response delay

    const conversationId = payload.conversationId || `conv-${Date.now()}`;
    const userMsgId = `msg-${Date.now()}-u`;
    const asstMsgId = `msg-${Date.now()}-a`;

    const userMessage: ChatMessage = {
      id: userMsgId,
      conversationId,
      role: 'user',
      content: payload.content,
      timestamp: new Date().toISOString(),
      jurisdiction: payload.jurisdiction,
      topic: payload.topic,
    };

    // Find best match in knowledge base
    const contentLower = payload.content.toLowerCase();
    const matched = SINDH_LEGAL_KNOWLEDGE_BASE.find((k) =>
      k.keywords.some((kw) => contentLower.includes(kw))
    );

    let assistantMessage: ChatMessage;

    if (matched) {
      assistantMessage = {
        id: asstMsgId,
        conversationId,
        role: 'assistant',
        content: `### Legal Evaluation (${matched.topic.toUpperCase()} — Pakistan Jurisdiction)\n\n${matched.summary}\n\n${matched.analysis}\n\n#### Recommended Practical Next Steps:\n${matched.nextSteps
          .map((s, idx) => `${idx + 1}. ${s}`)
          .join('\n')}`,
        timestamp: new Date(Date.now() + 1000).toISOString(),
        jurisdiction: payload.jurisdiction,
        topic: matched.topic,
        confidenceLevel: 'verified-statute',
        citations: matched.citations,
        evidenceSnippets: matched.evidenceSnippets,
        suggestedQuestions: matched.suggestedQuestions,
      };
    } else {
      assistantMessage = {
        id: asstMsgId,
        conversationId,
        role: 'assistant',
        content: `### Legal Context Notice — Pakistan & Federal Laws\n\nRegarding your question: **"${payload.content}"**\n\nUnder Pakistani jurisprudence and the Constitution of Pakistan (1973), citizens are entitled to due process and equal protection of the law (Articles 4, 10-A, and 25).\n\nTo provide precise statutory references under Pakistan law, could you specify additional details such as:\n1. The specific district or province (e.g. Sindh, Punjab, Islamabad, KPK, Balochistan)\n2. Whether written contracts, formal notices, or official documentation exist\n3. Whether legal proceedings are already pending before any court or tribunal`,
        timestamp: new Date(Date.now() + 1000).toISOString(),
        jurisdiction: payload.jurisdiction,
        topic: payload.topic || 'general',
        confidenceLevel: 'general-guidance',
        citations: [SINDH_STATUTORY_CITATIONS.constitution_art4_10a],
        evidenceSnippets: [
          {
            id: 'snip-gen-1',
            sourceDocument: 'The Constitution of the Islamic Republic of Pakistan, 1973',
            sectionReference: 'Article 4 & 10-A',
            snippetText:
              'To enjoy the protection of law and to be treated in accordance with law is the inalienable right of every citizen.',
            relevanceConfidence: 0.85,
          },
        ],
        suggestedQuestions: [
          'What are tenant rights against eviction in Pakistan?',
          'What are employee notice period rights under Pakistan Labour law?',
          'How to file a consumer complaint against defective goods?',
        ],
      };
    }

    // Persist messages
    const allMessages = getStoredMessages();
    const existing = allMessages[conversationId] || [];
    allMessages[conversationId] = [...existing, userMessage, assistantMessage];
    saveStoredMessages(allMessages);

    // Persist or update summary
    const summaries = getStoredSummaries();
    const title =
      payload.content.length > 55
        ? `${payload.content.slice(0, 52)}...`
        : payload.content;

    const existingSummaryIndex = summaries.findIndex((s) => s.id === conversationId);
    if (existingSummaryIndex >= 0) {
      summaries[existingSummaryIndex] = {
        ...summaries[existingSummaryIndex],
        lastMessagePreview: assistantMessage.content.slice(0, 90) + '...',
        updatedAt: assistantMessage.timestamp,
        messageCount: summaries[existingSummaryIndex].messageCount + 2,
      };
    } else {
      summaries.unshift({
        id: conversationId,
        title,
        lastMessagePreview: assistantMessage.content.slice(0, 90) + '...',
        jurisdiction: payload.jurisdiction,
        topic: payload.topic || 'general',
        messageCount: 2,
        createdAt: userMessage.timestamp,
        updatedAt: assistantMessage.timestamp,
      });
    }
    saveStoredSummaries(summaries);

    return {
      conversationId,
      userMessage,
      assistantMessage,
    };
  }

  async deleteConversation(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const summaries = getStoredSummaries().filter((s) => s.id !== id);
    saveStoredSummaries(summaries);

    const messages = getStoredMessages();
    delete messages[id];
    saveStoredMessages(messages);
  }
}

class RealChatService implements IChatService {
  async getConversations(): Promise<ConversationSummary[]> {
    return apiClient<ConversationSummary[]>(API_ENDPOINTS.CONVERSATIONS.LIST, {
      method: 'GET',
    });
  }

  async getConversation(id: string): Promise<ConversationDetail> {
    return apiClient<ConversationDetail>(API_ENDPOINTS.CONVERSATIONS.DETAIL(id), {
      method: 'GET',
    });
  }

  async createConversation(payload: SendMessagePayload): Promise<SendMessageResponse> {
    return apiClient<SendMessageResponse>(API_ENDPOINTS.CONVERSATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    const endpoint = payload.conversationId
      ? API_ENDPOINTS.CONVERSATIONS.MESSAGES(payload.conversationId)
      : API_ENDPOINTS.CONVERSATIONS.CREATE;

    return apiClient<SendMessageResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async deleteConversation(id: string): Promise<void> {
    return apiClient<void>(API_ENDPOINTS.CONVERSATIONS.DELETE(id), {
      method: 'DELETE',
    });
  }
}

export const chatService: IChatService = env.isMockEnabled
  ? new MockChatService()
  : new RealChatService();
