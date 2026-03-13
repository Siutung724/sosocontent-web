-- ============================================================
-- Migration 001: Workflow Engine Tables
-- brandwriter01.ai / sosocontent.ai
-- ============================================================

-- Workspaces (multi-tenant support; one user can own multiple workspaces)
CREATE TABLE IF NOT EXISTS workspaces (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Brand Profiles (tied to a workspace, used to pre-fill prompts)
CREATE TABLE IF NOT EXISTS brand_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  description      TEXT,
  target_audience  TEXT,
  tone             TEXT,                        -- e.g. 輕鬆搞笑 / 專業可信
  language_style   TEXT,                        -- e.g. 香港粵語口語＋繁體中文
  banned_words     TEXT[] NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workflows (each represents a reusable content-generation process)
CREATE TABLE IF NOT EXISTS workflows (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,  -- NULL = global/system workflow
  key          TEXT NOT NULL,                  -- e.g. weekly_social, promo_campaign
  name         TEXT NOT NULL,
  description  TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (workspace_id, key)
);

-- Prompt Templates (the actual prompts, one per workflow for now)
CREATE TABLE IF NOT EXISTS prompt_templates (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id    UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  system_prompt  TEXT NOT NULL,                -- Fixed system instruction
  template_body  TEXT NOT NULL,                -- User prompt with {{PLACEHOLDER}} vars
  model          TEXT NOT NULL DEFAULT 'openai/gpt-4o-mini',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prompt Variables (schema for rendering input forms and validating inputs)
CREATE TABLE IF NOT EXISTS prompt_variables (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id    UUID NOT NULL REFERENCES prompt_templates(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,                -- matches {{NAME}} in template_body
  label          TEXT NOT NULL,               -- human-readable label (Traditional Chinese)
  type           TEXT NOT NULL CHECK (type IN ('text', 'textarea', 'select', 'multi-select')),
  required       BOOLEAN NOT NULL DEFAULT true,
  options        JSONB,                        -- for select / multi-select: [{"value":"...", "label":"..."}]
  default_value  TEXT,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  UNIQUE (template_id, name)
);

-- Executions (audit log of every AI generation run)
CREATE TABLE IF NOT EXISTS executions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  workflow_id  UUID REFERENCES workflows(id) ON DELETE SET NULL,
  template_id  UUID REFERENCES prompt_templates(id) ON DELETE SET NULL,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  inputs       JSONB NOT NULL DEFAULT '{}',   -- the filled-in variable values
  result       JSONB,                          -- parsed AI output
  model        TEXT,
  tokens_used  INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_brand_profiles_workspace ON brand_profiles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workflows_key ON workflows(key);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_workflow ON prompt_templates(workflow_id);
CREATE INDEX IF NOT EXISTS idx_prompt_variables_template ON prompt_variables(template_id);
CREATE INDEX IF NOT EXISTS idx_executions_workspace ON executions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_executions_user ON executions(user_id);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE workspaces       ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions       ENABLE ROW LEVEL SECURITY;

-- Users can only access their own workspaces
CREATE POLICY "workspace_owner_access" ON workspaces
  FOR ALL USING (owner_id = auth.uid());

-- Users can access brand profiles in their workspaces
CREATE POLICY "brand_profile_workspace_access" ON brand_profiles
  FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

-- Users can access their own executions
CREATE POLICY "execution_user_access" ON executions
  FOR ALL USING (user_id = auth.uid());

-- Workflows and templates are public-readable (system-level) or workspace-scoped
CREATE POLICY "workflow_read" ON workflows
  FOR SELECT USING (workspace_id IS NULL OR
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));

CREATE POLICY "template_read" ON prompt_templates
  FOR SELECT USING (true);  -- readable by all authenticated users

CREATE POLICY "variable_read" ON prompt_variables
  FOR SELECT USING (true);  -- readable by all authenticated users

ALTER TABLE workflows        ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_variables ENABLE ROW LEVEL SECURITY;
