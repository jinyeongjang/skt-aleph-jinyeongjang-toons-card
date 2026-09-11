import React, { useState } from 'react';
import { X, Copy, CheckCircle2, FileText } from 'lucide-react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const quickVerify4Lines = `① 어디로 가나요: 브라우저에서 무로그인 편집기 메인 캔버스(ToonsCard Studio)로 접속합니다.
② 3단계 이내 행동: [이미지 업로드(PNG/JPEG)] → [문구 입력 및 위치/크기/색상 조절] → [PNG 다운로드] 버튼을 클릭합니다.
③ 무엇이 보이면 통과인가요: 실시간 미리보기 캔버스와 다운로드된 PNG 파일의 문구 위치·줄바꿈·이미지 배치가 100% 일치합니다.
④ 안 될 때 무엇이 보이나요: 지원하지 않는 파일(.gif 등) 또는 문법 손상 JSON 업로드 시 기존 작업을 보존하며 빨간색 거부 사유 배너가 즉각 표시됩니다.`;

  const aiJudgment3Lines = `① AI에게 맡긴 일: 1:1·4:5·9:16 다중 화면비의 Canvas 2D 렌더링 수학 공식 설계, 극단 입력 12건의 테스트베드 스캐폴딩 및 Prettier/Oxlint 자동화 검증 지원.
② 학생이 직접 판단한 일: 공백 없는 초장문 영문 텍스트의 Canvas 우측 이탈 결함을 해결하기 위해 grapheme 기반의 지능형 break-word 줄바꿈 알고리즘을 채택하고, 로컬스토리지 안정 ID(UUID) 기반의 자가 치유 CRUD 아키텍처를 결정함.
③ AI 제안을 따르지 않은 일: AI가 초기 렌더링에 외부 폰트 CDN 비동기 fetch를 제안했으나, 오프라인 및 시크릿 창 100% 무결점 렌더링을 보장하기 위해 시스템 표준 폰트 스택 및 document.fonts.ready 동기화 가드로 최종 구현함.`;

  const fullSubmissionDoc = `[과제 3: 짤·카드 스튜디오 공식 제출문]

1. 결과물 주소: https://skt-aleph-jinyeongjang-toonscard.vercel.app (무로그인 공개 편집기)
2. 소스 주소: https://github.com/jinyeongjang/skt-aleph-toonscard

3. 짧은 확인 방법 4줄 (T03-C31):
${quickVerify4Lines}

4. AI와 나의 판단 3줄 (T03-C32):
${aiJudgment3Lines}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 p-4"
    >
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">과제 3 공식 제출 양식</h2>
              <p className="text-xs text-neutral-500">T03-C31 (4줄 확인법) & T03-C32 (3줄 판단문)</p>
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

        {/* 원클릭 전체 복사 버튼 */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => handleCopy('full', fullSubmissionDoc)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copiedKey === 'full' ? '전체 복사 완료!' : '제출문 전체 복사'}</span>
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* 제출물 주소 */}
          <div className="space-y-1.5 rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
            <h3 className="font-bold text-neutral-900 dark:text-white">제출 링크 (T03-C01)</h3>
            <div className="space-y-1 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
              <div>• 결과물 주소: 무로그인 공개 정적 웹 (시크릿 창 즉시 사용)</div>
              <div>• 소스 주소: GitHub 오픈소스 공개 저장소</div>
            </div>
          </div>

          {/* 짧은 확인 방법 4줄 (T03-C31) */}
          <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>짧은 확인 방법 4줄 (T03-C31)</span>
              </h3>
              <button
                type="button"
                onClick={() => handleCopy('verify', quickVerify4Lines)}
                className="rounded border border-neutral-300 bg-white px-2 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {copiedKey === 'verify' ? '복사됨!' : '복사'}
              </button>
            </div>
            <pre className="font-sans leading-relaxed whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
              {quickVerify4Lines}
            </pre>
          </div>

          {/* AI와 나의 판단 3줄 (T03-C32) */}
          <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white">
                <CheckCircle2 className="h-4 w-4 text-sky-500" />
                <span>AI와 나의 판단 3줄 (T03-C32)</span>
              </h3>
              <button
                type="button"
                onClick={() => handleCopy('judgment', aiJudgment3Lines)}
                className="rounded border border-neutral-300 bg-white px-2 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {copiedKey === 'judgment' ? '복사됨!' : '복사'}
              </button>
            </div>
            <pre className="font-sans leading-relaxed whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
              {aiJudgment3Lines}
            </pre>
          </div>
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
