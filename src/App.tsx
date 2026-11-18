import React, { useState, useEffect } from "react";
import {
  Siren,
  Search,
  FileText,
  BookOpen,
  MessageSquare,
  BarChart3,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Send,
  PieChart,
  Check,
  Edit2,
  Users,
  Plus,
  ShieldAlert,
  ShieldCheck,
  QrCode,
  Download,
  Trash2,
  Paperclip,
  Clock,
  Calendar,
  ArrowUpDown,
  Eye,
  EyeOff,
  UserX,
  ExternalLink,
} from "lucide-react";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  collection,
  deleteDoc,
} from "firebase/firestore";

const USER_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDSlBOW8Q9TgnaFdaP5nEuB-lF8EZST_-0",
  authDomain: "seoulfisingx.firebaseapp.com",
  projectId: "seoulfisingx",
  storageBucket: "seoulfisingx.firebasestorage.app",
  messagingSenderId: "292025374229",
  appId: "1:292025374229:web:83741c37d0c1721af1e01c",
  measurementId: "G-R55Z7L668H",
};

const SESSION_STORAGE_KEY = "seoul_phishing_x_auth_session";

let app,
  auth,
  db,
  appId = "seoulfisingx-app";
try {
  const envConfig =
    typeof __firebase_config !== "undefined" && __firebase_config
      ? JSON.parse(__firebase_config)
      : null;
  const firebaseConfig =
    envConfig && Object.keys(envConfig).length > 0
      ? envConfig
      : USER_FIREBASE_CONFIG;

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  if (typeof __app_id !== "undefined" && __app_id) {
    appId = __app_id;
  }
} catch (e) {
  console.log("Firebase init fallback mode", e);
}

const GUIDE_MANUAL_DEFAULT = {
  id: 999,
  isSpecialGuide: true,
  title: "[필독] 악성앱 추출 및 완전 삭제 통합 가이드 (붙임5·6)",
  tag: "필독 가이드",
  qrUrl: "http://m.site.naver.com/1Hu36",
  extractOverview:
    "피해자의 휴대전화를 탐색, 악성앱으로 의심되는 설치파일(apk)을 추출하여 KISA '사이버사기시스템'으로 전송 → 유관기관(금융보안원·삼성·통신사 등) 공유를 통한 악성앱 차단 및 예방 기술개발에 활용",
  extractWarning:
    "악성 앱 추출 후 악성앱은 별도 제거 필요 및 제거가 안 될 경우 반드시 휴대전화 초기화 안내",
  deleteVaccineNotice:
    "피해자 휴대전화기기에 'V3 Mobile Plus' 혹은 '알약M' 설치하여 휴대전화에 설치된 악성앱이 있는지 백신 검사",
  hiddenSystemApps: [
    "실시간보호",
    "스마트보호",
    "모바일가드",
    "모바일인증",
    "모바일대출 등",
  ],
  impersonationApps: [
    "서민금융잇다",
    "시티즌코난, 시티즌코어",
    "CleanMaster",
    "knfa, kca",
    "AI Call, AI eyes",
    "한국소비자보호원(한국소비자원)",
    "신한저축은행, OK저축은행 등 시중은행 앱과 명칭 유사",
  ],
  resetWarning:
    "악성앱이 수동으로 삭제되지 않는 경우도 있으므로, 반드시 휴대전화 초기화 할 수 있도록 안내해야 함",
  apkDeleteWarning:
    "악성앱을 삭제한 이후라도, 설치파일(.apk/.zip)을 다시 누르면 악성앱이 재설치되므로 설치파일도 함께 삭제해야 함",
  content:
    "[붙임5] 악성 앱 추출 가이드 및 [붙임6] 악성 앱 삭제 가이드 통합 상세 매뉴얼입니다.",
};

