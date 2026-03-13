export type ToneLevel = 0 | 1 | 2 | 3;

export type Industry = 'retail' | 'fitness' | 'beauty' | 'fnb' | 'general';

export type UseCase = 'facebook_post' | 'instagram_post' | 'xhs' | 'video_script' | 'edm' | 'ad_copy' | 'whatsapp_broadcast' | 'image_prompt';

export interface GenerateRequest {
  brandName: string;
  productDescription: string;
  targetAudience?: string;
  industry: Industry;
  keyBenefits?: string[];
  toneLevel?: number;
  contentType: UseCase;
}

export interface GenerateResponse {
  id?: string; // 加入 ID 方便歷史紀錄操作
  type: string;
  mainContent: string;
  variants: string[];
  hashtags: string[];
  error?: string;
}

// --- SME Workflow #1: 每週社交媒體內容助手 ---

export interface WeeklyContentRequest {
  businessType: string;       // 行業／店舖類型
  platforms: string;          // 目標平台 (e.g. IG、Facebook、小紅書)
  weeklyFocus: string;        // 本週推廣重點
  targetAudience: string;     // 目標受眾
  brandDescription: string;   // 品牌描述
  tone: string;               // 語氣風格 (e.g. 輕鬆搞笑、專業可信、溫暖貼地)
  languageStyle: string;      // 語言風格 (e.g. 香港粵語口語＋繁體中文、台灣用語)
}

export interface WeeklyPost {
  day: number;                // 1–7
  theme: string;              // 貼文主題／角度
  content: string;            // 完整貼文內文
  visualConcept: string;      // 建議圖片或短影片概念
  hashtags: string[];         // Hashtag 建議 (3–8 個)
}

export interface WeeklyContentResponse {
  id?: string;
  weeklyPlan: WeeklyPost[];
  error?: string;
}
