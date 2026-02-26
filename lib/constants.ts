import { UseCase, ToneLevel } from './types';

export const USE_CASES: { label: string; value: UseCase }[] = [
  { label: 'Facebook 貼文', value: 'facebook_post' },
  { label: '短影片腳本 (Shorts/Reels)', value: 'video_script' },
  { label: 'EDM 郵件內容', value: 'edm' },
  { label: '廣告文案 (Ad Copy)', value: 'ad_copy' },
  { label: 'WhatsApp 廣播訊息', value: 'whatsapp_broadcast' },
];

export const TONE_LEVELS: { label: string; value: ToneLevel; description: string }[] = [
  { label: '超貼地 (0)', value: 0, description: '好似老友吹水咁，多潮流用語' },
  { label: '輕鬆 (1)', value: 1, description: '幽默親切，適合一般社交媒體' },
  { label: '專業 (2)', value: 2, description: '大方得體但唔死板' },
  { label: '正式 (3)', value: 3, description: '偏向官方口吻，但仲係廣東話' },
];
