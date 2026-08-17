/**
 * conversationService.ts
 * ─────────────────────────────────────────────────────────────
 * Persists AI chat history in the `ai_conversations` table.
 * RLS ensures each farmer can only access their own conversations.
 * ─────────────────────────────────────────────────────────────
 */

import { supabase } from '@/lib/supabase';

export interface ConversationMessage {
  id: string;
  user_id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  message: string;
  context?: Record<string, unknown> | null;
  created_at: string;
}

export interface ConversationSummary {
  conversation_id: string;
  title: string;
  last_message_at: string;
  message_count: number;
}

function newId(): string {
  return (crypto as Crypto & { randomUUID?: () => string }).randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Save a single message (user or assistant) to a conversation */
export async function saveMessage(
  userId: string,
  conversationId: string,
  role: 'user' | 'assistant',
  message: string,
  context?: Record<string, unknown> | null,
): Promise<ConversationMessage | null> {
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: userId,
      conversation_id: conversationId,
      role,
      message,
      context: context ?? null,
    })
    .select('*')
    .single();

  if (error) {
    console.error('saveMessage error:', error.message);
    return null;
  }
  return data as ConversationMessage;
}

/** Load all messages for a specific conversation, oldest first */
export async function loadConversation(
  userId: string,
  conversationId: string,
): Promise<ConversationMessage[]> {
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('loadConversation error:', error.message);
    return [];
  }
  return (data ?? []) as ConversationMessage[];
}

/** List all conversations for a farmer, most recent first */
export async function listConversations(
  userId: string,
): Promise<ConversationSummary[]> {
  const { data, error } = await supabase
    .from('ai_conversation_list')
    .select('*')
    .eq('user_id', userId)
    .order('last_message_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('listConversations error:', error.message);
    return [];
  }
  return (data ?? []) as ConversationSummary[];
}

/** Rename a conversation (updates all rows in the group) */
export async function renameConversation(
  userId: string,
  conversationId: string,
  title: string,
): Promise<void> {
  const { error } = await supabase
    .from('ai_conversations')
    .update({ title })
    .eq('user_id', userId)
    .eq('conversation_id', conversationId);

  if (error) {
    console.error('renameConversation error:', error.message);
  }
}

/** Delete an entire conversation (all messages in the group) */
export async function deleteConversation(
  userId: string,
  conversationId: string,
): Promise<void> {
  const { error } = await supabase
    .from('ai_conversations')
    .delete()
    .eq('user_id', userId)
    .eq('conversation_id', conversationId);

  if (error) {
    console.error('deleteConversation error:', error.message);
  }
}

/** Generate a conversation title from the first user message */
export function generateTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim();
  if (trimmed.length <= 50) return trimmed;
  return trimmed.slice(0, 47) + '…';
}

/** Create a new conversation ID */
export function createConversationId(): string {
  return newId();
}
