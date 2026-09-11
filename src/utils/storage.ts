import type { CardTemplate, TemplateImportResult } from '../types/studio';
import { SAMPLE_IMG_MEME_1X1, SAMPLE_IMG_QUOTE_4X5, SAMPLE_IMG_STORY_9X16 } from './sampleImages';

const STORAGE_KEY_TEMPLATES = 'TOONSCARD_STUDIO_TEMPLATES_V1';
const STORAGE_KEY_ACTIVE_TEMPLATE = 'TOONSCARD_STUDIO_ACTIVE_TEMPLATE_V1';

/**
 * 기본 제공 사전 템플릿 3종 (안정된 ID 부여)
 */
export const DEFAULT_BUILTIN_TEMPLATES: CardTemplate[] = [
  {
    id: 'builtin-tpl-meme-1x1',
    name: '💻 개발자의 버그 밈 (1:1)',
    aspectRatio: '1:1',
    imageUrl: SAMPLE_IMG_MEME_1X1,
    imageFit: 'cover',
    backgroundColor: '#111827',
    createdAt: 1773300000001,
    updatedAt: 1773300000001,
    isCustom: false,
    textLayers: [
      {
        id: 'layer-top-1',
        text: '이게 왜 돌아가지? 🤔',
        fontSize: 52,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 6,
        bgColor: 'rgba(0, 0, 0, 0.65)',
        align: 'center',
        posX: 50,
        posY: 14,
        presetPosition: 'top',
        fontFamily: 'Pretendard, sans-serif',
        isBold: true,
        shadow: true,
      },
      {
        id: 'layer-bot-1',
        text: '건드리지 마세요. 배포 완료되었어요. 🔥',
        fontSize: 48,
        color: '#facc15',
        strokeColor: '#000000',
        strokeWidth: 5,
        bgColor: 'rgba(0, 0, 0, 0.75)',
        align: 'center',
        posX: 50,
        posY: 86,
        presetPosition: 'bottom',
        fontFamily: 'Pretendard, sans-serif',
        isBold: true,
        shadow: true,
      },
    ],
  },
  {
    id: 'builtin-tpl-quote-4x5',
    name: '🌌 2026 주니어 개발 명언 (4:5)',
    aspectRatio: '4:5',
    imageUrl: SAMPLE_IMG_QUOTE_4X5,
    imageFit: 'cover',
    backgroundColor: '#0f172a',
    createdAt: 1773300000002,
    updatedAt: 1773300000002,
    isCustom: false,
    textLayers: [
      {
        id: 'layer-quote-mid',
        text: '“완벽함보다 완료가 낫다” ✨\n\n일단 동작하게 만들고,\n그 다음 우아하게 리팩토링하라.',
        fontSize: 52,
        color: '#f8fafc',
        strokeColor: '#0f172a',
        strokeWidth: 4,
        bgColor: 'rgba(15, 23, 42, 0.7)',
        align: 'center',
        posX: 50,
        posY: 50,
        presetPosition: 'middle',
        fontFamily: 'Pretendard, sans-serif',
        isBold: true,
        shadow: true,
      },
    ],
  },
  {
    id: 'builtin-tpl-story-9x16',
    name: '⚡ AI 풀스택 엔지니어링 (9:16)',
    aspectRatio: '9:16',
    imageUrl: SAMPLE_IMG_STORY_9X16,
    imageFit: 'cover',
    backgroundColor: '#09090b',
    createdAt: 1773300000003,
    updatedAt: 1773300000003,
    isCustom: false,
    textLayers: [
      {
        id: 'layer-story-mid',
        text: '⚡ 2026 AI 풀스택 핵심 역량\n\n1. 직관적 UI & 경계 해상도 무결점\n2. 예외 처리 & 데이터 손상 자가 복구\n3. AI 도구 비판적 활용 및 책임성',
        fontSize: 54,
        color: '#38bdf8',
        strokeColor: '#000000',
        strokeWidth: 5,
        bgColor: 'rgba(0, 0, 0, 0.8)',
        align: 'center',
        posX: 50,
        posY: 42,
        presetPosition: 'middle',
        fontFamily: 'Pretendard, sans-serif',
        isBold: true,
        shadow: true,
      },
    ],
  },
];

/**
 * 고유하고 안정된 ID 생성기 (T03-C21: 배열 인덱스 사용 금지, 불변 ID 보장)
 */
