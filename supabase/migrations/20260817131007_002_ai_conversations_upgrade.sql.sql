-- ================================================================
-- Migration 002: AI Conversations upgrade
-- Adds conversation grouping, titles, and UPDATE policy to ai_conversations
-- Puthumai Uzhavan v2.0
-- ================================================================

-- Add conversation grouping columns
ALTER TABLE public.ai_conversations
  ADD COLUMN IF NOT EXISTS conversation_id uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS title text DEFAULT 'New Conversation';

-- Index for efficient conversation grouping
CREATE INDEX IF NOT EXISTS ai_conversations_conv_user_created
  ON public.ai_conversations(user_id, conversation_id, created_at desc);

-- Add UPDATE policy so farmers can (e.g.) rename a conversation
CREATE POLICY "ai_conv_owner_update"
  ON public.ai_conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Helper view: list of distinct conversations per user with latest message preview
CREATE OR REPLACE VIEW public.ai_conversation_list AS
SELECT
  user_id,
  conversation_id,
  max(title) AS title,
  max(created_at) AS last_message_at,
  count(*) AS message_count
FROM public.ai_conversations
GROUP BY user_id, conversation_id;

ALTER VIEW public.ai_conversation_list OWNER TO postgres;

GRANT SELECT ON public.ai_conversation_list TO authenticated;
