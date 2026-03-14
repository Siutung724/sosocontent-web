-- ============================================================
-- Migration 008: Batch 2 — Add 3 new workflows + deactivate brand_story
-- 1. kol_script     → KOL / 紅人合作腳本生成器 (PROMPT 3)
-- 2. flash_sale     → 限時優惠爆款帖生成器     (PROMPT 7)
-- 3. competitor_ad  → 競爭對手廣告拆解器       (PROMPT 5)
-- 4. brand_story    → set is_active = false
-- Run in Supabase SQL Editor
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 0. Deactivate brand_story
-- ─────────────────────────────────────────────────────────────

UPDATE workflows SET is_active = false WHERE key = 'brand_story';


-- ─────────────────────────────────────────────────────────────
-- 1. KOL / 紅人合作腳本生成器 (kol_script)
-- ─────────────────────────────────────────────────────────────

INSERT INTO workflows (id, workspace_id, key, name, description, is_active)
VALUES (
  'a6000000-0000-0000-0000-000000000006',
  NULL,
  'kol_script',
  'KOL 合作腳本生成器',
  '為 KOL 合作帖子生成完整腳本，以第一人稱真實分享感切入，自然植入品牌優惠碼，附互動問題及 Hashtag 建議，直接交給 KOL 使用。',
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO prompt_templates (id, workflow_id, name, system_prompt, template_body, model)
VALUES (
  'b6000000-0000-0000-0000-000000000006',
  'a6000000-0000-0000-0000-000000000006',
  'KOL 合作腳本生成',

  $SYSTEM$你是一位專為香港中小企服務的品牌內容策略師，精通 KOL 合作文案及廣東話口語表達。

你的核心原則：
1. 真實感優先：腳本要讓人感覺是 KOL 的親身體驗，而非廣告稿
2. 自然植入：品牌推廣信息融入個人故事，不突兀
3. 激發互動：結尾問題要直接觸動 KOL 粉絲留言分享

語言規範（香港市場專用）：
- 主體：廣東話口語（如「我真係」「超正」「唔信你試吓」）
- KOL 第一人稱敘述，有個人感情
- 適度英文：品牌名、產品名保留英文
- 禁用：硬銷語氣、台灣用語、過分完美的廣告腔

【輸出格式規定】
必須輸出純 JSON，格式如下（不得有任何額外文字或 Markdown code block）：
{
  "kol_script": {
    "opening": "開場白（KOL 第一人稱，分享親身使用場景引入，80字內，自然真實）",
    "experience": "使用體驗描述（具體細節，感官描述優先：看到/感受到/聞到什麼，100字內）",
    "before_after": "前後對比或效果說明（用具體變化說明成效，50字內）",
    "brand_recommendation": "推薦理由（為何選這個品牌而非競品，真實感，50字內）",
    "offer_callout": "優惠碼植入（自然融入，強調截止日期製造緊迫感，30字內）",
    "engagement_question": "互動問題（結尾問讀者一個問題，提升留言率，20字內）",
    "full_script": "完整腳本全文（將以上元素整合，流暢自然，250-350字）",
    "hashtags": ["#KOL標籤", "#品牌標籤", "#行業標籤1", "#行業標籤2", "#香港標籤"]
  }
}
hashtags 需要 10-12 個（KOL 個人標 + 品牌標 + 行業標 + 香港本地標）。$SYSTEM$,

  $TEMPLATE$請為以下 KOL 合作生成完整腳本：

品牌名稱：{{BRAND_NAME}}
行業：{{INDUSTRY}}
推廣產品／服務：{{PRODUCT_SERVICE}}
KOL 暱稱／風格：{{KOL_STYLE}}
KOL 專屬優惠碼：{{PROMO_CODE}}
優惠內容：{{OFFER_DETAILS}}
優惠截止日期：{{DEADLINE}}
內容格式：{{CONTENT_FORMAT}}
語言風格：{{LANGUAGE_STYLE}}

請輸出完整 KOL 合作腳本，包括：
① opening：以 KOL 第一人稱分享親身使用場景
② experience：具體使用體驗（感官細節優先）
③ before_after：前後對比或效果說明
④ brand_recommendation：真實推薦理由
⑤ offer_callout：自然植入優惠碼（含截止日期）
⑥ engagement_question：結尾互動問題
⑦ full_script：整合後的完整腳本全文
⑧ hashtags：10-12個

請嚴格按照系統指定的 JSON 格式輸出。$TEMPLATE$,

  'openai/gpt-4o-mini'
)
ON CONFLICT DO NOTHING;

INSERT INTO prompt_variables (template_id, name, label, type, required, options, default_value, sort_order)
VALUES
  ('b6000000-0000-0000-0000-000000000006',
   'BRAND_NAME', '品牌名稱', 'text', true, NULL, NULL, 1),

  ('b6000000-0000-0000-0000-000000000006',
   'INDUSTRY', '行業', 'text', true, NULL, NULL, 2),

  ('b6000000-0000-0000-0000-000000000006',
   'PRODUCT_SERVICE', '推廣產品／服務', 'textarea', true, NULL,
   '描述 KOL 要推廣的具體產品或服務，以及主要賣點', 3),

  ('b6000000-0000-0000-0000-000000000006',
   'KOL_STYLE', 'KOL 暱稱／風格定位', 'select', true,
   '[
     {"value":"生活感 / 真實分享","label":"🏠 生活感 / 真實分享"},
     {"value":"專業感 / 行業達人","label":"💼 專業感 / 行業達人"},
     {"value":"幽默感 / 搞笑風格","label":"😄 幽默感 / 搞笑風格"},
     {"value":"親子感 / 家庭生活","label":"👨‍👩‍👧 親子感 / 家庭生活"},
     {"value":"時尚感 / 潮流品味","label":"✨ 時尚感 / 潮流品味"}
   ]'::jsonb,
   '生活感 / 真實分享', 4),

  ('b6000000-0000-0000-0000-000000000006',
   'PROMO_CODE', 'KOL 專屬優惠碼', 'text', false, NULL,
   '例：KOLVIP20，或填「暫無」', 5),

  ('b6000000-0000-0000-0000-000000000006',
   'OFFER_DETAILS', '優惠內容', 'text', false, NULL,
   '例：9折、首單免運、免費試用，或填「暫無」', 6),

  ('b6000000-0000-0000-0000-000000000006',
   'DEADLINE', '優惠截止日期', 'text', false, NULL,
   '例：4月30日，或填「不限」', 7),

  ('b6000000-0000-0000-0000-000000000006',
   'CONTENT_FORMAT', '內容格式', 'select', true,
   '[
     {"value":"IG 帖子文字","label":"📸 IG 帖子文字"},
     {"value":"影片旁白腳本","label":"🎬 影片旁白腳本"},
     {"value":"IG 限時動態文字","label":"⏱ IG 限時動態文字"},
     {"value":"Facebook 帖文","label":"📘 Facebook 帖文"}
   ]'::jsonb,
   'IG 帖子文字', 8),

  ('b6000000-0000-0000-0000-000000000006',
   'LANGUAGE_STYLE', '語言風格', 'select', true,
   '[
     {"value":"香港粵語口語＋繁體中文","label":"🇭🇰 香港粵語口語＋繁體中文"},
     {"value":"台灣用語＋繁體中文","label":"🇹🇼 台灣用語＋繁體中文"},
     {"value":"書面華語＋繁體中文","label":"📝 書面華語＋繁體中文"}
   ]'::jsonb,
   '香港粵語口語＋繁體中文', 9)