const ADMIN_WELFARE_MANUAL_DEFAULT = {
  id: 998,
  title: "신종 시나리오: 행정복지센터 및 경찰 사칭 비대면(우편함) 현금 편취",
  tag: "최신 경보",
  content: `[수법 개요]
• 사건 명칭: 행정복지센터 및 경찰 사칭 결합형 비대면 편취 사기
• 핵심 특징: 일상적인 행정 연락(주민등록등본 대리 발급 문의)으로 경계심을 무너뜨린 뒤, 기관 사칭(경찰관)으로 연계해 공포심을 유발하고 비대면(우편함 등)으로 현금을 편취하는 신종 수법

🚨 [단계별 범행 시나리오 흐름]

① 1단계: 행정복지센터 사칭 (명의도용 불안감 조성)
• 범행 수법: 가해자가 행정복지센터 직원을 사칭하여 연락
• 주요 멘트: "친척이 위임장을 들고 와서 등본 발급을 요구했는데, 혹시 아시는 분인가요?"
• 심리 유도: 피해자가 모르는 사람이라며 당황하면, 명의도용 피해 우려가 크다며 "저희 쪽에서 대신 경찰에 신고해 주겠다"고 안심시킨 뒤 전화를 끊고 다음 연락을 유도

② 2단계: 경찰관 사칭 (범죄 연루 압박 및 고립)
• 범행 수법: 직후에 사칭범이 경찰관(형사팀)인 것처럼 다시 연락
• 주요 멘트: "서울 OO경찰서 형사입니다. 행정복지센터 신고 접수를 받고 확인해 보니, 현재 선생님 명의도용 및 대포통장 개설 시도가 포착되었습니다."
• 심리 고립: "공범으로 오인될 수 있으니 수사가 끝날 때까지 가족을 포함한 주변 사람들에게 절대 알리지 마십시오."

③ 3단계: 임시 보호 조치 빙자 (현금 인출 및 보관 지시)
• 범행 수법: 자산 보호를 명목으로 현금을 직접 찾아 특정 장소에 두도록 강요
• 주요 멘트: "계좌에 있는 자산이 불법 자금과 섞였는지 확인하고 보호해야 합니다. 현금을 인출해 자택 우편함에 넣어두시면, 저희가 회수해 확인 후 즉시 돌려드리겠습니다."
• 행동 지시: 피해자로 하여금 ATM 무카드/무통장 인출 등을 통해 현금을 전액 찾게 한 뒤, 자택 우편함에 넣고 인증 사진을 전송하도록 강요

④ 4단계: 수거책 현금 탈취
• 범행 수법: 피해자가 우편함 보관 인증 사진을 보내면, 인근에 대기 중이던 수거책이 즉시 우편함을 열어 현금 봉투를 들고 도주

🛡️ [현장 대응 및 피해 예방 핵심 수칙]
• 공공기관의 대리 신고 부재: 행정복지센터 직원이 개인의 명의도용 피해를 대신 경찰에 접수해 주거나, 직후에 경찰관이 개인 휴대폰으로 바로 연락하는 공식 절차는 존재하지 않습니다.
• 비대면 현금 인출·보관 요구는 100% 사기: 경찰, 검찰, 금융감독원 등 어떤 수사·금융기관도 자산 보호나 범죄 연루 확인을 명목으로 현금 인출을 요구하거나 우편함·보관함 등에 돈을 넣어두라고 지시하지 않습니다.
• 즉시 신고 및 대처: 유사한 전화를 받았을 경우 즉시 통화를 종료하고, 주변의 다른 전화를 통해 112 또는 경찰청 보이스피싱 통합신고·상담센터(1394)로 진위 여부를 반드시 확인해야 합니다.`,
};

const INITIAL_MANUALS = [
  GUIDE_MANUAL_DEFAULT,
  ADMIN_WELFARE_MANUAL_DEFAULT,
  {
    id: 1,
    title: "신종 수법: 중고폰 유도 및 원격제어 차단",
    tag: "최신 경보",
    content:
      "당근마켓 등에서 공기계 구매를 유도한 후, AnyDesk 등 원격제어 앱을 설치하게 하여 피해자의 연락망을 통제하는 수법이 급증하고 있습니다.\n\n[초동 조치]\n1. 즉시 비행기 탑승 모드 전환\n2. USIM 제거\n3. 타 기기에서 계좌지급정지 우선 실행",
  },
  {
    id: 2,
    title: "청첩장·택배 사칭 스미싱 대응",
    tag: "스미싱",
    content:
      '문자 내 단축 URL 클릭 시 악성 APK가 설치되며 주소록 및 인증번호가 탈취됩니다.\n\n[초동 조치]\n1. 비행기 탑승 모드\n2. 통신사 고객센터 통한 "소액결제 차단" 및 "착신전환 해제" 확인\n3. 악성 앱 삭제 전 증거(APK) 백업 권장',
  },
  {
    id: 3,
    title: "대출빙자형 전화가로채기(악성앱)",
    tag: "보이스피싱",
    content:
      "피해자가 금감원(1332)이나 경찰(112)로 전화해도 보이스피싱 조직으로 연결되도록 통화를 가로채는 악성앱입니다.\n\n[초동 조치]\n1. 피해자 기기로는 절대 확인 전화 금지\n2. 출동 경찰관의 기기 또는 다른 유선 전화로 금융사 지급정지 요청",
  },
];

