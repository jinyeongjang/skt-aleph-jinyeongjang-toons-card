import { ASPECT_RATIOS, type CardTemplate, type TextLayer } from '../types/studio';

/**
 * 이미지 로더 헬퍼 (Promise 기반)
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`이미지 로드 실패: ${String(err)}`));
    img.src = src;
  });
};

/**
 * 지능형 텍스트 줄바꿈 계산
 * - 한글, 영문 혼합, 공백 없는 긴 단어, 이모지 모두 지원
 * - legacyDefectMode: T03-C15 검증용. 결함 수정 전의 순수 공백 기준 줄바꿈(긴 단어 오버플로우 버그 재현)
 */
export const breakTextIntoLines = (
  ctx: CanvasRenderingContext2D,
  rawText: string,
  maxWidth: number,
  legacyDefectMode = false,
): string[] => {
  if (!rawText) return [''];

  const initialParagraphs = rawText.split('\n');
  const resultLines: string[] = [];

  for (const paragraph of initialParagraphs) {
    if (paragraph.trim() === '') {
      resultLines.push('');
      continue;
    }

    if (legacyDefectMode) {
      // [수정 전 FAIL 결함 알고리즘]
      // 단순 공백(space)으로만 분할 -> 공백 없는 50자 영문이나 긴 한글 문단이 들어오면 줄바꿈되지 않고 캔버스 우측으로 넘쳐 잘림
      const words = paragraph.split(' ');
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          resultLines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        resultLines.push(currentLine);
      }
    } else {
      // [수정 후 PASS 개선 알고리즘]
      // 단어 및 개별 글자(Grapheme) 단위 측정 지원: 단어가 maxWidth를 넘을 경우 글자 단위 강제 분할(break-word)
      let currentLine = '';
      const chars = Array.from(paragraph); // 이모지 및 유니코드 안전 분할

      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const testLine = currentLine + char;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine.length > 0) {
          resultLines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        resultLines.push(currentLine);
      }
    }
  }

  return resultLines;
};

/**
 * 둥근 사각형 그리기 헬퍼
 */
const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

export interface RenderOptions {
  legacyDefectMode?: boolean; // T03-C15 테스트용
  scaleFactor?: number; // 미리보기 화면 축소 렌더링 배율 (1.0 = 원본 1080p 해상도)
}

/**
 * 핵심 카드 렌더링 엔진 (Canvas 2D)
 * - T03-C06 ~ T03-C08: 문구 위치/크기/색 즉시 반영
 * - T03-C11 ~ T03-C13: 1:1, 4:5, 9:16 화면비 및 파일 일치 보장
 * - T03-C28: Canvas 내보내기 시 위치 메타데이터(EXIF) 0건 보장
 */