ON CONFLICT (template_id, name) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 2. 限時優惠爆款帖生成器 (flash_sale)
-- ─────────────────────────────────────────────────────────────

INSERT INTO workflows (id, workspace_id, key, name, description, is_active)
VALUES (
  'a7000000-0000-0000-0000-000000000007',
  NULL,
  'flash_sale',
  '限時優惠爆款帖生成器',
  '生成製造緊迫感、推動即時轉化的限時優惠帖文，包含稀缺感表達、香港地域認同元素、明確單一 CTA，及 Hashtag 策略。',
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO prompt_templates (id, workflow_id, name, system_prompt, template_body, model)
VALUES (
  'b7000000-0000-0000-0000-000000000007',
  'a7000000-0000-0000-0000-000000000007',
  '限時優惠帖生成',

  $SYSTEM$你是一位專為香港中小企服務的品牌內容策略師，精通製造緊迫感與推動即時轉化的廣告文案。

你的核心原則：
1. 製造稀缺感：限量、限時、限地區，讓人覺得「唔買就冇」
2. 降低購買障礙：「唔需要簽約」「試完先決定」等反硬銷聲明
3. 明確單一CTA：只給一個行動指令，減少決策疲勞

【香港高轉化限時帖必備元素】
✓ 數字強化（折扣%、剩餘數量、截止倒數）
✓ 限量/限時稀缺感表達
✓ 香港地域認同感（「全港首X」「香港獨家」）
✓ 反硬銷聲明（降低戒心）
✓ 明確單一CTA（只給一個行動指令）
✓ 廣東話口語貫穿全文

【輸出格式規定】
必須輸出純 JSON，格式如下（不得有任何額外文字或 Markdown code block）：
{
  "flash_sale": {
    "urgency_hook": "製造緊迫感的開場（含數字/截止日期/限量，15字內）",
    "offer_highlight": "優惠核心訊息（清晰說明優惠內容及條件，50字內）",
    "scarcity_statement": "稀缺感聲明（限量/限時/限地區，20字內）",
    "trust_reducer": "降低購買障礙聲明（反硬銷，20字內）",
    "cta": "明確單一行動號召（只一個指令 + 聯絡方式，20字內）",
    "full_post": "完整帖文全文（250-350字，廣東話口語，所有元素自然整合）",
    "hashtags": ["#優惠標籤", "#品牌標籤", "#行業標籤", "#香港標籤"],
    "visual_direction": "建議配圖方向（20字內）"
  }
}
hashtags 需要 12-15 個。$SYSTEM$,

  $TEMPLATE$請為以下限時優惠生成爆款帖文：

品牌名稱：{{BRAND_NAME}}
行業：{{INDUSTRY}}
優惠內容：{{OFFER_CONTENT}}
優惠幅度：{{OFFER_VALUE}}
截止日期／時間：{{DEADLINE}}
適用條件：{{CONDITIONS}}
聯絡方式：{{CONTACT_METHOD}}
語言風格：{{LANGUAGE_STYLE}}

請輸出包含以下香港高轉化元素的限時優惠帖：
① urgency_hook：製造緊迫感的開場（含數字/截止日期）
② offer_highlight：優惠核心訊息（清晰、具體）
③ scarcity_statement：稀缺感聲明（限量/限時/限地區）
④ trust_reducer：降低購買障礙聲明（「唔需要簽約」等）
⑤ cta：明確單一行動號召（只給一個指令）
⑥ full_post：完整帖文全文（250-350字，廣東話口語）
⑦ hashtags：12-15個
⑧ visual_direction：建議配圖方向

請嚴格按照系統指定的 JSON 格式輸出。$TEMPLATE$,

  'openai/gpt-4o-mini'
)
ON CONFLICT DO NOTHING;

INSERT INTO prompt_variables (template_id, name, label, type, required, options, default_value, sort_order)
VALUES
  ('b7000000-0000-0000-0000-000000000007',
   'BRAND_NAME', '品牌名稱', 'text', true, NULL, NULL, 1),

  ('b7000000-0000-0000-0000-000000000007',
   'INDUSTRY', '行業', 'text', true, NULL, NULL, 2),

  ('b7000000-0000-0000-0000-000000000007',
   'OFFER_CONTENT', '優惠內容', 'select', true,
   '[
     {"value":"折扣優惠","label":"💰 折扣優惠"},
     {"value":"買X送Y","label":"🎁 買X送Y"},
     {"value":"免費體驗／試用","label":"🆓 免費體驗／試用"},
     {"value":"限量贈品","label":"🎀 限量贈品"},
     {"value":"套裝組合優惠","label":"📦 套裝組合優惠"}
   ]'::jsonb,
   '折扣優惠', 3),

  ('b7000000-0000-0000-0000-000000000007',
   'OFFER_VALUE', '優惠幅度', 'text', true, NULL,
   '例：7折 / 首50名半價 / 買2送1', 4),

  ('b7000000-0000-0000-0000-000000000007',
   'DEADLINE', '截止日期／時間', 'text', true, NULL,
   '例：4月30日晚上11:59', 5),

  ('b7000000-0000-0000-0000-000000000007',
   'CONDITIONS', '適用條件', 'text', false, NULL,
   '例：消費滿$300、新客戶專享，或填「無門檻」', 6),

  ('b7000000-0000-0000-0000-000000000007',
   'CONTACT_METHOD', '聯絡方式', 'select', true,
   '[
     {"value":"WhatsApp 查詢","label":"💬 WhatsApp 查詢"},
     {"value":"網站下單","label":"🌐 網站下單"},
     {"value":"到店購買","label":"🏪 到店購買"},
     {"value":"Instagram DM","label":"📸 Instagram DM"}
   ]'::jsonb,
   'WhatsApp 查詢', 7),

  ('b7000000-0000-0000-0000-000000000007',
   'LANGUAGE_STYLE', '語言風格', 'select', true,
   '[
     {"value":"香港粵語口語＋繁體中文","label":"🇭🇰 香港粵語口語＋繁體中文"},
     {"value":"台灣用語＋繁體中文","label":"🇹🇼 台灣用語＋繁體中文"},
     {"value":"書面華語＋繁體中文","label":"📝 書面華語＋繁體中文"}
   ]'::jsonb,
   '香港粵語口語＋繁體中文', 8)

