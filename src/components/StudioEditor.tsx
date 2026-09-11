import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { AspectRatio, CardTemplate, TextLayer, TextPositionPreset, ImageFitMode } from '../types/studio';
import { ASPECT_RATIOS } from '../types/studio';
import { renderCardTemplate, downloadCanvasImage } from '../utils/canvasRenderer';
import { PRESET_IMAGE_GALLERY } from '../utils/sampleImages';
import {
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Type,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Bookmark,
  Maximize2,
  Bold,
  Sparkles,
  Square,
} from 'lucide-react';

interface StudioEditorProps {
  currentTemplate: CardTemplate;
  onChangeTemplate: (updated: CardTemplate) => void;
  onSaveAsCustomTemplate: (template: CardTemplate) => void;
  onOpenAspectModal: () => void;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({
  currentTemplate,
  onChangeTemplate,
  onSaveAsCustomTemplate,
  onOpenAspectModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 현재 선택된 활성 텍스트 레이어 ID
  const [selectedLayerId, setSelectedLayerId] = useState<string>(() => {
    return currentTemplate.textLayers[0]?.id || '';
  });

  // 파일 거부 경고 토스트 상태 (T03-C09, T03-C10)
  const [fileError, setFileError] = useState<{ message: string; timestamp: number } | null>(null);
  const [fileSuccess, setFileSuccess] = useState<string | null>(null);

  // 저장 완료 안내 토스트
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // 활성 텍스트 레이어 찾기
  const activeLayer =
    currentTemplate.textLayers.find((l) => l.id === selectedLayerId) || currentTemplate.textLayers[0] || null;

  // 캔버스 실시간 렌더링
  const renderCanvas = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      await renderCardTemplate(canvasRef.current, currentTemplate);
    } catch (err) {
      console.error('캔버스 렌더링 에러:', err);
    }
  }, [currentTemplate]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // 화면비 변경 (T03-C11, T03-C12, T03-C13)
  const handleRatioChange = useCallback(
    (ratio: AspectRatio) => {
      onChangeTemplate({
        ...currentTemplate,
        aspectRatio: ratio,
        updatedAt: Date.now(),
      });
    },
    [currentTemplate, onChangeTemplate],
  );

  // 파일 유효성 검사 및 로드 (T03-C04, T03-C05, T03-C09, T03-C10)
  const processUploadedFile = useCallback(
    (file: File) => {
      const validMimes = ['image/png', 'image/jpeg', 'image/jpg'];
      const validExtensions = ['.png', '.jpg', '.jpeg'];
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();

      const isValidMime = validMimes.includes(file.type.toLowerCase());
      const isValidExt = validExtensions.includes(extension);

      if (!isValidMime && !isValidExt) {
        // [T03-C09, T03-C10 준수]
        // 지원하지 않는 파일은 즉시 거부하고, 기존 템플릿/작업 내용을 100% 보존하며 명확한 이유 안내
        setFileError({
          message: `지원하지 않는 파일 형식(${extension || file.type || '알 수 없음'})입니다. PNG 또는 JPEG 파일만 업로드할 수 있습니다. (기존 작업은 안전하게 보존되었습니다)`,
          timestamp: Date.now(),
        });
        setFileSuccess(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // 통과 시 FileReader로 로드 (T03-C04: PNG, T03-C05: JPEG)
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          onChangeTemplate({
            ...currentTemplate,
            imageUrl: dataUrl,
            updatedAt: Date.now(),
          });
          setFileError(null);
          setFileSuccess(`성공적으로 불러왔습니다: ${file.name} (${file.type.toUpperCase()})`);
          setTimeout(() => setFileSuccess(null), 3000);
        }
      };
      reader.onerror = () => {
        setFileError({
          message: '파일을 읽는 도중 오류가 발생했습니다. 다른 파일을 선택해 주세요.',
          timestamp: Date.now(),
        });
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [currentTemplate, onChangeTemplate],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processUploadedFile(file);
      }
    },
    [processUploadedFile],
  );

