/**
 * 기본 제공 프리셋 이미지 및 샘플 에셋 (SVG Data URL)
 * 외부 네트워크 없이도 100% 오프라인 작동, 저작권 이슈 0건, 위치 메타데이터 0건
 */

// 1:1 밈 카드용 개발자 모니터 배경
export const SAMPLE_IMG_MEME_1X1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1e2e"/>
      <stop offset="50%" stop-color="#181825"/>
      <stop offset="100%" stop-color="#11111b"/>
    </linearGradient>
    <linearGradient id="screen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#313244"/>
      <stop offset="100%" stop-color="#1e1e2e"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#89b4fa" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#89b4fa" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <circle cx="540" cy="540" r="450" fill="url(#glow)"/>
  
  <!-- Desk -->
  <rect x="140" y="800" width="800" height="40" rx="10" fill="#45475a"/>
  
  <!-- Monitor -->
  <rect x="240" y="240" width="600" height="460" rx="20" fill="#313244" stroke="#585b70" stroke-width="8"/>
  <rect x="260" y="260" width="560" height="420" rx="12" fill="url(#screen)"/>
  
  <!-- Code lines on monitor -->
  <rect x="300" y="310" width="160" height="18" rx="6" fill="#f38ba8"/>
  <rect x="480" y="310" width="220" height="18" rx="6" fill="#89b4fa"/>
  <rect x="340" y="350" width="300" height="16" rx="6" fill="#a6e3a1"/>
  <rect x="340" y="390" width="240" height="16" rx="6" fill="#fab387"/>
  <rect x="380" y="430" width="180" height="16" rx="6" fill="#cba6f7"/>
  <rect x="380" y="470" width="320" height="16" rx="6" fill="#94e2d5"/>
  <rect x="340" y="510" width="140" height="16" rx="6" fill="#f9e2af"/>
  <rect x="300" y="550" width="100" height="18" rx="6" fill="#f38ba8"/>
  <circle cx="285" cy="285" r="7" fill="#f38ba8"/>
  <circle cx="310" cy="285" r="7" fill="#f9e2af"/>
  <circle cx="335" cy="285" r="7" fill="#a6e3a1"/>

  <!-- Stand -->
  <rect x="510" y="700" width="60" height="100" fill="#585b70"/>
  <polygon points="460,800 620,800 600,780 480,780" fill="#45475a"/>

  <!-- Coffee mug -->
  <rect x="760" y="730" width="60" height="70" rx="8" fill="#fab387"/>
  <path d="M 820 745 C 845 745 845 775 820 775" fill="none" stroke="#fab387" stroke-width="8"/>
  <path d="M 780 715 Q 775 700 785 685" fill="none" stroke="#fab387" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
  <path d="M 795 715 Q 805 700 795 685" fill="none" stroke="#fab387" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
</svg>`)}`;

// 4:5 카드뉴스용 모던 그라디언트 배경
export const SAMPLE_IMG_QUOTE_4X5 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="quoteBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="40%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#311042"/>
    </linearGradient>
    <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#c084fc" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#quoteBg)"/>
  
  <!-- Subtle geometric circles -->
  <circle cx="200" cy="300" r="380" fill="none" stroke="url(#accentGlow)" stroke-width="2" stroke-dasharray="10 15"/>
  <circle cx="880" cy="1050" r="420" fill="none" stroke="url(#accentGlow)" stroke-width="3" stroke-dasharray="8 20"/>
  <circle cx="900" cy="200" r="180" fill="#38bdf8" fill-opacity="0.05"/>
  <circle cx="150" cy="1150" r="220" fill="#c084fc" fill-opacity="0.06"/>

  <!-- Quotation mark illustration -->
  <path d="M 220 440 C 220 370 260 330 330 320 L 330 380 C 290 390 280 410 280 440 L 330 440 L 330 520 L 220 520 Z
           M 380 440 C 380 370 420 330 490 320 L 490 380 C 450 390 440 410 440 440 L 490 440 L 490 520 L 380 520 Z" 
        fill="#ffffff" fill-opacity="0.12"/>
