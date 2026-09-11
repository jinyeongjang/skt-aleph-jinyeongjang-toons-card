/**
 * 과제 3: 짤·카드 스튜디오 (ToonsCard Studio) 타입 정의
 * 조건 이미지 condi 3-1 ~ condi 3-6 및 평가 기준 T03-C01 ~ T03-C32 준수
 */

export type AspectRatio = '1:1' | '4:5' | '9:16';

export interface AspectRatioMeta {
  ratio: AspectRatio;
  label: string;
  width: number;
  height: number;
  description: string;
  recommendedFor: string;
}

export const ASPECT_RATIOS: Record<AspectRatio, AspectRatioMeta> = {
  '1:1': {
    ratio: '1:1',
    label: '1:1 정사각형',
    width: 1080,
    height: 1080,
    description: '1080 × 1080 px',
    recommendedFor: '인스타그램 피드, 트위터/X, 커뮤니티 밈 카드',
  },
  '4:5': {
    ratio: '4:5',
    label: '4:5 세로 피드',
    width: 1080,
    height: 1350,
    description: '1080 × 1350 px',
    recommendedFor: '인스타그램 세로 피드, 카드뉴스, 정보 요약 카드',
  },
  '9:16': {
    ratio: '9:16',
    label: '9:16 숏폼/스토리',
    width: 1080,
    height: 1920,
    description: '1080 × 1920 px',
    recommendedFor: '인스타 스토리, 유튜브 쇼츠, 틱톡 세로 썸네일',
  },
};

export type TextPositionPreset = 'top' | 'middle' | 'bottom' | 'custom';
export type TextAlign = 'left' | 'center' | 'right';

export interface TextLayer {
  id: string;
  text: string;
  fontSize: number; // in pixels relative to 1080px base
  color: string;
  strokeColor: string;
  strokeWidth: number; // 0 to 12
  bgColor: string; // 'transparent' or rgba/hex
  align: TextAlign;
  posX: number; // 0 to 100 (%)
  posY: number; // 0 to 100 (%)
  presetPosition: TextPositionPreset;
  fontFamily: string;
  isBold: boolean;
  shadow: boolean;
}

export type ImageFitMode = 'cover' | 'contain' | 'fill';

export interface CardTemplate {
  id: string;
  name: string;
  aspectRatio: AspectRatio;
  imageUrl: string;
  imageFit: ImageFitMode;
  backgroundColor: string;
  textLayers: TextLayer[];
  createdAt: number;
  updatedAt: number;
  isCustom?: boolean;
}

export interface FinishedWork {
  id: string;
  title: string;
  aspectRatio: AspectRatio;
  description: string;
  previewUrl: string;
  isSelfCreated: boolean;
  sourceUrl?: string;
  licenseInfo: string;
  metadataClean: boolean;
  template: CardTemplate;
}

export interface ExtremeTestCase {
  id: number;
  name: string;
  category: '문자열' | '줄바꿈' | '이미지' | '보안' | '경계값';
  description: string;
  payload: {
    text?: string;
    imageType?: 'transparent' | 'wide' | 'tall' | 'micro';
    fontSize?: number;
  };
  expectedBehavior: string;
  statusBefore: 'FAIL' | 'PASS';
  statusAfter: 'PASS';
  defectSummary?: string;
}

export interface TemplateImportResult {
  success: boolean;
  errorType?: 'syntax' | 'schema' | 'none';
  errorMessage?: string;
  template?: CardTemplate;
}