  // 활성 텍스트 레이어 업데이트 (T03-C06, T03-C07, T03-C08)
  const updateActiveLayer = useCallback(
    (updates: Partial<TextLayer>) => {
      if (!activeLayer) return;
      const updatedLayers = currentTemplate.textLayers.map((l) => {
        if (l.id === activeLayer.id) {
          return { ...l, ...updates };
        }
        return l;
      });

      onChangeTemplate({
        ...currentTemplate,
        textLayers: updatedLayers,
        updatedAt: Date.now(),
      });
    },
    [activeLayer, currentTemplate, onChangeTemplate],
  );

  // 위치 프리셋 변경 (T03-C06)
  const handlePositionPreset = useCallback(
    (preset: TextPositionPreset) => {
      let posY = 50;
      if (preset === 'top') posY = 15;
      else if (preset === 'middle') posY = 50;
      else if (preset === 'bottom') posY = 85;

      updateActiveLayer({
        presetPosition: preset,
        posY,
      });
    },
    [updateActiveLayer],
  );

  // 텍스트 레이어 추가
  const handleAddTextLayer = useCallback(() => {
    const newId = `layer_${Date.now()}`;
    const newLayer: TextLayer = {
      id: newId,
      text: '새로운 텍스트 문구',
      fontSize: 44,
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 4,
      bgColor: 'rgba(0, 0, 0, 0.6)',
      align: 'center',
      posX: 50,
      posY: 50,
      presetPosition: 'middle',
      fontFamily: 'Pretendard, sans-serif',
      isBold: true,
      shadow: true,
    };

    onChangeTemplate({
      ...currentTemplate,
      textLayers: [...currentTemplate.textLayers, newLayer],
      updatedAt: Date.now(),
    });
    setSelectedLayerId(newId);
  }, [currentTemplate, onChangeTemplate]);

  // 텍스트 레이어 삭제
  const handleDeleteTextLayer = useCallback(
    (layerId: string) => {
      if (currentTemplate.textLayers.length <= 1) {
        alert('최소 1개의 텍스트 레이어가 필요합니다.');
        return;
      }
      const remaining = currentTemplate.textLayers.filter((l) => l.id !== layerId);
      onChangeTemplate({
        ...currentTemplate,
        textLayers: remaining,
        updatedAt: Date.now(),
      });
      setSelectedLayerId(remaining[0].id);
    },
    [currentTemplate, onChangeTemplate],
  );

  // 프리셋 이미지 적용
  const handleSelectPresetImage = useCallback(
    (url: string) => {
      onChangeTemplate({
        ...currentTemplate,
        imageUrl: url,
        updatedAt: Date.now(),
      });
      setFileSuccess('프리셋 이미지가 안전하게 적용되었습니다.');
      setTimeout(() => setFileSuccess(null), 2500);
    },
    [currentTemplate, onChangeTemplate],
  );

  // 다운로드 실행 (PNG / JPEG)
  const handleDownload = useCallback(
    async (format: 'png' | 'jpeg') => {
      await downloadCanvasImage(currentTemplate, format);
    },
    [currentTemplate],
  );

  // 템플릿 저장 (T03-C17)
  const handleSaveTemplate = useCallback(() => {
    onSaveAsCustomTemplate(currentTemplate);
    setSaveToast('현재 작업이 [내 템플릿 목록]에 안전하게 저장되었습니다!');
    setTimeout(() => setSaveToast(null), 3000);
  }, [currentTemplate, onSaveAsCustomTemplate]);

  const meta = ASPECT_RATIOS[currentTemplate.aspectRatio];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      {/* 알림 및 오류 배너 (T03-C09, T03-C10) */}
      {fileError && (
        <div
          role="alert"
          className="animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50/90 p-4 text-sm text-rose-900 shadow-sm backdrop-blur dark:border-rose-900/60 dark:bg-rose-950/70 dark:text-rose-200"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <div className="flex-1">
            <p className="font-semibold">지원하지 않는 파일 형식</p>
            <p className="mt-0.5 text-xs text-rose-800 dark:text-rose-300">{fileError.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setFileError(null)}
            className="cursor-pointer text-xs font-semibold underline hover:text-rose-700"
          >
            닫기
          </button>
        </div>
      )}