</svg>`)}`;

// 9:16 숏폼/스토리용 네온 사이버 배경 (고화질 사이버펑크 렌더링 에셋)
export const SAMPLE_IMG_STORY_9X16 = '/presets/cyber_neon_story.jpg';

// 투명 알파 PNG 샘플 (초고화질 3D 골드 & 에메랄드 홀로그래픽 검증 배지 - 100% 알파 투명도)
export const SAMPLE_IMG_TRANSPARENT_PNG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <!-- Outer Glow -->
    <filter id="badgeGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#059669" flood-opacity="0.35"/>
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
    <filter id="checkGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#047857" flood-opacity="0.6"/>
    </filter>
    <!-- Gradients -->
    <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="30%" stop-color="#eab308" />
      <stop offset="70%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#a16207" />
    </linearGradient>
    <linearGradient id="emeraldShield" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="40%" stop-color="#059669" />
      <stop offset="100%" stop-color="#064e3b" />
    </linearGradient>
    <linearGradient id="cyberGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#34d399" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#047857" stop-opacity="0.8" />
    </linearGradient>
    <linearGradient id="glossArc" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#d1fae5" />
    </linearGradient>
  </defs>

  <!-- Notice: Zero background rectangle! Pure 100% alpha transparency around badge -->
  <g filter="url(#badgeGlow)">
    <!-- 24-Point Gold Rosette Seal Base -->
    <g transform="translate(540, 540)">
      <!-- Scalloped Star Teeth -->
      <polygon points="
        0,-410 70,-400 140,-410 200,-360 260,-390 310,-310 370,-320 390,-230 430,-210 420,-120 440,-80 410,0
        440,80 420,120 430,210 390,230 370,320 310,310 260,390 200,360 140,410 70,400 0,410
        -70,400 -140,410 -200,360 -260,390 -310,310 -370,320 -390,230 -430,210 -420,120 -440,80 -410,0
        -440,-80 -420,-120 -430,-210 -390,-230 -370,-320 -310,-310 -260,-390 -200,-360 -140,-410 -70,-400"
        fill="url(#goldRim)" stroke="#fde047" stroke-width="4" stroke-linejoin="round"/>
    </g>

    <!-- Outer Golden Bevel Ring -->
    <circle cx="540" cy="540" r="360" fill="#0f172a" stroke="url(#goldRim)" stroke-width="14"/>
    <circle cx="540" cy="540" r="340" fill="none" stroke="#fde047" stroke-width="2" stroke-dasharray="8 8"/>

    <!-- Inner Emerald Holographic Core -->
    <circle cx="540" cy="540" r="310" fill="url(#emeraldShield)" stroke="url(#goldRim)" stroke-width="8"/>
    <circle cx="540" cy="540" r="300" fill="url(#cyberGlass)"/>

    <!-- Tech Circuit Rings -->
    <circle cx="540" cy="540" r="260" fill="none" stroke="#34d399" stroke-width="2.5" stroke-dasharray="16 12" opacity="0.6"/>
    <circle cx="540" cy="540" r="230" fill="none" stroke="#6ee7b7" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.4"/>

    <!-- Gloss Specular Highlight Arc -->
    <path d="M 280 490 A 280 280 0 0 1 800 490 A 290 200 0 0 0 280 490 Z" fill="url(#glossArc)"/>

    <!-- 3D Embossed Checkmark with Shadow -->
    <path d="M 410 535 L 500 625 L 680 440" fill="none" stroke="#064e3b" stroke-width="50" stroke-linecap="round" stroke-linejoin="round" transform="translate(0, 10)" opacity="0.5"/>
    <path d="M 410 535 L 500 625 L 680 440" fill="none" stroke="url(#checkGrad)" stroke-width="44" stroke-linecap="round" stroke-linejoin="round" filter="url(#checkGlow)"/>

    <!-- Bottom Ribbon Banner -->
    <rect x="330" y="690" width="420" height="70" rx="35" fill="#090d16" stroke="url(#goldRim)" stroke-width="5"/>
    <text x="540" y="736" font-family="'Pretendard', sans-serif" font-size="30" font-weight="900" fill="#fef08a" text-anchor="middle" letter-spacing="4">
      ★ VERIFIED PASS ★
    </text>

    <!-- Top Rating Stars -->
    <polygon points="540,265 548,285 570,288 554,302 559,324 540,312 521,324 526,302 510,288 532,285" fill="#fde047" stroke="#ca8a04" stroke-width="1"/>
    <polygon points="460,280 466,296 484,298 471,310 475,328 460,318 445,328 449,310 436,298 454,296" fill="#fef08a" opacity="0.9"/>
    <polygon points="620,280 626,296 644,298 631,310 635,328 620,318 605,328 609,310 596,298 614,296" fill="#fef08a" opacity="0.9"/>
  </g>
