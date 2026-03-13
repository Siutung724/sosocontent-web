# sosocontent.ai — Design System

> 設計風格：深色玻璃態（Dark Glassmorphism）
> 參考：Higgsfield / Linear / Vercel 風格

---

## 色彩系統（Tailwind 自訂 tokens）

| Token | Tailwind class | Hex | 用途 |
|-------|---------------|-----|------|
| body | `bg-body` | `#0b0b12` | 頁面主背景 |
| surface | `bg-surface` | `#13131e` | 卡片、面板背景 |
| surface-2 | `bg-surface-2` | `#1c1c2a` | 輸入框、次層背景 |
| primary | `text-primary` | `#eeeef8` | 主文字（近白） |
| secondary | `text-secondary` | `#7878a0` | 次要文字、placeholder |
| accent | `text-accent` / `bg-accent` | `#6366f1` | 品牌色、CTA、active 狀態 |
| success | `text-success` | `#22c55e` | 成功提示 |
| danger | `text-danger` | `#ef4444` | 錯誤提示 |

### 邊框
- 一般邊框：`border border-white/5`
- 強調邊框：`border border-white/10`
- Hover 邊框：`border border-white/20`

---

## Logo 規則

- 文字：**sosocontent**（全小寫，固定）
- 字重：`font-bold`
- 字距：`tracking-tight`（輕微收窄，保持視覺緊湊）
- 字體：Gunter（若未安裝，用 `font-sans` Inter + `TODO: replace with Gunter` 備注）
- 顏色：`text-primary`
- 小圖示：左側可配一個 16×16 極簡 icon（speech bubble 或圓角方塊），單色 `text-accent`
- Hover／Active：整個 logo 區塊不改色，只可加 `opacity-80` 過渡

---

## Nav

```
[logo]  [Workflows]  [內容庫]  [品牌]     |    [avatar] [email]  [登出]
```

- 背景：`bg-body/90 backdrop-blur-md`
- 定位：`sticky top-0 z-40`
- 下邊框：`border-b border-white/5`
- Nav link 預設：`text-secondary`
- Nav link hover：`text-primary` + 底線 `border-b-2 border-accent`
- Active route：`text-primary font-medium`
- 登出按鈕：`border border-white/10 rounded-full px-4 py-1.5 text-secondary hover:bg-white/5`

---

## 內容區

- 外層容器：`max-w-6xl mx-auto px-4 md:px-8 lg:px-12`
- 頁面頂部 padding：`py-8 md:py-12`
- Section 間距：`space-y-10`

---

## 卡片 / 面板

```css
bg-surface border border-white/5 rounded-2xl
shadow-[0_0_30px_rgba(0,0,0,0.4)]
```

- Hover：`hover:border-white/10 transition-colors`
- 強調卡片：`border-accent/30`

---

## 按鈕

### Primary（CTA）
```
bg-accent hover:bg-accent/90 text-white font-semibold
px-5 py-2.5 rounded-xl transition-colors
```

### Secondary
```
border border-white/10 hover:bg-white/5 text-secondary hover:text-primary
px-4 py-2 rounded-xl transition-colors
```

### Danger
```
border border-danger/30 hover:bg-danger/10 text-danger
px-4 py-2 rounded-xl transition-colors
```

---

## 輸入框

```
bg-surface-2 border border-white/10 rounded-xl px-3 py-2.5 text-sm
text-primary placeholder:text-secondary
focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50
```

---

## Toast

- 定位：`fixed bottom-5 right-5 z-50`（mobile: 改 top）
- 卡片：`bg-surface border border-white/10 rounded-xl px-4 py-3 shadow-[0_0_30px_rgba(0,0,0,0.5)]`
- 左側色條：
  - success → `bg-success` 4px 寬條
  - error → `bg-danger` 4px 寬條
- 自動消失：3 秒

---

## 間距 & 排版

| 元素 | Class |
|------|-------|
| 頁面標題 (h1) | `text-2xl md:text-3xl font-bold text-primary` |
| 區塊標題 (h2) | `text-xs font-semibold text-secondary uppercase tracking-widest` |
| 段落 | `text-sm text-secondary leading-relaxed` |
| 標籤 (label) | `text-sm font-medium text-secondary` |

---

## Voice / TTS UI（Placeholder 規則）

> 現階段：純 UI placeholder，所有 onClick 觸發 Toast「語音生成功能即將推出」
> 將來：串接 TTS provider 時，直接換掉 onClick 邏輯，UI 結構不變

### Workflow 結果卡片底部 Voice Bar

每張結果卡片（PostCard / WeeklyPostCard）底部加一條分隔線 + Voice Bar：

```
border-t border-white/5
px-5 py-2.5 flex items-center justify-between
```

- **左側 Play button**
  ```
  border border-accent/30 text-accent hover:bg-accent/10
  rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1.5
  transition-colors
  ```
  Icon：`▶` 或耳機 SVG（16×16，`text-accent`）
  文字：`播放`

- **右側狀態文字**
  - 未建立聲線：`text-xs text-secondary/60`，文字：`系統預設聲線`
  - 已建立聲線（將來）：`text-xs text-accent/70`，文字：`以你的聲線播放`

### Brand / Settings 頁面 Voice Profile 卡片

固定顯示，不受資料狀態影響：

```
bg-surface border border-white/5 rounded-2xl p-5
```

內容：
- 標題：`我的聲線（Voice Profile）`，`text-sm font-semibold text-primary`
- 聲線名稱：`預設聲線`，`text-secondary`
- 語言：`暫未設定`，`text-secondary/60`
- 訓練狀態 badge：`未建立`
  ```
  text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full
  ```
- 兩個按鈕（Secondary style）：
  - `上載示範音頻`
  - `重新訓練`
  - 兩者 onClick 均觸發 Toast：`「TTS 設定即將推出，請稍後」`

### 顏色規則

- 全部使用現有 `accent` / `secondary` token，**不新增** voice 專用色
- 未啟用狀態：`text-secondary/60`，`border-white/5`
- 可互動元素：`text-accent`，`border-accent/30`，`hover:bg-accent/10`
