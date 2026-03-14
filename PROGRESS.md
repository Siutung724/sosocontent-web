# sosocontent.ai — 開發進度表

> 更新日期：2026-03-15（Session 8 更新）
> 專案：香港中小企 AI 廣東話內容助理 SaaS
> 技術棧：Next.js 15 · TypeScript · Tailwind CSS · Supabase · OpenRouter · MiniMax TTS · Stripe

---

## 圖例

| 符號 | 狀態 |
|------|------|
| ✅ | 完成 |
| 🔄 | 進行中 |
| ⏳ | 待做 |
| 🚫 | 暫緩 / 超出 MVP 範圍 |

---

## 一、資料庫 & 基礎架構

| # | 任務 | 負責 | 狀態 | 備註 |
|---|------|------|------|------|
| 1.1 | DB Migration：核心表（workspaces / brand_profiles / workflows / prompt_templates / prompt_variables / executions） | 後端 | ✅ | `001_workflow_tables.sql` |
| 1.2 | Row Level Security (RLS) 政策 | 後端 | ✅ | Migration 內已定義 |
| 1.3 | Seed：weekly_social workflow | 後端 | ✅ | `seed.sql` |
| 1.4 | Seed：brand_story workflow | 後端 | ✅ | ⛔ 已停用（is_active=false） |
| 1.5 | Seed：product_launch workflow | 後端 | ✅ | |
| 1.6 | Seed：brand_trust workflow | 後端 | ✅ | |
| 1.7 | Seed：brand_strategy workflow | 後端 | ✅ | |
| 1.8 | Seed：kol_script workflow | 後端 | ✅ | Migration 006 |
| 1.9 | Seed：flash_sale workflow | 後端 | ✅ | Migration 007 |
| 1.10 | Seed：competitor_ad workflow | 後端 | ✅ | Migration 008 |
| 1.11 | DB Migration：voice_profiles 表 | 後端 | ✅ | `002_voice_tables.sql` |
| 1.12 | DB Migration：user_plans 表 | 後端 | ✅ | `004_user_plans.sql` |
| 1.13 | DB Migration：tts-audio bucket RLS | 後端 | ✅ | `005_tts_audio_storage_rls.sql` |
| 1.14 | DB Migration：credit_cost on workflows + credits_used on executions | 後端 | ✅ | `009_credit_system.sql`（已執行） |
| 1.15 | Supabase Storage：tts-audio bucket 設為 Public | DevOps | ✅ | Dashboard 手動設定 |
| 1.16 | 環境變數設定（.env.local + Vercel） | DevOps | ✅ | 全部已加入 Vercel |

---

## 二、後端 API

| # | 任務 | 路徑 | 狀態 | 備註 |
|---|------|------|------|------|
| 2.1 | Supabase Server Client | `lib/supabase-server.ts` | ✅ | |
| 2.2 | Supabase Browser Client | `lib/supabase-browser.ts` | ✅ | |
| 2.3 | TypeScript 型別定義 | `lib/workflow-types.ts` | ✅ | 含 credit_cost / credits_used |
| 2.4 | **Workflow 執行引擎 + 積分系統** | `POST /api/workflows/execute` | ✅ | OpenRouter fallback；積分扣款；Free=120 lifetime / Pro=1000/期 / Enterprise=5000/期 |
| 2.5 | Brand Profile CRUD API | `/api/brand-profiles` | ✅ | |
| 2.6 | Executions 列表 API | `GET /api/executions` | ✅ | filter + pagination |
| 2.7 | **TTS 語音生成 API** | `POST /api/tts/generate` | ✅ | MiniMax speech-02-hd；audio_url 快取 |
| 2.8 | **Stripe Webhook 處理** | `POST /api/webhooks/stripe` | ✅ | checkout.completed → upsert user_plans + updateUserById |
| 2.9 | Voice Profile CRUD API | `/api/voice-profiles` | ✅ | |

---