export const renderCardTemplate = async (
  canvas: HTMLCanvasElement,
  template: CardTemplate,
  options: RenderOptions = {},
): Promise<void> => {
  const meta = ASPECT_RATIOS[template.aspectRatio] || ASPECT_RATIOS['1:1'];
  const targetWidth = meta.width;
  const targetHeight = meta.height;

  // 글꼴 로드 대기 (웹폰트 깜빡임 및 레이아웃 틀어짐 방지)
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // 폰트 로드 실패 시 시스템 글꼴로 즉각 폴백
    }
  }

  // 캔버스 크기 지정
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D 컨텍스트를 생성할 수 없습니다.');

  // 1. 기본 배경색 칠하기
  ctx.fillStyle = template.backgroundColor || '#111827';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // 2. 배경 이미지 렌더링
  if (template.imageUrl) {
    try {
      const img = await loadImage(template.imageUrl);
      const imgWidth = img.naturalWidth || img.width;
      const imgHeight = img.naturalHeight || img.height;

      if (template.imageFit === 'fill') {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      } else if (template.imageFit === 'contain') {
        const scale = Math.min(targetWidth / imgWidth, targetHeight / imgHeight);
        const drawW = imgWidth * scale;
        const drawH = imgHeight * scale;
        const drawX = (targetWidth - drawW) / 2;
        const drawY = (targetHeight - drawH) / 2;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else {
        // 기본 'cover' (중앙 기준 꽉 채우기)
        const scale = Math.max(targetWidth / imgWidth, targetHeight / imgHeight);
        const drawW = imgWidth * scale;
        const drawH = imgHeight * scale;
        const drawX = (targetWidth - drawW) / 2;
        const drawY = (targetHeight - drawH) / 2;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
    } catch (e) {
      console.warn('배경 이미지 로드 실패:', e);
      // 이미지 실패 시 배경색 유지
    }
  }

  // 3. 텍스트 레이어 렌더링
  for (const layer of template.textLayers) {
    renderSingleTextLayer(ctx, layer, targetWidth, targetHeight, options.legacyDefectMode);
  }
};

/**
 * 개별 텍스트 레이어 렌더링 함수
 */
const renderSingleTextLayer = (
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  canvasWidth: number,
  canvasHeight: number,
  legacyDefectMode = false,
) => {
  if (!layer.text || layer.text.trim() === '') return;

  ctx.save();

  // 폰트 설정
  const weight = layer.isBold ? 'bold' : 'normal';
  const fontFamily =
    layer.fontFamily || '-apple-system, BlinkMacSystemFont, "Pretendard", "Segoe UI", Roboto, sans-serif';
  ctx.font = `${weight} ${layer.fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'middle';

  // 가로 여백 (양옆 60px 안전영역)
  const marginX = 60;
  const maxWidth = canvasWidth - marginX * 2;

  // 줄바꿈 계산
  const lines = breakTextIntoLines(ctx, layer.text, maxWidth, legacyDefectMode);
  const lineHeight = layer.fontSize * 1.35;
  const totalBlockHeight = lines.length * lineHeight;

  // Y 좌표 계산 (퍼센트 기준)
  let baseY = (canvasHeight * layer.posY) / 100;
  if (layer.presetPosition === 'top') {
    baseY = 120 + totalBlockHeight / 2;
  } else if (layer.presetPosition === 'middle') {
    baseY = canvasHeight / 2;
  } else if (layer.presetPosition === 'bottom') {
    baseY = canvasHeight - 120 - totalBlockHeight / 2;
  }

  // X 좌표 계산 (퍼센트 기준)
  let baseX = (canvasWidth * layer.posX) / 100;
  if (layer.align === 'center') {
    baseX = canvasWidth / 2;
    ctx.textAlign = 'center';
  } else if (layer.align === 'left') {
    baseX = marginX;
    ctx.textAlign = 'left';
  } else if (layer.align === 'right') {
    baseX = canvasWidth - marginX;
    ctx.textAlign = 'right';
  }

  // 배경 박스 (하이라이트 배지) 처리
  if (layer.bgColor && layer.bgColor !== 'transparent') {
    const padX = layer.fontSize * 0.35;
    const padY = layer.fontSize * 0.2;

    lines.forEach((line, idx) => {
      const lineY = baseY - totalBlockHeight / 2 + idx * lineHeight + lineHeight / 2;
      const textMetrics = ctx.measureText(line);
      const textW = textMetrics.width;

      let boxX = baseX - padX;
      if (layer.align === 'center') {
        boxX = baseX - textW / 2 - padX;
      } else if (layer.align === 'right') {
        boxX = baseX - textW - padX;
      }

      const boxY = lineY - lineHeight / 2 + padY / 2;
      const boxW = textW + padX * 2;
      const boxH = lineHeight - padY;

      ctx.fillStyle = layer.bgColor;
      drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 8);
      ctx.fill();
    });
  }

  // 그림자 설정
  if (layer.shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 4;
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // 글자 그리기 (외곽선 -> 본문)
  lines.forEach((line, idx) => {
    const lineY = baseY - totalBlockHeight / 2 + idx * lineHeight + lineHeight / 2;

    // 외곽선 (Stroke)
    if (layer.strokeWidth > 0 && layer.strokeColor) {
      ctx.strokeStyle = layer.strokeColor;
      ctx.lineWidth = layer.strokeWidth * 2;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(line, baseX, lineY);
    }

    // 본문 채우기 (Fill)
    ctx.fillStyle = layer.color;
    ctx.fillText(line, baseX, lineY);
  });

  ctx.restore();
};

/**
 * 캔버스 이미지를 다운로드 파일로 저장
 * - format: 'png' | 'jpeg'
 * - EXIF 메타데이터 100% 제거된 순수 픽셀 데이터 파일로 추출 (T03-C28)
 */
export const downloadCanvasImage = async (
  template: CardTemplate,
  format: 'png' | 'jpeg' = 'png',
  filename?: string,
): Promise<void> => {
  const exportCanvas = document.createElement('canvas');
  await renderCardTemplate(exportCanvas, template);

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? 'jpg' : 'png';
  const defaultName = `${template.name.replace(/[^a-zA-Z0-9가-힣_-]/g, '_')}_${template.aspectRatio.replace(':', '_')}.${extension}`;
  const finalFilename = filename || defaultName;

  exportCanvas.toBlob(
    (blob) => {
      if (!blob) {
        console.error('Blob 생성 실패');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    mimeType,
    0.95,
  );
};
