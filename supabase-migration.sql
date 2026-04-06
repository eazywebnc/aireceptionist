-- ============================================
-- AIReceptionist — Extended Migration
-- Adds fields to ar_settings + ar_messages table
-- Run AFTER the base migration.sql
-- ============================================

-- ============================================
-- Extend ar_settings with business config fields
-- ============================================
ALTER TABLE ar_settings ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE ar_settings ADD COLUMN IF NOT EXISTS business_phone TEXT;
ALTER TABLE ar_settings ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{"mon":"09:00-17:00","tue":"09:00-17:00","wed":"09:00-17:00","thu":"09:00-17:00","fri":"09:00-17:00","sat":"closed","sun":"closed"}';
ALTER TABLE ar_settings ADD COLUMN IF NOT EXISTS greeting_message TEXT DEFAULT 'Thank you for calling. How can I help you today?';
ALTER TABLE ar_settings ADD COLUMN IF NOT EXISTS faq_entries JSONB DEFAULT '[]';
ALTER TABLE ar_settings ADD COLUMN IF NOT EXISTS voice_style TEXT DEFAULT 'professional' CHECK (voice_style IN ('professional', 'friendly', 'casual'));

-- ============================================
-- Extend ar_calls with flagged + notes
-- ============================================
ALTER TABLE ar_calls ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT false;
ALTER TABLE ar_calls ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================
-- ar_messages: messages left by callers
-- ============================================
CREATE TABLE IF NOT EXISTS ar_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  call_id UUID REFERENCES ar_calls(id) ON DELETE SET NULL,
  caller_phone TEXT NOT NULL,
  message_text TEXT NOT NULL,
  handled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_ar_calls_user_created ON ar_calls(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ar_calls_user_status ON ar_calls(user_id, status);
CREATE INDEX IF NOT EXISTS idx_ar_calls_flagged ON ar_calls(user_id, flagged) WHERE flagged = true;
CREATE INDEX IF NOT EXISTS idx_ar_transcripts_call ON ar_transcripts(call_id, timestamp_ms);
CREATE INDEX IF NOT EXISTS idx_ar_messages_user ON ar_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ar_messages_handled ON ar_messages(user_id, handled) WHERE handled = false;

-- ============================================
-- RLS for ar_messages
-- ============================================
ALTER TABLE ar_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON ar_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON ar_messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can insert (webhooks)
CREATE POLICY "Service role can insert messages" ON ar_messages
  FOR INSERT WITH CHECK (true);

-- Allow service role inserts on ar_calls too (for webhooks)
CREATE POLICY "Service role can insert calls" ON ar_calls
  FOR INSERT WITH CHECK (true);

-- Allow service role inserts on ar_transcripts (for webhooks)
CREATE POLICY "Service role can insert transcripts" ON ar_transcripts
  FOR INSERT WITH CHECK (true);

-- Allow users to update own calls (flagged, notes)
CREATE POLICY "Users can update own calls" ON ar_calls
  FOR UPDATE USING (auth.uid() = user_id);
