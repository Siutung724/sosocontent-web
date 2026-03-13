# sosocontent.ai — 開發進度表

> 更新日期：2026-03-13（Session 6 更新）
> 專案：香港／台灣中小企 AI 內容助理 SaaS
> 技術棧：Next.js 15 · TypeScript · Tailwind CSS · Supabase · OpenRouter / Gemini

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
| 1.1 | DB Migration：`workspaces` `brand_profiles` `workflows` `prompt_templates` `prompt_variables` `executions` | 後端 | ✅ | `001_workflow_tables.sql` |
| 1.2 | Row Level Security (RLS) 政策 | 後端 | ✅ | Migration 內已定義 |
| 1.3 | Seed：`weekly_social` workflow + prompt_template + 7 個 prompt_variables | 後端 | ✅ | `seed.sql` — 已執行到 Supabase |
| 1.4 | Seed：`brand_story` workflow | 後端 | ⏳ | 第二個 workflow |
| 1.5 | Seed：`product_launch` workflow | 後端 | ⏳ | 第三個 workflow |
| 1.6 | `generations` 表（舊版 legacy，非 workflow engine） | 後端 | ✅ | 供舊 `/api/generate` 使用 |
| 1.7 | Supabase 環境變數設定（`.env.local`） | DevOps | ✅ | `NEXT_PUBLIC_SUPABASE_URL` 等 |
| 1.8 | AI API Key 設定（OpenRouter / Gemini） | DevOps | ✅ | `.env.local` |

---

## 二、後端 API

| # | 任務 | 路徑 | 狀態 | 備註 |
|---|------|------|------|------|
| 2.1 | Supabase Server Client | `lib/supabase-server.ts` | ✅ | `@supabase/ssr` cookie-based |
| 2.2 | Supabase Browser Client | `lib/supabase-browser.ts` | ✅ | |
| 2.3 | TypeScript 型別定義 | `lib/workflow-types.ts` | ✅ | 全部 interface 齊備 |
| 2.4 | **Workflow 執行引擎** | `POST /api/workflows/execute` | ✅ | 支援 OpenRouter + Gemini fallback；model retry |
| 2.5 | 舊版文案生成 API | `POST /api/generate` | ✅ | Legacy，維持現有功能 |
| 2.6 | 歷史紀錄 API | `GET /api/history` | ✅ | 需登入，從 `generations` 表讀取 |
| 2.7 | Brand Profile CRUD API | `POST/GET/PATCH/DELETE /api/brand-profiles` | ✅ | auto-create workspace；RLS 保護 |
| 2.8 | Workspace 管理 API | `/api/workspaces` | ⏳ | 多用戶隔離 |
| 2.9 | Executions 列表 API（Content Library） | `GET /api/executions` | ✅ | filter by workflow_key；pagination |
| 2.10 | 使用量統計 / Rate Limiting | middleware | ⏳ | 防濫用，免費版限額 |
| 2.11 | Stripe Webhook 處理 | `/api/webhooks/stripe` | 🚫 | Phase 2 |

---

## 三、前端頁面

### 3A. 已完成頁面

| # | 頁面 | 路徑 | 狀態 | 備註 |
|---|------|------|------|------|
| 3.1 | Root Layout | `app/layout.tsx` | ✅ | Inter 字型，繁中 lang |
| 3.2 | 舊版首頁（Legacy UI） | `app/page.tsx` | ✅ | 單頁 form + Google 登入 |
| 3.3 | **Workflow Hub** | `app/workflows/page.tsx` | ✅ | Server Component，顯示 active workflows 卡片 |
| 3.4 | **動態 Workflow 表單頁** | `app/workflows/[key]/page.tsx` | ✅ | Server Component，讀 prompt_variables |
| 3.5 | **Workflow 表單 + 結果（Client）** | `app/workflows/[key]/WorkflowForm.tsx` | ✅ | 4 種 input type；weekly_social 7 張貼文卡；複製功能 |

### 3B. 待開發頁面

