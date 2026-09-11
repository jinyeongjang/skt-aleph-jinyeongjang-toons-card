import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { StudioEditor } from './components/StudioEditor';
import { AspectComparisonModal } from './components/AspectComparisonModal';
import { TemplateManagerModal } from './components/TemplateManagerModal';
import { GalleryModal } from './components/GalleryModal';
import { Footer } from './components/Footer';
import type { CardTemplate } from './types/studio';
import { loadActiveTemplate, saveActiveTemplate, createNewTemplate, DEFAULT_BUILTIN_TEMPLATES } from './utils/storage';

export const App: React.FC = () => {
  // 현재 활성 편집 템플릿
  const [currentTemplate, setCurrentTemplate] = useState<CardTemplate>(() => {
    return loadActiveTemplate();
  });

  // 다크 모드 상태
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('THEME_MODE');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // 모달 상태들 (스튜디오 지원 유틸리티)
  const [showAspectModal, setShowAspectModal] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);

  // 다크 모드 클래스 반영
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('THEME_MODE', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('THEME_MODE', 'light');
    }
  }, [isDark]);

  // 템플릿 변경 처리: React 상태 즉시 반영
  const handleChangeTemplate = useCallback((updated: CardTemplate) => {
    setCurrentTemplate(updated);
  }, []);

  // 로컬스토리지 동기화 디바운스 (빠른 타이핑 시 동기 I/O 지연 및 화면 버벅임 방지)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveActiveTemplate(currentTemplate);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentTemplate]);

  // 페이지 새로고침/이탈 시 최신 템플릿 즉시 저장 보장 (T03-C21)
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveActiveTemplate(currentTemplate);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentTemplate]);

  // 기본 템플릿으로 초기화
  const handleResetToDefault = useCallback(() => {
    if (window.confirm('기본 템플릿으로 편집기를 초기화하시겠습니까?')) {
      const defaultTpl = DEFAULT_BUILTIN_TEMPLATES[0];
      setCurrentTemplate(defaultTpl);
      saveActiveTemplate(defaultTpl);
    }
  }, []);

  // 새 커스텀 템플릿으로 저장
  const handleSaveAsCustomTemplate = useCallback((tpl: CardTemplate) => {
    createNewTemplate({
      name: `${tpl.name} (사본)`,
      aspectRatio: tpl.aspectRatio,
      imageUrl: tpl.imageUrl,
      imageFit: tpl.imageFit,
      backgroundColor: tpl.backgroundColor,
      textLayers: tpl.textLayers,
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-between overflow-x-clip bg-neutral-50/50 font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white dark:bg-neutral-950 dark:text-neutral-100">
      {/* 상단 고정 헤더 */}
      <Header
        isDark={isDark}
        onToggleDark={() => setIsDark((prev) => !prev)}
        onResetToDefault={handleResetToDefault}
        onOpenAspectModal={() => setShowAspectModal(true)}
        onOpenTemplateModal={() => setShowTemplateModal(true)}
        onOpenGalleryModal={() => setShowGalleryModal(true)}
      />

      {/* 메인 컨테이너: 스튜디오 편집기 단독 집중 노출 */}
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-start px-3 pt-20 pb-12 outline-none sm:px-6 sm:pt-24"
      >
        <div id="studio" className="w-full scroll-mt-24">
          <StudioEditor
            currentTemplate={currentTemplate}
            onChangeTemplate={handleChangeTemplate}
            onSaveAsCustomTemplate={handleSaveAsCustomTemplate}
            onOpenAspectModal={() => setShowAspectModal(true)}
          />
        </div>
      </main>

      {/* 화면비 비교 모달 */}
      <AspectComparisonModal
        isOpen={showAspectModal}
        onClose={() => setShowAspectModal(false)}
        baseTemplate={currentTemplate}
      />

      {/* 템플릿 보관함 모달 */}
      <TemplateManagerModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        currentTemplate={currentTemplate}
        onLoadTemplate={handleChangeTemplate}
      />

      {/* 예시 갤러리 모달 */}
      <GalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        onLoadTemplate={handleChangeTemplate}
      />

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
};

export default App;
