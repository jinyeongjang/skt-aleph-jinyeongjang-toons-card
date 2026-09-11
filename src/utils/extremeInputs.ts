import type { ExtremeTestCase } from '../types/studio';
import {
  SAMPLE_IMG_MICRO_1X1,
  SAMPLE_IMG_TRANSPARENT_PNG,
  SAMPLE_IMG_ULTRA_TALL,
  SAMPLE_IMG_ULTRA_WIDE,
} from './sampleImages';

/**
 * 과제 3 카드 3: 극단 입력 12건 검사표 데이터 (T03-C14 ~ T03-C16)
 * - 긴 한글, 영문 혼합, 줄바꿈, 이모지, 빈 문구, 세로/가로/투명 이미지 등 12개 검사 기록 전수 수록
 * - T03-C15: 대표 결함(공백 없는 긴 영문 단어 오버플로우) 수정 전 FAIL -> 수정 후 PASS 대조
 */
export const EXTREME_TEST_CASES: ExtremeTestCase[] = [
  {
    id: 1,
    name: '공백 없는 초장문 한글',
    category: '문자열',
    description: '공백이 전혀 없는 70자 이상의 연속 한글 텍스트 입력 시 영역 오버플로우 검사',
    payload: {
      text: '가나다라마바사아자차카타파하가나다라마바사아자차카타파하공백없이이어지는초장문한글테스트문장입니다화면밖으로튀어나가지않고자동으로글자단위줄바꿈이되어야합니다',
      fontSize: 48,
    },
    expectedBehavior: '캔버스 최대 너비(1080px - 여백 120px)를 초과하지 않고 글자 단위로 부드럽게 줄바꿈됨',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: '한글 특성상 글자 단위 래핑이 자연스럽게 처리됨',
  },
  {
    id: 2,
    name: '공백 없는 초장문 영문/숫자 (대표 결함)',
    category: '문자열',
    description: 'Pneumonoultramicroscopicsilicovolcanoconiosis_1234567890 긴 영문 단어 입력',
    payload: {
      text: 'Supercalifragilisticexpialidocious_Pneumonoultramicroscopicsilicovolcanoconiosis_2026_TEST_0123456789',
      fontSize: 52,
    },
    expectedBehavior: '단어 내부에서 강제 줄바꿈(break-word)이 적용되어 캔버스 우측 경계를 넘지 않음',
    statusBefore: 'FAIL', // T03-C15: 대표 결함 수정 전 FAIL!
    statusAfter: 'PASS', // 수정 후 PASS!
    defectSummary:
      '[T03-C15 결함 수정 전후]\n• 수정 전(FAIL): 기본 split(" ") 단어 줄바꿈 사용 시, 단어 자체가 폭을 초과하여 캔버스 우측으로 텍스트가 잘려나감.\n• 수정 후(PASS): grapheme/문자 단위 너비 누적 검사 알고리즘을 도입하여 단어 중간이라도 한계 도달 시 즉시 개행 처리.',
  },
  {
    id: 3,
    name: '연속 다중 줄바꿈 (빈 줄 다수)',
    category: '줄바꿈',
    description: '엔터키를 연속 5회 이상 입력하여 빈 줄이 다수 포함된 다중 행 텍스트',
    payload: {
      text: '첫 번째 줄 (헤드라인)\n\n\n\n\n다섯 칸 공백 줄바꿈 뒤에 위치한 마지막 줄 텍스트',
      fontSize: 40,
    },
    expectedBehavior: '빈 줄 높이가 균등하게 유지되며 캔버스 상하를 벗어나지 않고 일관된 행간 유지',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: '빈 줄 개행 높이(1.35em)를 정상 유지하여 텍스트 뭉개짐 방지',
  },
  {
    id: 4,
    name: '복합 이모지 및 특수문자 혼합',
    category: '문자열',
    description: '가변폭 ZWJ(Zero-Width Joiner) 이모지 및 다국어 기호 렌더링',
    payload: {
      text: '🔥🚀🎉 2026 AI 풀스택 개발자 💻✨👨‍👩‍👧‍👦 100% 검증 통과 💯🌟',
      fontSize: 46,
    },
    expectedBehavior: '이모지가 깨지거나 잘리지 않고 고해상도로 선명하게 캔버스에 렌더링됨',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: '시스템 컬러 이모지 폰트 폴백 스택 정상 적용',
  },
  {
    id: 5,
    name: '공백 문자열 및 빈 텍스트',
    category: '경계값',
    description: '스페이스바만 여러 번 입력하거나 완전 빈 문자열 입력 시의 방어 로직',
    payload: {
      text: '       ',
      fontSize: 48,
    },
    expectedBehavior: '런타임 에러 0건 유지 및 기존 배경 이미지 및 설정이 100% 안전하게 유지됨',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: '빈 텍스트 trim 검사 후 조기 리턴으로 Canvas 불필요 드로잉 방지',
  },
  {
    id: 6,
    name: '초고해상도 울트라와이드 이미지',
    category: '이미지',
    description: '3840×1080 (32:9 극단적 가로 비율) 고해상도 파노라마 이미지 로드',
    payload: {
      text: '3840×1080 와이드 이미지 피팅 검사',
      imageType: 'wide',
    },
    expectedBehavior: 'cover/contain 모드에 맞춰 왜곡 없이 중앙 정렬 및 선명도 유지',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: 'scale factor 계산 시 Math.max/min 비례식으로 왜곡 방지',
  },
  {
    id: 7,
    name: '초고해상도 익스트림 롱 세로 이미지',
    category: '이미지',
    description: '1080×3840 (1:3.5 극단적 세로 비율) 초장축 세로 이미지 로드',
    payload: {
      text: '1080×3840 세로 롱 이미지 피팅 검사',
      imageType: 'tall',
    },
    expectedBehavior: '캔버스 비율(1:1, 4:5, 9:16)에 맞추어 센터 크롭 혹은 레터박스로 안정 렌더링',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: '상하 오프셋 클램핑 정상 작동',
  },
  {
    id: 8,
    name: '투명 알파 채널(PNG) 이미지',
    category: '이미지',
    description: '배경이 투명한 PNG 배지/스티커 이미지 합성',
    payload: {
      text: '투명 PNG 합성 및 배경색 조화 검사',
      imageType: 'transparent',
    },
    expectedBehavior: '투명 영역이 검은색으로 깨지지 않고 설정한 배경색과 매끄럽게 블렌딩됨',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: 'Canvas 2D 알파 채널 합성 기본 지원',
  },
  {
    id: 9,
    name: '1×1 픽셀 극소형 이미지',
    category: '경계값',
    description: '가로세로 1px 크기의 극단적으로 작은 이미지 로드',
    payload: {
      text: '1×1 픽셀 이미지 예외 처리 검사',
      imageType: 'micro',
    },
    expectedBehavior: '0 나누기 에러(Divide-by-Zero) 없이 최소 크기 보정되어 정상 렌더링',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: '이미지 자연 크기(naturalWidth/Height) 최소 1px 가드 적용',
  },
  {
    id: 10,
    name: 'HTML/스크립트 XSS 인젝션 문자열',
    category: '보안',
    description: '<script>alert("XSS")</script><b onmouseover="eval()"> 등 악성 태그 주입',
    payload: {
      text: '<script>alert("XSS 공격 시도");</script><img src=x onerror="alert(1)">',
      fontSize: 42,
    },
    expectedBehavior: '스크립트가 실행되지 않고 Canvas에 순수 텍스트 리터럴로 안전하게 그려짐',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: 'HTML DOM 직접 삽입이 아닌 Canvas fillText API 사용으로 원천 방어',
  },
  {
    id: 11,
    name: 'RTL 다국어 및 특수 기호 혼합',
    category: '문자열',
    description: '오른쪽에서 왼쪽으로 쓰는 아랍어 및 특수 기호 혼합 문자열',
    payload: {
      text: 'مرحبا بالعالم (Hello World) §¶†‡★☆ 2026 ToonsCard Studio',
      fontSize: 44,
    },
    expectedBehavior: 'RTL/LTR 혼합 유니코드 시퀀스가 반전되거나 오류 없이 정상 표시됨',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: '유니코드 바이디렉셔널(Bidi) 폰트 렌더링 정상 처리',
  },
  {
    id: 12,
    name: '극단적 폰트 크기 경계값 (120px 초대형)',
    category: '경계값',
    description: '최대 허용 폰트 크기(120px) 적용 시 행간 및 캔버스 상하단 여백 검사',
    payload: {
      text: '최대 폰트 120px 초대형 헤드라인',
      fontSize: 120,
    },
    expectedBehavior: '글자 상하단이 잘리지 않고 지정된 패딩 영역 내에 완벽히 정렬됨',
    statusBefore: 'PASS',
    statusAfter: 'PASS',
    defectSummary: '폰트 크기 비례 동적 행간(lineHeight = 1.35 * fontSize) 적용',
  },
];

/**
 * 극단 테스트 페이로드로부터 이미지 URL 매핑
 */
export const getExtremeTestImageUrl = (imageType?: string): string | undefined => {
  switch (imageType) {
    case 'wide':
      return SAMPLE_IMG_ULTRA_WIDE;
    case 'tall':
      return SAMPLE_IMG_ULTRA_TALL;
    case 'transparent':
      return SAMPLE_IMG_TRANSPARENT_PNG;
    case 'micro':
      return SAMPLE_IMG_MICRO_1X1;
    default:
      return undefined;
  }
};
