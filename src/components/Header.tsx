import React from 'react';
import { Sparkles, Sliders, Columns, FolderOpen, Image as ImageIcon, Sun, Moon, RotateCcw } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  onResetToDefault: () => void;
  onOpenAspectModal: () => void;
  onOpenTemplateModal: () => void;
  onOpenGalleryModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleDark,
  onResetToDefault,
  onOpenAspectModal,
  onOpenTemplateModal,
  onOpenGalleryModal,
}) => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-900/90">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-lg p-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-sky-500 to-emerald-400 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
                  ToonsCard jinyeongjang Studio
                </span>
              </div>
              <p className="hidden text-[11px] text-neutral-500 sm:block dark:text-neutral-400">
                밈·카드·SNS 이미지 제작 스튜디오
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="hidden items-center gap-1.5 text-xs font-medium lg:flex">
          <div className="flex items-center gap-1.5 rounded-lg bg-indigo-50/80 px-3 py-1.5 font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Sliders className="h-3.5 w-3.5 text-indigo-500" />
            <span>편집기</span>
          </div>

          <button
            type="button"
            onClick={onOpenAspectModal}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
          >
            <Columns className="h-3.5 w-3.5 text-sky-500" />
            <span>화면비 비교</span>
          </button>

          <button
            type="button"
            onClick={onOpenTemplateModal}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
          >
            <FolderOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span>템플릿 보관함</span>
          </button>

          <button
            type="button"
            onClick={onOpenGalleryModal}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-white"
          >
            <ImageIcon className="h-3.5 w-3.5 text-purple-500" />
            <span>예시 갤러리</span>
          </button>
        </nav>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Reset */}
          <button
            type="button"
            onClick={onResetToDefault}
            className="cursor-pointer rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            title="기본 템플릿으로 초기화"
            aria-label="기본 템플릿으로 초기화"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={onToggleDark}
            className="cursor-pointer rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
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
