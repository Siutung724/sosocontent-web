-- ============================================================
-- Migration 002: Voice / TTS 預留 Schema
-- 現階段：只加欄位，不實作任何 TTS 功能
-- ============================================================

-- 1. voice_profiles 表
CREATE TABLE IF NOT EXISTS voice_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT '我的聲線',
  tts_provider    TEXT,               -- 'elevenlabs' | 'openai' | 'google' | null
  voice_id        TEXT,               -- provider 內部 voice reference
  language        TEXT NOT NULL DEFAULT 'zh-HK',
  status          TEXT NOT NULL DEFAULT 'not_created',
                                      -- 'not_created' | 'training' | 'ready' | 'error'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own voice profiles"
  ON voice_profiles FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 2. 為 executions 表加 voice 預留欄位
ALTER TABLE executions
  ADD COLUMN IF NOT EXISTS audio_url        TEXT,
  ADD COLUMN IF NOT EXISTS voice_profile_id UUID REFERENCES voice_profiles(id) ON DELETE SET NULL;