| # | 頁面 | 路徑 | 狀態 | 優先級 | 備註 |
|---|------|------|------|--------|------|
| 3.6 | 登入 / 註冊頁 | `app/auth/page.tsx` | ✅ | 🔴 高 | Google OAuth + Email Magic Link |
| 3.7 | Auth Callback | `app/auth/callback/route.ts` | ✅ | 🔴 高 | Supabase SSR callback |
| 3.8 | 登入後 Dashboard | `app/dashboard/page.tsx` | ✅ | 🔴 高 | 顯示快捷入口 + 最近生成 |
| 3.9 | Brand Profile 管理頁 | `app/brand/page.tsx` | ✅ | 🟡 中 | 新增 / 編輯 / 刪除品牌資料 |
| 3.10 | Content Library 頁 | `app/library/page.tsx` | ✅ | 🟡 中 | accordion 展開結果；filter；分頁載入 |
| 3.11 | 用戶設定頁 | `app/settings/page.tsx` | ✅ | 🟢 低 | 帳戶資料、訂閱計劃、Voice Profile、聯絡支援 |
| 3.12 | 定價頁 | `app/pricing/page.tsx` | ⏳ | 🟢 低 | 免費版 vs 付費版比較 |

---

## 四、共用組件

| # | 組件 | 路徑 | 狀態 | 備註 |
|---|------|------|------|------|
| 4.1 | Navigation / Top Bar | `components/Nav.tsx` | ✅ | Server Component；logo + NavLinks（Client）；sticky blur nav |
| 4.1b | Nav Links（Client） | `components/NavLinks.tsx` | ✅ | active route 偵測；Google signOut；工作坊／內容庫／品牌／設定 |
| 4.2 | Toast 通知 | `components/Toast.tsx` + `providers/ToastProvider.tsx` | ✅ | success／error 左色條；3.5s 自動消失；Context API |
| 4.2b | useToast hook | `hooks/useToast.ts` | ✅ | 供 Client Component 呼叫 |
| 4.3 | App Layout Wrapper | `components/AppLayout.tsx` | ✅ | Nav + 統一 container；所有登入後頁面使用 |
| 4.4 | Loading Skeleton | `components/Skeleton.tsx` | ✅ | SkeletonLine / SkeletonPostCard / SkeletonWorkflowCard / SkeletonBrandCard / SkeletonExecRow + 整頁組合 |
| 4.5 | Auth Guard (middleware) | `middleware.ts` | ✅ | 保護 /dashboard /workflows /library /brand /settings |

---

## 五、UX／UI 設計系統

| # | 任務 | 路徑 | 狀態 | 備註 |
|---|------|------|------|------|
| 5.1 | 設計規範文件 | `DESIGN.md` | ✅ | 深色玻璃態；色彩 tokens；Logo 規則；Nav／卡片／按鈕／輸入框／Toast 規格 |
| 5.2 | Tailwind 自訂 tokens | `tailwind.config.ts` | ✅ | body / surface / surface-2 / primary / secondary / accent / success / danger；shadow-card / shadow-toast |
| 5.3 | 全域背景深色化 | `app/globals.css` | ✅ | body 改為 `#0b0b12`，移除舊 light gradient |
| 5.4 | Dashboard 深色主題 | `app/dashboard/page.tsx` | ✅ | AppLayout；dark tokens 全面替換 |
| 5.5 | Workflow Hub 深色主題 | `app/workflows/page.tsx` | ✅ | AppLayout；移除舊 header |
| 5.6 | Workflow 表單頁深色主題 | `app/workflows/[key]/page.tsx` | ✅ | AppLayout；accent back link |
| 5.7 | WorkflowForm 深色主題 | `app/workflows/[key]/WorkflowForm.tsx` | ✅ | inputs / post cards / error / submit 全部換 dark tokens |
| 5.8 | Brand 管理頁深色主題 | `app/brand/page.tsx` | ✅ | AppLayout；移除舊 header |
| 5.9 | BrandManager 深色主題 | `app/brand/BrandManager.tsx` | ✅ | form fields / profile cards / empty state 全部換 dark tokens |
| 5.10 | 內容庫頁深色主題 | `app/library/page.tsx` | ✅ | AppLayout；移除舊 header |
| 5.11 | LibraryView 深色主題 | `app/library/LibraryView.tsx` | ✅ | exec cards / post cards / filter tabs / spinner / load-more 全部換 dark tokens |
| 5.12 | Gunter 字體（Logo） | `app/layout.tsx` | ⏳ | 現用 Inter 備用；TODO: 安裝 Gunter 字體 |

