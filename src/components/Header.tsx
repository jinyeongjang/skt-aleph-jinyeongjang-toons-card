import React from 'react';
import {
  Sparkles,
  Sliders,
  Columns,
  TestTube2,
  FolderOpen,
  ShieldCheck,
  FileText,
  Sun,
  Moon,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  onResetToDefault: () => void;
  onOpenAspectModal: () => void;
  onOpenExtremeModal: () => void;
  onOpenTemplateModal: () => void;
  onOpenSafetyModal: () => void;
  onOpenSubmissionModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleDark,
  onResetToDefault,
  onOpenAspectModal,
  onOpenExtremeModal,
  onOpenTemplateModal,
  onOpenSafetyModal,
  onOpenSubmissionModal,
}) => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-900/90">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Logo & Title (무로그인 공개 열람 T03-C01) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg p-1 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
                  ToonsCard Studio
                </span>
                <span className="hidden rounded-md bg-sky-100 px-1.5 py-0.5 text-[11px] font-semibold text-sky-700 sm:inline-block dark:bg-sky-950/80 dark:text-sky-300">
                  과제 3
                </span>
              </div>
              <p className="hidden text-[11px] text-neutral-500 sm:block dark:text-neutral-400">
                짤·카드 스튜디오 | SKT ALEPH 장진영
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Bar (카드별 팝업 모달 다이얼로그) */}
        <nav className="hidden items-center gap-1 text-xs font-medium lg:flex">
          <div className="flex items-center gap-1.5 rounded-lg bg-indigo-50/80 px-3 py-1.5 font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Sliders className="h-3.5 w-3.5 text-indigo-500" />
            <span>편집기 (메인)</span>
          </div>

          <button
            type="button"
            onClick={onOpenAspectModal}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
          >
            <Columns className="h-3.5 w-3.5 text-sky-500" />
            <span>화면비 대조 (카드 2)</span>
          </button>

          <button
            type="button"
            onClick={onOpenExtremeModal}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
          >
            <TestTube2 className="h-3.5 w-3.5 text-amber-500" />
            <span>극단 입력 12건 (카드 3)</span>
          </button>

          <button
            type="button"
            onClick={onOpenTemplateModal}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
          >
            <FolderOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span>템플릿 CRUD (카드 4)</span>
          </button>

          <button
            type="button"
            onClick={onOpenSafetyModal}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
            <span>JSON & 완성본 (카드 5)</span>
          </button>
        </nav>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Submission Modal button */}
          <button
            type="button"
            onClick={onOpenSubmissionModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            title="제출 규격 양식 (T03-C31, T03-C32)"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">제출 양식</span>
          </button>

          {/* Quick Reset */}
          <button
            type="button"
            onClick={onResetToDefault}
            className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            title="기본 템플릿으로 초기화"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={onToggleDark}
            className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-sky-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};