ON CONFLICT (template_id, name) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 3. 競爭對手廣告拆解器 (competitor_ad)
-- ─────────────────────────────────────────────────────────────

INSERT INTO workflows (id, workspace_id, key, name, description, is_active)
VALUES (
  'a8000000-0000-0000-0000-000000000008',
  NULL,
  'competitor_ad',
  '競爭對手廣告拆解器',
  '貼入競爭對手廣告原文，AI 自動拆解其訴求核心、情緒觸發器、社會認證手法及弱點，並提供3個可即時借鑑的策略建議。',
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO prompt_templates (id, workflow_id, name, system_prompt, template_body, model)
VALUES (
  'b8000000-0000-0000-0000-000000000008',
  'a8000000-0000-0000-0000-000000000008',
  '競爭對手廣告拆解分析',

  $SYSTEM$你是一位專為香港中小企服務的品牌競爭策略師，精通廣告文案分析、消費心理及香港市場競爭動態。

你的核心原則：
1. 客觀拆解：找出競爭對手廣告的真實策略，不帶偏見
2. 可借鑑：每個分析點都要有「我可以怎樣用」的具體建議
3. 找弱點：重點識別競爭對手做得不足的地方，這是差異化機會

【輸出格式規定】
必須輸出純 JSON，格式如下（不得有任何額外文字或 Markdown code block）：
{
  "competitor_analysis": {
    "core_appeal": "訴求核心（這則廣告最想打動客人的一個點，30字內）",
    "emotion_triggers": [
      {"trigger": "情緒觸發器類型（恐懼/渴望/歸屬/身份/稀缺）", "example": "廣告中的具體用詞或手法"}
    ],
    "social_proof_methods": ["使用了什麼社會認證手法1", "手法2"],
    "cta_analysis": "CTA 設計分析（是否清晰、有無限時元素、行動指令評估，50字內）",
    "localization_score": "香港本地化程度評估（有無廣東話口語、本地文化元素，30字內）",
    "weaknesses": [
      {"weakness": "弱點描述（30字內）", "opportunity": "我可以突破的機會（30字內）"}
    ],
    "borrowable_tactics": [
      {"tactic": "可借鑑手法標題", "how_to_apply": "我的品牌如何具體執行（40字內）"}
    ]
  }
}
emotion_triggers 列出所有識別到的，social_proof_methods 列出 2-4 個，weaknesses 列出 2-3 個，borrowable_tactics 需要 3 個。$SYSTEM$,

  $TEMPLATE$請分析以下競爭對手廣告，提取可借鑑的策略，並找出可以超越的空間：

我的品牌行業：{{MY_INDUSTRY}}
競爭對手廣告原文：
{{COMPETITOR_AD_TEXT}}
語言風格：{{LANGUAGE_STYLE}}

請從以下角度拆解：
① core_appeal：訴求核心（最想打動客人的一個點）
② emotion_triggers：情緒觸發器（恐懼/渴望/歸屬/身份/稀缺）
③ social_proof_methods：社會認證手法清單
④ cta_analysis：CTA 設計評估
⑤ localization_score：香港本地化程度
⑥ weaknesses：廣告弱點 + 我可以突破的機會
⑦ borrowable_tactics：3個可即時借鑑、應用到我品牌的具體手法

請嚴格按照系統指定的 JSON 格式輸出。$TEMPLATE$,

  'openai/gpt-4o-mini'
)
ON CONFLICT DO NOTHING;

INSERT INTO prompt_variables (template_id, name, label, type, required, options, default_value, sort_order)
VALUES
  ('b8000000-0000-0000-0000-000000000008',
   'MY_INDUSTRY', '我的品牌行業', 'text', true, NULL,
   '例：美容護膚、餐飲、健身', 1),

  ('b8000000-0000-0000-0000-000000000008',
   'COMPETITOR_AD_TEXT', '競爭對手廣告原文', 'textarea', true, NULL,
   '貼入完整廣告文案（包括標題、正文、Hashtag 等），可來自 Facebook、Instagram 或任何平台', 2),

  ('b8000000-0000-0000-0000-000000000008',
   'LANGUAGE_STYLE', '語言風格', 'select', true,
   '[
     {"value":"香港粵語口語＋繁體中文","label":"🇭🇰 香港粵語口語＋繁體中文"},
     {"value":"台灣用語＋繁體中文","label":"🇹🇼 台灣用語＋繁體中文"},
     {"value":"書面華語＋繁體中文","label":"📝 書面華語＋繁體中文"}
   ]'::jsonb,
   '香港粵語口語＋繁體中文', 3)

ON CONFLICT (template_id, name) DO NOTHING;
