export type ToneLevel = 0 | 1 | 2 | 3;

export type UseCase = 'facebook_post' | 'video_script' | 'edm' | 'ad_copy' | 'whatsapp_broadcast';

export interface GenerateRequest {
  brandName: string;
  productDescription: string;
  targetAudience?: string;
  keyBenefits?: string[];
  toneLevel?: number;
  contentType: string;
}

export interface GenerateResponse {
  type: string;
  mainContent: string;
  variants: string[];
  hashtags: string[];
  error?: string;
}