export const generateStableId = (prefix = 'tpl'): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomStr}`;
};

/**
 * 템플릿 목록 불러오기 (자가 치유 & 무중단 기본값 복구)
 */
export const loadAllTemplates = (): CardTemplate[] => {
  if (typeof window === 'undefined') return [...DEFAULT_BUILTIN_TEMPLATES];

  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEMPLATES);
    if (!raw) {
      // 비어있는 경우 기본 템플릿 저장 후 반환 (T02-C24, T03-C21)
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(DEFAULT_BUILTIN_TEMPLATES));
      return [...DEFAULT_BUILTIN_TEMPLATES];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.warn('저장된 템플릿 형식이 유효하지 않아 기본값으로 복구합니다.');
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(DEFAULT_BUILTIN_TEMPLATES));
      return [...DEFAULT_BUILTIN_TEMPLATES];
    }

    return parsed;
  } catch (err) {
    console.error('로컬스토리지 파싱 실패 - 자가 치유 작동:', err);
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(DEFAULT_BUILTIN_TEMPLATES));
    return [...DEFAULT_BUILTIN_TEMPLATES];
  }
};

/**
 * 템플릿 전체 목록 영구 저장
 */
export const saveAllTemplates = (templates: CardTemplate[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
  } catch (err) {
    console.error('템플릿 저장 실패 (용량 초과 등):', err);
  }
};

/**
 * [T03-C17] 신규 템플릿 생성 (Create)
 */
export const createNewTemplate = (templateData: Omit<CardTemplate, 'id' | 'createdAt' | 'updatedAt'>): CardTemplate => {
  const all = loadAllTemplates();
  const now = Date.now();
  const newTemplate: CardTemplate = {
    ...templateData,
    id: generateStableId('custom_tpl'),
    createdAt: now,
    updatedAt: now,
    isCustom: true,
  };

  const updatedList = [newTemplate, ...all];
  saveAllTemplates(updatedList);
  return newTemplate;
};

/**
 * [T03-C19] 기존 템플릿 수정 (Update) - 고유 ID 매칭
 */
export const updateTemplateById = (id: string, updates: Partial<CardTemplate>): CardTemplate | null => {
  const all = loadAllTemplates();
  const targetIndex = all.findIndex((t) => t.id === id);

  if (targetIndex === -1) {
    console.warn(`수정 대상 템플릿(ID: ${id})을 찾을 수 없습니다.`);
    return null;
  }

  const updated: CardTemplate = {
    ...all[targetIndex],
    ...updates,
    id, // ID 불변 보장
    updatedAt: Date.now(),
    isCustom: true,
  };

  all[targetIndex] = updated;
  saveAllTemplates(all);
  return updated;
};

/**
 * [T03-C20] 템플릿 삭제 (Delete) - 고유 ID 매칭
 */
export const deleteTemplateById = (id: string): boolean => {
  const all = loadAllTemplates();
  const filtered = all.filter((t) => t.id !== id);

  if (filtered.length === all.length) {
    return false; // 삭제 대상 없음
  }

  saveAllTemplates(filtered);
  return true;
};

/**
 * 현재 활성 템플릿 저장 & 로드
 */
export const loadActiveTemplate = (): CardTemplate => {
  if (typeof window === 'undefined') return DEFAULT_BUILTIN_TEMPLATES[0];

  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_TEMPLATE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.aspectRatio && Array.isArray(parsed.textLayers)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  const all = loadAllTemplates();
  return all[0] || DEFAULT_BUILTIN_TEMPLATES[0];
};

export const saveActiveTemplate = (template: CardTemplate): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_TEMPLATE, JSON.stringify(template));
  } catch {
    // ignore
  }
};

/**
 * [T03-C22, T03-C23, T03-C24] JSON 가져오기 검증 및 복원 엔진
 * - 문법 오류나 필수 항목 누락 시 기존 데이터 절대 변경 없음 (T03-C23, T03-C24)
 */
export const validateAndParseTemplateJson = (jsonString: string): TemplateImportResult => {
  // 1단계: 문법 검증 (T03-C23: 문법이 손상된 JSON 거부)
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (syntaxErr) {
    return {
      success: false,
      errorType: 'syntax',
      errorMessage: `JSON 문법 오류(SyntaxError): 따옴표, 괄호 등 JSON 구문이 손상되었습니다. (${String(syntaxErr)})`,
    };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return {
      success: false,
      errorType: 'schema',
      errorMessage: '유효성 검증 실패: JSON 루트 데이터는 객체({})여야 합니다.',
    };
  }

  const obj = parsed as Record<string, unknown>;

  // 2단계: 필수 항목 스키마 검증 (T03-C24: 필수 항목이 빠진 JSON 거부)
  const missingFields: string[] = [];

  if (!obj.name || typeof obj.name !== 'string' || obj.name.trim() === '') {
    missingFields.push('name (템플릿 이름)');
  }

  const validRatios = ['1:1', '4:5', '9:16'];
  if (!obj.aspectRatio || !validRatios.includes(String(obj.aspectRatio))) {
    missingFields.push('aspectRatio (1:1, 4:5, 9:16 중 하나)');
  }

  if (!obj.textLayers || !Array.isArray(obj.textLayers)) {
    missingFields.push('textLayers (텍스트 레이어 배열)');
  }

  if (missingFields.length > 0) {
    return {
      success: false,
      errorType: 'schema',
      errorMessage: `필수 항목 누락(SchemaError): 다음 필수 필드가 누락되었거나 유효하지 않습니다 -> [${missingFields.join(', ')}]`,
    };
  }

  // 3단계: 텍스트 레이어 내부 유효성 정규화
  const rawLayers = obj.textLayers as unknown[];
  const normalizedLayers = rawLayers.map((l, idx) => {
    const layerObj = (typeof l === 'object' && l !== null ? l : {}) as Record<string, unknown>;
    return {
      id: typeof layerObj.id === 'string' ? layerObj.id : `layer_${idx + 1}`,
      text: typeof layerObj.text === 'string' ? layerObj.text : '',
      fontSize: typeof layerObj.fontSize === 'number' ? layerObj.fontSize : 48,
      color: typeof layerObj.color === 'string' ? layerObj.color : '#ffffff',
      strokeColor: typeof layerObj.strokeColor === 'string' ? layerObj.strokeColor : '#000000',
      strokeWidth: typeof layerObj.strokeWidth === 'number' ? layerObj.strokeWidth : 4,
      bgColor: typeof layerObj.bgColor === 'string' ? layerObj.bgColor : 'transparent',
      align: ['left', 'center', 'right'].includes(String(layerObj.align))
        ? (layerObj.align as 'left' | 'center' | 'right')
        : 'center',
      posX: typeof layerObj.posX === 'number' ? layerObj.posX : 50,
      posY: typeof layerObj.posY === 'number' ? layerObj.posY : 50,
      presetPosition: ['top', 'middle', 'bottom', 'custom'].includes(String(layerObj.presetPosition))
        ? (layerObj.presetPosition as 'top' | 'middle' | 'bottom' | 'custom')
        : 'custom',
      fontFamily: typeof layerObj.fontFamily === 'string' ? layerObj.fontFamily : 'Pretendard, sans-serif',
      isBold: typeof layerObj.isBold === 'boolean' ? layerObj.isBold : true,
      shadow: typeof layerObj.shadow === 'boolean' ? layerObj.shadow : true,
    };
  });

  const now = Date.now();
  const normalizedTemplate: CardTemplate = {
    id: typeof obj.id === 'string' && obj.id ? obj.id : generateStableId('imported'),
    name: String(obj.name),
    aspectRatio: obj.aspectRatio as '1:1' | '4:5' | '9:16',
    imageUrl: typeof obj.imageUrl === 'string' ? obj.imageUrl : '',
    imageFit: ['cover', 'contain', 'fill'].includes(String(obj.imageFit))
      ? (obj.imageFit as 'cover' | 'contain' | 'fill')
      : 'cover',
    backgroundColor: typeof obj.backgroundColor === 'string' ? obj.backgroundColor : '#111827',
    textLayers: normalizedLayers,
    createdAt: typeof obj.createdAt === 'number' ? obj.createdAt : now,
    updatedAt: now,
    isCustom: true,
  };

  return {
    success: true,
    errorType: 'none',
    template: normalizedTemplate,
  };
};

/**
 * 템플릿을 JSON 파일로 다운로드
 */
export const downloadTemplateAsJson = (template: CardTemplate): void => {
  const jsonString = JSON.stringify(template, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `template_${template.name.replace(/[^a-zA-Z0-9가-힣_-]/g, '_')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