      {fileSuccess && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/90 p-3 text-xs text-emerald-900 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/70 dark:text-emerald-200"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{fileSuccess}</span>
        </div>
      )}

      {saveToast && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-sky-300 bg-sky-50/90 p-3 text-xs text-sky-900 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/70 dark:text-sky-200"
        >
          <Bookmark className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 상단 컨트롤 바: 화면비 선택 & 빠른 액션 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white/90 p-3.5 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90">
        {/* 화면비 선택 버튼 그룹 */}
        <div className="flex items-center gap-1.5 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800/80">
          {(['1:1', '4:5', '9:16'] as AspectRatio[]).map((ratio) => {
            const rMeta = ASPECT_RATIOS[ratio];
            const isActive = currentTemplate.aspectRatio === ratio;
            return (
              <button
                key={ratio}
                type="button"
                onClick={() => handleRatioChange(ratio)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                  isActive
                    ? 'bg-white text-neutral-950 shadow-xs ring-1 ring-neutral-200/80 dark:bg-neutral-700 dark:text-white dark:ring-neutral-600'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                <span
                  className={`inline-block rounded-xs border transition-colors ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-500/20 dark:border-sky-400 dark:bg-sky-400/20'
                      : 'border-neutral-400/80 dark:border-neutral-500'
                  }`}
                  style={{
                    width: ratio === '9:16' ? '7px' : ratio === '4:5' ? '9px' : '10px',
                    height: ratio === '9:16' ? '12px' : ratio === '4:5' ? '11px' : '10px',
                  }}
                />
                <span>{rMeta.label}</span>
              </button>
            );
          })}
        </div>

        {/* 우측 빠른 액션: 화면비 일치 대조 팝업 / 다운로드 / 템플릿 저장 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenAspectModal}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-neutral-50/80 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs transition-all hover:border-neutral-300 hover:bg-neutral-100 hover:underline active:scale-95 dark:border-neutral-700/80 dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-700/80"
          >
            <Maximize2 className="h-3.5 w-3.5 text-sky-500" />
            <span>화면비 비교</span>
          </button>

          <button
            type="button"
            onClick={handleSaveTemplate}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-300/80 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs transition-all hover:border-emerald-400 hover:bg-emerald-100 hover:underline active:scale-95 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
          >
            <Bookmark className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>템플릿 저장</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleDownload('png')}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-neutral-800 hover:underline active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <Download className="h-3.5 w-3.5" />
              <span>PNG 다운로드</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownload('jpeg')}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-neutral-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:underline active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              title="JPEG 포맷으로 다운로드"
            >
              <span>JPG 다운로드</span>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 에디터 그리드 (좌측: 조작 패널 / 우측: 실시간 캔버스) */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        {/* ================= 좌측: 편집 조작 패널 ================= */}
        <div className="custom-scrollbar max-h-[calc(100vh-160px)] space-y-3.5 overflow-y-auto rounded-2xl border border-neutral-200/80 bg-white/90 p-4 pr-2.5 shadow-sm backdrop-blur-md lg:col-span-5 dark:border-neutral-800 dark:bg-neutral-900/90">
          {/* 섹션 1: 이미지 편집 도구 */}
          <div className="space-y-2.5 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3 dark:border-neutral-800/80 dark:bg-neutral-800/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                  <ImageIcon className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-xs font-bold tracking-wider text-neutral-900 uppercase dark:text-white">
                  이미지 편집
                </h3>
              </div>
              <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                PNG · JPG 지원
              </span>
            </div>

            {/* 파일 업로드 버튼 및 인풋 */}
            <div className="flex items-center gap-2">
              <label className="hover-lift active-press inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-300/80 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-xs transition-all hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">
                <Upload className="h-3.5 w-3.5 text-neutral-500" />
                <span>내 이미지 업로드 (PNG·JPG)</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>

              {/* 이미지 맞춤 모드 (Cover / Contain / Fill) */}
              <select
                value={currentTemplate.imageFit}
                onChange={(e) =>
                  onChangeTemplate({
                    ...currentTemplate,
                    imageFit: e.target.value as ImageFitMode,
                    updatedAt: Date.now(),
                  })
                }
                className="cursor-pointer rounded-xl border border-neutral-300/80 bg-white px-2.5 py-2 text-xs font-medium text-neutral-700 shadow-xs transition-all hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                title="이미지 맞춤 방식"
              >
                <option value="cover">채우기 (Cover)</option>
                <option value="contain">맞춤 (Contain)</option>
                <option value="fill">늘리기 (Fill)</option>
              </select>
            </div>

            {/* 프리셋 이미지 빠른 선택 썸네일 */}
            <div>
              <p className="mb-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                기본 추천 프리셋 이미지:
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {PRESET_IMAGE_GALLERY.map((p) => {
                  const isSelected = currentTemplate.imageUrl === p.url;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPresetImage(p.url)}
                      className={`group relative h-12 cursor-pointer overflow-hidden rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-sky-500 shadow-sm ring-2 ring-sky-500'
                          : 'border-neutral-200/80 hover:border-sky-400 dark:border-neutral-700'
                      }`}
                      title={p.name}
                    >
                      <img
                        src={p.url}
                        alt={p.name}
                        className="h-full w-full object-cover opacity-85 transition-transform duration-300 group-hover:scale-105 group-hover:opacity-100"
                      />
                      <span className="absolute inset-x-0 bottom-0 truncate bg-neutral-950/75 px-1 py-0.5 text-[9px] font-medium text-white backdrop-blur-[2px]">
                        {p.aspectRatio}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 섹션 2: 문구 편집 */}
          <div className="space-y-3 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3 dark:border-neutral-800/80 dark:bg-neutral-800/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20">
                  <Type className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-xs font-bold tracking-wider text-neutral-900 uppercase dark:text-white">
                  문구 편집
                </h3>
              </div>

              {/* 레이어 추가 버튼 */}
              <button
                type="button"
                onClick={handleAddTextLayer}
                className="hover-lift active-press inline-flex cursor-pointer items-center gap-1 rounded-lg border border-indigo-200/60 bg-indigo-50/80 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 shadow-2xs hover:bg-indigo-100 dark:border-indigo-800/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
              >
                <Plus className="h-3 w-3" />
                <span>문구 추가</span>
              </button>
            </div>

            {/* 레이어 탭 선택기 */}
            <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800/60">
              {currentTemplate.textLayers.map((l, index) => {
                const isCurrent = l.id === selectedLayerId;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setSelectedLayerId(l.id)}
                    className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-white text-indigo-700 shadow-xs dark:bg-neutral-900 dark:text-indigo-300'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    <span>문구 {index + 1}</span>
                    {currentTemplate.textLayers.length > 1 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTextLayer(l.id);
                        }}
                        className="ml-0.5 rounded-full p-0.5 text-neutral-400 hover:bg-neutral-200 hover:text-rose-600 dark:hover:bg-neutral-700 dark:hover:text-rose-400"
                        title="레이어 삭제"
                      >
                        ×
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {activeLayer && (
              <div className="space-y-2.5">
                {/* 1. 텍스트 입력창 (한글, 영문, 이모지, 줄바꿈) */}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    문구 내용 (엔터 줄바꿈 및 이모지 지원)
                  </label>
                  <textarea
                    rows={3}
                    value={activeLayer.text}
                    onChange={(e) => updateActiveLayer({ text: e.target.value })}
                    placeholder="여기에 문구를 입력하세요..."
                    className="w-full rounded-xl border border-neutral-300/80 bg-white p-3 text-xs leading-relaxed text-neutral-900 shadow-xs transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                {/* 2. 문구 위치 */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                      문구 위치
                    </label>
                    <span className="font-mono text-[11px] font-medium text-neutral-500">Y: {activeLayer.posY}%</span>
                  </div>
                  <div className="mb-2 grid grid-cols-4 gap-1.5">
                    {(['top', 'middle', 'bottom'] as TextPositionPreset[]).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => handlePositionPreset(pos)}
                        className={`cursor-pointer rounded-xl py-1.5 text-xs font-semibold capitalize transition-all ${
                          activeLayer.presetPosition === pos
                            ? 'bg-neutral-900 text-white shadow-xs dark:bg-white dark:text-neutral-900'
                            : 'border border-neutral-200/80 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {pos === 'top' ? '상단' : pos === 'middle' ? '중앙' : '하단'}
                      </button>
                    ))}
                    {/* 정렬 버튼 (좌 / 중 / 우) */}
                    <div className="flex items-center justify-center gap-0.5 rounded-xl border border-neutral-200/80 bg-white p-0.5 dark:border-neutral-700 dark:bg-neutral-800">
                      <button
                        type="button"
                        onClick={() => updateActiveLayer({ align: 'left' })}
                        className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
                          activeLayer.align === 'left'
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                        title="좌측 정렬"
                      >
                        <AlignLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateActiveLayer({ align: 'center' })}
                        className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
                          activeLayer.align === 'center'
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                        title="가운데 정렬"
                      >
                        <AlignCenter className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateActiveLayer({ align: 'right' })}
                        className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
                          activeLayer.align === 'right'
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                        title="우측 정렬"
                      >
                        <AlignRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Y축 미세 위치 슬라이더 */}
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={activeLayer.posY}
                    onChange={(e) =>
                      updateActiveLayer({
                        posY: Number(e.target.value),
                        presetPosition: 'custom',
                      })
                    }
                    className="h-1.5 w-full cursor-pointer rounded-lg bg-neutral-200 accent-indigo-600 dark:bg-neutral-700"
                  />
                </div>

                {/* 3. 글자 크기 */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                      글자 크기
                    </label>
                    <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {activeLayer.fontSize} px
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="16"
                      max="110"
                      value={activeLayer.fontSize}
                      onChange={(e) => updateActiveLayer({ fontSize: Number(e.target.value) })}
                      className="h-1.5 flex-1 cursor-pointer rounded-lg bg-neutral-200 accent-indigo-600 dark:bg-neutral-700"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateActiveLayer({ fontSize: Math.max(16, activeLayer.fontSize - 4) })}
                        className="cursor-pointer rounded-lg border border-neutral-300/80 bg-white px-2.5 py-1 text-xs font-bold text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => updateActiveLayer({ fontSize: Math.min(120, activeLayer.fontSize + 4) })}
                        className="cursor-pointer rounded-lg border border-neutral-300/80 bg-white px-2.5 py-1 text-xs font-bold text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. 글자 색상 */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                      글자 색상
                    </label>
                    <span className="font-mono text-[11px] text-neutral-500">{activeLayer.color}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* 컬러 인풋 */}
                    <input
                      type="color"
                      value={activeLayer.color}
                      onChange={(e) => updateActiveLayer({ color: e.target.value })}
                      className="h-7 w-8 cursor-pointer rounded-lg border border-neutral-300/80 dark:border-neutral-700"
                      title="텍스트 색상 직접 선택"
                    />

                    {/* 추천 컬러 칩 */}
                    {['#ffffff', '#facc15', '#38bdf8', '#f43f5e', '#4ade80', '#111827'].map((c) => {
                      const isActive = activeLayer.color.toLowerCase() === c.toLowerCase();
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateActiveLayer({ color: c })}
                          style={{ backgroundColor: c }}
                          className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border shadow-2xs transition-all ${
                            isActive
                              ? 'scale-110 border-white ring-2 ring-indigo-500 ring-offset-1'
                              : 'border-neutral-300/80 hover:scale-105 dark:border-neutral-600'
                          }`}
                          title={c}
                        >
                          {isActive && (
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                backgroundColor: c.toLowerCase() === '#ffffff' ? '#111827' : '#ffffff',
                              }}
                            />
                          )}
                        </button>
                      );
                    })}

                    {/* 외곽선(Stroke) 색상 및 두께 */}
                    <div className="ml-auto flex items-center gap-1.5 text-xs">
                      <span className="text-[10px] text-neutral-500">외곽선:</span>
                      <input
                        type="color"
                        value={activeLayer.strokeColor}
                        onChange={(e) => updateActiveLayer({ strokeColor: e.target.value })}
                        className="h-6 w-6 cursor-pointer rounded border border-neutral-300 dark:border-neutral-700"
                        title="외곽선 색상"
                      />
                      <select
                        value={activeLayer.strokeWidth}
                        onChange={(e) => updateActiveLayer({ strokeWidth: Number(e.target.value) })}
                        className="cursor-pointer rounded-lg border border-neutral-300/80 bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                      >
                        <option value="0">없음</option>
                        <option value="2">얇게 (2px)</option>
                        <option value="5">보통 (5px)</option>
                        <option value="8">굵게 (8px)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 스타일 토글 (굵게, 그림자, 배경 배지) */}
                <div className="flex flex-wrap items-center gap-2 border-t border-neutral-200/70 pt-2.5 dark:border-neutral-700/70">
                  <button
                    type="button"
                    onClick={() => updateActiveLayer({ isBold: !activeLayer.isBold })}
                    className={`hover-lift active-press inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeLayer.isBold
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-neutral-200/80 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Bold className="h-3.5 w-3.5" />
                    <span>굵게</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateActiveLayer({ shadow: !activeLayer.shadow })}
                    className={`hover-lift active-press inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeLayer.shadow
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-neutral-200/80 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>그림자</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateActiveLayer({
                        bgColor: activeLayer.bgColor !== 'transparent' ? 'transparent' : 'rgba(0, 0, 0, 0.7)',
                      })
                    }
                    className={`hover-lift active-press inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeLayer.bgColor !== 'transparent'
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-neutral-200/80 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Square className="h-3.5 w-3.5" />
                    <span>배경 박스</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= 우측: 실시간 캔버스 미리보기 ================= */}
        <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-900/[0.03] p-6 backdrop-blur-md lg:col-span-7 dark:border-neutral-800 dark:bg-neutral-900/40">
          {/* 상단 메타 바 */}
          <div className="mb-3 flex w-full max-w-md items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/80 px-3 py-1 shadow-xs dark:border-neutral-800 dark:bg-neutral-800/80">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">{meta.label} 실시간 렌더링</span>
            </div>
            <span className="rounded-full border border-neutral-200/60 bg-white/60 px-2.5 py-0.5 font-mono text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-400">
              {meta.description} (1080p 규격)
            </span>
          </div>

          {/* 메인 캔버스 뷰포트 (체커보드 투명 패턴 배경 + 그림자 베젤) */}
          <div
            className="bg-canvas-pattern relative flex items-center justify-center overflow-hidden rounded-2xl border border-neutral-800/20 shadow-[0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-black/10 dark:border-neutral-700/80 dark:ring-white/10"
            style={{
              width: '100%',
              maxWidth:
                currentTemplate.aspectRatio === '9:16'
                  ? '300px'
                  : currentTemplate.aspectRatio === '4:5'
                    ? '360px'
                    : '420px',
              aspectRatio:
                currentTemplate.aspectRatio === '1:1'
                  ? '1 / 1'
                  : currentTemplate.aspectRatio === '4:5'
                    ? '4 / 5'
                    : '9 / 16',
            }}
          >
            <canvas
              ref={canvasRef}
              className="pointer-events-none h-full w-full object-contain select-none"
              title="실시간 캔버스 미리보기"
            />
          </div>

          {/* 하단 캔버스 안내 설명 */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              미리보기와 저장 파일 100% 동일 렌더링
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              개인정보 보호 EXIF 메타데이터 자동 소거
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
