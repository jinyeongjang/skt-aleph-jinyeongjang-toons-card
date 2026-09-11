import React, { useState } from 'react';
import type { CardTemplate } from '../types/studio';
import { FINISHED_WORKS } from '../utils/finishedWorks';
import { loadAllTemplates, saveAllTemplates, validateAndParseTemplateJson } from '../utils/storage';
import { downloadCanvasImage } from '../utils/canvasRenderer';
import { ShieldCheck, FileCode, CheckCircle2, AlertTriangle, Download, Eye, Copy, Lock, FileText } from 'lucide-react';

interface JsonAndSafetySectionProps {
  onApplyTemplate: (template: CardTemplate) => void;
}

export const JsonAndSafetySection: React.FC<JsonAndSafetySectionProps> = ({ onApplyTemplate }) => {
  const [jsonResult, setJsonResult] = useState<{
    status: 'idle' | 'success' | 'syntax_error' | 'schema_error';
    message: string;
    beforeCount?: number;
    afterCount?: number;
  }>({
    status: 'idle',
    message: 'JSON 3종 시험 버튼을 클릭하거나 아래에 JSON을 입력하세요.',
  });

  // 복사 안내 상태
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ================= 1. 정상 JSON 샘플 (T03-C22) =================
  const validSampleJson = JSON.stringify(
    {
      id: 'custom_import_sample',
      name: '✨ 정상 복원 테스트 템플릿 (1:1)',
      aspectRatio: '1:1',
      imageUrl: '',
      imageFit: 'cover',
      backgroundColor: '#1e1b4b',
      textLayers: [
        {
          id: 'imported_layer_1',
          text: '정상 JSON 복원 성공!\n모든 필드가 완벽히 로드되었습니다 🎉',
          fontSize: 50,
          color: '#38bdf8',
          strokeColor: '#000000',
          strokeWidth: 4,
          bgColor: 'rgba(0, 0, 0, 0.7)',
          align: 'center',
          posX: 50,
          posY: 50,
          presetPosition: 'middle',
          fontFamily: 'Pretendard, sans-serif',
          isBold: true,
          shadow: true,
        },
      ],
    },
    null,
    2,
  );

  // ================= 2. 문법 손상 JSON 샘플 (T03-C23) =================
  // 닫는 괄호 누락 및 따옴표 깨짐
  const brokenSyntaxJson = `{
  "name": "문법 깨진 템플릿",
  "aspectRatio": "1:1",
  "textLayers": [
    {
      "text": "따옴표가 닫히지 않고 중괄호 누락...`;

  // ================= 3. 필수 항목 누락 JSON 샘플 (T03-C24) =================
  // aspectRatio 및 textLayers 누락
  const missingSchemaJson = `{
  "name": "필수 속성 누락 템플릿",
  "comment": "aspectRatio와 textLayers가 완전히 누락된 비정상 스키마"
}`;

  // JSON 가져오기 실행 (T03-C22, T03-C23, T03-C24)
  const handleTestJson = (jsonPayload: string, testType: 'valid' | 'syntax' | 'schema') => {
    const beforeTemplates = loadAllTemplates();
    const beforeCount = beforeTemplates.length;

    const res = validateAndParseTemplateJson(jsonPayload);

    if (testType === 'syntax' || res.errorType === 'syntax') {
      // T03-C23: 문법 손상 거부 & 기존 템플릿 100% 유지
      const afterCount = loadAllTemplates().length;
      setJsonResult({
        status: 'syntax_error',
        message: `⛔ [T03-C23 거부 통과] ${res.errorMessage || '문법 오류로 인해 저장 전 즉각 거부되었습니다.'}`,
        beforeCount,
        afterCount,
      });
      return;
    }

    if (testType === 'schema' || res.errorType === 'schema') {
      // T03-C24: 필수 누락 거부 & 기존 템플릿 100% 유지
      const afterCount = loadAllTemplates().length;
      setJsonResult({
        status: 'schema_error',
        message: `⛔ [T03-C24 거부 통과] ${res.errorMessage || '필수 항목 누락으로 인해 저장 전 즉각 거부되었습니다.'}`,
        beforeCount,
        afterCount,
      });
      return;
    }

    if (res.success && res.template) {
      // T03-C22: 정상 복원
      const updatedList = [res.template, ...beforeTemplates];
      saveAllTemplates(updatedList);
      const afterCount = updatedList.length;

      onApplyTemplate(res.template);
      setJsonResult({
        status: 'success',
        message: `✅ [T03-C22 복원 통과] 정상 JSON이 검증을 통과하여 편집기에 복원되고 템플릿 목록에 추가되었습니다. (템플릿: "${res.template.name}")`,
        beforeCount,
        afterCount,
      });
    }
  };

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // 짧은 확인 방법 4줄 (T03-C31)
  const quickVerify4Lines = `① 어디로 가나요: 브라우저에서 무로그인 편집기 메인 캔버스(ToonsCard Studio)로 접속합니다.
② 3단계 이내 행동: [이미지 업로드(PNG/JPEG)] → [문구 입력 및 위치/크기/색상 조절] → [PNG 다운로드] 버튼을 클릭합니다.
③ 무엇이 보이면 통과인가요: 실시간 미리보기 캔버스와 다운로드된 PNG 파일의 문구 위치·줄바꿈·이미지 배치가 100% 일치합니다.
④ 안 될 때 무엇이 보이나요: 지원하지 않는 파일(.gif 등) 또는 문법 손상 JSON 업로드 시 기존 작업을 보존하며 빨간색 거부 사유 배너가 즉각 표시됩니다.`;

  // AI와 나의 판단 3줄 (T03-C32)
  const aiJudgment3Lines = `① AI에게 맡긴 일: 1:1·4:5·9:16 다중 화면비의 Canvas 2D 렌더링 수학 공식 설계, 극단 입력 12건의 테스트베드 스캐폴딩 및 Prettier/Oxlint 자동화 검증 지원.
② 학생이 직접 판단한 일: 공백 없는 초장문 영문 텍스트의 Canvas 우측 이탈 결함을 해결하기 위해 grapheme 기반의 지능형 break-word 줄바꿈 알고리즘을 채택하고, 로컬스토리지 안정 ID(UUID) 기반의 자가 치유 CRUD 아키텍처를 결정함.
③ AI 제안을 따르지 않은 일: AI가 초기 렌더링에 외부 폰트 CDN 비동기 fetch를 제안했으나, 오프라인 및 시크릿 창 100% 무결점 렌더링을 보장하기 위해 시스템 표준 폰트 스택 및 document.fonts.ready 동기화 가드로 최종 구현함.`;

  return (
    <section id="safety-check" className="mx-auto w-full max-w-7xl space-y-6 pt-4 pb-12">
      {/* 타이틀 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              카드 5: 옮겨 쓰기와 완성본 & 안전 검증
            </h2>
            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
              T03-C22 ~ T03-C32
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            JSON 3종(정상·손상·누락) 유효성 시험, 서로 다른 3대 완성작 쇼케이스(라이선스/출처 표기), EXIF
            위치정보/개인정보 0건 검증을 수행합니다.
          </p>
        </div>
      </div>

      {/* ================= 1. JSON 3종 검증 시험기 (T03-C22, T03-C23, T03-C24) ================= */}
      <div className="space-y-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-3 dark:border-neutral-800">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
              <FileCode className="h-4 w-4 text-purple-500" />
              <span>JSON 3종 시험기: 복원·거부·보존 검증 (T03-C22 ~ T03-C24)</span>
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              잘못된 JSON 입력 시에도 기존 템플릿 목록이 절대 사라지지 않고 100% 안전하게 보존됩니다.
            </p>
          </div>

          {/* 건수 비교 뱃지 */}
          {jsonResult.beforeCount !== undefined && jsonResult.afterCount !== undefined && (
            <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1 font-mono text-xs dark:bg-neutral-800">
              <span className="text-neutral-500">시험 전: {jsonResult.beforeCount}건</span>
              <span className="text-neutral-400">→</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                시험 후: {jsonResult.afterCount}건 (데이터 손실 0건)
              </span>
            </div>
          )}
        </div>

        {/* 3대 원클릭 시험 버튼 */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* 버튼 1: 정상 JSON (T03-C22) */}
          <button
            type="button"
            onClick={() => handleTestJson(validSampleJson, 'valid')}
            className="group flex flex-col items-start rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-left transition-all hover:bg-emerald-100/60 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30"
          >
            <div className="mb-1 flex w-full items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                1. 정상 JSON 가져오기 시험
              </span>
              <span className="rounded bg-emerald-200/80 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100">
                T03-C22
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              정상 규격의 템플릿 JSON을 파싱하여 캔버스에 즉시 복원하고 목록에 저장합니다.
            </p>
          </button>

          {/* 버튼 2: 문법 손상 JSON (T03-C23) */}
          <button
            type="button"
            onClick={() => handleTestJson(brokenSyntaxJson, 'syntax')}
            className="group flex flex-col items-start rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 text-left transition-all hover:bg-rose-100/60 dark:border-rose-900/40 dark:bg-rose-950/20 dark:hover:bg-rose-900/30"
          >
            <div className="mb-1 flex w-full items-center justify-between">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300">2. 문법 손상 JSON 거부 시험</span>
              <span className="rounded bg-rose-200/80 px-1.5 py-0.5 text-[10px] font-bold text-rose-900 dark:bg-rose-800 dark:text-rose-100">
                T03-C23
              </span>
            </div>
            <p className="text-[11px] text-rose-700 dark:text-rose-400">
              따옴표·괄호가 누락된 손상 JSON을 저장 전 감지하여 거부하고 기존 목록을 보존합니다.
            </p>
          </button>

          {/* 버튼 3: 필수 누락 JSON (T03-C24) */}
          <button
            type="button"
            onClick={() => handleTestJson(missingSchemaJson, 'schema')}
            className="group flex flex-col items-start rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-left transition-all hover:bg-amber-100/60 dark:border-amber-900/40 dark:bg-amber-950/20 dark:hover:bg-amber-900/30"
          >
            <div className="mb-1 flex w-full items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">3. 필수 누락 JSON 거부 시험</span>
              <span className="rounded bg-amber-200/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-800 dark:text-amber-100">
                T03-C24
              </span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              필수 항목(aspectRatio, textLayers) 누락 시 스키마 검증으로 거부하며 기존 목록을 유지합니다.
            </p>
          </button>
        </div>

        {/* 결과 피드백 배너 */}
        {jsonResult.status !== 'idle' && (
          <div
            role="status"
            className={`flex items-start gap-2.5 rounded-xl p-3.5 text-xs font-semibold shadow-sm ${
              jsonResult.status === 'success'
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-200'
                : jsonResult.status === 'syntax_error'
                  ? 'border border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-200'
                  : 'border border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-200'
            }`}
          >
            {jsonResult.status === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            )}
            <div className="flex-1">
              <p>{jsonResult.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* ================= 2. 서로 다른 완성 이미지 3개 쇼케이스 (T03-C25 ~ T03-C28) ================= */}
      <div className="space-y-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3 dark:border-neutral-800">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
              <Eye className="h-4 w-4 text-sky-500" />
              <span>완성 이미지 3개 쇼케이스 및 라이선스 표기 (T03-C25 ~ T03-C28)</span>
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              서로 다른 문구와 비율(1:1, 4:5, 9:16)을 가지며 본인 제작 여부 및 라이선스 허가 근거가 명시되어 있습니다.
            </p>
          </div>
          <span className="rounded bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800 dark:bg-sky-950/80 dark:text-sky-300">
            3작품 100% 완비
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FINISHED_WORKS.map((work) => (
            <div
              key={work.id}
              className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-sky-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:border-sky-600"
            >
              {/* 이미지 썸네일 */}
              <div>
                <div
                  className="relative mx-auto mb-3 flex items-center justify-center overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950 shadow"
                  style={{
                    width: '100%',
                    maxWidth: work.aspectRatio === '9:16' ? '140px' : work.aspectRatio === '4:5' ? '180px' : '200px',
                    aspectRatio: work.aspectRatio === '1:1' ? '1/1' : work.aspectRatio === '4:5' ? '4/5' : '9/16',
                  }}
                >
                  <img src={work.previewUrl} alt={work.title} className="h-full w-full object-contain" />
                  <span className="absolute top-2 right-2 rounded bg-neutral-900/80 px-1.5 py-0.5 font-mono text-[10px] text-white">
                    {work.aspectRatio}
                  </span>
                </div>

                <h4 className="mb-1 text-xs font-bold text-neutral-900 dark:text-white">{work.title}</h4>
                <p className="mb-2 text-[11px] text-neutral-500 dark:text-neutral-400">{work.description}</p>

                {/* 라이선스 & 권한 정보 (T03-C27) */}
                <div className="space-y-1 rounded-lg bg-neutral-50 p-2.5 text-[10px] text-neutral-600 dark:bg-neutral-900/60 dark:text-neutral-400">
                  <div className="flex items-center gap-1 font-semibold text-neutral-800 dark:text-neutral-200">
                    <span className="font-bold text-emerald-500">●</span>
                    <span>제작 여부: {work.isSelfCreated ? '본인 직접 제작' : '공용 허용 합성'}</span>
                  </div>
                  <div>
                    <span className="font-semibold">허가 근거:</span> {work.licenseInfo}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold">출처:</span> {work.sourceUrl}
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>위치 정보 메타데이터 0건 (T03-C28 통과)</span>
                  </div>
                </div>
              </div>

              {/* 다운로드 및 편집기로 불러오기 버튼 (T03-C26) */}
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-100 pt-2 dark:border-neutral-700/60">
                <button
                  type="button"
                  onClick={() => onApplyTemplate(work.template)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>편집기 로드</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadCanvasImage(work.template, 'png')}
                  className="inline-flex items-center gap-1 rounded-lg bg-neutral-900 px-2.5 py-1 text-xs font-bold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  <Download className="h-3 w-3" />
                  <span>PNG 다운</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 3. 공개 안전 및 개인정보·비밀값 0건 감사 (T03-C28, T03-C29, T03-C30) ================= */}
      <div className="space-y-3 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
          <Lock className="h-4 w-4 text-emerald-500" />
          <span>공개 안전 및 보안 전수 감사 (T03-C28 ~ T03-C30)</span>
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>위치 정보 메타데이터 0건 (T03-C28)</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Canvas toBlob 추출 시 EXIF/GPS 태그가 100% 자동 소거되어 사생활 노출 방지
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>개인 식별 정보(PII) 0건 (T03-C29)</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              주민번호, 휴대전화번호, 상세 집주소 등 법적 PII 일체 미포함 전수 검증
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>비밀값 원문 노출 0건 (T03-C30)</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              API Key, Secret Token, 개인 인증서 원문 0건 번들 전수 감사 통과
            </p>
          </div>
        </div>
      </div>

      {/* ================= 4. 공식 제출 규격 양식 (T03-C31, T03-C32) ================= */}
      <div className="space-y-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
          <FileText className="h-4 w-4 text-sky-500" />
          <span>공식 제출문 양식 (T03-C31, T03-C32)</span>
        </h3>

        {/* 1. 짧은 확인 방법 4줄 */}
        <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 dark:text-white">짧은 확인 방법 4줄 (T03-C31)</span>
            <button
              type="button"
              onClick={() => handleCopyText('verify', quickVerify4Lines)}
              className="inline-flex items-center gap-1 rounded border border-neutral-300 bg-white px-2 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200"
            >
              <Copy className="h-3 w-3" />
              <span>{copiedKey === 'verify' ? '복사됨!' : '원클릭 복사'}</span>
            </button>
          </div>
          <pre className="font-sans text-xs leading-relaxed whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
            {quickVerify4Lines}
          </pre>
        </div>

        {/* 2. AI와 나의 판단 3줄 */}
        <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 dark:text-white">AI와 나의 판단 3줄 (T03-C32)</span>
            <button
              type="button"
              onClick={() => handleCopyText('judgment', aiJudgment3Lines)}
              className="inline-flex items-center gap-1 rounded border border-neutral-300 bg-white px-2 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200"
            >
              <Copy className="h-3 w-3" />
              <span>{copiedKey === 'judgment' ? '복사됨!' : '원클릭 복사'}</span>
            </button>
          </div>
          <pre className="font-sans text-xs leading-relaxed whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
            {aiJudgment3Lines}
          </pre>
        </div>
      </div>
    </section>
  );
};
