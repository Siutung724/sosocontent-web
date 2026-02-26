# sosocontent.ai Cantonese MVP 🇭🇰

一個基於 Next.js 14 + Serverless Backend 的地道廣東話 AI 內容營銷助手。

## 快速開始 (Local Development)

### 1. 安裝依賴
```bash
cd mvp
npm install
```

### 2. 設定環境變數 (.env.local)
建立 `.env.local` 檔案並填入：
```env
NEXT_PUBLIC_APP_NAME="sosocontent.ai MVP"
# 指向你的 Cloud Function 或 Apps Script URL
CONTENT_API_BASE_URL="https://YOUR_BACKEND_URL"
```

### 3. 啟動開發伺服器
```bash
npm run dev
```
開啟 [http://localhost:3000](http://localhost:3000) 即可使用。

---

## 部署說明 (Deployment)

### 前端 (Vercel)
1. 在 Vercel Dashboard 匯入此專案。
2. 設定上述環境變數。
3. **設定 Custom Domain**:
   - 喺 Vercel Project 頁面，去 **Settings** -> **Domains**。
   - 輸入 `sosocontent.ai` 並按 **Add**。
   - 根據 Vercel 提示，去你嘅 Domain Provider (例如 Namecheap, GoDaddy) 設定 **A Record** (指向 Vercel IP) 或者 **CNAME** (指向 `vuerp-vercel.app`)。
   - 等候 DNS 生效 (通常幾分鐘到幾小時)。

### 後端方案 A: Google Cloud Functions (高專業度)
1. 進入 `backend/gcf` 路徑。

---

## 方案 C: Cloudflare Pages 部署 (推薦)

### 1. 綁定 GoDaddy 到 Cloudflare
- 登入 Cloudflare，按 **"Add a Site"** 並輸入 `sosocontent.ai`。
- 揀 **Free Plan**。
- Cloudflare 會掃描你現有 DNS，然後畀兩組 **Nameservers** 你 (例如 `...ns.cloudflare.com`)。
- 返去 **GoDaddy** -> **Domain Settings** -> **Manage DNS** -> **Nameservers**，按 **Change** 並填入嗰兩組 Cloudflare Nameservers。

### 2. 部署 Next.js 到 Cloudflare Pages
- 喺 Cloudflare 左側選單揀 **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**。
- 授權 GitHub 並選擇你的 Repo。
- **Build settings**:
    - Framework preset: **Next.js**
    - Build command: `npx @cloudflare/next-on-pages@1` (或者預設 `npm run build`)
- **Environment variables**:
    - 加入 `CONTENT_API_BASE_URL` (指向你的後端)。
- 按 **Save and Deploy**。
2. 指令部署 (需已安裝 gcloud SDK)：
   ```bash
   gcloud functions deploy generateContent \
     --runtime nodejs20 \
     --trigger-http \
     --allow-unauthenticated \
     --set-env-vars AI_API_KEY=你的_GEMINI_KEY
   ```
3. 取得 `https://...` 網址並填入前端的 `CONTENT_API_BASE_URL`。

### 後端方案 B: Google Apps Script (快速/免費)
1. 在 Google Drive 建立一個新的 Apps Script。
2. 貼入 `backend/gas/main.gs` 的代碼。
3. 在 Project Settings -> Script Properties 加入 `AI_API_KEY`。
4. 按下 "Deploy" -> "New Deployment" -> "Web App" (Who has access: Anyone)。
5. 取得 Web App URL 並填入前端的 `CONTENT_API_BASE_URL`。

---

## 技術棧 (Stack)
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Premium Vanilla CSS (Inter Font + Glassmorphism)
- **Logic**: TypeScript
- **Backend API**: Gemini Pro 1.5 API 

---
*Powered by Antigravity*