const INITIAL_NEWS = [
  {
    id: "news-1",
    createdAt: 1763400000003,
    tag: "주민센터사칭",
    title:
      "“친척이 등본 떼러 왔는데…” 행정복지센터·경찰 사칭 우편함 현금 편취 주의보",
    press: "경찰청 알리미 · 2026.11",
    url: "https://www.youtube.com/watch?v=MkStRakOvV4",
  },
  {
    id: "news-2",
    createdAt: 1763400000002,
    tag: "카드배송사칭",
    title:
      "“신청 안 한 카드가 배송됐다” 원격제어·악성앱 설치 유도 보이스피싱 급증",
    press: "수사지원팀 경보 · 2026.11",
    url: "https://www.police.go.kr",
  },
  {
    id: "news-3",
    createdAt: 1763400000001,
    tag: "악성앱구제",
    title:
      "서울경찰청 형사과, 보이스피싱 악성앱 피해 대상자 실시간 대면 구제 총력 대응",
    press: "서울경찰청 · 2026.11",
    url: "https://www.smpa.go.kr",
  },
];

const INITIAL_REPORTS = [
  {
    id: "REP-2026-0893",
    date: "2026. 11. 13",
    serialNumber: "25301",
    victimName: "김철수",
    team: "서초서 피싱팀(대면)",
    officer: "경사 박진우",
    dispatchResult: "조치완료",
    faceToFace: "대면",
    contacted: "악성앱 설치",
    crimeType: "카드배송",
    phoneMaker: "삼성/갤럭시",
    appExtracted: "추출 완료",
    appDeleted: "삭제 완료",
    damageAmount: "0",
    preventedAmount: "32000000",
    summary:
      "카드 배송 사칭 연락을 받고 원격제어 앱 및 악성앱을 설치한 피해자를 즉시 대면하여 비행기모드 전환 후 악성앱 추출 및 삭제 완료. 은행 지급정지로 3,200만원 인출 예방.",
    status: "접수완료",
  },
  {
    id: "REP-2026-0892",
    date: "2026. 11. 12",
    serialNumber: "25296",
    victimName: "홍길동",
    team: "강남서 강력1팀",
    officer: "경위 이민수",
    dispatchResult: "조치완료",
    faceToFace: "대면",
    contacted: "직접 연락",
    crimeType: "기관사칭",
    phoneMaker: "삼성/갤럭시",
    appExtracted: "추출 완료",
    appDeleted: "삭제 완료",
    damageAmount: "0",
    preventedAmount: "45000000",
    summary:
      "피해자 고립 직전 현장 도착하여 데이터 차단 후 지급정지 완료. 악성앱 2개 추출 및 삭제.",
    status: "관리자 확인완료",
  },
];

const INITIAL_POSTS = [
  {
    id: 1,
    author: "관악서 형사3팀",
    time: "10분 전",
    category: "신종APK",
    content:
      '"모바일건강보험증" 사칭하는 새로운 악성 APK 떴습니다. 패키지명 com.nhis.mobile.sec 주의바랍니다. 아이콘이 교묘하네요.',
  },
  {
    id: 2,
    author: "서울청 형사지원계 (관리자)",
    time: "1시간 전",
    category: "공지",
    content:
      "[긴급] 현재 AnyDesk를 이용한 중고폰 유도 수법이 강남, 서초 일대에서 연속 4건 발생했습니다. 출동 시 무조건 비행기모드부터 실행하세요!",
  },
];

