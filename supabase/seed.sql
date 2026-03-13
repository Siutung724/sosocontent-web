-- ============================================================
-- Seed: SME Workflow #1 — 每週社交媒體內容助手
-- Run AFTER migration 001_workflow_tables.sql
-- ============================================================

-- 1. Insert the system-level workflow (workspace_id = NULL means global/shared)
INSERT INTO workflows (id, workspace_id, key, name, description, is_active)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  NULL,
  'weekly_social',
  '每週社交媒體內容助手',
  '根據品牌資料及本週重點，一次過生成 7 條社交媒體貼文，每條包含主題、內文、圖片概念及 Hashtag。',
  true
)
ON CONFLICT (workspace_id, key) DO NOTHING;


-- 2. Insert the prompt template for weekly_social
INSERT INTO prompt_templates (id, workflow_id, name, system_prompt, template_body, model)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  '每週 7 條貼文生成',

  -- system_prompt ─────────────────────────────────────────────────────────────
  $SYSTEM$你是一位熟悉香港和台灣中小企業市場的資深社交媒體內容策劃，精通粵語和繁體中文。
用字要自然、本地化、符合社群平台語氣，絕對不要機器感或硬銷味。
你的目標是幫老闆在最短時間內準備一星期的社交媒體貼文，使內容有吸引力，同時帶出品牌價值而不過分推銷。

【輸出格式規定】
必須輸出純 JSON，格式如下（不得有任何額外文字或 Markdown code block）：
{
  "weekly_plan": [
    {
      "day": 1,
      "theme": "貼文主題／角度（短句）",
      "content": "完整貼文內文",
      "visual_concept": "建議的圖片或短影片概念（簡要說明）",
      "hashtags": ["#標籤1", "#標籤2"]
    }
  ]
}
weekly_plan 陣列必須剛好包含 7 個物件（day 1 至 day 7），hashtags 每條 3–8 個。$SYSTEM$,

  -- template_body (user prompt with {{PLACEHOLDER}} vars) ─────────────────────
  $TEMPLATE$根據以下資訊，幫我設計一星期的社交媒體內容：

行業／店舖類型：{{BUSINESS_TYPE}}
目標平台：{{PLATFORMS}}
本週推廣重點：{{WEEKLY_FOCUS}}
目標受眾：{{TARGET_AUDIENCE}}
品牌描述：{{BRAND_DESCRIPTION}}
語氣風格：{{TONE}}
語言風格：{{LANGUAGE_STYLE}}

請產出 7 條貼文建議，每一條都要包含：
1）貼文主題／角度（短句，填入 theme）
2）完整貼文內文（適合指定平台，用 {{LANGUAGE_STYLE}}，填入 content）
3）建議的圖片或短影片概念（簡要說明，填入 visual_concept）
4）Hashtag 建議 3–8 個（填入 hashtags 陣列）

請嚴格按照系統指定的 JSON 格式輸出，方便我 copy 使用。$TEMPLATE$,

  'openai/gpt-4o-mini'
)
ON CONFLICT DO NOTHING;


-- 3. Insert prompt variables (defines the input form fields)
INSERT INTO prompt_variables (template_id, name, label, type, required, options, default_value, sort_order)
VALUES

  ('b1000000-0000-0000-0000-000000000001',
   'BUSINESS_TYPE', '行業／店舖類型', 'text', true, NULL,
   NULL, 1),

  ('b1000000-0000-0000-0000-000000000001',
   'PLATFORMS', '目標平台', 'multi-select', true,
   '[
     {"value":"IG","label":"Instagram"},
     {"value":"Facebook","label":"Facebook"},
     {"value":"小紅書","label":"小紅書 (XHS)"},
     {"value":"Threads","label":"Threads"},
     {"value":"TikTok","label":"TikTok / 抖音"}
   ]'::jsonb,
   'IG、Facebook', 2),

  ('b1000000-0000-0000-0000-000000000001',
   'WEEKLY_FOCUS', '本週推廣重點', 'textarea', true, NULL,
   NULL, 3),

  ('b1000000-0000-0000-0000-000000000001',
   'TARGET_AUDIENCE', '目標受眾', 'text', false, NULL,
   '香港大眾', 4),

  ('b1000000-0000-0000-0000-000000000001',
   'BRAND_DESCRIPTION', '品牌描述', 'textarea', false, NULL,
   NULL, 5),

  ('b1000000-0000-0000-0000-000000000001',
   'TONE', '語氣風格', 'select', true,
   '[
     {"value":"輕鬆搞笑","label":"😄 輕鬆搞笑"},
     {"value":"專業可信","label":"💼 專業可信"},
     {"value":"溫暖貼地","label":"🤝 溫暖貼地"},
     {"value":"活力年輕","label":"⚡ 活力年輕"},
     {"value":"高端精緻","label":"✨ 高端精緻"}
   ]'::jsonb,
   '輕鬆搞笑', 6),

  ('b1000000-0000-0000-0000-000000000001',
   'LANGUAGE_STYLE', '語言風格', 'select', true,
   '[
     {"value":"香港粵語口語＋繁體中文","label":"🇭🇰 香港粵語口語＋繁體中文"},
     {"value":"台灣用語＋繁體中文","label":"🇹🇼 台灣用語＋繁體中文"},
     {"value":"書面華語＋繁體中文","label":"📝 書面華語＋繁體中文"}
   ]'::jsonb,
   '香港粵語口語＋繁體中文', 7)

ON CONFLICT (template_id, name) DO NOTHING;
