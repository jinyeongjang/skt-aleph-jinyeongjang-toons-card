import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { StudioEditor } from './components/StudioEditor';
import { AspectComparisonModal } from './components/AspectComparisonModal';
import { ExtremeTestModal } from './components/ExtremeTestModal';
import { TemplateManagerModal } from './components/TemplateManagerModal';
import { JsonAndSafetyModal } from './components/JsonAndSafetyModal';
import { SubmissionModal } from './components/SubmissionModal';
import { Footer } from './components/Footer';
import type { CardTemplate } from './types/studio';
import { loadActiveTemplate, saveActiveTemplate, createNewTemplate, DEFAULT_BUILTIN_TEMPLATES } from './utils/storage';

export const App: React.FC = () => {
  // 현재 활성 편집 템플릿 (T03-C06 ~ T03-C08, T03-C21 자가 치유)
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

  // 모달 상태들 (메인페이지는 오직 스튜디오 편집기만 노출하고, 타 카드는 모달로 원클릭 열람)
  const [showAspectModal, setShowAspectModal] = useState<boolean>(false);
  const [showExtremeModal, setShowExtremeModal] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showSafetyModal, setShowSafetyModal] = useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState<boolean>(false);

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

  // 템플릿 변경 처리
  const handleChangeTemplate = useCallback((updated: CardTemplate) => {
    setCurrentTemplate(updated);
    saveActiveTemplate(updated);
  }, []);

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
      {/* 상단 고정 헤더: 상단 네비게이션을 통해 각 카드별 모달 원클릭 호출 */}
      <Header
        isDark={isDark}
        onToggleDark={() => setIsDark((prev) => !prev)}
        onResetToDefault={handleResetToDefault}
        onOpenAspectModal={() => setShowAspectModal(true)}
        onOpenExtremeModal={() => setShowExtremeModal(true)}
        onOpenTemplateModal={() => setShowTemplateModal(true)}
        onOpenSafetyModal={() => setShowSafetyModal(true)}
        onOpenSubmissionModal={() => setShowSubmissionModal(true)}
      />

      {/* 메인 컨테이너: 메인페이지에는 스튜디오 편집기만 100% 집중 노출 (T03-C03 첫 화면 노출) */}
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

      {/* 카드 2: 화면비 일치 대조 모달 (T03-C11 ~ T03-C13) */}
      <AspectComparisonModal
        isOpen={showAspectModal}
        onClose={() => setShowAspectModal(false)}
        baseTemplate={currentTemplate}
      />

      {/* 카드 3: 극단 입력 12건 & 대표 결함 전후 모달 (T03-C14 ~ T03-C16) */}
      <ExtremeTestModal
        isOpen={showExtremeModal}
        onClose={() => setShowExtremeModal(false)}
        currentTemplate={currentTemplate}
        onApplyTestCase={handleChangeTemplate}
      />

      {/* 카드 4: 템플릿 CRUD 모달 (T03-C17 ~ T03-C21) */}
      <TemplateManagerModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        currentTemplate={currentTemplate}
        onLoadTemplate={handleChangeTemplate}
      />

      {/* 카드 5: JSON 복원·완성 이미지·공개 안전 검증 모달 (T03-C22 ~ T03-C32) */}
      <JsonAndSafetyModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        onApplyTemplate={handleChangeTemplate}
      />

      {/* 공식 제출 양식 모달 (T03-C31, T03-C32) */}
      <SubmissionModal isOpen={showSubmissionModal} onClose={() => setShowSubmissionModal(false)} />

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
};

export default App;