const normalizeReportDate = (report) => {
  if (!report) return "날짜 미기재";
  const rawDate = report.date || report.dispatchDate || "";

  if (typeof rawDate === "string" && rawDate !== "날짜 미상") {
    const nums = rawDate.match(/\d+/g);
    if (nums && nums.length >= 3) {
      let year = nums[0];
      if (year.length === 2) year = `20${year}`;
      const month = String(nums[1]).padStart(2, "0");
      const day = String(nums[2]).padStart(2, "0");
      return `${year}. ${month}. ${day}`;
    }
  }

  let ts = report.createdAt;
  if (!ts && typeof report.id === "string") {
    const idMatch = report.id.match(/^REP-(\d{13})$/);
    if (idMatch) ts = Number(idMatch[1]);
  }
  if (ts) {
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}. ${month}. ${day}`;
    }
  }

  const today = new Date();
  return `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}. ${String(today.getDate()).padStart(2, "0")}`;
};

const extractYearMonth = (normalizedDate) => {
  const match = String(normalizedDate).match(/^(\d{4})\.\s*(\d{2})/);
  if (match) {
    return `${match[1]}년 ${Number(match[2])}월`;
  }
  return "기타 기간";
};

const getTodayFormatted = () => {
  const d = new Date();
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}. ${String(d.getDate()).padStart(2, "0")}`;
};

const formatJoinDate = (ts) => {
  if (!ts) return "날짜 정보 없음";
  const d = new Date(Number(ts));
  if (isNaN(d.getTime())) return "날짜 정보 없음";
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}. ${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
    2,
    "0"
  )}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// 원본 스플래시 이미지(/splash.jpg)가 있으면 그대로 표시하고, 없을 시 고해상도 폴백 레이아웃 표시
