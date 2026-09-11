import React from 'react';
import type { CardTemplate } from '../types/studio';
import { FINISHED_WORKS } from '../utils/finishedWorks';
import { downloadCanvasImage } from '../utils/canvasRenderer';
import { X, Image as ImageIcon, Download, ArrowRight, ShieldCheck } from 'lucide-react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (template: CardTemplate) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, onLoadTemplate }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 p-4 backdrop-blur-sm"
    >
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">예시 갤러리</h2>
              <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
                1080p 고해상도 완성작
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              세 가지 화면비(1:1, 4:5, 9:16)로 완성된 카드 예시입니다. 클릭하여 바로 편집기에 불러오거나 다운로드할 수
              있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 갤러리 그리드 */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {FINISHED_WORKS.map((work) => (
            <div
              key={work.id}
              className="flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:border-purple-400 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:border-purple-500"
            >
              <div>
                {/* 미리보기 이미지 */}
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-neutral-950 p-2">
                  <img
                    src={work.previewUrl}
                    alt={work.title}
                    className="max-h-full max-w-full rounded-lg object-contain shadow-md"
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-neutral-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                    {work.aspectRatio}
                  </span>
                </div>

                {/* 정보 */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{work.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">{work.description}</p>

                  <div className="mt-3 space-y-1 rounded-lg bg-neutral-50 p-2.5 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                    <div className="flex items-center gap-1 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{work.isSelfCreated ? '직접 창작 카드' : '오픈 라이선스 활용'}</span>
                    </div>
                    <p className="truncate">출처: {work.sourceUrl}</p>
                    <p className="truncate">라이선스: {work.licenseInfo}</p>
                  </div>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex items-center gap-2 border-t border-neutral-100 p-4 dark:border-neutral-700/60">
                <button
                  type="button"
                  onClick={() => {
                    onLoadTemplate(work.template);
                    onClose();
                  }}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-purple-500"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>편집기로 불러오기</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadCanvasImage(work.template, 'png')}
                  className="cursor-pointer rounded-xl border border-neutral-300 p-2 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  title="PNG 다운로드"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <div className="mt-6 flex justify-end border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
