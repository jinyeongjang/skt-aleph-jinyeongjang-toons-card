import React, { useState, useEffect, useCallback } from 'react';
import type { CardTemplate } from '../types/studio';
import {
  loadAllTemplates,
  saveAllTemplates,
  createNewTemplate,
  updateTemplateById,
  deleteTemplateById,
  downloadTemplateAsJson,
  validateAndParseTemplateJson,
} from '../utils/storage';
import {
  X,
  Plus,
  FolderOpen,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: CardTemplate;
  onLoadTemplate: (template: CardTemplate) => void;
}

export const TemplateManagerModal: React.FC<TemplateManagerModalProps> = ({
  isOpen,
  onClose,
  currentTemplate,
  onLoadTemplate,
}) => {
  const [templates, setTemplates] = useState<CardTemplate[]>(() => loadAllTemplates());
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // 템플릿 목록 동기화
  const refreshList = useCallback(() => {
    setTemplates(loadAllTemplates());
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setTemplates(loadAllTemplates());
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // [T03-C17] 신규 템플릿 생성
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newTemplateName.trim() || `나의 템플릿 #${templates.length + 1}`;
    const created = createNewTemplate({
      name,
      aspectRatio: currentTemplate.aspectRatio,
      imageUrl: currentTemplate.imageUrl,
      imageFit: currentTemplate.imageFit,
      backgroundColor: currentTemplate.backgroundColor,
      textLayers: currentTemplate.textLayers,
    });

    setNewTemplateName('');
    refreshList();
    setActionNotice(`새 템플릿 "${created.name}"이(가) 등록되었습니다.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // [T03-C18] 템플릿 불러오기
  const handleLoad = (template: CardTemplate) => {
    onLoadTemplate(template);
    setActionNotice(`"${template.name}" 템플릿을 편집기에 불러왔습니다.`);
    setTimeout(() => {
      setActionNotice(null);
      onClose();
    }, 1000);
  };

  // [T03-C19] 템플릿 이름 수정 시작
  const handleStartEdit = (template: CardTemplate) => {
    setEditingId(template.id);
    setEditNameValue(template.name);
  };

  // [T03-C19] 템플릿 수정 저장 (안정된 ID 기준)
  const handleSaveEdit = (id: string) => {
    if (!editNameValue.trim()) return;
    const updated = updateTemplateById(id, { name: editNameValue.trim() });
    if (updated) {
      setEditingId(null);
      refreshList();
      setActionNotice(`템플릿 이름이 "${updated.name}"(으)로 변경되었습니다.`);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  // [T03-C20] 템플릿 삭제 (안정된 ID 기준)
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`템플릿 "${name}"을(를) 삭제하시겠습니까?`)) {
      deleteTemplateById(id);
      refreshList();
      setActionNotice(`"${name}" 템플릿이 삭제되었습니다.`);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  // 새로고침 유지 검증 (localStorage 직접 재조회)
  const handleVerifyPersistence = () => {
    refreshList();
    setActionNotice('템플릿 목록을 새로고침했습니다.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  // JSON 파일 가져오기
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const res = validateAndParseTemplateJson(text);
      if (!res.success) {
        setActionNotice(`⛔ 가져오기 실패: ${res.errorMessage}`);
        return;
      }
      if (res.template) {
        const currentList = loadAllTemplates();
        const updatedList = [res.template, ...currentList];
        saveAllTemplates(updatedList);
        refreshList();
        setActionNotice(`✅ 템플릿 "${res.template.name}"을(를) 성공적으로 가져왔습니다.`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">템플릿 보관함</h2>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    로컬 스토리지 자동 저장
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  자주 사용하는 카드 레이아웃을 저장하고 언제든지 불러와 편집할 수 있습니다.
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

            {/* 액션 알림 바 */}
            <AnimatePresence>
              {actionNotice && (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/90 p-3 text-xs font-semibold text-emerald-900 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/70 dark:text-emerald-200"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{actionNotice}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 1. 신규 템플릿 생성 폼 */}
            <form
              onSubmit={handleCreateTemplate}
              className="mt-4 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-800/40"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  <Plus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>현재 작업본으로 새 템플릿 생성</span>
                </span>
                <span className="text-[11px] font-medium text-neutral-500">
                  현재 비율: {currentTemplate.aspectRatio} · 문구 {currentTemplate.textLayers.length}개
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="생성할 템플릿 이름을 입력하세요 (예: 2026 트렌드 카드)"
                  className="flex-1 rounded-xl border border-neutral-300/80 bg-white px-3.5 py-2 text-xs text-neutral-900 shadow-xs transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="hover-lift active-press inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-500"
                >
                  <Plus className="h-4 w-4" />
                  <span>템플릿 저장</span>
                </button>
              </div>
            </form>

            {/* 2. 등록된 템플릿 목록 */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold tracking-wider text-neutral-900 uppercase dark:text-white">
                    저장된 템플릿 목록 ({templates.length}개 등록됨)
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <label className="hover-lift active-press inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
                    <Upload className="h-3.5 w-3.5 text-emerald-500" />
                    <span>JSON 가져오기</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportJsonFile}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleVerifyPersistence}
                    className="hover-lift active-press inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    title="목록 새로고침"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-sky-500" />
                    <span>목록 새로고침</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {templates.map((tpl) => {
                  const isEditing = editingId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      className="hover-lift flex flex-col justify-between rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs transition-all hover:border-emerald-400/80 dark:border-neutral-800 dark:bg-neutral-800/60 dark:hover:border-emerald-600"
                    >
                      <div className="space-y-2">
                        {/* 상단 라벨 & 안정된 ID */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-bold text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                            {tpl.aspectRatio}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-400">ID: {tpl.id}</span>
                        </div>

                        {/* 이름 (수정 모드 또는 일반 텍스트) */}
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 pt-1">
                            <input
                              type="text"
                              value={editNameValue}
                              onChange={(e) => setEditNameValue(e.target.value)}
                              className="flex-1 rounded-lg border border-emerald-500 bg-white px-2.5 py-1 text-xs text-neutral-900 focus:outline-none dark:bg-neutral-700 dark:text-white"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(tpl.id)}
                              className="cursor-pointer rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                            >
                              저장
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="cursor-pointer rounded-lg border border-neutral-300 px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <h4 className="truncate text-xs font-bold text-neutral-900 dark:text-white">{tpl.name}</h4>
                        )}

                        <p className="line-clamp-2 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                          {tpl.textLayers[0]?.text || '(텍스트 없음)'}
                        </p>
                      </div>

                      {/* 하단 조작 버튼 (R, U, D, Export) */}
                      <div className="mt-3.5 flex items-center justify-between border-t border-neutral-100 pt-2.5 dark:border-neutral-700/60">
                        <button
                          type="button"
                          onClick={() => handleLoad(tpl)}
                          className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                          <span>불러오기</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {/* 수정 버튼 */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(tpl)}
                            className="cursor-pointer rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                            title="이름 수정"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* JSON 다운로드 */}
                          <button
                            type="button"
                            onClick={() => downloadTemplateAsJson(tpl)}
                            className="cursor-pointer rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                            title="JSON 내보내기"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>

                          {/* 삭제 버튼 */}
                          <button
                            type="button"
                            onClick={() => handleDelete(tpl.id, tpl.name)}
                            className="cursor-pointer rounded-lg p-1.5 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                            title="템플릿 삭제"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 푸터 */}
            <div className="mt-6 flex justify-end border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="hover-lift active-press cursor-pointer rounded-xl border border-neutral-300/80 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-xs transition-all hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