const SplashScreen = ({ fadingOut, onSkip }) => {
  const [imgLoaded, setImgLoaded] = useState(true);

  return (
    <div
      onClick={onSkip}
      className={`fixed inset-0 z-[2147483647] bg-black flex flex-col justify-between select-none overflow-hidden cursor-pointer transition-opacity duration-500 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {imgLoaded && (
        <img
          src="/splash.jpg"
          alt="서울형사 피싱X"
          onError={() => setImgLoaded(false)}
          className="absolute inset-0 w-full h-full object-cover sm:object-contain bg-black z-20"
        />
      )}

      {/* 상단 다크 브러시드 메탈 질감 영역 */}
      <div
        className="w-full h-[23.8%] relative overflow-hidden shrink-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 35%, #323232 0%, #242424 55%, #111111 92%, #050505 100%)",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent via-black/75 to-black" />
      </div>

      {/* 중앙 순수 블랙 배경 & '서울형사 피싱 X' 로고 영역 */}
      <div className="flex-1 bg-black flex items-center justify-center px-4 relative">
        <svg
          viewBox="0 0 724 220"
          className="w-full max-w-[420px] h-auto overflow-visible"
          aria-label="서울형사 피싱 X"
        >
          <text
            x="118"
            y="134"
            fill="#B2B4B7"
            fontSize="66"
            fontWeight="900"
            letterSpacing="-3"
            style={{
              fontFamily:
                "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
            }}
          >
            서울형사
          </text>
          <text
            x="372"
            y="136"
            fill="#FFFFFF"
            fontSize="72"
            fontWeight="900"
            letterSpacing="-2"
            style={{
              fontFamily:
                "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
            }}
          >
            피싱
          </text>
          <text
            x="530"
            y="141"
            fill="#DC0609"
            fontSize="92"
            fontWeight="900"
            style={{
              fontFamily: "'Montserrat', 'Pretendard', sans-serif",
            }}
          >
            X
          </text>
        </svg>
      </div>

      {/* 하단 영역 + 남색(#2C314E) '서울경찰청 형사과' 바 */}
      <div className="w-full h-[23.8%] flex flex-col shrink-0">
        <div
          className="flex-1 w-full relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 95% 85% at 50% 62%, #303030 0%, #222222 55%, #101010 92%, #050505 100%)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black via-black/75 to-transparent z-10" />
        </div>
        <div
          className="w-full h-[30%] min-h-[48px] max-h-[64px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#2C314E" }}
        >
          <span
            className="text-white text-[14px] sm:text-[15px] tracking-tight font-bold"
            style={{
              fontFamily:
                "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', sans-serif",
            }}
          >
            서울경찰청 형사과
          </span>
        </div>
      </div>
    </div>
  );
};

// 상단 로고 컴포넌트: 서울형사 피싱X
const SeoulPhishingXLogo = ({ size = "md", darkText = false }) => {
  const isLarge = size === "lg";

  return (
    <span
      className="inline-flex items-baseline select-none antialiased"
      style={{
        fontFamily:
          "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
      }}
      aria-label="서울형사 피싱X"
    >
      <span
        className={`${
          darkText ? "text-slate-600" : "text-[#CBD5E1]"
        } tracking-tight ${
          isLarge ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
        }`}
        style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      >
        서울형사
      </span>
      <span
        className={`${
          darkText ? "text-slate-900" : "text-white"
        } tracking-tight ml-1.5 ${
          isLarge ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
        }`}
        style={{ fontWeight: 900 }}
      >
        피싱
      </span>
      <span
        className={`text-[#E60000] ml-0.5 ${
          darkText
            ? "drop-shadow-[0_2px_6px_rgba(230,0,0,0.22)]"
            : "drop-shadow-[0_0_10px_rgba(255,26,26,0.5)]"
        } ${isLarge ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"}`}
        style={{
          fontFamily: "'Montserrat', 'Pretendard', sans-serif",
          fontWeight: 900,
        }}
      >
        X
      </span>
    </span>
  );
};

// [붙임5·6] 악성앱 추출 및 삭제 통합 매뉴얼 상세페이지 컴포넌트
const ExtractionDeletionGuideDetail = ({ manualData }) => {
  const [subTab, setSubTab] = useState("all");
  const data = { ...GUIDE_MANUAL_DEFAULT, ...(manualData || {}) };
  const hiddenList = Array.isArray(data.hiddenSystemApps)
    ? data.hiddenSystemApps
    : GUIDE_MANUAL_DEFAULT.hiddenSystemApps;
  const impersonationList = Array.isArray(data.impersonationApps)
    ? data.impersonationApps
    : GUIDE_MANUAL_DEFAULT.impersonationApps;

  return (
    <div className="p-4 sm:p-5 space-y-5 bg-slate-50/60">
      <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 p-1 rounded-2xl">
        {[
          { id: "all", label: "전체과정 한눈에" },
          { id: "extract", label: "붙임5. 추출 가이드" },
          { id: "delete", label: "붙임6. 삭제 가이드" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id)}
            className={`py-2 px-2 rounded-xl text-[11px] font-black transition whitespace-nowrap ${
              subTab === t.id
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(subTab === "all" || subTab === "extract") && (
        <div className="bg-white rounded-[1.75rem] border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="bg-blue-500 text-white text-[11px] font-black px-2.5 py-1 rounded-lg">
                붙임 5
              </span>
              <h3 className="text-sm sm:text-base font-black tracking-tight">
                악성 앱 추출 가이드
              </h3>
            </div>
            <span className="text-[10px] font-bold text-blue-200 bg-white/10 px-2.5 py-1 rounded-lg">
              경찰청 디지털포렌식센터
            </span>
          </div>

          <div className="p-5 space-y-5">
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 space-y-1.5">
              <div className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                악성앱 추출 프로그램 개요 (경찰청 디지털포렌식센터 개발)
              </div>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                {data.extractOverview}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                추출 절차 (갤럭시·안드로이드 휴대전화 전용)
              </h4>

              <div className="space-y-2.5">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                  <div className="text-xs font-black text-slate-900 mb-1">
                    ① 피해자의 휴대전화에서 ‘악성 앱 자동추출 프로그램(앱)’ 설치
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                    → ‘피해자의 휴대폰’으로 QR코드 촬영 또는 링크(
                    <span className="text-blue-600 underline font-black">
                      {data.qrUrl}
                    </span>
                    ) 접속하여 다운로드
                  </p>
                  <p className="text-[11px] text-rose-600 font-extrabold mt-1">
                    ※ 갤럭시(안드로이드 기반) 휴대전화에만 설치 가능
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                  <div className="text-xs font-black text-slate-900 mb-1">
                    ② ‘악성 앱 자동 추출 프로그램’ 실행
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                    → 프로그램 실행 후 유해한 앱이라는 안내창이 뜨면{" "}
                    <span className="text-rose-600 font-black">
                      ‘무시하고 설치’
                    </span>{" "}
                    클릭, 추출 경찰관 정보 입력 후 검사 시작 및 전송 여부 확인
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
                  <div className="text-xs font-black text-amber-900 mb-0.5">
                    ③ 악성 앱 추출 후 반드시 별도 제거 필요!
                  </div>
                  <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                    → {data.extractWarning}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="border border-slate-200 rounded-2xl p-4 bg-white flex flex-col items-center text-center justify-between">
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black bg-slate-900 text-white px-2.5 py-0.5 rounded-lg">
                    STEP 1
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    카메라 스캔
                  </span>
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    data.qrUrl
                  )}`}
                  alt="악성앱 추출 앱 QR"
                  className="w-28 h-28 object-contain border border-slate-200 rounded-xl p-1.5 my-1"
                />
                <div className="text-[11px] font-black text-slate-800 mt-2">
                  ① 피해자 휴대전화로 QR인식
                </div>
                <div className="text-[10px] font-bold text-blue-600">
                  {data.qrUrl}
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-white flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black bg-slate-900 text-white px-2.5 py-0.5 rounded-lg">
                    STEP 2
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    설치 팝업
                  </span>
                </div>
                <div className="bg-slate-900 text-white rounded-xl p-3 space-y-2 text-[10px] my-1">
                  <div className="font-bold text-slate-200">
                    파일을 다운로드하시겠습니까?
                  </div>
                  <div className="flex justify-end gap-3 pt-1 border-t border-slate-700 font-black">
                    <span className="text-slate-400">취소</span>
                    <span className="text-blue-400 ring-2 ring-rose-500 px-1.5 rounded">
                      다운로드 / 설치
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-black text-slate-800 text-center mt-2">
                  ② 파일 다운로드 권한 허용 클릭
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-white flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black bg-rose-600 text-white px-2.5 py-0.5 rounded-lg">
                    STEP 3 (중요)
                  </span>
                  <span className="text-[10px] font-bold text-rose-500">
                    차단 우회
                  </span>
                </div>
                <div className="bg-slate-900 text-white rounded-xl p-3 space-y-1.5 text-[10px] my-1">
                  <div className="text-rose-400 font-black">
                    ⚠ 유해한 앱 차단됨
                  </div>
                  <div className="text-slate-300 text-[9.5px]">
                    Play 프로텍트에서 이 앱을 인식하지 못합니다.
                  </div>
                  <div className="pt-1">
                    <span className="inline-block border border-rose-500 bg-rose-500/20 text-rose-300 font-black px-2 py-0.5 rounded">
                      무시하고 설치하기 (클릭)
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-black text-slate-800 text-center mt-2">
                  ③ ‘무시하고 설치하기’ 선택 후 설치
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-white flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-lg">
                    STEP 4
                  </span>
                  <span className="text-[10px] font-bold text-blue-600">
                    KISA 자동전송
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1 text-[10px] my-1">
                  <div className="font-black text-slate-800 text-center border-b border-slate-200 pb-1">
                    수사관정보 입력
                  </div>
                  <div className="flex justify-between text-slate-500 font-bold">
                    <span>소속 / 계급 / 성명</span>
                    <span className="text-slate-800">
                      서울청 / 경사 / 홍길동
                    </span>
                  </div>
                  <div className="bg-blue-600 text-white text-center py-1 rounded font-black mt-1">
                    검사 시작 및 전송
                  </div>
                </div>
                <div className="text-[11px] font-black text-slate-800 text-center mt-2">
                  ④ 수사관정보 입력 후 전송 확인
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(subTab === "all" || subTab === "delete") && (
        <div className="bg-white rounded-[1.75rem] border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-rose-900 to-slate-900 px-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="bg-rose-500 text-white text-[11px] font-black px-2.5 py-1 rounded-lg">
                붙임 6
              </span>
              <h3 className="text-sm sm:text-base font-black tracking-tight">
                악성 앱 삭제 가이드 (1~2 모두 실행 필수)
              </h3>
            </div>
          </div>

          <div className="p-5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  단계 1
                </span>
                <h4 className="text-sm font-black text-slate-900">
                  이미 설치된 악성앱을 삭제하는 방법
                </h4>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs font-extrabold text-emerald-900">
                🛡 {data.deleteVaccineNotice}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    step: "① 설정 진입",
                    desc: "휴대전화 상단바를 내려 우측 상단 설정(⚙️) 선택",
                  },
                  {
                    step: "② 아래로 스크롤",
                    desc: "설정 화면에서 아래로 내림(드래그)",
                  },
                  {
                    step: "③ 애플리케이션",
                    desc: "메뉴 중 [애플리케이션] 항목 선택",
                  },
                  {
                    step: "④ 정렬기준 선택",
                    desc: "앱 목록 우측의 정렬 아이콘(⇅) 선택",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between"
                  >
                    <div className="text-xs font-black text-blue-700 mb-1">
                      {item.step}
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 leading-snug">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-xs font-black text-amber-300">
                      ⑤ 필터 및 정렬 설정 (필수!)
                    </span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                      갤럭시 화면
                    </span>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-3 flex items-center justify-between border border-amber-400/60">
                    <div>
                      <div className="text-xs font-black text-white">
                        시스템 앱 표시
                      </div>
                      <div className="text-[10px] text-amber-300 font-bold">
                        반드시 켜야 숨겨진 악성앱 확인 가능!
                      </div>
                    </div>
                    <div className="w-10 h-5 bg-blue-500 rounded-full flex items-center justify-end p-0.5">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-3 space-y-1.5 border border-amber-400/60">
                    <div className="text-[10px] text-slate-400 font-bold">
                      정렬 기준 (아래 2개 중 선택하여 최근 설치앱 색출)
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                      최근 사용 이력 순
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                      마지막 업데이트 순
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-black text-rose-900 border-b border-rose-200 pb-2">
                    ⑥ 주요 의심 악성앱 명칭 예시 (즉시 삭제)
                  </div>

                  <div>
                    <div className="text-[11px] font-black text-rose-700 mb-1.5">
                      ■ 숨겨진 악성앱 (시스템 앱 · 바탕화면에 안 보임)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hiddenList.map((name, i) => (
                        <span
                          key={i}
                          className="bg-white border border-rose-200 text-rose-800 text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-black text-slate-800 mb-1.5">
                      ■ 주요 사칭 악성앱 (바탕화면에서 확인됨)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {impersonationList.map((name, i) => (
                        <span
                          key={i}
                          className="bg-white border border-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs font-extrabold text-amber-900">
                ⚠️ {data.resetWarning}
              </div>
            </div>

            <div className="space-y-4 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  단계 2
                </span>
                <h4 className="text-sm font-black text-slate-900">
                  악성앱 설치파일(APK·ZIP)을 완전 삭제하는 방법
                </h4>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs font-extrabold text-rose-800">
                🚨 {data.apkDeleteWarning}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <div className="text-xs font-black text-slate-900 mb-1">
                    ① 바탕화면에서 ‘내 파일’ 앱 선택
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold">
                    삼성 기본 폴더나 홈 화면에서 노란색 폴더 모양의{" "}
                    <span className="text-blue-700 font-black">[내 파일]</span>{" "}
                    앱을 실행합니다.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <div className="text-xs font-black text-slate-900 mb-1">
                    ② 최근 파일 · 다운로드 · 설치파일(APK) 확인
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold">
                    카테고리에서{" "}
                    <span className="text-rose-600 font-black">[다운로드]</span>{" "}
                    및{" "}
                    <span className="text-rose-600 font-black">
                      [설치 파일(APK)]
                    </span>
                    로 들어가 의심 파일(예: 대출신청서.zip, KBank.zip)을
                    확인합니다.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <div className="text-xs font-black text-slate-900 mb-1">
                    ③ 악성앱 설치파일(.apk) 완전 삭제
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold">
                    설치 파일 목록에 남아 있는{" "}
                    <span className="text-rose-600 font-black">
                      shinhan.apk
                    </span>{" "}
                    등 모든 악성 설치파일을 길게 눌러 삭제하고 휴지통까지
                    비웁니다.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5">
                  <div className="text-xs font-black text-blue-900 mb-1">
                    ④ 백신 앱으로 최종 악성코드 검사
                  </div>
                  <p className="text-[11px] text-blue-
