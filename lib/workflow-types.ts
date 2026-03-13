/**
 * Workflow Engine — TypeScript Types
 * Mirrors the Supabase schema in migrations/001_workflow_tables.sql
 */

// ── Core entities ─────────────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface BrandProfile {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  target_audience: string | null;
  tone: string | null;
  language_style: string | null;
  banned_words: string[];
  created_at: string;
}

export interface Workflow {
  id: string;
  workspace_id: string | null;   // null = system/global workflow
  key: string;                   // e.g. 'weekly_social'
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface PromptTemplate {
  id: string;
  workflow_id: string;
  name: string;
  system_prompt: string;
  template_body: string;         // contains {{PLACEHOLDER}} variables
  model: string;
  created_at: string;
  updated_at: string;
}

export type VariableType = 'text' | 'textarea' | 'select' | 'multi-select';

export interface SelectOption {
  value: string;
  label: string;
}

export interface PromptVariable {
  id: string;
  template_id: string;
  name: string;                  // matches {{NAME}} in template_body
  label: string;                 // human-readable (Traditional Chinese)
  type: VariableType;
  required: boolean;
  options: SelectOption[] | null;  // for select / multi-select only
  default_value: string | null;
  sort_order: number;
}

export interface Execution {
  id: string;
  workspace_id: string | null;
  workflow_id: string | null;
  template_id: string | null;
  user_id: string | null;
  inputs: Record<string, string>;
  result: unknown;               // parsed JSON from AI
  model: string | null;
  tokens_used: number | null;
  created_at: string;
}

// ── API request / response shapes ────────────────────────────────────────────

export interface ExecuteWorkflowRequest {
  /** The workflow key (e.g. 'weekly_social') or templateId UUID */
  workflowKey?: string;
  templateId?: string;
  /** Optional: pre-fills TARGET_AUDIENCE, BRAND_DESCRIPTION, TONE, LANGUAGE_STYLE */
  brandProfileId?: string;
  /** Variable values — keys must match PromptVariable.name */
  inputs: Record<string, string>;
}

export interface ExecuteWorkflowResponse {
  executionId: string;
  workflowKey: string;
  result: unknown;               // parsed AI output (workflow-specific shape)
  model: string;
  tokensUsed: number | null;
  error?: string;
}

// ── weekly_social result shape ────────────────────────────────────────────────

export interface WeeklyPost {
  day: number;
  theme: string;
  content: string;
  visual_concept: string;
  hashtags: string[];
}

export interface WeeklySocialResult {
  weekly_plan: WeeklyPost[];
}
