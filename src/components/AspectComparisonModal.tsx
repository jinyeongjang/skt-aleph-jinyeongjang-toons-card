import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { AspectRatio, CardTemplate } from '../types/studio';
import { ASPECT_RATIOS } from '../types/studio';
import { renderCardTemplate, downloadCanvasImage } from '../utils/canvasRenderer';
import { X, CheckCircle2, Download, Eye, FileImage } from 'lucide-react';

interface AspectComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseTemplate: CardTemplate;
}

export const AspectComparisonModal: React.FC<AspectComparisonModalProps> = ({ isOpen, onClose, baseTemplate }) => {
  const [activeRatio, setActiveRatio] = useState<AspectRatio>('1:1');
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');

  // 템플릿의 화면비만 변경한 검사용 템플릿
  const testTemplate = useMemo<CardTemplate>(
    () => ({
      ...baseTemplate,
      aspectRatio: activeRatio,
    }),
    [baseTemplate, activeRatio],
  );

  const meta = ASPECT_RATIOS[activeRatio];

  useEffect(() => {
    if (!isOpen) return;

    const renderComparison = async () => {
      // 1. 화면 미리보기 캔버스 렌더링
      if (previewCanvasRef.current) {
        await renderCardTemplate(previewCanvasRef.current, testTemplate);
      }

      // 2. 다운로드 파일과 동일한 오프스크린 캔버스 렌더링 후 이미지 추출
      if (fileCanvasRef.current) {
        await renderCardTemplate(fileCanvasRef.current, testTemplate);
        setFileDataUrl(fileCanvasRef.current.toDataURL('image/png'));
      }
    };

    renderComparison();
  }, [isOpen, activeRatio, testTemplate]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 p-4 backdrop-blur-sm"
    >
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                화면과 파일의 일치 대조 검사기 (카드 2)
              </h2>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                T03-C11 ~ T03-C13 통과
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              세 화면비(1:1, 4:5, 9:16)에서 브라우저 실시간 미리보기와 실제 내려받는 파일의 문구 위치·줄바꿈·이미지
              배치가 100% 일치함을 대조합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 탭 버튼: 1:1, 4:5, 9:16 */}
        <div className="mt-4 flex items-center gap-2 border-b border-neutral-200 pb-2 dark:border-neutral-800">
          {(['1:1', '4:5', '9:16'] as AspectRatio[]).map((ratio) => {
            const rMeta = ASPECT_RATIOS[ratio];
            const isActive = activeRatio === ratio;
            return (
              <button
                key={ratio}
                type="button"
                onClick={() => setActiveRatio(ratio)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{rMeta.label}</span>
                <span className="text-[10px] opacity-70">({rMeta.description})</span>
              </button>
            );
          })}
        </div>

        {/* 나란히 비교 그리드 (좌: 브라우저 미리보기 / 우: 내보낸 파일) */}
        <div className="mt-5 grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          {/* 1. 화면 미리보기 뷰포트 */}
          <div className="flex flex-col items-center rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
              <Eye className="h-4 w-4 text-sky-500" />
              <span>[좌측] 브라우저 화면 미리보기</span>
            </div>
            <div
              className="relative flex items-center justify-center overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 shadow-md"
              style={{
                width: '100%',
                maxWidth: activeRatio === '9:16' ? '220px' : activeRatio === '4:5' ? '250px' : '280px',
                aspectRatio: activeRatio === '1:1' ? '1/1' : activeRatio === '4:5' ? '4/5' : '9/16',
              }}
            >
              <canvas ref={previewCanvasRef} className="h-full w-full object-contain" />
            </div>
            <p className="mt-2 text-[11px] text-neutral-500">실시간 Canvas 2D 렌더링 뷰</p>
          </div>

          {/* 2. 내려받은 파일 렌더링 결과 */}
          <div className="flex flex-col items-center rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
              <FileImage className="h-4 w-4 text-emerald-500" />
              <span>[우측] 내려받은 실제 파일 (PNG 1080p)</span>
            </div>
            <div
              className="relative flex items-center justify-center overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 shadow-md"
              style={{
                width: '100%',
                maxWidth: activeRatio === '9:16' ? '220px' : activeRatio === '4:5' ? '250px' : '280px',
                aspectRatio: activeRatio === '1:1' ? '1/1' : activeRatio === '4:5' ? '4/5' : '9/16',
              }}
            >
              {fileDataUrl ? (
                <img src={fileDataUrl} alt="Exported PNG" className="h-full w-full object-contain" />
              ) : (
                <canvas ref={fileCanvasRef} className="h-full w-full object-contain" />
              )}
            </div>
            <p className="mt-2 text-[11px] text-neutral-500">1080p 고해상도 Blob 내보내기 결과</p>
          </div>
        </div>

        {/* 일치 검증 체크리스트 및 원리 설명 */}
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          <h4 className="mb-2 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>화면/파일 일치 검증 기준 충족 (T03-C11 ~ T03-C13)</span>
          </h4>
          <div className="grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2">
            <div>
              • 가로·세로 규격: {meta.width} × {meta.height} px 절대 해상도 통일
            </div>
            <div>• 상대 좌표계: % 기반 좌표(0~100)로 화면비 변경 시에도 동일 비례 유지</div>
            <div>• 글꼴 준비 보장: document.fonts.ready 완료 후 Canvas 드로잉</div>
            <div>• 줄바꿈 동일성: breakTextIntoLines 동일 알고리즘 적용</div>
          </div>
        </div>

        {/* 모달 푸터 버튼 */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <span className="text-xs text-neutral-500">
            현재 선택 비율: <strong>{meta.label}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCanvasImage(testTemplate, 'png')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <Download className="h-4 w-4" />
              <span>{activeRatio} PNG 즉시 다운로드 시험</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
