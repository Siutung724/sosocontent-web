export type ToneLevel = 0 | 1 | 2 | 3;

export type UseCase = 'facebook_post' | 'video_script' | 'edm' | 'ad_copy' | 'whatsapp_broadcast';

export interface GenerateRequest {
  brandName: string;
  productDescription: string;
  targetAudience: string;
  toneLevel: ToneLevel;
  useCase: UseCase;
}

export interface GenerateResponse {
  content: string;
  meta: {
    useCase: UseCase;
    language: string;
    timestamp: string;
  };
  error?: string;
}
