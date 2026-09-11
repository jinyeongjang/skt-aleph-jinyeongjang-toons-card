import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200/80 bg-white/70 py-4 text-center text-xs text-neutral-500 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
        <p className="font-mono text-[11px]">
          © 2026 ToonsCard Studio · SKT ALEPH 짤·카드 스튜디오 (과제 3) · 개발자 장진영
        </p>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
          무로그인 공개 정적 웹 · EXIF 위치정보 0건 · 개인정보 0건
        </p>
      </div>
    </footer>
  );
};
