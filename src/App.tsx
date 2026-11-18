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

const INITIAL_MANUALS = [
  GUIDE_MANUAL_DEFAULT,
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

const DEFAULT_NEWS_LIST = [
  {
    id: "news-1",
    tag: "주민센터사칭",
    title:
      "“친척이 등본 떼러 왔는데…” 행정복지센터·경찰 사칭 우편함 현금 편취 주의보",
    press: "경찰청 알리미 · 2026.11",
    url: "https://www.youtube.com/watch?v=MkStRakOvV4",
  },
  {
    id: "news-2",
    tag: "카드배송사칭",
    title:
      "“신청 안 한 카드가 배송됐다” 원격제어·악성앱 설치 유도 보이스피싱 급증",
    press: "수사지원팀 경보 · 2026.11",
    url: "https://www.police.go.kr",
  },
  {
    id: "news-3",
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

// 보내주신 '제목 없는 디자인 (3).jpg' 이미지를 파일 업로드 없이 100% 코드로 동일하게 구현한 스플래시 화면
const SplashScreen = ({ fadingOut, onSkip }) => {
  return (
    <div
      onClick={onSkip}
      className={`fixed inset-0 z-[2147483647] bg-black flex flex-col justify-between select-none overflow-hidden cursor-pointer transition-opacity duration-500 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 상단 다크 브러시드 메탈 질감 영역 (원본 비율 23.8%) */}
      <div
        className="w-full h-[23.8%] relative overflow-hidden shrink-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 35%, #323232 0%, #242424 55%, #111111 92%, #050505 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(176deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(4deg, rgba(0,0,0,0.45) 0px, rgba(0,0,0,0.45) 2px, transparent 2px, transparent 6px)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent via-black/75 to-black" />
      </div>

      {/* 중앙 순수 블랙 배경 & '서울형사 피싱 X' 로고 영역 (원본 비율 52.4%) */}
      <div className="flex-1 bg-black flex items-center justify-center px-4 relative">
        <svg
          viewBox="0 0 724 220"
          className="w-full max-w-[420px] h-auto overflow-visible"
          aria-label="서울형사 피싱 X"
        >
          <defs>
            {/* '피싱' 및 'X' 글자 내부의 미세 스크래치/그런지 스텐실 질감 마스크 */}
            <mask id="grungeTextMask">
              <rect x="0" y="0" width="724" height="220" fill="white" />
              {/* '피' 하단 및 획 내부 스크래치 */}
              <circle cx="386" cy="126" r="2.2" fill="black" />
              <circle cx="391" cy="129" r="1.6" fill="black" />
              <circle cx="399" cy="125" r="2.4" fill="black" />
              <circle cx="404" cy="128" r="1.8" fill="black" />
              <circle cx="412" cy="127" r="2.1" fill="black" />
              <circle cx="418" cy="124" r="1.5" fill="black" />
              <circle cx="395" cy="96" r="1.7" fill="black" />
              <circle cx="428" cy="108" r="1.9" fill="black" />
              <circle cx="431" cy="115" r="2.2" fill="black" />
              <path
                d="M382 124 L422 128 L419 131 L380 126 Z"
                fill="black"
                opacity="0.65"
              />
              {/* '싱' 내부 스크래치 */}
              <circle cx="458" cy="104" r="1.8" fill="black" />
              <circle cx="463" cy="112" r="2.1" fill="black" />
              <circle cx="481" cy="84" r="1.9" fill="black" />
              <circle cx="497" cy="92" r="2.3" fill="black" />
              <circle cx="495" cy="109" r="1.7" fill="black" />
              <circle cx="472" cy="134" r="2.0" fill="black" />
              <circle cx="489" cy="142" r="2.2" fill="black" />
              <circle cx="498" cy="136" r="1.6" fill="black" />
              {/* 'X' 내부 거친 스크래치 */}
              <circle cx="552" cy="76" r="2.5" fill="black" />
              <circle cx="558" cy="88" r="2.1" fill="black" />
              <circle cx="578" cy="118" r="2.6" fill="black" />
              <circle cx="585" cy="132" r="3.0" fill="black" />
              <circle cx="591" cy="138" r="2.2" fill="black" />
              <circle cx="548" cy="134" r="2.4" fill="black" />
              <circle cx="586" cy="82" r="2.1" fill="black" />
              <path
                d="M578 125 L596 142 L592 145 L575 128 Z"
                fill="black"
                opacity="0.55"
              />
            </mask>
          </defs>

          {/* 서울형사 (깔끔한 실버 그레이 고딕) */}
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

          {/* 피싱 (화이트 스텐실 그런지 고딕) */}
          <text
            x="372"
            y="136"
            fill="#FFFFFF"
            fontSize="72"
            fontWeight="900"
            letterSpacing="-2"
            mask="url(#grungeTextMask)"
            style={{
              fontFamily:
                "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
            }}
          >
            피싱
          </text>

          {/* X (강렬한 레드 스텐실 그런지) */}
          <text
            x="530"
            y="141"
            fill="#DC0609"
            fontSize="92"
            fontWeight="900"
            mask="url(#grungeTextMask)"
            style={{
              fontFamily: "'Montserrat', 'Pretendard', sans-serif",
            }}
          >
            X
          </text>
        </svg>
      </div>

      {/* 하단 다크 브러시드 메탈 질감 + 최하단 남색(#2C314E) '서울경찰청 형사과' 바 */}
      <div className="w-full h-[23.8%] flex flex-col shrink-0">
        <div
          className="flex-1 w-full relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 95% 85% at 50% 62%, #303030 0%, #222222 55%, #101010 92%, #050505 100%)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black via-black/75 to-transparent z-10" />
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(175deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(5deg, rgba(0,0,0,0.45) 0px, rgba(0,0,0,0.45) 2px, transparent 2px, transparent 6px)",
            }}
          />
        </div>

        {/* 보내주신 3번째 이미지의 남색(#2C314E) 하단 바 */}
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
                  <p className="text-[11px] text-blue-800 font-bold">
                    마지막으로{" "}
                    <span className="font-black">
                      ‘V3 Mobile Plus’ 또는 ‘알약M’
                    </span>
                    을 실행하여 [악성코드 검사]로 잔여 위협이 없는지 최종
                    점검합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentOfficer, setCurrentOfficer] = useState(null);
  const [user, setUser] = useState(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupRank, setSignupRank] = useState("경위");
  const [signupUnit, setSignupUnit] = useState("");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [usersSynced, setUsersSynced] = useState(false);

  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMemberModal, setSelectedMemberModal] = useState(null);
  const [showMemberPassword, setShowMemberPassword] = useState(false);
  const [confirmWithdrawId, setConfirmWithdrawId] = useState(null);

  const [noticeModal, setNoticeModal] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [manuals, setManuals] = useState(INITIAL_MANUALS);
  const [selectedManual, setSelectedManual] = useState(null);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [editingManualId, setEditingManualId] = useState(null);
  const [newManual, setNewManual] = useState({
    title: "",
    tag: "최신 경보",
    content: "",
    attachment: null,
  });

  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [reportToast, setReportToast] = useState(null);
  const [reportFilter, setReportFilter] = useState("all");
  const [reportSearch, setReportSearch] = useState("");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
  const [dateSortOrder, setDateSortOrder] = useState("desc");
  const [collapsedDates, setCollapsedDates] = useState({});
  const [currentDatePage, setCurrentDatePage] = useState(1);
  const DATES_PER_PAGE = 5;

  const [newReport, setNewReport] = useState({
    serialNumber: "",
    victimName: "",
    team: [],
    officer: "",
    dispatchResult: "",
    dispatchDate: getTodayFormatted(),
    faceToFace: "",
    contacted: "",
    crimeType: "",
    crimeTypeOther: "",
    phoneMaker: "",
    phoneMakerOther: "",
    appExtracted: "",
    appDeleted: "",
    damageAmount: "",
    preventedAmount: "",
    summary: "",
  });

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("현장공유");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostText, setEditPostText] = useState("");
  const [editPostCategory, setEditPostCategory] = useState("현장공유");

  const [reportTabMode, setReportTabMode] = useState("write");
  const [editingReportId, setEditingReportId] = useState(null);
  const [editReportData, setEditReportData] = useState({});

  const [isEditingForm, setIsEditingForm] = useState(false);
  const [formLabels, setFormLabels] = useState({
    headerTitle: "피싱 악성앱 구제활동",
    headerDesc:
      "악성 앱 관련 문의 사항은 서울청 형사과 강석준 경사(02-700-4014)로 문의해 주시면 감사드리겠습니다.\n항상 감사합니다!",
    headerWarning:
      "※ 보이스악성앱 설치 유형 피해자는 즉시 대면 조치 및 피해 사실 전면 부인하면 최근 사례 설명 및 추궁을 통해 피해 사실 확인 부탁드립니다.",
    headerRequiredNote: "* 표시는 필수 질문임",
    q1: "1. 악성앱 엑셀 관리 연번",
    q2: "2. 피해자 성명(예시:홍길동)",
    q3: "3. 소속팀(지역경찰 협업 시에는 지역경찰 지원 출동도 추가로 체크 부탁드립니다!)",
    q3Sub: "해당 사항에 모두 표시하세요.",
    q4: "4. 출동 결과(조치 불가의 경우 시도청 담당자에게 연락주세요.)",
    q5: "5. 출동일",
    q5Sub: "예: 2026. 11. 14 또는 2026년 11월 14일",
    q6: "6. 담당 경찰관(예시: 경O OOO)",
    q7: "7. 대면 여부",
    q8: "8. 연락 여부(피싱범에게 최초 연락이 온 경로)",
    q9: "9. 범행 유형",
    q10: "10. 핸드폰 제조사(확인 불가 시, 확인 불가 기재)",
    q11: "11. 악성앱 추출(미설치, 미감지는 추출불가로 보고)",
    q12: "12. 악성앱 삭제 (미설치, 미감지는 추출불가로 보고)",
    q13: "13. 피해 발생 금액",
    q13Sub: "예시: 100,000,000 / 숫자만 기재, 오타 주의",
    q14: "14. 피해 예방 금액",
    q14Sub1: "예시: 100,000,000 / 숫자만 기재, 오타 주의",
    q14Sub2:
      "피해자가 피싱임을 인지 못하여 피해금을 전달하려 하였으나, 출동 경찰관으로 인해 전달하지 않은 경우입니다.\n매월 예방 사례 및 예방액 취합하여 포상하고 있으니 관련 우수사례 보고도 부탁드리겠습니다.",
    q15: "15. 조치 상세 내용",
    q15Sub:
      "(피싱사이트 유형은 사이트 접속 경위, 보이스악성앱 유형은 악성앱 설치 경위를 조치 내용에 반드시 포함해서 기재 부탁드립니다.)",
  });

  const [stats, setStats] = useState({
    titleMain: "오늘의 서울청 악성앱 구제활동 대상자",
    totalCases: "9",
    totalCasesUnit: "건",
    caseIncreasePrefix: "전일 대비 -",
    caseIncrease: "4",
    caseIncreaseUnit: "건",
    goldenTimeMonth: "10",
    labelGoldenTime: "서울경찰청 악성앱 구제활동 조치율",
    goldenTimeRate: "98.9",
    goldenTimeUnit: "%",
    preventedMonth: "10",
    labelPreventedAmount: "피해 예방액",
    preventedAmount: "4.86",
    preventedUnit: "억",
    titleNews: "최근 보이스피싱 주요 보도 사례",
    newsList: DEFAULT_NEWS_LIST,
  });
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNewsItem, setNewNewsItem] = useState({
    tag: "",
    title: "",
    press: "",
    url: "",
  });

  // 앱 로딩 시 스플래시 화면 타이머 (약 4초간 표시 후 부드럽게 전환)
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setSplashFading(true);
    }, 3500);
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // 저장된 자동로그인 세션 복원
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.officer) {
          const restoredAdmin =
            Boolean(parsed.isAdmin) || parsed.officer.role === "admin";
          setCurrentOfficer(parsed.officer);
          setIsAdmin(restoredAdmin);
          setIsLoggedIn(true);
        }
      }
    } catch (e) {
      console.log("Auto login restore error", e);
    }
  }, []);

  // 우측 하단 'Open Sandbox' 버튼 자동 숨김 및 제거
  useEffect(() => {
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    }

    if (!document.getElementById("tailwind-cdn")) {
      const script = document.createElement("script");
      script.id = "tailwind-cdn";
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }

    if (!document.getElementById("custom-fonts")) {
      const fontLink = document.createElement("link");
      fontLink.id = "custom-fonts";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Noto+Sans+KR:wght@700;800;900&display=swap";
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
    }

    if (!document.getElementById("pretendard-font")) {
      const pretendardLink = document.createElement("link");
      pretendardLink.id = "pretendard-font";
      pretendardLink.href =
        "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css";
      pretendardLink.rel = "stylesheet";
      document.head.appendChild(pretendardLink);
    }

    if (!document.getElementById("hide-csb-badge-style")) {
      const style = document.createElement("style");
      style.id = "hide-csb-badge-style";
      style.innerHTML = `
        iframe[src*="codesandbox"],
        iframe[title*="CodeSandbox"],
        a[href*="codesandbox.io"],
        a[href*="csb.app"],
        div[id*="codesandbox"],
        div[class*="codesandbox"],
        body > iframe,
        body > a,
        body > button,
        body > div:not(#root):not(#app) {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          max-width: 0 !important;
          max-height: 0 !important;
          overflow: hidden !important;
          z-index: -99999 !important;
        }
      `;
      document.head.appendChild(style);
    }

    const removeSandboxBadge = () => {
      try {
        Array.from(document.body.children).forEach((el) => {
          const tag = el.tagName;
          if (
            el.id !== "root" &&
            el.id !== "app" &&
            tag !== "SCRIPT" &&
            tag !== "STYLE" &&
            tag !== "LINK"
          ) {
            el.style.setProperty("display", "none", "important");
            el.style.setProperty("visibility", "hidden", "important");
            el.style.setProperty("pointer-events", "none", "important");
            el.remove();
          }
        });

        const allNodes = document.querySelectorAll(
          "a, button, div, span, iframe"
        );
        allNodes.forEach((node) => {
          if (node.id === "root" || node.id === "app") return;
          const txt = (node.textContent || "").trim();
          const href = node.getAttribute?.("href") || "";
          const src = node.getAttribute?.("src") || "";

          if (
            txt === "Open Sandbox" ||
            href.includes("codesandbox.io") ||
            src.includes("codesandbox.io")
          ) {
            node.style.setProperty("display", "none", "important");
            if (
              node.parentElement &&
              node.parentElement !== document.body &&
              node.parentElement.id !== "root" &&
              node.parentElement.id !== "app"
            ) {
              node.parentElement.style.setProperty(
                "display",
                "none",
                "important"
              );
              node.parentElement.remove();
            } else {
              node.remove();
            }
          }

          if (node.shadowRoot) {
            const shadowText = node.shadowRoot.textContent || "";
            const shadowHtml = node.shadowRoot.innerHTML || "";
            if (
              shadowText.includes("Open Sandbox") ||
              shadowHtml.includes("codesandbox")
            ) {
              node.style.setProperty("display", "none", "important");
              node.remove();
            }
          }
        });
      } catch (err) {
        // ignore
      }
    };

    removeSandboxBadge();
    const observer = new MutationObserver(removeSandboxBadge);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    const intervalId = setInterval(removeSandboxBadge, 500);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!auth) {
      setUser({ uid: "local-officer" });
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      }
    });
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.log("Auth fallback mode", e);
        setUser({ uid: "seoul-police-officer" });
      }
    };
    initAuth();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    const unsubPending = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "pendingUsers"),
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), docId: d.id }));
        setPendingUsers(list);
      },
      (err) => console.log("Pending sync err", err)
    );

    const unsubApproved = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "approvedUsers"),
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), docId: d.id }));
        setApprovedUsers(list);
        setUsersSynced(true);
      },
      (err) => console.log("Approved sync err", err)
    );

    const unsubReports = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "reports"),
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs
            .map((d) => ({ ...d.data(), docId: d.id }))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setReports(list);
        }
      },
      (err) => console.log("Reports sync err", err)
    );

    const unsubPosts = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "posts"),
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs
            .map((d) => ({ ...d.data(), docId: d.id }))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setPosts(list);
        }
      },
      (err) => console.log("Posts sync err", err)
    );

    const unsubManuals = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "manuals"),
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs
            .map((d) => ({ ...d.data(), docId: d.id }))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          const hasGuide = list.some(
            (m) => m.id === 999 || m.isSpecialGuide === true
          );
          setManuals(hasGuide ? list : [GUIDE_MANUAL_DEFAULT, ...list]);
        }
      },
      (err) => console.log("Manuals sync err", err)
    );

    const unsubConfig = onSnapshot(
      doc(db, "artifacts", appId, "public", "data", "appConfig", "main"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.stats) {
            setStats((prev) => ({
              ...prev,
              ...data.stats,
              titleMain:
                data.stats.titleMain === "오늘의 서울청 통합 관제망"
                  ? "오늘의 서울청 악성앱 구제활동 대상자"
                  : data.stats.titleMain || prev.titleMain,
              labelPreventedAmount:
                data.stats.labelPreventedAmount === "피해 예방액 (추정)"
                  ? "피해 예방액"
                  : data.stats.labelPreventedAmount ||
                    prev.labelPreventedAmount,
              titleNews:
                data.stats.titleNews ||
                prev.titleNews ||
                "최근 보이스피싱 주요 보도 사례",
              newsList: Array.isArray(data.stats.newsList)
                ? data.stats.newsList
                : prev.newsList || DEFAULT_NEWS_LIST,
            }));
          }
          if (data.formLabels) {
            setFormLabels((prev) => ({
              ...prev,
              ...data.formLabels,
            }));
          }
        }
      },
      (err) => console.log("Config sync err", err)
    );

    return () => {
      unsubPending();
      unsubApproved();
      unsubReports();
      unsubPosts();
      unsubManuals();
      unsubConfig();
    };
  }, [user]);

  // 실시간 회원 상태 동기화: 탈퇴 처리 시 즉시 로그아웃 / 관리자 승격·해제 시 즉시 권한 전환
  useEffect(() => {
    if (!isLoggedIn || !currentOfficer || !usersSynced) return;
    if (
      currentOfficer.badgeNo === "oo4482" ||
      currentOfficer.badgeNo === "123"
    ) {
      return;
    }
    const matchedUser = approvedUsers.find(
      (u) => u.badgeNo === currentOfficer.badgeNo
    );
    if (!matchedUser) {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (e) {
        console.log(e);
      }
      setIsLoggedIn(false);
      setCurrentOfficer(null);
      setIsAdmin(false);
      setNoticeModal({
        type: "error",
        title: "계정 이용 종료 안내",
        message: "관리자에 의해 회원 탈퇴(삭제) 처리되어 로그아웃되었습니다.",
      });
    } else {
      const cloudIsAdmin = matchedUser.role === "admin";
      if (
        cloudIsAdmin !== isAdmin ||
        currentOfficer.role !== matchedUser.role
      ) {
        setIsAdmin(cloudIsAdmin);
        setCurrentOfficer(matchedUser);
        try {
          if (localStorage.getItem(SESSION_STORAGE_KEY)) {
            localStorage.setItem(
              SESSION_STORAGE_KEY,
              JSON.stringify({ officer: matchedUser, isAdmin: cloudIsAdmin })
            );
          }
        } catch (e) {
          console.log(e);
        }
        if (!cloudIsAdmin && activeTab === "pending") {
          setActiveTab("dashboard");
        }
        setReportToast(
          cloudIsAdmin
            ? "관리자 권한으로 승격되어 관리자 모드가 활성화되었습니다."
            : "관리자 권한이 해제되어 일반 모드로 전환되었습니다."
        );
        setTimeout(() => setReportToast(null), 3500);
      }
    }
  }, [
    isLoggedIn,
    currentOfficer,
    usersSynced,
    approvedUsers,
    isAdmin,
    activeTab,
  ]);

  const saveConfigToCloud = async (newStats, newLabels) => {
    if (!user || !db) return;
    try {
      await setDoc(
        doc(db, "artifacts", appId, "public", "data", "appConfig", "main"),
        {
          stats: newStats || stats,
          formLabels: newLabels || formLabels,
        },
        { merge: true }
      );
    } catch (e) {
      console.log("Config save error", e);
    }
  };

  const persistLoginSession = (officerObj, adminFlag) => {
    try {
      if (autoLogin) {
        localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({ officer: officerObj, isAdmin: adminFlag })
        );
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.log("Session save error", e);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.log("Session remove error", e);
    }
    setIsLoggedIn(false);
    setCurrentOfficer(null);
    setIsAdmin(false);
    setOfficerId("");
    setPassword("");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const trimmedId = officerId.trim();

    if (isSignUpMode) {
      if (!trimmedId || !password || !signupName.trim() || !signupUnit.trim()) {
        setNoticeModal({
          type: "warning",
          title: "입력 항목 확인",
          message:
            "이름, 계급, 소속, 아이디, 비밀번호를 모두 빠짐없이 입력해주세요.",
        });
        return;
      }

      if (
        trimmedId === "oo4482" ||
        trimmedId === "123" ||
        approvedUsers.some((u) => u.badgeNo === trimmedId) ||
        pendingUsers.some((u) => u.badgeNo === trimmedId)
      ) {
        setNoticeModal({
          type: "warning",
          title: "이미 등록된 아이디",
          message: "해당 아이디는 이미 가입 신청되었거나 사용 중인 계정입니다.",
        });
        return;
      }

      const newUser = {
        name: signupName.trim(),
        rank: signupRank,
        unit: signupUnit.trim(),
        badgeNo: trimmedId,
        password: password,
        role: "user",
        id: Date.now(),
        createdAt: Date.now(),
      };

      setPendingUsers([...pendingUsers, newUser]);
      if (user && db) {
        try {
          await setDoc(
            doc(
              db,
              "artifacts",
              appId,
              "public",
              "data",
              "pendingUsers",
              String(newUser.id)
            ),
            newUser
          );
        } catch (err) {
          console.log(err);
        }
      }

      setNoticeModal({
        type: "pending",
        title: "회원가입 신청 접수 완료",
        message:
          "회원가입 신청이 정상적으로 접수되었습니다.\n관리자가 승인한 후 회원가입이 최종 완료되며, 승인 완료 후부터 로그인이 가능합니다.",
      });
      setIsSignUpMode(false);
      setOfficerId("");
      setPassword("");
      setSignupName("");
      setSignupUnit("");
      return;
    }

    if (trimmedId === "oo4482" && password === "qweqwe1!") {
      const adminOfficer = {
        name: "강석준",
        rank: "경사",
        unit: "서울청 강력계 악성앱담당자",
        badgeNo: "oo4482",
        role: "admin",
      };
      setCurrentOfficer(adminOfficer);
      setIsAdmin(true);
      setIsLoggedIn(true);
      persistLoginSession(adminOfficer, true);
      setReportToast("관리자 권한으로 접속되었습니다.");
      setTimeout(() => setReportToast(null), 3500);
      return;
    }

    if (trimmedId === "123" && password === "123") {
      const testerOfficer = {
        name: "테스터",
        rank: "순경",
        unit: "테스트 파출소",
        badgeNo: "123",
        role: "user",
      };
      setCurrentOfficer(testerOfficer);
      setIsAdmin(false);
      setIsLoggedIn(true);
      persistLoginSession(testerOfficer, false);
      setReportToast("순경 테스터 수사관님, 환영합니다.");
      setTimeout(() => setReportToast(null), 3500);
      return;
    }

    const isPending = pendingUsers.find((u) => u.badgeNo === trimmedId);
    if (isPending) {
      setNoticeModal({
        type: "pending",
        title: "회원가입 미승인 상태",
        message:
          "아직 회원가입이 승인되지 않았습니다.\n서울청 관리자의 가입 승인이 완료된 후에 로그인하실 수 있습니다.",
      });
      return;
    }

    const userMatch = approvedUsers.find(
      (u) => u.badgeNo === trimmedId && u.password === password
    );

    if (userMatch) {
      const isUserAdmin = userMatch.role === "admin";
      setCurrentOfficer(userMatch);
      setIsAdmin(isUserAdmin);
      setIsLoggedIn(true);
      persistLoginSession(userMatch, isUserAdmin);
      setReportToast(
        isUserAdmin
          ? `${userMatch.rank} ${userMatch.name} 관리자님, 환영합니다.`
          : `${userMatch.rank} ${userMatch.name} 수사관님, 환영합니다.`
      );
      setTimeout(() => setReportToast(null), 3500);
    } else {
      setNoticeModal({
        type: "error",
        title: "로그인 실패",
        message:
          "아이디 또는 비밀번호가 일치하지 않거나, 등록되지 않은 계정입니다.",
      });
    }
  };

  const approveUser = async (userToApprove) => {
    const approvedObj = {
      ...userToApprove,
      role: userToApprove.role || "user",
      approvedAt: Date.now(),
    };
    setApprovedUsers([...approvedUsers, approvedObj]);
    setPendingUsers(pendingUsers.filter((u) => u.id !== userToApprove.id));
    if (selectedMemberModal && selectedMemberModal.id === userToApprove.id) {
      setSelectedMemberModal(null);
    }
    if (user && db) {
      try {
        await setDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "approvedUsers",
            String(userToApprove.docId || userToApprove.id)
          ),
          approvedObj
        );
        await deleteDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "pendingUsers",
            String(userToApprove.docId || userToApprove.id)
          )
        );
      } catch (e) {
        console.log(e);
      }
    }
    setReportToast(
      `${userToApprove.rank} ${userToApprove.name} 수사관의 회원가입이 승인되었습니다.`
    );
    setTimeout(() => setReportToast(null), 3000);
  };

  const rejectUser = async (userToReject) => {
    setPendingUsers(pendingUsers.filter((u) => u.id !== userToReject.id));
    if (selectedMemberModal && selectedMemberModal.id === userToReject.id) {
      setSelectedMemberModal(null);
    }
    if (user && db) {
      try {
        await deleteDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "pendingUsers",
            String(userToReject.docId || userToReject.id)
          )
        );
      } catch (e) {
        console.log(e);
      }
    }
    setReportToast(`${userToReject.name}님의 가입 신청이 반려 처리되었습니다.`);
    setTimeout(() => setReportToast(null), 3000);
  };

  // 회원 관리자 승격 / 일반 회원 전환
  const handleToggleMemberAdminRole = async (memberObj) => {
    const nextRole = memberObj.role === "admin" ? "user" : "admin";
    const updatedMember = { ...memberObj, role: nextRole };
    delete updatedMember.memberStatus;

    setApprovedUsers(
      approvedUsers.map((u) => (u.id === memberObj.id ? updatedMember : u))
    );
    setSelectedMemberModal({
      ...updatedMember,
      memberStatus: "approved",
    });

    if (user && db) {
      try {
        await setDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "approvedUsers",
            String(memberObj.docId || memberObj.id)
          ),
          updatedMember,
          { merge: true }
        );
      } catch (e) {
        console.log("Role update error", e);
      }
    }

    setReportToast(
      nextRole === "admin"
        ? `${memberObj.rank} ${memberObj.name} 수사관이 관리자로 승격되었습니다.`
        : `${memberObj.rank} ${memberObj.name} 수사관의 관리자 권한이 해제되었습니다.`
    );
    setTimeout(() => setReportToast(null), 3500);
  };

  const handleWithdrawApprovedUser = async (memberToRemove) => {
    setApprovedUsers(approvedUsers.filter((u) => u.id !== memberToRemove.id));
    setSelectedMemberModal(null);
    setConfirmWithdrawId(null);
    setShowMemberPassword(false);

    if (user && db) {
      try {
        await deleteDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "approvedUsers",
            String(memberToRemove.docId || memberToRemove.id)
          )
        );
      } catch (e) {
        console.log("Withdraw delete error", e);
      }
    }

    setReportToast(
      `${memberToRemove.rank} ${memberToRemove.name} 수사관의 계정이 탈퇴(삭제) 처리되었습니다.`
    );
    setTimeout(() => setReportToast(null), 3500);
  };

  const openMemberDetail = (memberObj, statusType) => {
    setSelectedMemberModal({ ...memberObj, memberStatus: statusType });
    setShowMemberPassword(false);
    setConfirmWithdrawId(null);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!Array.isArray(newReport.team) || newReport.team.length === 0) {
      setNoticeModal({
        type: "warning",
        title: "소속팀 선택 필요",
        message: "3번 항목인 소속팀을 최소 1개 이상 체크해주세요.",
      });
      return;
    }

    const finalCrimeType =
      newReport.crimeType === "기타:"
        ? `기타(${newReport.crimeTypeOther || "미상"})`
        : newReport.crimeType || "미기재";

    const finalPhoneMaker =
      newReport.phoneMaker === "기타:"
        ? `기타(${newReport.phoneMakerOther || "미상"})`
        : newReport.phoneMaker || "미기재";

    const nowTs = Date.now();
    const formattedDate = normalizeReportDate({
      date: newReport.dispatchDate,
      createdAt: nowTs,
    });

    const created = {
      id: `REP-${nowTs}`,
      createdAt: nowTs,
      date: formattedDate,
      serialNumber: newReport.serialNumber,
      victimName: newReport.victimName,
      team: Array.isArray(newReport.team)
        ? newReport.team.join(", ")
        : newReport.team,
      officer:
        newReport.officer || `${currentOfficer.rank} ${currentOfficer.name}`,
      submitterId: currentOfficer.badgeNo,
      dispatchResult: newReport.dispatchResult,
      faceToFace: newReport.faceToFace,
      contacted: newReport.contacted,
      crimeType: finalCrimeType,
      phoneMaker: finalPhoneMaker,
      appExtracted: newReport.appExtracted,
      appDeleted: newReport.appDeleted,
      damageAmount: newReport.damageAmount || "0",
      preventedAmount: newReport.preventedAmount || "0",
      summary: newReport.summary || "상세 조치내역 없음",
      status: "접수완료",
    };

    setReports([created, ...reports]);
    if (user && db) {
      try {
        await setDoc(
          doc(db, "artifacts", appId, "public", "data", "reports", created.id),
          created
        );
      } catch (err) {
        console.log(err);
      }
    }

    setReportToast("피싱 악성앱 구제활동 조치보고가 전송되었습니다.");
    setNewReport({
      serialNumber: "",
      victimName: "",
      team: [],
      officer: "",
      dispatchResult: "",
      dispatchDate: getTodayFormatted(),
      faceToFace: "",
      contacted: "",
      crimeType: "",
      crimeTypeOther: "",
      phoneMaker: "",
      phoneMakerOther: "",
      appExtracted: "",
      appDeleted: "",
      damageAmount: "",
      preventedAmount: "",
      summary: "",
    });
    setReportTabMode("list");
    setCurrentDatePage(1);
    setTimeout(() => setReportToast(null), 3500);
  };

  const handleReportEditClick = (report) => {
    setEditingReportId(report.id);
    setEditReportData({ ...report, date: normalizeReportDate(report) });
  };

  const handleReportEditSave = async () => {
    const updated = {
      ...editReportData,
      date: normalizeReportDate(editReportData),
    };
    setReports(reports.map((r) => (r.id === editingReportId ? updated : r)));
    if (user && db) {
      try {
        await setDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "reports",
            editingReportId
          ),
          updated,
          { merge: true }
        );
      } catch (err) {
        console.log(err);
      }
    }
    setEditingReportId(null);
    setReportToast("보고서가 성공적으로 수정되었습니다.");
    setTimeout(() => setReportToast(null), 3500);
  };

  const handleDeleteReport = async (id) => {
    setReports(reports.filter((r) => r.id !== id));
    if (user && db) {
      try {
        await deleteDoc(
          doc(db, "artifacts", appId, "public", "data", "reports", id)
        );
      } catch (err) {
        console.log(err);
      }
    }
    setReportToast("보고서가 삭제되었습니다.");
    setTimeout(() => setReportToast(null), 3500);
  };

  const handleConfirmReport = async (id) => {
    const target = reports.find((r) => r.id === id);
    const nextStatus =
      target?.status === "관리자 확인완료" ? "접수완료" : "관리자 확인완료";
    setReports(
      reports.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );
    if (user && db) {
      try {
        await setDoc(
          doc(db, "artifacts", appId, "public", "data", "reports", id),
          { status: nextStatus },
          { merge: true }
        );
      } catch (err) {
        console.log(err);
      }
    }
    setReportToast(
      nextStatus === "관리자 확인완료"
        ? "관리자 확인 완료 처리되었습니다."
        : "접수완료(미확인) 상태로 변경되었습니다."
    );
    setTimeout(() => setReportToast(null), 3500);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost = {
      id: Date.now(),
      createdAt: Date.now(),
      author: `${currentOfficer.unit} ${currentOfficer.name}`,
      authorId: currentOfficer.badgeNo,
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      category: newPostCategory,
      content: newPostText,
    };
    setPosts([newPost, ...posts]);
    if (user && db) {
      try {
        await setDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "posts",
            String(newPost.id)
          ),
          newPost
        );
      } catch (err) {
        console.log(err);
      }
    }
    setNewPostText("");
    setNewPostCategory("현장공유");
  };

  const handlePostEditStart = (post) => {
    setEditingPostId(post.id);
    setEditPostText(post.content);
    setEditPostCategory(post.category || "현장공유");
  };

  const handlePostEditSave = async (post) => {
    if (!editPostText.trim()) return;
    const updatedPost = {
      ...post,
      content: editPostText,
      category: editPostCategory,
    };
    setPosts(posts.map((p) => (p.id === post.id ? updatedPost : p)));
    if (user && db) {
      try {
        await setDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "posts",
            String(post.id)
          ),
          updatedPost,
          { merge: true }
        );
      } catch (err) {
        console.log(err);
      }
    }
    setEditingPostId(null);
    setReportToast("게시글이 수정되었습니다.");
    setTimeout(() => setReportToast(null), 3000);
  };

  const handleDeletePost = async (id) => {
    setPosts(posts.filter((post) => post.id !== id));
    if (user && db) {
      try {
        await deleteDoc(
          doc(db, "artifacts", appId, "public", "data", "posts", String(id))
        );
      } catch (err) {
        console.log(err);
      }
    }
    setReportToast("게시글이 삭제되었습니다.");
    setTimeout(() => setReportToast(null), 3500);
  };

  const handleManualEditStart = (manual, e) => {
    if (e) e.stopPropagation();
    setEditingManualId(manual.id);
    setNewManual({
      title: manual.title || "",
      tag: manual.tag || "최신 경보",
      content: manual.content || "",
      attachment: manual.attachment || null,
    });
    setIsAddingManual(true);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!newManual.title.trim()) return;

    if (editingManualId) {
      const target = manuals.find((m) => m.id === editingManualId) || {};
      const updated = {
        ...target,
        title: newManual.title,
        tag: newManual.tag,
        content: newManual.content,
        attachment: newManual.attachment,
      };
      setManuals(manuals.map((m) => (m.id === editingManualId ? updated : m)));
      if (selectedManual && selectedManual.id === editingManualId) {
        setSelectedManual(updated);
      }
      if (user && db) {
        try {
          await setDoc(
            doc(
              db,
              "artifacts",
              appId,
              "public",
              "data",
              "manuals",
              String(editingManualId)
            ),
            updated,
            { merge: true }
          );
        } catch (err) {
          console.log(err);
        }
      }
      setEditingManualId(null);
      setIsAddingManual(false);
      setNewManual({
        title: "",
        tag: "최신 경보",
        content: "",
        attachment: null,
      });
      setReportToast("매뉴얼이 수정되었습니다.");
      setTimeout(() => setReportToast(null), 3000);
      return;
    }

    if (!newManual.content.trim()) return;
    const created = {
      id: Date.now(),
      createdAt: Date.now(),
      title: newManual.title,
      tag: newManual.tag,
      content: newManual.content,
      attachment: newManual.attachment,
    };
    setManuals([created, ...manuals]);
    if (user && db) {
      try {
        await setDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "manuals",
            String(created.id)
          ),
          created
        );
      } catch (err) {
        console.log(err);
      }
    }
    setNewManual({
      title: "",
      tag: "최신 경보",
      content: "",
      attachment: null,
    });
    setIsAddingManual(false);
    setReportToast("새로운 현장 매뉴얼이 등록되었습니다.");
    setTimeout(() => setReportToast(null), 3500);
  };

  const handleDeleteManual = async (id, e) => {
    if (e) e.stopPropagation();
    setManuals(manuals.filter((m) => m.id !== id));
    if (selectedManual && selectedManual.id === id) {
      setSelectedManual(null);
    }
    if (user && db) {
      try {
        await deleteDoc(
          doc(db, "artifacts", appId, "public", "data", "manuals", String(id))
        );
      } catch (err) {
        console.log(err);
      }
    }
    setReportToast("매뉴얼이 삭제되었습니다.");
    setTimeout(() => setReportToast(null), 3000);
  };

  const handleManualFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setNoticeModal({
          type: "warning",
          title: "용량 초과",
          message: "첨부 파일 크기는 1MB를 초과할 수 없습니다.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewManual({ ...newManual, attachment: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleStatsEdit = () => {
    if (isEditingStats) {
      saveConfigToCloud(stats, formLabels);
      setReportToast("통계 및 보도 사례 설정이 저장되었습니다.");
      setTimeout(() => setReportToast(null), 2500);
    }
    setIsEditingStats(!isEditingStats);
  };

  const toggleFormEdit = () => {
    if (isEditingForm) {
      saveConfigToCloud(stats, formLabels);
      setReportToast("조치보고 양식이 저장되었습니다.");
      setTimeout(() => setReportToast(null), 2500);
    }
    setIsEditingForm(!isEditingForm);
  };

  const handleNewsItemChange = (id, field, newValue) => {
    setStats((prev) => ({
      ...prev,
      newsList: (prev.newsList || DEFAULT_NEWS_LIST).map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      ),
    }));
  };

  const handleAddNewsSubmit = () => {
    if (!newNewsItem.title.trim()) {
      setNoticeModal({
        type: "warning",
        title: "기사 제목 입력 필요",
        message: "보도 사례의 기사 또는 영상 제목을 입력해주세요.",
      });
      return;
    }

    const rawUrl = newNewsItem.url.trim();
    const formattedUrl =
      rawUrl && !rawUrl.startsWith("http") ? `https://${rawUrl}` : rawUrl;

    const createdNews = {
      id: `news-${Date.now()}`,
      tag: newNewsItem.tag.trim() || "주요보도",
      title: newNewsItem.title.trim(),
      press: newNewsItem.press.trim() || `보도자료 · ${getTodayFormatted()}`,
      url: formattedUrl || "https://www.police.go.kr",
    };

    const updatedStats = {
      ...stats,
      newsList: [createdNews, ...(stats.newsList || DEFAULT_NEWS_LIST)],
    };

    setStats(updatedStats);
    saveConfigToCloud(updatedStats, formLabels);
    setNewNewsItem({ tag: "", title: "", press: "", url: "" });
    setIsAddingNews(false);
    setReportToast("새로운 보이스피싱 보도 사례가 등록되었습니다.");
    setTimeout(() => setReportToast(null), 3000);
  };

  const handleDeleteNewsItem = (id, e) => {
    if (e) e.stopPropagation();
    const updatedStats = {
      ...stats,
      newsList: (stats.newsList || DEFAULT_NEWS_LIST).filter(
        (item) => item.id !== id
      ),
    };
    setStats(updatedStats);
    saveConfigToCloud(updatedStats, formLabels);
    setReportToast("보도 사례가 삭제되었습니다.");
    setTimeout(() => setReportToast(null), 2500);
  };

  const handleDownloadExcel = (targetList) => {
    const listToExport = Array.isArray(targetList) ? targetList : reports;
    if (listToExport.length === 0) {
      setNoticeModal({
        type: "warning",
        title: "데이터 없음",
        message: "현재 조건에 해당하는 보고서 데이터가 없습니다.",
      });
      return;
    }

    const headers = [
      formLabels.q1,
      formLabels.q2,
      formLabels.q3,
      formLabels.q4,
      formLabels.q5,
      formLabels.q6,
      formLabels.q7,
      formLabels.q8,
      formLabels.q9,
      formLabels.q10,
      formLabels.q11,
      formLabels.q12,
      formLabels.q13,
      formLabels.q14,
      formLabels.q15,
      "관리자 확인상태",
    ];

    const csvRows = [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(","),
    ];
    listToExport.forEach((r) => {
      const summaryEscaped = `"${(r.summary || "")
        .replace(/"/g, '""')
        .replace(/\n/g, " ")}"`;
      const teamEscaped = `"${(r.team || "").replace(/"/g, '""')}"`;
      const row = [
        `"${r.serialNumber || ""}"`,
        `"${r.victimName || ""}"`,
        teamEscaped,
        `"${r.dispatchResult || ""}"`,
        `"${normalizeReportDate(r)}"`,
        `"${r.officer || ""}"`,
        `"${r.faceToFace || ""}"`,
        `"${r.contacted || ""}"`,
        `"${r.crimeType || ""}"`,
        `"${r.phoneMaker || ""}"`,
        `"${r.appExtracted || ""}"`,
        `"${r.appDeleted || ""}"`,
        r.damageAmount || "0",
        r.preventedAmount || "0",
        summaryEscaped,
        `"${r.status || "접수완료"}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const dateSuffix =
      selectedDateFilter !== "all"
        ? selectedDateFilter.replace(/\.\s*/g, "-")
        : new Date().toISOString().slice(0, 10);

    const link = document.createElement("a");
    link.href = url;
    link.download = `서울형사_피싱X_조치보고내역_${dateSuffix}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val) => {
    if (!val || val === "0") return "0";
    const num = Number(String(val).replace(/[^0-9]/g, ""));
    return isNaN(num) ? val : num.toLocaleString("ko-KR");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-5 font-sans relative">
        {showSplash && (
          <SplashScreen
            fadingOut={splashFading}
            onSkip={() => setShowSplash(false)}
          />
        )}

        {noticeModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
            <div className="bg-white rounded-[2rem] max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
                  noticeModal.type === "pending"
                    ? "bg-amber-100 text-amber-600"
                    : noticeModal.type === "error"
                    ? "bg-rose-100 text-rose-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {noticeModal.type === "pending" ? (
                  <Clock className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900">
                  {noticeModal.title}
                </h3>
                <p className="text-xs text-slate-600 font-bold leading-relaxed whitespace-pre-line">
                  {noticeModal.message}
                </p>
              </div>
              <button
                onClick={() => setNoticeModal(null)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition"
              >
                확인
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-sm space-y-6">
          <div className="bg-white rounded-[2.25rem] p-7 shadow-2xl space-y-6">
            <div className="text-center space-y-1.5">
              <div className="bg-blue-50 border border-blue-100 w-14 h-14 rounded-2xl mx-auto mb-2 shadow-sm flex items-center justify-center text-blue-600">
                <Siren className="w-7 h-7 text-rose-500" />
              </div>
              <div className="flex justify-center py-0.5">
                <SeoulPhishingXLogo size="lg" darkText={true} />
              </div>
              <p className="text-[11px] text-slate-500 font-bold tracking-tight">
                보이스피싱 악성앱 피해구제활동
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUpMode && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">
                      성명
                    </label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-semibold text-slate-900 placeholder-slate-400 transition"
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">
                        계급
                      </label>
                      <select
                        value={signupRank}
                        onChange={(e) => setSignupRank(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold text-slate-900 transition"
                      >
                        <option value="순경">순경</option>
                        <option value="경장">경장</option>
                        <option value="경사">경사</option>
                        <option value="경위">경위</option>
                        <option value="경감">경감</option>
                        <option value="경정">경정</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">
                        소속 관서/팀
                      </label>
                      <input
                        type="text"
                        value={signupUnit}
                        onChange={(e) => setSignupUnit(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-semibold text-slate-900 placeholder-slate-400 transition"
                        placeholder="강남서 강력1팀"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">
                  아이디
                </label>
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-semibold text-slate-900 placeholder-slate-400 transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-semibold text-slate-900 placeholder-slate-400 transition"
                />
              </div>

              {!isSignUpMode && (
                <label className="flex items-center gap-2 text-xs font-extrabold text-slate-600 cursor-pointer select-none pt-0.5">
                  <input
                    type="checkbox"
                    checked={autoLogin}
                    onChange={(e) => setAutoLogin(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>자동 로그인</span>
                </label>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.98] transition mt-2 text-sm"
              >
                {isSignUpMode ? "회원가입 신청" : "수사관 로그인"}
              </button>
            </form>

            <div className="text-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsSignUpMode(!isSignUpMode);
                  setOfficerId("");
                  setPassword("");
                }}
                className="text-xs font-extrabold text-blue-600 hover:text-blue-800 transition"
              >
                {isSignUpMode
                  ? "이미 계정이 있으신가요? 로그인하기"
                  : "계정이 없으신가요? 회원가입 신청"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const baseReports = isAdmin
    ? reports
    : reports.filter(
        (r) =>
          r.submitterId === currentOfficer.badgeNo ||
          (r.officer && r.officer.includes(currentOfficer.name))
      );

  const reportsWithNormalizedDate = baseReports.map((r) => {
    const normDate = normalizeReportDate(r);
    return {
      ...r,
      normalizedDate: normDate,
      yearMonth: extractYearMonth(normDate),
    };
  });

  const uniqueMonths = Array.from(
    new Set(reportsWithNormalizedDate.map((r) => r.yearMonth))
  ).sort((a, b) => b.localeCompare(a));

  const reportsInSelectedMonth =
    selectedMonthFilter === "all"
      ? reportsWithNormalizedDate
      : reportsWithNormalizedDate.filter(
          (r) => r.yearMonth === selectedMonthFilter
        );

  const uniqueDates = Array.from(
    new Set(reportsInSelectedMonth.map((r) => r.normalizedDate))
  ).sort((a, b) =>
    dateSortOrder === "desc" ? b.localeCompare(a) : a.localeCompare(b)
  );

  const filteredReports = reportsInSelectedMonth.filter((r) => {
    const statusMatch =
      reportFilter === "all"
        ? true
        : reportFilter === "confirmed"
        ? r.status === "관리자 확인완료"
        : r.status !== "관리자 확인완료";

    const dateMatch =
      selectedDateFilter === "all" || r.normalizedDate === selectedDateFilter;

    const searchStr = reportSearch.trim().toLowerCase();
    const searchMatch =
      !searchStr ||
      (r.victimName && r.victimName.toLowerCase().includes(searchStr)) ||
      (r.officer && r.officer.toLowerCase().includes(searchStr)) ||
      (r.serialNumber &&
        String(r.serialNumber).toLowerCase().includes(searchStr)) ||
      (r.team && r.team.toLowerCase().includes(searchStr)) ||
      (r.normalizedDate && r.normalizedDate.toLowerCase().includes(searchStr));

    return statusMatch && dateMatch && searchMatch;
  });

  const groupedReportsByDate = filteredReports.reduce((acc, report) => {
    const key = report.normalizedDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(report);
    return acc;
  }, {});

  const sortedDateKeys = Object.keys(groupedReportsByDate).sort((a, b) =>
    dateSortOrder === "desc" ? b.localeCompare(a) : a.localeCompare(b)
  );

  const totalDatePages = Math.max(
    1,
    Math.ceil(sortedDateKeys.length / DATES_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentDatePage, totalDatePages);
  const paginatedDateKeys = sortedDateKeys.slice(
    (safeCurrentPage - 1) * DATES_PER_PAGE,
    safeCurrentPage * DATES_PER_PAGE
  );

  const isDateExpanded = (dateKey, idx) => {
    if (selectedDateFilter !== "all" || reportSearch.trim() !== "") return true;
    if (collapsedDates[dateKey] !== undefined) {
      return !collapsedDates[dateKey];
    }
    return idx === 0;
  };

  const toggleDateCollapse = (dateKey, idx) => {
    const currentlyExpanded = isDateExpanded(dateKey, idx);
    setCollapsedDates((prev) => ({
      ...prev,
      [dateKey]: currentlyExpanded,
    }));
  };

  const expandAllDates = () => {
    const next = {};
    sortedDateKeys.forEach((k) => {
      next[k] = false;
    });
    setCollapsedDates(next);
  };

  const collapseAllDates = () => {
    const next = {};
    sortedDateKeys.forEach((k) => {
      next[k] = true;
    });
    setCollapsedDates(next);
  };

  const memberSearchLower = memberSearch.trim().toLowerCase();
  const filteredPendingUsers = pendingUsers.filter(
    (u) =>
      !memberSearchLower ||
      (u.name && u.name.toLowerCase().includes(memberSearchLower)) ||
      (u.unit && u.unit.toLowerCase().includes(memberSearchLower)) ||
      (u.rank && u.rank.toLowerCase().includes(memberSearchLower)) ||
      (u.badgeNo && u.badgeNo.toLowerCase().includes(memberSearchLower))
  );
  const filteredApprovedUsers = approvedUsers.filter(
    (u) =>
      !memberSearchLower ||
      (u.name && u.name.toLowerCase().includes(memberSearchLower)) ||
      (u.unit && u.unit.toLowerCase().includes(memberSearchLower)) ||
      (u.rank && u.rank.toLowerCase().includes(memberSearchLower)) ||
      (u.badgeNo && u.badgeNo.toLowerCase().includes(memberSearchLower))
  );

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col font-sans relative selection:bg-blue-600 selection:text-white">
      {showSplash && (
        <SplashScreen
          fadingOut={splashFading}
          onSkip={() => setShowSplash(false)}
        />
      )}

      {noticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-[2rem] max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-amber-100 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-900">
                {noticeModal.title}
              </h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed whitespace-pre-line">
                {noticeModal.message}
              </p>
            </div>
            <button
              onClick={() => setNoticeModal(null)}
              className="w-full py-3 bg-slate-900 text-white text-xs font-extrabold rounded-xl"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 회원 상세정보, 관리자 승격 및 탈퇴 모달 */}
      {selectedMemberModal && isAdmin && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-5 animate-fadeIn"
          onClick={() => {
            setSelectedMemberModal(null);
            setConfirmWithdrawId(null);
            setShowMemberPassword(false);
          }}
        >
          <div
            className="bg-white rounded-[2rem] max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg ${
                      selectedMemberModal.memberStatus === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedMemberModal.memberStatus === "approved"
                      ? "승인완료 회원"
                      : "승인대기 신청자"}
                  </span>
                  {selectedMemberModal.memberStatus === "approved" &&
                    selectedMemberModal.role === "admin" && (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-blue-600 text-white flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        관리자
                      </span>
                    )}
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedMemberModal.rank} {selectedMemberModal.name}
                </h3>
                <p className="text-xs font-bold text-blue-600 mt-0.5">
                  {selectedMemberModal.unit}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedMemberModal(null);
                  setConfirmWithdrawId(null);
                  setShowMemberPassword(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-xs font-bold border border-slate-200/60">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">성명 / 계급</span>
                <span className="text-slate-900 font-black">
                  {selectedMemberModal.name} ({selectedMemberModal.rank})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">소속 관서/팀</span>
                <span className="text-slate-900 font-extrabold">
                  {selectedMemberModal.unit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">로그인 아이디</span>
                <span className="text-blue-700 font-black">
                  {selectedMemberModal.badgeNo}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">비밀번호</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-800 font-mono font-extrabold">
                    {showMemberPassword
                      ? selectedMemberModal.password || "미기재"
                      : "••••••••"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowMemberPassword(!showMemberPassword)}
                    className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition"
                    title={
                      showMemberPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showMemberPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              {selectedMemberModal.memberStatus === "approved" && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">권한 등급</span>
                  {selectedMemberModal.role === "admin" ? (
                    <span className="text-blue-700 font-black flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      관리자 (전체 관리 권한)
                    </span>
                  ) : (
                    <span className="text-slate-700 font-extrabold">
                      일반 수사관
                    </span>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">가입 신청일</span>
                <span className="text-slate-700">
                  {formatJoinDate(
                    selectedMemberModal.createdAt || selectedMemberModal.id
                  )}
                </span>
              </div>
              {selectedMemberModal.approvedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">가입 승인일</span>
                  <span className="text-emerald-700">
                    {formatJoinDate(selectedMemberModal.approvedAt)}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center">
                <span className="text-slate-400">누적 활동 실적</span>
                <span className="text-slate-900 font-black">
                  조치보고{" "}
                  <span className="text-blue-600">
                    {
                      reports.filter(
                        (r) =>
                          r.submitterId === selectedMemberModal.badgeNo ||
                          (r.officer &&
                            r.officer.includes(selectedMemberModal.name))
                      ).length
                    }
                    건
                  </span>{" "}
                  · 소통방{" "}
                  <span className="text-blue-600">
                    {
                      posts.filter(
                        (p) =>
                          p.authorId === selectedMemberModal.badgeNo ||
                          (p.author &&
                            p.author.includes(selectedMemberModal.name))
                      ).length
                    }
                    건
                  </span>
                </span>
              </div>
            </div>

            {selectedMemberModal.memberStatus === "pending" ? (
              <div className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => rejectUser(selectedMemberModal)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-extrabold transition"
                  >
                    가입 반려
                  </button>
                  <button
                    type="button"
                    onClick={() => approveUser(selectedMemberModal)}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    일반 회원 승인
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    approveUser({ ...selectedMemberModal, role: "admin" })
                  }
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  관리자 권한으로 즉시 승인
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 flex items-center justify-between gap-2">
                  <div className="text-left">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      관리자 모드 권한 설정
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                      {selectedMemberModal.role === "admin"
                        ? "현재 모든 관리 기능(통계·매뉴얼·보고서·회원관리) 사용 가능"
                        : "승격 시 로그인 즉시 관리자 모드로 접속됩니다"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleMemberAdminRole(selectedMemberModal)
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold transition shrink-0 whitespace-nowrap shadow-sm ${
                      selectedMemberModal.role === "admin"
                        ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                    }`}
                  >
                    {selectedMemberModal.role === "admin"
                      ? "권한 해제"
                      : "관리자 승격"}
                  </button>
                </div>

                {confirmWithdrawId === selectedMemberModal.id ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 space-y-2.5 text-center">
                    <p className="text-xs font-black text-rose-700 leading-snug">
                      정말 {selectedMemberModal.rank} {selectedMemberModal.name}{" "}
                      수사관의 계정을
                      <br />
                      탈퇴(영구 삭제) 처리하시겠습니까?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmWithdrawId(null)}
                        className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50 transition"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleWithdrawApprovedUser(selectedMemberModal)
                        }
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm transition"
                      >
                        탈퇴 확정
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmWithdrawId(selectedMemberModal.id)}
                    className="w-full py-3 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 text-xs font-extrabold flex items-center justify-center gap-1.5 transition"
                  >
                    <UserX className="w-4 h-4" />
                    회원 탈퇴 (계정 삭제)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white pt-8 pb-4 px-5 shadow-lg shrink-0 z-20 sticky top-0">
        <div className="max-w-xl mx-auto flex justify-between items-center gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-black tracking-tight flex items-center gap-2">
              <div className="bg-blue-600/30 p-1.5 rounded-xl border border-blue-400/30 shrink-0">
                <Siren className="w-4 h-4 text-rose-400" />
              </div>
              <SeoulPhishingXLogo size="md" />
              {isAdmin && (
                <span className="text-xs font-bold text-blue-300 ml-0.5 whitespace-nowrap">
                  (관리자)
                </span>
              )}
            </span>
            <span className="text-[11px] text-blue-300 ml-9 font-medium tracking-tight truncate">
              {currentOfficer.rank} {currentOfficer.name} ·{" "}
              {currentOfficer.unit}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLogout}
              className="text-xs px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 backdrop-blur-md transition font-bold whitespace-nowrap"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {reportToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 text-xs font-bold flex items-center justify-between shadow-xl shrink-0 animate-fadeIn z-50 fixed top-[72px] left-0 right-0 max-w-xl mx-auto rounded-b-2xl">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{reportToast}</span>
          </div>
          <button
            onClick={() => setReportToast(null)}
            className="opacity-80 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-28 max-w-xl w-full mx-auto">
        {activeTab === "dashboard" && (
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-br from-[#0C1B33] via-slate-900 to-indigo-950 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2 gap-2">
                  {isEditingStats && isAdmin ? (
                    <input
                      type="text"
                      value={stats.titleMain}
                      onChange={(e) =>
                        setStats({ ...stats, titleMain: e.target.value })
                      }
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-sm font-bold text-blue-200 focus:outline-none"
                    />
                  ) : (
                    <h2 className="text-xs font-extrabold tracking-wider text-blue-300 uppercase">
                      {stats.titleMain}
                    </h2>
                  )}
                  {isAdmin && (
                    <button
                      onClick={toggleStatsEdit}
                      className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-xl text-white font-bold transition shadow-lg shadow-blue-600/30 shrink-0 flex items-center gap-1.5 border border-blue-400/30 whitespace-nowrap"
                    >
                      {isEditingStats ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Edit2 className="w-3.5 h-3.5" />
                      )}
                      {isEditingStats ? "저장 완료" : "통계수정"}
                    </button>
                  )}
                </div>
                {isEditingStats && isAdmin ? (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <div className="flex items-baseline gap-1">
                      <input
                        type="text"
                        value={stats.totalCases}
                        onChange={(e) =>
                          setStats({ ...stats, totalCases: e.target.value })
                        }
                        className="w-20 bg-white/10 border border-white/30 rounded-xl text-2xl font-black text-white focus:outline-none text-center py-1"
                      />
                      <input
                        type="text"
                        value={stats.totalCasesUnit ?? "건"}
                        onChange={(e) =>
                          setStats({
                            ...stats,
                            totalCasesUnit: e.target.value,
                          })
                        }
                        className="w-10 bg-white/10 border border-white/30 rounded-lg text-sm font-bold text-blue-200 focus:outline-none text-center py-1"
                      />
                    </div>
                    <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1.5 rounded-xl border border-amber-400/30 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <input
                        type="text"
                        value={stats.caseIncreasePrefix ?? "전일 대비 +"}
                        onChange={(e) =>
                          setStats({
                            ...stats,
                            caseIncreasePrefix: e.target.value,
                          })
                        }
                        className="w-20 bg-white/10 border border-amber-300/50 rounded px-1 py-0.5 text-amber-300 text-xs font-bold focus:outline-none text-center"
                      />
                      <input
                        type="text"
                        value={stats.caseIncrease}
                        onChange={(e) =>
                          setStats({ ...stats, caseIncrease: e.target.value })
                        }
                        className="w-10 bg-white/10 border border-amber-300/50 rounded px-1 py-0.5 text-amber-300 text-xs font-bold focus:outline-none text-center"
                      />
                      <input
                        type="text"
                        value={stats.caseIncreaseUnit ?? "건"}
                        onChange={(e) =>
                          setStats({
                            ...stats,
                            caseIncreaseUnit: e.target.value,
                          })
                        }
                        className="w-8 bg-white/10 border border-amber-300/50 rounded px-1 py-0.5 text-amber-300 text-xs font-bold focus:outline-none text-center"
                      />
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-4xl font-black tracking-tight">
                      {stats.totalCases}
                      <span className="text-lg font-bold text-blue-200 ml-0.5">
                        {stats.totalCasesUnit ?? "건"}
                      </span>
                    </span>
                    <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-xl border border-amber-400/30 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {stats.caseIncreasePrefix ?? "전일 대비 +"}
                      {stats.caseIncrease}
                      {stats.caseIncreaseUnit ?? "건"}
                    </span>
                  </div>
                )}
              </div>
              <PieChart className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 pointer-events-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-200/80">
                {isEditingStats && isAdmin ? (
                  <div className="flex items-center gap-1 mb-2">
                    <input
                      type="text"
                      value={stats.goldenTimeMonth ?? "10"}
                      onChange={(e) =>
                        setStats({ ...stats, goldenTimeMonth: e.target.value })
                      }
                      className="w-8 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 text-[11px] font-black text-blue-600 text-center focus:outline-none shrink-0"
                    />
                    <span className="text-[11px] font-extrabold text-slate-500 shrink-0">
                      월
                    </span>
                    <input
                      type="text"
                      value={stats.labelGoldenTime}
                      onChange={(e) =>
                        setStats({ ...stats, labelGoldenTime: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-[11px] font-bold text-slate-500 focus:outline-none min-w-0"
                    />
                  </div>
                ) : (
                  <div className="text-[11px] font-extrabold text-slate-400 mb-1.5 truncate tracking-tight">
                    {stats.goldenTimeMonth ?? "10"}월 {stats.labelGoldenTime}
                  </div>
                )}
                {isEditingStats && isAdmin ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={stats.goldenTimeRate}
                      onChange={(e) =>
                        setStats({ ...stats, goldenTimeRate: e.target.value })
                      }
                      className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-base font-black text-emerald-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={stats.goldenTimeUnit ?? "%"}
                      onChange={(e) =>
                        setStats({ ...stats, goldenTimeUnit: e.target.value })
                      }
                      className="w-10 bg-slate-50 border border-slate-200 rounded-xl px-1.5 py-1 text-sm font-black text-emerald-600 text-center focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="text-2xl font-black text-emerald-600 tracking-tight">
                    {stats.goldenTimeRate}
                    {stats.goldenTimeUnit ?? "%"}
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-200/80">
                {isEditingStats && isAdmin ? (
                  <div className="flex items-center gap-1 mb-2">
                    <input
                      type="text"
                      value={stats.preventedMonth ?? "10"}
                      onChange={(e) =>
                        setStats({ ...stats, preventedMonth: e.target.value })
                      }
                      className="w-8 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 text-[11px] font-black text-blue-600 text-center focus:outline-none shrink-0"
                    />
                    <span className="text-[11px] font-extrabold text-slate-500 shrink-0">
                      월
                    </span>
                    <input
                      type="text"
                      value={stats.labelPreventedAmount}
                      onChange={(e) =>
                        setStats({
                          ...stats,
                          labelPreventedAmount: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-[11px] font-bold text-slate-500 focus:outline-none min-w-0"
                    />
                  </div>
                ) : (
                  <div className="text-[11px] font-extrabold text-slate-400 mb-1.5 truncate tracking-tight">
                    {stats.preventedMonth ?? "10"}월{" "}
                    {stats.labelPreventedAmount}
                  </div>
                )}
                {isEditingStats && isAdmin ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={stats.preventedAmount}
                      onChange={(e) =>
                        setStats({ ...stats, preventedAmount: e.target.value })
                      }
                      className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-base font-black text-blue-700 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={stats.preventedUnit ?? "억"}
                      onChange={(e) =>
                        setStats({ ...stats, preventedUnit: e.target.value })
                      }
                      className="w-10 bg-slate-50 border border-slate-200 rounded-xl px-1.5 py-1 text-sm font-black text-blue-700 text-center focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="text-2xl font-black text-blue-700 tracking-tight">
                    {stats.preventedAmount}
                    {stats.preventedUnit ?? "억"}
                  </div>
                )}
              </div>
            </div>

            {/* 교체된 영역: 최근 보이스피싱 관련 보도 사례 */}
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  {isEditingStats && isAdmin ? (
                    <input
                      type="text"
                      value={
                        stats.titleNews ?? "최근 보이스피싱 주요 보도 사례"
                      }
                      onChange={(e) =>
                        setStats({ ...stats, titleNews: e.target.value })
                      }
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none flex-1"
                    />
                  ) : (
                    <span className="truncate">
                      {stats.titleNews ?? "최근 보이스피싱 주요 보도 사례"}
                    </span>
                  )}
                </h3>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNews(!isAddingNews)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition shrink-0 whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    보도 추가
                  </button>
                )}
              </div>

              {isAddingNews && isAdmin && (
                <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 space-y-2.5">
                  <div className="text-xs font-black text-blue-800">
                    새 보이스피싱 보도 사례 등록
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="수법 태그 (예: 주민센터사칭)"
                      value={newNewsItem.tag}
                      onChange={(e) =>
                        setNewNewsItem({ ...newNewsItem, tag: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="언론사·날짜 (예: KBS · 2026.11)"
                      value={newNewsItem.press}
                      onChange={(e) =>
                        setNewNewsItem({
                          ...newNewsItem,
                          press: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="기사 또는 보도 영상 제목 입력"
                    value={newNewsItem.title}
                    onChange={(e) =>
                      setNewNewsItem({ ...newNewsItem, title: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="원문 기사 또는 유튜브 링크 (https://...)"
                    value={newNewsItem.url}
                    onChange={(e) =>
                      setNewNewsItem({ ...newNewsItem, url: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNews(false);
                        setNewNewsItem({
                          tag: "",
                          title: "",
                          press: "",
                          url: "",
                        });
                      }}
                      className="px-3.5 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleAddNewsSubmit}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      등록하기
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                {(stats.newsList || DEFAULT_NEWS_LIST).map((item) => (
                  <div key={item.id}>
                    {isEditingStats && isAdmin ? (
                      <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.tag}
                            onChange={(e) =>
                              handleNewsItemChange(
                                item.id,
                                "tag",
                                e.target.value
                              )
                            }
                            placeholder="태그"
                            className="w-28 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-rose-700 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={item.press}
                            onChange={(e) =>
                              handleNewsItemChange(
                                item.id,
                                "press",
                                e.target.value
                              )
                            }
                            placeholder="언론사 · 날짜"
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleDeleteNewsItem(item.id, e)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition shrink-0"
                            title="보도 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            handleNewsItemChange(
                              item.id,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="기사 제목"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) =>
                            handleNewsItemChange(item.id, "url", e.target.value)
                          }
                          placeholder="기사 링크 (https://...)"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-blue-600 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          if (item.url) {
                            window.open(
                              item.url,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        }}
                        className="group p-3.5 bg-slate-50/80 hover:bg-blue-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 transition cursor-pointer flex items-start justify-between gap-2.5"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-extrabold rounded-md">
                              {item.tag}
                            </span>
                            <span className="text-[11px] text-slate-400 font-bold">
                              {item.press}
                            </span>
                          </div>
                          <p className="text-xs font-extrabold text-slate-800 group-hover:text-blue-700 leading-snug break-words">
                            {item.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 pt-0.5">
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteNewsItem(item.id, e)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {(stats.newsList || DEFAULT_NEWS_LIST).length === 0 && (
                  <div className="text-center py-6 text-xs font-bold text-slate-400">
                    등록된 보이스피싱 보도 사례가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "manuals" && (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-lg font-black text-slate-900">
                유형별 현장 초동대응 매뉴얼
              </h2>
              {isAdmin && !selectedManual && !isAddingManual && (
                <button
                  onClick={() => {
                    setEditingManualId(null);
                    setNewManual({
                      title: "",
                      tag: "최신 경보",
                      content: "",
                      attachment: null,
                    });
                    setIsAddingManual(true);
                  }}
                  className="bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 hover:bg-blue-700 transition whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />새 매뉴얼 등록
                </button>
              )}
            </div>

            {isAddingManual ? (
              <form
                onSubmit={handleManualSubmit}
                className="bg-white rounded-[2rem] shadow-sm border border-slate-200/80 overflow-hidden flex flex-col p-4 space-y-3"
              >
                <div className="text-xs font-black text-blue-700 px-1">
                  {editingManualId ? "매뉴얼 수정" : "새 매뉴얼 등록"}
                </div>
                <input
                  type="text"
                  placeholder="매뉴얼 제목 입력"
                  value={newManual.title}
                  onChange={(e) =>
                    setNewManual({ ...newManual, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                />
                <select
                  value={newManual.tag}
                  onChange={(e) =>
                    setNewManual({ ...newManual, tag: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  <option value="필독 가이드">필독 가이드</option>
                  <option value="최신 경보">최신 경보</option>
                  <option value="보이스피싱">보이스피싱</option>
                  <option value="스미싱">스미싱</option>
                  <option value="일반 지침">일반 지침</option>
                </select>
                <textarea
                  placeholder="초동 조치 내용 등 매뉴얼 본문을 입력하세요."
                  value={newManual.content}
                  onChange={(e) =>
                    setNewManual({ ...newManual, content: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm h-48 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1">
                    <Paperclip className="w-3 h-3" />
                    사진 첨부 (최대 1MB 이미지)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleManualFileChange}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition cursor-pointer"
                  />
                  {newManual.attachment && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 bg-white inline-block max-w-[120px]">
                      <img
                        src={newManual.attachment}
                        alt="첨부 미리보기"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingManual(false);
                      setEditingManualId(null);
                    }}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md"
                  >
                    {editingManualId ? "수정 저장" : "등록하기"}
                  </button>
                </div>
              </form>
            ) : !selectedManual ? (
              <div className="space-y-3">
                {manuals.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedManual(m)}
                    className={`p-5 rounded-[1.75rem] shadow-sm border cursor-pointer transition group ${
                      m.isSpecialGuide || m.id === 999
                        ? "bg-gradient-to-r from-blue-50 via-white to-rose-50 border-blue-300 hover:border-blue-600 hover:shadow-md"
                        : "bg-white border-slate-200/80 hover:border-blue-500 hover:shadow-md"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2.5">
                      <span
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-xl ${
                          m.isSpecialGuide || m.tag === "필독 가이드"
                            ? "bg-slate-900 text-amber-300"
                            : m.tag === "최신 경보"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {m.tag}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => handleManualEditStart(m, e)}
                            className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition"
                            title="매뉴얼 수정"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isAdmin && m.id !== 999 && !m.isSpecialGuide && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteManual(m.id, e)}
                            className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 flex items-center justify-center transition"
                            title="매뉴얼 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition">
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {m.title}
                    </h3>
                  </div>
                ))}
                {manuals.length === 0 && (
                  <div className="bg-white rounded-[2rem] p-10 text-center text-xs font-bold text-slate-400 border border-slate-200/80">
                    등록된 매뉴얼이 없습니다.
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
                <div className="bg-slate-50 p-4 border-b border-slate-200/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedManual(null)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm shrink-0 whitespace-nowrap"
                  >
                    ← 목록으로
                  </button>
                  <span className="text-xs font-bold text-slate-900 truncate px-2 flex-1 text-center">
                    {selectedManual.title}
                  </span>
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) =>
                          handleManualEditStart(selectedManual, e)
                        }
                        className="text-xs font-bold text-blue-600 hover:bg-blue-100 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl flex items-center gap-1 whitespace-nowrap transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        수정
                      </button>
                      {selectedManual.id !== 999 &&
                        !selectedManual.isSpecialGuide && (
                          <button
                            type="button"
                            onClick={(e) =>
                              handleDeleteManual(selectedManual.id, e)
                            }
                            className="text-xs font-bold text-rose-600 hover:bg-rose-100 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl flex items-center gap-1 whitespace-nowrap transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            삭제
                          </button>
                        )}
                    </div>
                  )}
                </div>

                {selectedManual.isSpecialGuide || selectedManual.id === 999 ? (
                  <ExtractionDeletionGuideDetail manualData={selectedManual} />
                ) : (
                  <div className="p-6 flex-1 overflow-y-auto whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-semibold">
                    {selectedManual.content}

                    {selectedManual.attachment && (
                      <div className="mt-6 border-t border-slate-100 pt-5">
                        <h4 className="text-[11px] font-extrabold text-slate-400 mb-2.5 flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5" />
                          참고 이미지
                        </h4>
                        <img
                          src={selectedManual.attachment}
                          alt="매뉴얼 첨부파일"
                          className="rounded-xl border border-slate-200 shadow-sm max-w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "report" && (
          <div className="p-4 space-y-4">
            <div className="flex gap-2 mb-1">
              <button
                onClick={() => setReportTabMode("write")}
                className={`flex-1 py-3 rounded-[1rem] text-xs font-black transition shadow-sm whitespace-nowrap ${
                  reportTabMode === "write"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                {isAdmin ? "양식 확인/수정" : "새 보고서 작성"}
              </button>
              <button
                onClick={() => setReportTabMode("list")}
                className={`flex-1 py-3 rounded-[1rem] text-xs font-black transition shadow-sm whitespace-nowrap ${
                  reportTabMode === "list"
                    ? "bg-blue-600 text-white shadow-blue-600/30"
                    : "bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                {isAdmin ? "제출된 보고서 목록" : "내 보고서 내역"}
              </button>
            </div>

            {reportTabMode === "write" ? (
              <form
                onSubmit={handleReportSubmit}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/80 space-y-6"
              >
                <div className="border-b border-slate-200 pb-4 flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    {isEditingForm && isAdmin ? (
                      <div className="space-y-2.5 bg-blue-50/50 p-3 rounded-2xl border border-blue-200">
                        <div>
                          <label className="block text-[10px] font-extrabold text-blue-600 mb-1">
                            양식 메인 제목
                          </label>
                          <input
                            type="text"
                            value={formLabels.headerTitle}
                            onChange={(e) =>
                              setFormLabels({
                                ...formLabels,
                                headerTitle: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-blue-300 rounded-xl px-3 py-1.5 text-base font-black text-slate-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-blue-600 mb-1">
                            상단 문의/인사 안내 문구
                          </label>
                          <textarea
                            value={formLabels.headerDesc}
                            onChange={(e) =>
                              setFormLabels({
                                ...formLabels,
                                headerDesc: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 resize-none focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-rose-600 mb-1">
                            붉은색 강조 주의사항 문구 (※)
                          </label>
                          <textarea
                            value={formLabels.headerWarning}
                            onChange={(e) =>
                              setFormLabels({
                                ...formLabels,
                                headerWarning: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 resize-none focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 mb-1">
                            필수 질문 안내 문구
                          </label>
                          <input
                            type="text"
                            value={formLabels.headerRequiredNote}
                            onChange={(e) =>
                              setFormLabels({
                                ...formLabels,
                                headerRequiredNote: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">
                          {formLabels.headerTitle}
                        </h2>
                        <div className="text-[11.5px] text-slate-600 font-bold leading-relaxed space-y-3">
                          <p className="whitespace-pre-line">
                            {formLabels.headerDesc}
                          </p>
                          {formLabels.headerWarning && (
                            <p className="text-rose-600 whitespace-pre-line">
                              {formLabels.headerWarning}
                            </p>
                          )}
                          {formLabels.headerRequiredNote && (
                            <p className="text-slate-400 pt-0.5">
                              {formLabels.headerRequiredNote}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={toggleFormEdit}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 shrink-0 whitespace-nowrap ${
                        isEditingForm
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isEditingForm ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Edit2 className="w-3.5 h-3.5" />
                      )}
                      {isEditingForm ? "수정완료" : "양식수정"}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q1}
                        onChange={(e) =>
                          setFormLabels({ ...formLabels, q1: e.target.value })
                        }
                        className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-2 text-sm font-bold text-blue-700 focus:outline-none"
                      />
                    ) : (
                      <label className="block text-sm font-extrabold text-slate-800 mb-3">
                        {formLabels.q1} <span className="text-rose-600">*</span>
                      </label>
                    )}
                    <input
                      type="text"
                      required
                      value={newReport.serialNumber}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          serialNumber: e.target.value,
                        })
                      }
                      placeholder="내 답변"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-slate-800"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q2}
                        onChange={(e) =>
                          setFormLabels({ ...formLabels, q2: e.target.value })
                        }
                        className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-2 text-sm font-bold text-blue-700 focus:outline-none"
                      />
                    ) : (
                      <label className="block text-sm font-extrabold text-slate-800 mb-1">
                        {formLabels.q2} <span className="text-rose-600">*</span>
                      </label>
                    )}
                    <input
                      type="text"
                      required
                      value={newReport.victimName}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          victimName: e.target.value,
                        })
                      }
                      placeholder="내 답변"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-slate-800 mt-2"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <div className="space-y-1.5 mb-3">
                        <input
                          type="text"
                          value={formLabels.q3}
                          onChange={(e) =>
                            setFormLabels({ ...formLabels, q3: e.target.value })
                          }
                          className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 text-sm font-bold text-blue-700 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={formLabels.q3Sub}
                          onChange={(e) =>
                            setFormLabels({
                              ...formLabels,
                              q3Sub: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-extrabold text-slate-800 mb-1">
                          {formLabels.q3}{" "}
                          <span className="text-rose-600">*</span>
                        </label>
                        <p className="text-[11px] text-slate-500 font-semibold mb-3">
                          {formLabels.q3Sub}
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {[
                        "피싱팀(대면+비대면)",
                        "피싱팀(비대면)",
                        "피싱팀(대면)",
                        "강력팀",
                        "전담요원(방배)",
                        "※ 지역경찰 지원 출동",
                      ].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={opt}
                            checked={
                              Array.isArray(newReport.team) &&
                              newReport.team.includes(opt)
                            }
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewReport((prev) => {
                                const t = Array.isArray(prev.team)
                                  ? prev.team
                                  : [];
                                return {
                                  ...prev,
                                  team: checked
                                    ? [...t, opt]
                                    : t.filter((x) => x !== opt),
                                };
                              });
                            }}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q4}
                        onChange={(e) =>
                          setFormLabels({ ...formLabels, q4: e.target.value })
                        }
                        className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-2 text-sm font-bold text-blue-700 focus:outline-none"
                      />
                    ) : (
                      <label className="block text-sm font-extrabold text-slate-800 mb-3">
                        {formLabels.q4} <span className="text-rose-600">*</span>
                      </label>
                    )}
                    <div className="space-y-2">
                      {["조치완료", "조치중"].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="dispatchResult"
                            required
                            value={opt}
                            checked={newReport.dispatchResult === opt}
                            onChange={(e) =>
                              setNewReport({
                                ...newReport,
                                dispatchResult: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1 gap-2">
                      {isEditingForm && isAdmin ? (
                        <input
                          type="text"
                          value={formLabels.q5}
                          onChange={(e) =>
                            setFormLabels({ ...formLabels, q5: e.target.value })
                          }
                          className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-1 text-sm font-bold text-blue-700 focus:outline-none"
                        />
                      ) : (
                        <label className="block text-sm font-extrabold text-slate-800">
                          {formLabels.q5}{" "}
                          <span className="text-rose-600">*</span>
                        </label>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setNewReport({
                            ...newReport,
                            dispatchDate: getTodayFormatted(),
                          })
                        }
                        className="text-[11px] font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition shrink-0 whitespace-nowrap"
                      >
                        오늘 날짜 입력
                      </button>
                    </div>
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q5Sub}
                        onChange={(e) =>
                          setFormLabels({
                            ...formLabels,
                            q5Sub: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 mb-2 text-xs font-semibold text-slate-600 focus:outline-none"
                      />
                    ) : (
                      <p className="text-[11px] text-slate-500 font-semibold mb-3">
                        {formLabels.q5Sub}
                      </p>
                    )}
                    <input
                      type="text"
                      required
                      placeholder="내 답변"
                      value={newReport.dispatchDate}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          dispatchDate: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-slate-800"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q6}
                        onChange={(e) =>
                          setFormLabels({ ...formLabels, q6: e.target.value })
                        }
                        className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-2 text-sm font-bold text-blue-700 focus:outline-none"
                      />
                    ) : (
                      <label className="block text-sm font-extrabold text-slate-800 mb-3">
                        {formLabels.q6} <span className="text-rose-600">*</span>
                      </label>
                    )}
                    <input
                      type="text"
                      required
                      placeholder="내 답변"
                      value={newReport.officer}
                      onChange={(e) =>
                        setNewReport({ ...newReport, officer: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-slate-800"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q7}
                        onChange={(e) =>
                          setFormLabels({ ...formLabels, q7: e.target.value })
                        }
                        className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-2 text-sm font-bold text-blue-700 focus:outline-none"
                      />
                    ) : (
                      <label className="block text-sm font-extrabold text-slate-800 mb-3">
                        {formLabels.q7} <span className="text-rose-600">*</span>
                      </label>
                    )}
                    <div className="space-y-2">
                      {["대면", "비대면"].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="faceToFace"
                            required
                            value={opt}
                            checked={newReport.faceToFace === opt}
                            onChange={(e) =>
                              setNewReport({
                                ...newReport,
                                faceToFace: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q8}
                        onChange={(e) =>
                          setFormLabels({ ...formLabels, q8: e.target.value })
                        }
                        className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-2 text-sm font-bold text-blue-700 focus:outline-none"
                      />
                    ) : (
                      <label className="block text-sm font-extrabold text-slate-800 mb-3">
                        {formLabels.q8} <span className="text-rose-600">*</span>
                      </label>
                    )}
                    <div className="space-y-2">
                      {[
                        "직접 연락",
                        "악성앱 설치",
                        "사이트접속",
                        "연락 없음",
                      ].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="contacted"
                            required
                            value={opt}
                            checked={newReport.contacted === opt}
                            onChange={(e) =>
                              setNewReport({
                                ...newReport,
                                contacted: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q9}
                        onChange={(e) =>
                          setFormLabels({ ...formLabels, q9: e.target.value })
                        }
                        className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-2 text-sm font-bold text-blue-700 focus:outline-none"
                      />
                    ) : (
                      <label className="block text-sm font-extrabold text-slate-800 mb-3">
                        {formLabels.q9}
                      </label>
                    )}
                    <div className="space-y-2">
                      {[
                        "법원등기 빙자",
                        "기관사칭",
                        "대출사기",
                        "URL접속",
                        "카드배송",
                        "기타:",
                      ].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="crimeType"
                            value={opt}
                            checked={newReport.crimeType === opt}
                            onChange={(e) =>
                              setNewReport({
                                ...newReport,
                                crimeType: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          {opt}
                          {opt === "기타:" &&
                            newReport.crimeType === "기타:" && (
                              <input
                                type="text"
                                value={newReport.crimeTypeOther}
                                onChange={(e) =>
                                  setNewReport({
                                    ...newReport,
                                    crimeTypeOther: e.target.value,
                                  })
                                }
                                placeholder="상세 유형 입력"
                                className="ml-2 border-b border-slate-400 bg-transparent focus:outline-none focus:border-blue-600 text-sm font-bold px-1"
                              />
                            )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q10}
                        onChange={(e) =>
                          setFormLabels({ ...formLabels, q10: e.target.value })
                        }
                        className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-2 text-sm font-bold text-blue-700 focus:outline-none"
                      />
                    ) : (
                      <label className="block text-sm font-extrabold text-slate-800 mb-3">
                        {formLabels.q10}
                      </label>
                    )}
                    <div className="space-y-2">
                      {["삼성/갤럭시", "애플/아이폰", "확인 불가", "기타:"].map(
                        (opt) => (
                          <label
                            key={opt}
                            className="flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="phoneMaker"
                              value={opt}
                              checked={newReport.phoneMaker === opt}
                              onChange={(e) =>
                                setNewReport({
                                  ...newReport,
                                  phoneMaker: e.target.value,
                                })
                              }
                              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            {opt}
                            {opt === "기타:" &&
                              newReport.phoneMaker === "기타:" && (
                                <input
                                  type="text"
                                  value={newReport.phoneMakerOther}
                                  onChange={(e) =>
                                    setNewReport({
                                      ...newReport,
                                      phoneMakerOther: e.target.value,
                                    })
                                  }
                                  placeholder="제조사 입력"
                                  className="ml-2 border-b border-slate-400 bg-transparent focus:outline-none focus:border-blue-600 text-sm font-bold px-1"
                                />
                              )}
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q11}
                        onChange={(e) =>
                          setFormLabels({ ...formLabels, q11: e.target.value })
                        }
                        className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-2 text-sm font-bold text-blue-700 focus:outline-none"
                      />
                    ) : (
                      <label className="block text-sm font-extrabold text-slate-800 mb-3">
                        {formLabels.q11}{" "}
                        <span className="text-rose-600">*</span>
                      </label>
                    )}
                    <div className="space-y-2">
                      {["추출 완료", "추출 불가"].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="appExtracted"
                            required
                            value={opt}
                            checked={newReport.appExtracted === opt}
                            onChange={(e) =>
                              setNewReport({
                                ...newReport,
                                appExtracted: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <input
                        type="text"
                        value={formLabels.q12}
                        onChange={(e) =>
                          setFormLabels({ ...formLabels, q12: e.target.value })
                        }
                        className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 mb-2 text-sm font-bold text-blue-700 focus:outline-none"
                      />
                    ) : (
                      <label className="block text-sm font-extrabold text-slate-800 mb-3">
                        {formLabels.q12}{" "}
                        <span className="text-rose-600">*</span>
                      </label>
                    )}
                    <div className="space-y-2">
                      {["삭제 완료", "삭제 불가"].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="appDeleted"
                            required
                            value={opt}
                            checked={newReport.appDeleted === opt}
                            onChange={(e) =>
                              setNewReport({
                                ...newReport,
                                appDeleted: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <div className="space-y-1.5 mb-2">
                        <input
                          type="text"
                          value={formLabels.q13}
                          onChange={(e) =>
                            setFormLabels({
                              ...formLabels,
                              q13: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 text-sm font-bold text-blue-700 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={formLabels.q13Sub}
                          onChange={(e) =>
                            setFormLabels({
                              ...formLabels,
                              q13Sub: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-extrabold text-slate-800 mb-1">
                          {formLabels.q13}
                        </label>
                        <p className="text-[11px] text-slate-500 font-semibold mb-3">
                          {formLabels.q13Sub}
                        </p>
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="내 답변"
                      value={newReport.damageAmount}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          damageAmount: e.target.value.replace(/[^0-9]/g, ""),
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-slate-800"
                    />
                    {newReport.damageAmount && (
                      <p className="text-[11px] font-extrabold text-rose-600 mt-1.5 ml-1">
                        입력 금액 확인: {formatCurrency(newReport.damageAmount)}
                        원
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <div className="space-y-1.5 mb-2">
                        <input
                          type="text"
                          value={formLabels.q14}
                          onChange={(e) =>
                            setFormLabels({
                              ...formLabels,
                              q14: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 text-sm font-bold text-blue-700 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={formLabels.q14Sub1}
                          onChange={(e) =>
                            setFormLabels({
                              ...formLabels,
                              q14Sub1: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 focus:outline-none"
                        />
                        <textarea
                          value={formLabels.q14Sub2}
                          onChange={(e) =>
                            setFormLabels({
                              ...formLabels,
                              q14Sub2: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 resize-none focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-extrabold text-slate-800 mb-1">
                          {formLabels.q14}
                        </label>
                        <p className="text-[11px] text-slate-500 font-semibold mb-1">
                          {formLabels.q14Sub1}
                        </p>
                        <p className="text-[11px] text-slate-500 font-semibold mb-3 whitespace-pre-line">
                          {formLabels.q14Sub2}
                        </p>
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="내 답변"
                      value={newReport.preventedAmount}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          preventedAmount: e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ),
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-slate-800"
                    />
                    {newReport.preventedAmount && (
                      <p className="text-[11px] font-extrabold text-blue-600 mt-1.5 ml-1">
                        예방 금액 확인:{" "}
                        {formatCurrency(newReport.preventedAmount)}원
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {isEditingForm && isAdmin ? (
                      <div className="space-y-1.5 mb-2">
                        <input
                          type="text"
                          value={formLabels.q15}
                          onChange={(e) =>
                            setFormLabels({
                              ...formLabels,
                              q15: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1 text-sm font-bold text-blue-700 focus:outline-none"
                        />
                        <textarea
                          value={formLabels.q15Sub}
                          onChange={(e) =>
                            setFormLabels({
                              ...formLabels,
                              q15Sub: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 resize-none focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-extrabold text-slate-800 mb-1">
                          {formLabels.q15}{" "}
                          <span className="text-rose-600">*</span>
                        </label>
                        <p className="text-[11px] text-slate-500 font-semibold mb-3 whitespace-pre-line">
                          {formLabels.q15Sub}
                        </p>
                      </div>
                    )}
                    <textarea
                      required
                      placeholder="내 답변"
                      value={newReport.summary}
                      onChange={(e) =>
                        setNewReport({ ...newReport, summary: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/20 hover:from-blue-800 hover:to-indigo-900 active:scale-[0.98] transition flex items-center justify-center gap-2 text-sm mt-4"
                >
                  <Send className="w-4 h-4" />
                  보고서 제출
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center gap-2 px-1">
                  <h2 className="text-sm font-black text-slate-900 whitespace-nowrap shrink-0">
                    {isAdmin ? "제출된 보고서 목록" : "내 조치보고 내역"}
                  </h2>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isAdmin && (
                      <button
                        onClick={() => handleDownloadExcel(filteredReports)}
                        className="text-xs font-black bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1 whitespace-nowrap shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span>엑셀 저장</span>
                      </button>
                    )}
                    <span className="text-xs font-black bg-blue-100 text-blue-800 px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0">
                      총 {filteredReports.length}건
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={reportSearch}
                      onChange={(e) => {
                        setReportSearch(e.target.value);
                        setCurrentDatePage(1);
                      }}
                      placeholder="연번, 피해자명, 담당 경찰관, 소속팀, 날짜 검색..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "all", label: "전체 상태" },
                      { id: "unconfirmed", label: "미확인(접수)" },
                      { id: "confirmed", label: "확인완료" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setReportFilter(f.id);
                          setCurrentDatePage(1);
                        }}
                        className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition whitespace-nowrap text-center ${
                          reportFilter === f.id
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        출동일자별 정리
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={expandAllDates}
                          className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition whitespace-nowrap"
                        >
                          모두 펼치기
                        </button>
                        <button
                          type="button"
                          onClick={collapseAllDates}
                          className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition whitespace-nowrap"
                        >
                          모두 접기
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDateSortOrder(
                              dateSortOrder === "desc" ? "asc" : "desc"
                            )
                          }
                          className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg flex items-center gap-0.5 transition whitespace-nowrap"
                        >
                          <ArrowUpDown className="w-3 h-3" />
                          {dateSortOrder === "desc" ? "최신순" : "과거순"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={selectedMonthFilter}
                        onChange={(e) => {
                          setSelectedMonthFilter(e.target.value);
                          setSelectedDateFilter("all");
                          setCurrentDatePage(1);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="all">
                          전체 월 ({reportsWithNormalizedDate.length}건)
                        </option>
                        {uniqueMonths.map((m) => {
                          const mCount = reportsWithNormalizedDate.filter(
                            (r) => r.yearMonth === m
                          ).length;
                          return (
                            <option key={m} value={m}>
                              {m} ({mCount}건)
                            </option>
                          );
                        })}
                      </select>

                      <select
                        value={selectedDateFilter}
                        onChange={(e) => {
                          setSelectedDateFilter(e.target.value);
                          setCurrentDatePage(1);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="all">
                          전체 일자 ({reportsInSelectedMonth.length}건)
                        </option>
                        {uniqueDates.map((d) => {
                          const dCount = reportsInSelectedMonth.filter(
                            (r) => r.normalizedDate === d
                          ).length;
                          return (
                            <option key={d} value={d}>
                              {d} ({dCount}건)
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {paginatedDateKeys.map((dateKey, idx) => {
                    const dayReports = groupedReportsByDate[dateKey];
                    const dayPreventedSum = dayReports.reduce(
                      (sum, item) =>
                        sum +
                        Number(
                          String(item.preventedAmount || "0").replace(
                            /[^0-9]/g,
                            ""
                          )
                        ),
                      0
                    );
                    const unconfirmedCount = dayReports.filter(
                      (item) => item.status !== "관리자 확인완료"
                    ).length;
                    const expanded = isDateExpanded(dateKey, idx);

                    return (
                      <div
                        key={dateKey}
                        className="bg-white rounded-[1.5rem] border border-slate-200/90 shadow-sm overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleDateCollapse(dateKey, idx)}
                          className={`w-full px-4 py-3.5 flex items-center justify-between gap-2 transition text-left ${
                            expanded
                              ? "bg-slate-900 text-white"
                              : "bg-white hover:bg-slate-50 text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`p-1.5 rounded-lg border shrink-0 ${
                                expanded
                                  ? "bg-blue-500/20 border-blue-400/30 text-blue-300"
                                  : "bg-blue-50 border-blue-100 text-blue-600"
                              }`}
                            >
                              <Calendar className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-black tracking-tight whitespace-nowrap">
                              {dateKey}
                            </span>
                            <span
                              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg whitespace-nowrap shrink-0 ${
                                expanded
                                  ? "bg-white/15 text-blue-200"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {dayReports.length}건
                            </span>
                            {unconfirmedCount > 0 && (
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg whitespace-nowrap shrink-0 ${
                                  expanded
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                미확인 {unconfirmedCount}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div
                              className={`text-[11px] font-bold whitespace-nowrap ${
                                expanded ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              예방{" "}
                              <span
                                className={`font-black ${
                                  expanded ? "text-amber-300" : "text-blue-600"
                                }`}
                              >
                                {formatCurrency(dayPreventedSum)}원
                              </span>
                            </div>
                            {expanded ? (
                              <ChevronUp className="w-4 h-4 opacity-70 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
                            )}
                          </div>
                        </button>

                        {expanded && (
                          <div className="p-3 bg-slate-50/70 space-y-3 border-t border-slate-200/60">
                            {dayReports.map((r) => (
                              <div key={r.id}>
                                {editingReportId === r.id ? (
                                  <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border-2 border-blue-400 relative overflow-hidden space-y-3">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-sm font-black text-blue-700 flex items-center gap-1.5">
                                        <Edit2 className="w-4 h-4" />
                                        보고서 수정
                                      </span>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() =>
                                            setEditingReportId(null)
                                          }
                                          className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-bold hover:bg-slate-200 transition"
                                        >
                                          취소
                                        </button>
                                        <button
                                          onClick={handleReportEditSave}
                                          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-xl font-bold shadow-md hover:bg-blue-700 transition"
                                        >
                                          저장
                                        </button>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          연번
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.serialNumber}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              serialNumber: e.target.value,
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          출동일
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.date}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              date: e.target.value,
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          팀
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.team}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              team: e.target.value,
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          담당관
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.officer}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              officer: e.target.value,
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          대상자
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.victimName}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              victimName: e.target.value,
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          대면여부
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.faceToFace}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              faceToFace: e.target.value,
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          범행유형
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.crimeType}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              crimeType: e.target.value,
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          단말기
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.phoneMaker}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              phoneMaker: e.target.value,
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          앱추출
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.appExtracted}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              appExtracted: e.target.value,
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          앱삭제
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.appDeleted}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              appDeleted: e.target.value,
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          피해발생액
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.damageAmount}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              damageAmount:
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                ),
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none text-rose-600"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-400 ml-1">
                                          피해예방액
                                        </label>
                                        <input
                                          type="text"
                                          value={editReportData.preventedAmount}
                                          onChange={(e) =>
                                            setEditReportData({
                                              ...editReportData,
                                              preventedAmount:
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                ),
                                            })
                                          }
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:border-blue-400 focus:outline-none text-blue-600"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[10px] text-slate-400 ml-1">
                                        조치 상세 내용
                                      </label>
                                      <textarea
                                        value={editReportData.summary}
                                        onChange={(e) =>
                                          setEditReportData({
                                            ...editReportData,
                                            summary: e.target.value,
                                          })
                                        }
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 h-20 resize-none focus:border-blue-400 focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-200/80 relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-slate-100 gap-2">
                                      <div
                                        className={`${
                                          r.status === "관리자 확인완료"
                                            ? "bg-blue-100 text-blue-800 border-blue-200"
                                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                                        } text-[11px] font-black px-3 py-1 rounded-xl flex items-center gap-1 border whitespace-nowrap shrink-0`}
                                      >
                                        {r.status === "관리자 확인완료" ? (
                                          <FileCheck className="w-3.5 h-3.5 shrink-0" />
                                        ) : (
                                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                        )}
                                        {r.status || "접수완료"}
                                      </div>

                                      {isAdmin && (
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <button
                                            onClick={() =>
                                              handleConfirmReport(r.id)
                                            }
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition flex items-center gap-1 whitespace-nowrap ${
                                              r.status === "관리자 확인완료"
                                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                            }`}
                                          >
                                            <FileCheck className="w-3 h-3 shrink-0" />
                                            {r.status === "관리자 확인완료"
                                              ? "확인취소"
                                              : "확인체크"}
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleReportEditClick(r)
                                            }
                                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                                            title="수정"
                                          >
                                            <Edit2 className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteReport(r.id)
                                            }
                                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition"
                                            title="삭제"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex justify-between items-end mb-3 gap-2">
                                      <div className="min-w-0">
                                        <span className="text-[11px] text-slate-400 font-bold block truncate">
                                          출동일: {r.normalizedDate} · 연번: #
                                          {r.serialNumber}
                                        </span>
                                        <span className="text-sm font-black text-slate-900 block truncate">
                                          {r.team} ({r.officer})
                                        </span>
                                      </div>
                                      <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200/50 whitespace-nowrap shrink-0">
                                        {r.crimeType}
                                      </span>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs font-bold text-slate-700 mb-3 border border-slate-100">
                                      <div className="flex">
                                        <span className="w-20 text-slate-400 shrink-0">
                                          대상자:
                                        </span>{" "}
                                        <span className="text-slate-900">
                                          {r.victimName} ({r.faceToFace} /{" "}
                                          {r.dispatchResult || "조치완료"})
                                        </span>
                                      </div>
                                      <div className="flex">
                                        <span className="w-20 text-slate-400 shrink-0">
                                          단말기:
                                        </span>{" "}
                                        <span className="text-slate-900">
                                          {r.phoneMaker}
                                        </span>
                                      </div>
                                      <div className="flex">
                                        <span className="w-20 text-slate-400 shrink-0">
                                          악성앱:
                                        </span>{" "}
                                        <span className="text-slate-900">
                                          추출({r.appExtracted}) / 삭제(
                                          {r.appDeleted})
                                        </span>
                                      </div>
                                      <div className="flex">
                                        <span className="w-20 text-slate-400 shrink-0">
                                          피해발생액:
                                        </span>{" "}
                                        <span className="text-rose-600 font-black">
                                          {formatCurrency(r.damageAmount)}원
                                        </span>
                                      </div>
                                      <div className="flex">
                                        <span className="w-20 text-slate-400 shrink-0">
                                          피해예방액:
                                        </span>{" "}
                                        <span className="text-blue-600 font-black">
                                          {formatCurrency(r.preventedAmount)}원
                                        </span>
                                      </div>
                                    </div>

                                    <p className="text-xs text-slate-600 font-semibold bg-slate-50/50 border border-slate-100 p-3 rounded-2xl leading-relaxed">
                                      {r.summary}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {totalDatePages > 1 && (
                    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-sm mt-2">
                      <button
                        type="button"
                        disabled={safeCurrentPage <= 1}
                        onClick={() =>
                          setCurrentDatePage((p) => Math.max(1, p - 1))
                        }
                        className="flex items-center gap-1 text-xs font-extrabold text-slate-600 disabled:text-slate-300 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition whitespace-nowrap"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        이전
                      </button>
                      <span className="text-xs font-black text-slate-700 whitespace-nowrap">
                        {safeCurrentPage} / {totalDatePages} 페이지
                      </span>
                      <button
                        type="button"
                        disabled={safeCurrentPage >= totalDatePages}
                        onClick={() =>
                          setCurrentDatePage((p) =>
                            Math.min(totalDatePages, p + 1)
                          )
                        }
                        className="flex items-center gap-1 text-xs font-extrabold text-slate-600 disabled:text-slate-300 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition whitespace-nowrap"
                      >
                        다음
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {filteredReports.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-[2rem] border border-slate-200/80 text-slate-400 font-bold text-xs flex flex-col items-center gap-2 mt-4">
                    <FileText className="w-8 h-8 opacity-30" />
                    조건에 해당하는 조치보고 내역이 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "community" && (
          <div className="p-4 flex flex-col h-[calc(100vh-140px)]">
            <h2 className="text-lg font-black text-slate-900 mb-1 px-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              현장 정보 소통방 (Pol-아고라)
            </h2>
            <p className="text-xs text-slate-500 font-semibold px-1 mb-4">
              현장에서 발견된 신종 수법이나 악성 APK 정보를 공유해주세요.
            </p>

            <div className="flex-1 overflow-y-auto space-y-3 pb-4">
              {posts.map((post) => {
                const canEditPost =
                  isAdmin ||
                  post.authorId === currentOfficer.badgeNo ||
                  post.author ===
                    `${currentOfficer.unit} ${currentOfficer.name}`;

                return (
                  <div
                    key={post.id}
                    className="bg-white p-5 rounded-[1.75rem] shadow-sm border border-slate-200/80"
                  >
                    {editingPostId === post.id ? (
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                          <select
                            value={editPostCategory}
                            onChange={(e) =>
                              setEditPostCategory(e.target.value)
                            }
                            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700"
                          >
                            <option value="현장공유">현장공유</option>
                            <option value="신종APK">신종APK</option>
                            {isAdmin && <option value="공지">공지</option>}
                          </select>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingPostId(null)}
                              className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl"
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePostEditSave(post)}
                              className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-xl"
                            >
                              저장
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={editPostText}
                          onChange={(e) => setEditPostText(e.target.value)}
                          rows={2}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-semibold text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl ${
                                post.category === "공지"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {post.category}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {post.author}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {post.time}
                            </span>
                            {canEditPost && (
                              <button
                                onClick={() => handlePostEditStart(post)}
                                className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-lg transition"
                                title="수정하기"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canEditPost && (
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition"
                                title="삭제하기"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                          {post.content}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handlePostSubmit}
              className="bg-white p-4 rounded-[2rem] shadow-2xl border border-slate-200 flex flex-col gap-3 shrink-0"
            >
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewPostCategory("현장공유")}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                    newPostCategory === "현장공유"
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  일반 제보
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setNewPostCategory("공지")}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                      newPostCategory === "공지"
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    긴급 공지
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder={
                    newPostCategory === "공지"
                      ? "공지사항을 입력하세요..."
                      : "신종 수법이나 앱 패키지명 제보하기..."
                  }
                  className="flex-1 bg-slate-50 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition font-semibold border border-slate-200/60"
                />
                <button
                  type="submit"
                  disabled={!newPostText.trim()}
                  className="bg-blue-600 disabled:bg-slate-300 text-white p-3.5 rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "extract" && (
          <div className="p-4 space-y-4 flex flex-col items-center justify-center h-[calc(100vh-140px)]">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/80 text-center w-full max-w-sm">
              <h2 className="text-lg font-black text-slate-900 mb-2 flex items-center justify-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                악성앱 추출 도구
              </h2>
              <p className="text-xs text-slate-500 font-semibold mb-6 leading-relaxed">
                피해자 스마트폰의 기본 카메라를 열고
                <br />
                아래 QR코드를 스캔하도록 안내해주세요.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl inline-block border border-slate-200 border-dashed mb-4">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://m.site.naver.com/1Hu36"
                  alt="추출도구 QR코드"
                  className="w-48 h-48 object-contain rounded-lg mx-auto"
                />
              </div>
              <div className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-xl">
                🔗 연결 주소: http://m.site.naver.com/1Hu36
              </div>
            </div>
          </div>
        )}

        {activeTab === "pending" && isAdmin && (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-1 px-1">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                수사관 회원관리
              </h2>
              <div className="flex items-center gap-1.5">
                {pendingUsers.length > 0 && (
                  <span className="text-[11px] font-black bg-rose-100 text-rose-800 px-2.5 py-1 rounded-xl whitespace-nowrap">
                    대기 {pendingUsers.length}명
                  </span>
                )}
                <span className="text-[11px] font-black bg-blue-100 text-blue-800 px-2.5 py-1 rounded-xl whitespace-nowrap">
                  전체 {approvedUsers.length}명
                </span>
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="회원 성명, 계급, 소속 관서/팀, 아이디 검색..."
                className="w-full bg-white border border-slate-200/90 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-slate-600">
                  가입 승인 대기 ({filteredPendingUsers.length}명)
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  클릭 시 상세정보 확인
                </span>
              </div>

              {filteredPendingUsers.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-[1.75rem] p-7 text-center flex flex-col items-center justify-center text-slate-400 shadow-sm">
                  <ShieldAlert className="w-8 h-8 mb-2 opacity-40" />
                  <p className="font-bold text-xs">
                    {memberSearch.trim()
                      ? "검색 조건에 일치하는 승인 대기자가 없습니다."
                      : "현재 승인 대기 중인 수사관이 없습니다."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredPendingUsers.map((pendingUser) => (
                    <div
                      key={pendingUser.id}
                      onClick={() => openMemberDetail(pendingUser, "pending")}
                      className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-amber-200/80 hover:border-blue-400 cursor-pointer transition flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-black text-slate-900 mb-0.5 flex items-center gap-1.5 flex-wrap">
                          <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-lg font-extrabold">
                            승인대기
                          </span>
                          <span>
                            {pendingUser.rank} {pendingUser.name}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">
                            ({pendingUser.badgeNo})
                          </span>
                        </div>
                        <div className="text-xs font-bold text-blue-600 truncate">
                          소속: {pendingUser.unit}
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-1.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => rejectUser(pendingUser)}
                          className="bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 px-2.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap"
                        >
                          반려
                        </button>
                        <button
                          type="button"
                          onClick={() => approveUser(pendingUser)}
                          className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-1 whitespace-nowrap"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          승인
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-slate-600">
                  승인 완료된 수사관 목록 ({filteredApprovedUsers.length}명)
                </h3>
                <span className="text-[10px] font-bold text-blue-600">
                  클릭 시 상세·관리자승격·탈퇴
                </span>
              </div>

              {filteredApprovedUsers.length === 0 ? (
                <div className="bg-white/80 border border-slate-200/80 rounded-[1.75rem] p-8 text-center text-xs font-bold text-slate-400">
                  {memberSearch.trim()
                    ? "검색 조건에 일치하는 회원이 없습니다."
                    : "아직 승인 완료된 가입 회원이 없습니다."}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredApprovedUsers.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => openMemberDetail(u, "approved")}
                      className="bg-white hover:bg-blue-50/40 px-4 py-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-400 cursor-pointer transition flex justify-between items-center gap-2 shadow-sm"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-900 font-black text-sm">
                            {u.rank} {u.name}
                          </span>
                          <span className="text-slate-400">({u.badgeNo})</span>
                        </div>
                        <div className="text-[11px] font-bold text-blue-600 truncate mt-0.5">
                          {u.unit}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {u.role === "admin" ? (
                          <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1 whitespace-nowrap">
                            <ShieldCheck className="w-3 h-3" />
                            관리자
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap">
                            승인완료
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <nav className="bg-white/90 backdrop-blur-xl border-t border-slate-200/80 px-2 py-2.5 flex items-center justify-around shrink-0 fixed bottom-0 left-0 right-0 z-[2147483647] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition ${
            activeTab === "dashboard"
              ? "text-blue-700 font-black bg-blue-50"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">통계</span>
        </button>

        <button
          onClick={() => setActiveTab("manuals")}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition ${
            activeTab === "manuals"
              ? "text-slate-900 font-black bg-slate-100"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">매뉴얼</span>
        </button>

        <button
          onClick={() => setActiveTab("report")}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition ${
            activeTab === "report"
              ? "text-slate-900 font-black bg-slate-100"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">조치보고</span>
        </button>

        <button
          onClick={() => setActiveTab("extract")}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition ${
            activeTab === "extract"
              ? "text-slate-900 font-black bg-slate-100"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">추출도구</span>
        </button>

        <button
          onClick={() => setActiveTab("community")}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition ${
            activeTab === "community"
              ? "text-slate-900 font-black bg-slate-100"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">소통방</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition relative ${
              activeTab === "pending"
                ? "text-rose-600 font-black bg-rose-50"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {pendingUsers.length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
            )}
            {pendingUsers.length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            )}
            <Users className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">회원관리</span>
          </button>
        )}
      </nav>
    </div>
  );
}