## 三、前端頁面

| # | 頁面 | 路徑 | 狀態 | 備註 |
|---|------|------|------|------|
| 3.1 | 登入 / 註冊頁 | `app/auth/page.tsx` | ✅ | Google OAuth + Email Magic Link |
| 3.2 | **Dashboard — 指揮中心** | `app/dashboard/page.tsx` | ✅ | 4 stats（總生成、**剩餘積分**、品牌數、⚡工作坊）；常用 workflow；最近 5 紀錄；積分警示 banner |
| 3.3 | **Workflow Hub（工作坊）** | `app/workflows/page.tsx` | ✅ | 7 個活躍 workflow + 積分 badge；品牌快速存取 |
| 3.4 | **動態 Workflow 表單頁** | `app/workflows/[key]/page.tsx` | ✅ | Server Component；計算 creditsRemaining 傳入 WorkflowForm |
| 3.5 | **Workflow 表單 + 結果（Client）** | `app/workflows/[key]/WorkflowForm.tsx` | ✅ | 積分顯示；積分不足 disable 提交；403 升級 banner；8 種 workflow 結果渲染 |
| 3.6 | Brand Profile 管理頁 | `app/brand/page.tsx` | ✅ | |
| 3.7 | **Content Library** | `app/library/page.tsx` | ✅ | 7 個 workflow filter；Voice Bar；分頁 |
| 3.8 | 用戶設定頁 | `app/settings/page.tsx` + `SettingsView.tsx` | ✅ | 積分說明更新；升級按鈕連 /pricing |
| 3.9 | 聲線設定頁 | `app/settings/voice/page.tsx` | ✅ | |
| 3.10 | **定價頁** | `app/pricing/page.tsx` | ✅ | Stripe Buy Button（Pro $20 / Enterprise $50） |
| 3.11 | **Admin CRM Dashboard** | `app/admin/page.tsx` | ✅ | 用戶清單、方案統計、MRR 估算、CSV 匯出 |
| 3.12 | **Landing Page** | `app/page.tsx` | ✅ | 7 大 workflow feature grid + 積分 badge；PromoModal 3 天倒數；UpdateBanner 更新 |

---

## 四、共用組件

| # | 組件 | 路徑 | 狀態 |
|---|------|------|------|
| 4.1 | Navigation / Top Bar | `components/Nav.tsx` | ✅ |
| 4.2 | Toast 通知 | `components/Toast.tsx` | ✅ |
| 4.3 | App Layout Wrapper | `components/AppLayout.tsx` | ✅ |
| 4.4 | Auth Guard (middleware) | `middleware.ts` | ✅ |
| 4.5 | **Stripe Buy Button** | `components/StripeBuyButton.tsx` | ✅ |
| 4.6 | **Admin CSV 匯出按鈕** | `app/admin/AdminExportButton.tsx` | ✅ |
| 4.7 | **Landing Overlays** | `components/LandingOverlays.tsx` | ✅ | PromoModal（3天倒數 localStorage）+ UpdateBanner |

---

## 五、Workflow 一覽（7 個活躍）

| Key | 名稱 | 積分消耗 | 狀態 |
|-----|------|----------|------|
| weekly_social | 七日內容策略 | 20 | ✅ 活躍 |
| brand_strategy | 品牌定位一鍵生成器 | 20 | ✅ 活躍 |
| product_launch | 高轉化廣告文案生成器 | 10 | ✅ 活躍 |
| brand_trust | 客評廣告素材轉化器 | 10 | ✅ 活躍 |
| kol_script | KOL 合作腳本生成器 | 10 | ✅ 活躍 |
| flash_sale | 限時優惠爆款帖生成器 | 10 | ✅ 活躍 |
| competitor_ad | 競爭對手廣告拆解器 | 20 | ✅ 活躍 |
| brand_story | 品牌故事撰寫 | — | ⛔ 停用 |

---

## 六、積分系統（Phase 4.6）✅

