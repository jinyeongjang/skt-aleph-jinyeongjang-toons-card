import React from 'react';
import type { CardTemplate } from '../types/studio';
import { JsonAndSafetySection } from './JsonAndSafetySection';
import { X, ShieldCheck } from 'lucide-react';

interface JsonAndSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: CardTemplate) => void;
}

export const JsonAndSafetyModal: React.FC<JsonAndSafetyModalProps> = ({ isOpen, onClose, onApplyTemplate }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 p-4"
    >
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* 모달 상단 닫기 헤더 */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                  JSON 복원·완성본 쇼케이스 & 보안 감사 (카드 5)
                </h2>
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
                  T03-C22 ~ T03-C32
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                JSON 3종 유효성 시험, 완성 이미지 3종 라이선스 표기 및 EXIF 위치정보/개인정보 0건 감사
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="mt-4">
          <JsonAndSafetySection onApplyTemplate={onApplyTemplate} />
        </div>

        {/* 푸터 */}
        <div className="mt-6 flex justify-end border-t border-neutral-200 pt-4 dark:border-neutral-800">
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
  );
};