</svg>`)}`;

// 초광폭 가로 이미지 (3840x1080 와이드)
export const SAMPLE_IMG_ULTRA_WIDE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="3840" height="1080" viewBox="0 0 3840 1080">
  <defs>
    <linearGradient id="wideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="3840" height="1080" fill="url(#wideGrad)"/>
  <text x="1920" y="580" font-family="sans-serif" font-size="120" font-weight="bold" fill="#ffffff" text-anchor="middle">
    3840 × 1080 EXTREME ULTRA-WIDE PANORAMA
  </text>
</svg>`)}`;

// 초세로 롱 이미지 (1080x3840 롱)
export const SAMPLE_IMG_ULTRA_TALL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="3840" viewBox="0 0 1080 3840">
  <defs>
    <linearGradient id="tallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="50%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="3840" fill="url(#tallGrad)"/>
  <text x="540" y="1920" font-family="sans-serif" font-size="90" font-weight="bold" fill="#ffffff" text-anchor="middle">
    1080 × 3840 EXTREME VERTICAL TALL
  </text>
</svg>`)}`;

// 1x1 초소형 이미지
export const SAMPLE_IMG_MICRO_1X1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// 프리셋 갤러리 목록
export interface PresetImageOption {
  id: string;
  name: string;
  category: 'meme' | 'quote' | 'story' | 'transparent';
  url: string;
  aspectRatio: '1:1' | '4:5' | '9:16';
  description: string;
}

export const PRESET_IMAGE_GALLERY: PresetImageOption[] = [
  {
    id: 'preset-meme-1',
    name: '💻 개발자 야근 모니터 (1:1)',
    category: 'meme',
    url: SAMPLE_IMG_MEME_1X1,
    aspectRatio: '1:1',
    description: '코딩, 버그, 야근 밈 제작에 최적화된 1:1 모니터 일러스트',
  },
  {
    id: 'preset-quote-1',
    name: '🌌 딥 네이비 명언 카드 (4:5)',
    category: 'quote',
    url: SAMPLE_IMG_QUOTE_4X5,
    aspectRatio: '4:5',
    description: '인스타그램 피드용 고급스러운 그라디언트 명언/정보 카드',
  },
  {
    id: 'preset-story-1',
    name: '⚡ 사이버 네온 숏폼 (9:16)',
    category: 'story',
    url: SAMPLE_IMG_STORY_9X16,
    aspectRatio: '9:16',
    description: '인스타 릴스, 유튜브 쇼츠용 네온 그리드 배경',
  },
  {
    id: 'preset-badge-1',
    name: '✨ 검증 배지 투명 PNG (1:1)',
    category: 'transparent',
    url: SAMPLE_IMG_TRANSPARENT_PNG,
    aspectRatio: '1:1',
    description: '알파 채널이 적용된 투명 합성 스티커',
  },
];
