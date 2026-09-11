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
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-neutral-200/80 bg-white transition-colors dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-lg p-1">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 6 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 text-white shadow-md shadow-indigo-500/20"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-tight text-neutral-900 sm:text-base dark:text-white">
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
          <div className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 font-bold text-white shadow-xs dark:bg-white dark:text-neutral-950">
            <Sliders className="h-3.5 w-3.5 text-indigo-400 dark:text-indigo-600" />
            <span>편집기</span>
          </div>

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenAspectModal}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:hover:text-white"
          >
            <Columns className="h-3.5 w-3.5 text-sky-500" />
            <span>화면비 비교</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenTemplateModal}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:hover:text-white"
          >
            <FolderOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span>템플릿 보관함</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenGalleryModal}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:hover:text-white"
          >
            <ImageIcon className="h-3.5 w-3.5 text-purple-500" />
            <span>예시 갤러리</span>
          </motion.button>
        </nav>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Reset */}
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

          {/* Dark / Light Toggle */}
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