| 方案 | 積分額度 | 補充機制 |
|------|---------|---------|
| 免費版 | 120 積分（終身一次性） | 不補充 |
| Pro | 1,000 積分 / 帳單周期 | 每期自動補充，不累積 |
| 企業版 | 5,000 積分 / 帳單周期 | 每期自動補充，不累積 |

- Migration 009 已執行（credit_cost on workflows / credits_used on executions）
- API 層強制執行（執行前計算剩餘，不足返回 403 + 錯誤訊息）
- 前端 WorkflowForm 顯示消耗/剩餘積分，積分不足 disable 提交
- Dashboard 第 2 格 stat 顯示「剩餘積分」

---

## 七、訂閱 & 付費

| # | 任務 | 狀態 | 備註 |
|---|------|------|------|
| 7.1 | Stripe Buy Button 整合 | ✅ | Pro + Enterprise；client-reference-id = user.id |
| 7.2 | Stripe Webhook → 自動升級方案 | ✅ | checkout.completed / subscription.deleted / payment_failed |
| 7.3 | user_plans DB 表 | ✅ | user_id / plan / stripe_customer_id / current_period_end |
| 7.4 | 積分制限額執行 | ✅ | 取代舊「每月 1 次」邏輯 |
| 7.5 | Vercel 環境變數：STRIPE_WEBHOOK_SECRET | ✅ | 已加入 Vercel |

---

## 八、部署 & DevOps（全部 ✅）

| 項目 | 狀態 |
|------|------|
| Vercel 部署 → https://sosocontent-web.vercel.app | ✅ |
| 自訂域名 sosocontent.ai（DNS Valid） | ✅ |
| 全部環境變數已加入 Vercel | ✅ |
| Stripe Webhook endpoint 已設定 | ✅ |
| Supabase Auth URL + Google OAuth redirect | ✅ |
| Migrations 001–009 已全部執行 | ✅ |

---

## 九、MVP 里程碑

```
Phase 0 — 核心引擎 ✅
Phase 1 — Workflow UI ✅
Phase 2 — Auth & 用戶系統 ✅
Phase 3 — Content Library ✅
Phase 3.5 — UX/UI 設計系統 ✅
Phase 3.6 — Voice / TTS（MiniMax）✅
Phase 3.7 — 訂閱 & 付費（Stripe）✅
Phase 3.8 — Admin CRM ✅
Phase 4 — 部署上線 ✅（sosocontent.ai）
Phase 4.5 — 新 Workflow × 3（kol_script / flash_sale / competitor_ad）✅
Phase 4.6 — 積分系統 ✅（2026-03-15）
  [✅] Migration 009：credit_cost on workflows / credits_used on executions
  [✅] API 積分扣款 + 餘額檢查
  [✅] WorkflowForm 積分顯示 + 不足 disable
  [✅] Dashboard 剩餘積分 stat
  [✅] Landing Page 更新（7 workflows + 積分 badge）
  [✅] Settings 積分說明文字更新
  [✅] PromoModal / UpdateBanner 內容更新

Phase 5 — 增長功能 🚫（低優先）
  [ ] Mobile Nav（底部 tab bar）
  [ ] Google Sheets API 匯出（Admin）
  [ ] Tone Learning（記錄用戶編輯）
  [ ] 社交媒體排程發佈

Phase 6 — 數字人影片（企業版）🚫
  [ ] D-ID API 整合（相片 → 說話頭像影片）
  [ ] TTS 旁白 + Lip Sync
  [ ] 企業版積分消耗：數字人 = 50 積分/次
```

---

## 下一步行動

**低優先（有空再做）：**
1. Mobile Nav — 底部 tab bar（手機目前無導航）
2. Google Sheets API 匯出（Admin 頁面）

**未來規劃：**
3. 數字人影片（D-ID API）— 企業版專屬功能
4. 社交媒體直接排程發佈（Instagram Graph API）