---

## 六、Voice / TTS UI（Placeholder Phase）

| # | 任務 | 路徑 | 狀態 | 備註 |
|---|------|------|------|------|
| 6.1 | Voice UI 設計規則 | `DESIGN.md` | ✅ | Voice Bar 規格；Voice Profile 卡片規格；顏色規則 |
| 6.2 | TTS 後端規劃文件 | `VOICE_TTS_PLAN.md` | ✅ | DB schema、API 路由、provider 候選、狀態機 |
| 6.3 | DB Migration：voice_profiles + executions 欄位 | `supabase/migrations/002_voice_tables.sql` | ✅ | audio_url / voice_profile_id 預留；已執行到 Supabase ✅ 2026-03-13 |
| 6.4 | WorkflowForm PostCard Voice Bar | `app/workflows/[key]/WorkflowForm.tsx` | ✅ | Play button + 聲線狀態文字；onClick → Toast |
| 6.5 | LibraryView WeeklyPostCard Voice Bar | `app/library/LibraryView.tsx` | ✅ | 同上 |
| 6.6 | Brand 頁 Voice Profile 卡片 | `app/brand/BrandManager.tsx` | ✅ | 聲線名稱／語言／狀態 badge；兩個 placeholder 按鈕 → Toast |
| 6.7 | Settings 頁 Voice Profile 卡片 | `app/settings/page.tsx` + `SettingsView.tsx` | ✅ | 帳戶資料、訂閱計劃、Voice Profile、聯絡支援 |

---

## 七、測試

| # | 任務 | 狀態 | 備註 |
|---|------|------|------|
| 7.1 | `POST /api/workflows/execute` 手動測試（weekly_social） | ✅ | 已在開發環境確認 |
| 7.2 | Workflow Hub UI 測試（3 張卡片顯示） | ⏳ | 需有 seed 資料 |
| 7.3 | WorkflowForm 各 input type 測試 | ⏳ | text / textarea / select / multi-select |
| 7.4 | 結果卡片「複製全文」功能測試 | ⏳ | Clipboard API |
| 7.5 | 手機響應式測試 | ⏳ | iPhone SE / 375px |
| 7.6 | 錯誤情境測試（缺欄位 / API timeout） | ⏳ | |

---

## 八、部署 & DevOps

| # | 任務 | 狀態 | 備註 |
|---|------|------|------|
| 8.0 | `middleware.ts` — Supabase session 刷新 + /dashboard 路由保護 | ✅ | |
| 8.0b | Tailwind CSS v3 安裝 + `tailwind.config.ts` + `postcss.config.mjs` | ✅ | 修復無樣式問題 |
| 8.1 | `next.config.mjs` Cloudflare Pages 設定 | ✅ | `@cloudflare/next-on-pages` adapter |
| 8.2 | Cloudflare Pages 項目建立 & 連接 Git | ⏳ | |
| 8.3 | Cloudflare Pages 環境變數設定 | ⏳ | Supabase + AI keys |
| 8.4 | 自訂域名 `sosocontent.ai` 綁定 | ⏳ | |
| 8.5 | Supabase Production 項目建立 | ⏳ | 現用 dev 環境 |
| 8.6 | Migration 執行到 Production DB | ⏳ | |
| 8.7 | Seed 執行到 Production DB | ⏳ | |

---

## 九、MVP 里程碑

