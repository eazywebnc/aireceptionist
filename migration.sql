-- ============================================
-- AIReceptionist — Database Migration
-- Project: aireceptionist
-- Supabase: mgiamamqrvfcfqzlqtcs (SaaS Factory)
-- ============================================

-- ============================================
-- ar_settings: user settings/subscription
-- ============================================
CREATE TABLE IF NOT EXISTS ar_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  calls_limit INTEGER DEFAULT 50,
  businesses_limit INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================
-- ar_businesses: businesses managed by user
-- ============================================
CREATE TABLE IF NOT EXISTS ar_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT,
  greeting_message TEXT DEFAULT 'Thank you for calling. How can I help you today?',
  business_hours JSONB DEFAULT '{"mon":"09:00-17:00","tue":"09:00-17:00","wed":"09:00-17:00","thu":"09:00-17:00","fri":"09:00-17:00","sat":"closed","sun":"closed"}',
  ai_personality TEXT DEFAULT 'professional',
  transfer_number TEXT,
  voicemail_enabled BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'en',
  industry TEXT,
  custom_instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ar_calls: call log
-- ============================================
CREATE TABLE IF NOT EXISTS ar_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES ar_businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caller_number TEXT,
  caller_name TEXT,
  duration_seconds INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'missed', 'voicemail', 'transferred', 'in_progress')),
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  summary TEXT,
  action_items JSONB DEFAULT '[]',
  recording_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ar_transcripts: call transcriptions
-- ============================================
CREATE TABLE IF NOT EXISTS ar_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES ar_calls(id) ON DELETE CASCADE,
  speaker TEXT NOT NULL CHECK (speaker IN ('ai', 'caller')),
  content TEXT NOT NULL,
  timestamp_ms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE ar_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ar_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ar_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE ar_transcripts ENABLE ROW LEVEL SECURITY;

-- ar_settings
CREATE POLICY "Users can view own settings" ON ar_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON ar_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON ar_settings FOR UPDATE USING (auth.uid() = user_id);

-- ar_businesses
CREATE POLICY "Users can view own businesses" ON ar_businesses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own businesses" ON ar_businesses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own businesses" ON ar_businesses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own businesses" ON ar_businesses FOR DELETE USING (auth.uid() = user_id);

-- ar_calls
CREATE POLICY "Users can view own calls" ON ar_calls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own calls" ON ar_calls FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ar_transcripts (via call ownership)
CREATE POLICY "Users can view own transcripts" ON ar_transcripts FOR SELECT
  USING (EXISTS (SELECT 1 FROM ar_calls WHERE ar_calls.id = ar_transcripts.call_id AND ar_calls.user_id = auth.uid()));

-- ============================================
-- Updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_ar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ar_settings_updated_at
  BEFORE UPDATE ON ar_settings
  FOR EACH ROW EXECUTE FUNCTION update_ar_updated_at();

CREATE TRIGGER ar_businesses_updated_at
  BEFORE UPDATE ON ar_businesses
  FOR EACH ROW EXECUTE FUNCTION update_ar_updated_at();
