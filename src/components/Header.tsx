import React from 'react';
import { Sparkles, Sliders, Columns, FolderOpen, Image as ImageIcon, Sun, Moon, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-neutral-200/80 bg-white shadow-2xs transition-colors dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* 1. 로고 & 브랜드 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 6 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-sky-500 to-emerald-400 text-white shadow-md shadow-indigo-500/20"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-tight text-neutral-900 sm:text-base dark:text-white">
                  ToonsCard
                </span>
                <span className="hidden text-xs font-semibold text-neutral-400 sm:inline dark:text-neutral-500">|</span>
                <span className="hidden text-xs font-semibold text-neutral-600 sm:inline dark:text-neutral-300">
                  jinyeongjang Studio
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] font-medium text-neutral-500 sm:text-[11px] dark:text-neutral-400">
                  짤·카드 제작 스튜디오
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 네비게이션 바 (반응형: 대화면 텍스트+아이콘, 소화면 아이콘) */}
        <nav className="flex items-center gap-1 text-xs font-medium sm:gap-1.5">
          {/* 활성 편집기 표시 */}
          <div className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-1.5 font-bold text-white shadow-xs dark:bg-white dark:text-neutral-950">
            <Sliders className="h-3.5 w-3.5 text-indigo-400 dark:text-indigo-600" />
            <span className="hidden md:inline">편집기</span>
          </div>

          {/* 화면비 비교 */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onOpenAspectModal}
            className="group flex cursor-pointer items-center gap-1.5 rounded-xl border border-transparent px-2.5 py-1.5 text-neutral-600 transition-all hover:border-neutral-200/80 hover:bg-neutral-100 hover:text-neutral-900 hover:underline sm:px-3 dark:text-neutral-400 dark:hover:border-neutral-700/60 dark:hover:bg-neutral-800 dark:hover:text-white"
            title="세 화면비(1:1, 4:5, 9:16) 비교 검사기"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-400 dark:group-hover:bg-sky-900/60">
              <Columns className="h-3.5 w-3.5" />
            </span>
            <span className="hidden md:inline">화면비 비교</span>
          </motion.button>

          {/* 템플릿 보관함 */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onOpenTemplateModal}
            className="group flex cursor-pointer items-center gap-1.5 rounded-xl border border-transparent px-2.5 py-1.5 text-neutral-600 transition-all hover:border-neutral-200/80 hover:bg-neutral-100 hover:text-neutral-900 hover:underline sm:px-3 dark:text-neutral-400 dark:hover:border-neutral-700/60 dark:hover:bg-neutral-800 dark:hover:text-white"
            title="저장된 템플릿 목록 관리 (CRUD & JSON)"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:group-hover:bg-emerald-900/60">
              <FolderOpen className="h-3.5 w-3.5" />
            </span>
            <span className="hidden md:inline">템플릿 보관함</span>
          </motion.button>

          {/* 예시 갤러리 */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onOpenGalleryModal}
            className="group flex cursor-pointer items-center gap-1.5 rounded-xl border border-transparent px-2.5 py-1.5 text-neutral-600 transition-all hover:border-neutral-200/80 hover:bg-neutral-100 hover:text-neutral-900 hover:underline sm:px-3 dark:text-neutral-400 dark:hover:border-neutral-700/60 dark:hover:bg-neutral-800 dark:hover:text-white"
            title="1080p 고화질 예시 갤러리"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400 dark:group-hover:bg-purple-900/60">
              <ImageIcon className="h-3.5 w-3.5" />
            </span>
            <span className="hidden md:inline">예시 갤러리</span>
          </motion.button>
        </nav>

        {/* 우측 유틸리티 버튼 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 빠른 초기화 */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, rotate: -180 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={onResetToDefault}
            className="cursor-pointer rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-2 text-neutral-600 shadow-xs transition-colors hover:border-neutral-300 hover:bg-white hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-700/80 dark:hover:text-white"
            title="기본 템플릿으로 초기화"
            aria-label="기본 템플릿으로 초기화"
          >
            <RotateCcw className="h-4 w-4" />
          </motion.button>

          {/* 다크 / 라이트 모드 토글 */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleDark}
            className="cursor-pointer rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-2 text-neutral-600 shadow-xs transition-colors hover:border-neutral-300 hover:bg-white hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-700/80 dark:hover:text-white"
            title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            <motion.div
              key={isDark ? 'dark' : 'light'}
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-sky-500" />}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