```
Phase 0 — 核心引擎 ✅
  [✅] DB schema + seed
  [✅] /api/workflows/execute
  [✅] TypeScript types

Phase 1 — Workflow UI ✅  ← 現在
  [✅] Workflow Hub 頁面
  [✅] 動態表單 + 結果顯示
  [✅] weekly_social 7 張貼文卡

Phase 2 — Auth & 用戶系統 ✅
  [✅] middleware.ts (session refresh)
  [✅] 登入 / 註冊頁 (Google OAuth + Magic Link)
  [✅] Auth Callback Route
  [✅] Supabase Auth URL + Redirect URL 設定
  [✅] Google OAuth Provider 啟用
  [✅] Dashboard (workflow 快捷入口 + 最近紀錄)
  [✅] Tailwind CSS 安裝修復
  [✅] Brand Profile UI + API (CRUD + auto-create workspace)

Phase 3 — Content Library ✅
  [✅] GET /api/executions (filter + pagination)
  [✅] app/library/page.tsx + LibraryView.tsx
  [✅] Accordion 展開顯示完整結果
  [✅] Dashboard 快捷入口

Phase 3.5 — UX／UI 設計系統 ✅
  [✅] DESIGN.md 設計規範
  [✅] Tailwind 深色 tokens (body/surface/accent…)
  [✅] Nav + AppLayout + Toast 共用組件
  [✅] 全部登入後頁面套用 AppLayout + 深色主題
  [✅] middleware 擴展至所有受保護路由

Phase 3.6 — Voice / TTS UI Placeholder ✅
  [✅] VOICE_TTS_PLAN.md（DB schema + API 路由 + provider 規劃）
  [✅] DB Migration 002（voice_profiles 表 + executions 預留欄位）
  [✅] DESIGN.md Voice 規則（Voice Bar + Voice Profile 卡片）
  [✅] 所有結果卡片加 Voice Bar placeholder（PlayButton + 聲線狀態）
  [✅] Brand 頁加 Voice Profile 卡片 placeholder

Phase 4 — 部署上線 ⏳
  [ ] Cloudflare Pages
  [ ] Production Supabase
  [ ] 域名設定

Phase 5 — 更多 Workflows 🚫
  [ ] brand_story
  [ ] product_launch
  [ ] 訂閱計劃
```

---

## 下一步行動（Next Actions）

1. ~~seed.sql~~ ✅  ~~Auth 頁面~~ ✅  ~~Dashboard~~ ✅  ~~Tailwind 修復~~ ✅
2. ~~Brand Profile API + UI~~ ✅  ~~Content Library~~ ✅
3. ~~UX/UI 設計系統（深色主題 + Nav + AppLayout + Toast）~~ ✅
4. ~~Voice / TTS UI Placeholder~~ ✅
5. ~~Loading Skeleton 組件~~ ✅
6. ~~Toast 接入實際操作（brand 儲存 / 更新 / 刪除；workflow 生成成功 / 失敗）~~ ✅
7. ~~Settings 頁 + Voice Profile 卡片（6.7）~~ ✅
8. **下一步 A（DB）** — 執行 `002_voice_tables.sql` 到 Supabase（手動 SQL Editor）
9. **下一步 B（品質）** — 手機響應式測試（iPhone SE / 375px）
10. **部署** — Cloudflare Pages staging

---

## ⚡ Supabase Seed 操作步驟（手動）

由於未安裝 Supabase CLI，請按以下步驟執行 seed：

1. 開啟 [Supabase Dashboard](https://supabase.com/dashboard)
2. 進入你的項目 → **SQL Editor**
3. 先執行 `supabase/migrations/001_workflow_tables.sql`（若尚未執行）
4. 再執行 `supabase/seed.sql`
5. 在 **Table Editor → workflows** 確認有一行 `weekly_social` 且 `is_active = true`

## ⚙️ Supabase Auth 設定（Google OAuth）

在 Supabase Dashboard → **Authentication → URL Configuration** 設定：

- **Site URL**：`http://localhost:3000`（開發）/ 正式域名（上線後改）
- **Redirect URLs** 新增：
  - `http://localhost:3000/auth/callback`
  - `https://你的域名.com/auth/callback`

在 **Authentication → Providers → Google** 啟用並填入 Google Cloud Console 的 Client ID / Secret。
