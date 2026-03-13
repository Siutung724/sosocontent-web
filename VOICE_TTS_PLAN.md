# sosocontent.ai — Voice / TTS 功能規劃

> 狀態：預留設計（UI placeholder 已實作，backend 待定）
> 現階段嚴格禁止：寫死任何第三方 TTS SDK / endpoint，或在前端 expose TTS API key

---

## 目標

為每一個 execution（workflow 產出）預留語音欄位，方便將來串接任意 TTS provider，用戶可以用自己的聲線朗讀生成的文案。

---

## DB Schema 預留

### 修改現有 `executions` 表

```sql
-- Migration: 002_voice_tables.sql
ALTER TABLE executions
  ADD COLUMN IF NOT EXISTS audio_url TEXT,
  ADD COLUMN IF NOT EXISTS voice_profile_id UUID REFERENCES voice_profiles(id) ON DELETE SET NULL;
```

### 新表 `voice_profiles`

```sql
CREATE TABLE IF NOT EXISTS voice_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT '我的聲線',
  tts_provider    TEXT,                          -- 'elevenlabs' | 'openai' | 'gemini' | null
  voice_id        TEXT,                          -- provider 內部 voice reference
  language        TEXT DEFAULT 'zh-HK',          -- 'zh-HK' | 'zh-TW'
  status          TEXT NOT NULL DEFAULT 'not_created',
                                                 -- 'not_created' | 'training' | 'ready' | 'error'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own voice profiles"
  ON voice_profiles FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

---

## API 預留路由（暫時不實作，只定名）

| 方法 | 路徑 | 說明 |
|------|------|------|
| `POST` | `/api/voice/train` | 接受上載示範音頻 → call TTS provider 建立聲線 |
| `GET` | `/api/voice/profile` | 取得目前用戶的 voice profile |
| `PATCH` | `/api/voice/profile` | 更新 voice profile |
| `POST` | `/api/voice/generate` | 傳入 `text` + `execution_id`，回覆 `audio_url`，更新 executions.audio_url |

---

## Workflow Engine 預留邏輯

在 `POST /api/workflows/execute` 的 request body 預留一個 flag：

```ts
{
  workflowKey: string;
  inputs: Record<string, string>;
  generate_voice?: boolean;  // 預留，現階段忽略
}
```

將來 `generate_voice: true` 時的流程：
1. 正常執行 workflow，產生文字內容並儲存到 `executions`
2. 呼叫 `POST /api/voice/generate`，傳入 `execution_id`
3. TTS 完成後更新 `executions.audio_url`
4. 前端輪詢或 WebSocket 接收 `audio_url`，更新 Voice Bar 狀態

---

## UI Placeholder 狀態機

```
未建立聲線
  → Play button：顯示「播放」，onClick → Toast「語音生成功能即將推出」
  → 狀態文字：「系統預設聲線」

聲線訓練中（將來）
  → Play button：disabled，顯示「訓練中...」

聲線已就緒（將來）
  → Play button：顯示「播放」，onClick → 呼叫 /api/voice/generate
  → 狀態文字：「以你的聲線播放」

播放中（將來）
  → Play button：顯示「■ 停止」
  → 音頻 <audio> element（hidden）控制播放
```

---

## Provider 選擇（未決定，記錄候選）

| Provider | 優點 | 缺點 |
|----------|------|------|
| ElevenLabs | 粵語支援佳，聲線複製功能 | 收費較高 |
| OpenAI TTS | 簡單，品質穩定 | 粵語支援有限 |
| Google Cloud TTS | 繁中 / 粵語支援完整 | 設定較複雜 |
| Gemini（未來） | 原生整合 | 目前 TTS API 未公開 |

---

## 注意事項

- **現階段 UI 全部 placeholder**：按鈕 onClick 只觸發 Toast，不發任何 API request
- **不寫死 provider**：schema 的 `tts_provider` 欄位為 TEXT，允許將來換 provider
- **API key 安全**：TTS API key 只能在 server-side（`/api/voice/*` routes），絕不 expose 到前端
- **粵語優先**：默認 `language = 'zh-HK'`，用戶可在設定頁更改
