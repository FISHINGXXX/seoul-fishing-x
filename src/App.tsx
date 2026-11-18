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

let app: any,
  auth: any,
  db: any,
  appId = "seoulfisingx-app";

try {
  const win = window as any;
  const envConfig =
    typeof win.__firebase_config !== "undefined" && win.__firebase_config
      ? JSON.parse(win.__firebase_config)
      : null;
  const firebaseConfig =
    envConfig && Object.keys(envConfig).length > 0
      ? envConfig
      : USER_FIREBASE_CONFIG;

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  if (typeof win.__app_id !== "undefined" && win.__app_id) {
    appId = win.__app_id;
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
- 사건 명칭: 행정복지센터 및 경찰 사칭 결합형 비대면 편취 사기
- 핵심 특징: 일상적인 행정 연락(주민등록등본 대리 발급 문의)으로 경계심을 무너뜨린 뒤, 기관 사칭(경찰관)으로 연계해 공포심을 유발하고 비대면(우편함 등)으로 현금을 편취하는 신종 수법

🚨 [단계별 범행 시나리오 흐름]

① 1단계: 행정복지센터 사칭 (명의도용 불안감 조성)
- 범행 수법: 가해자가 행정복지센터 직원을 사칭하여 연락
- 주요 멘트: "친척이 위임장을 들고 와서 등본 발급을 요구했는데, 혹시 아시는 분인가요?"
- 심리 유도: 피해자가 모르는 사람이라며 당황하면, 명의도용 피해 우려가 크다며 "저희 쪽에서 대신 경찰에 신고해 주겠다"고 안심시킨 뒤 전화를 끊고 다음 연락을 유도

② 2단계: 경찰관 사칭 (범죄 연루 압박 및 고립)
- 범행 수법: 직후에 사칭범이 경찰관(형사팀)인 것처럼 다시 연락
- 주요 멘트: "서울 OO경찰서 형사입니다. 행정복지센터 신고 접수를 받고 확인해 보니, 현재 선생님 명의도용 및 대포통장 개설 시도가 포착되었습니다."
- 심리 고립: "공범으로 오인될 수 있으니 수사가 끝날 때까지 가족을 포함한 주변 사람들에게 절대 알리지 마십시오."

③ 3단계: 임시 보호 조치 빙자 (현금 인출 및 보관 지시)
- 범행 수법: 자산 보호를 명목으로 현금을 직접 찾아 특정 장소에 두도록 강요
- 주요 멘트: "계좌에 있는 자산이 불법 자금과 섞였는지 확인하고 보호해야 합니다. 현금을 인출해 자택 우편함에 넣어두시면, 저희가 회수해 확인 후 즉시 돌려드리겠습니다."
- 행동 지시: 피해자로 하여금 ATM 무카드/무통장 인출 등을 통해 현금을 전액 찾게 한 뒤, 자택 우편함에 넣고 인증 사진을 전송하도록 강요

④ 4단계: 수거책 현금 탈취
- 범행 수법: 피해자가 우편함 보관 인증 사진을 보내면, 인근에 대기 중이던 수거책이 즉시 우편함을 열어 현금 봉투를 들고 도주

🛡️ [현장 대응 및 피해 예방 핵심 수칙]
- 공공기관의 대리 신고 부재: 행정복지센터 직원이 개인의 명의도용 피해를 대신 경찰에 접수해 주거나, 직후에 경찰관이 개인 휴대폰으로 바로 연락하는 공식 절차는 존재하지 않습니다.
- 비대면 현금 인출·보관 요구는 100% 사기: 경찰, 검찰, 금융감독원 등 어떤 수사·금융기관도 자산 보호나 범죄 연루 확인을 명목으로 현금 인출을 요구하거나 우편함·보관함 등에 돈을 넣어두라고 지시하지 않습니다.
- 즉시 신고 및 대처: 유사한 전화를 받았을 경우 즉시 통화를 종료하고, 주변의 다른 전화를 통해 112 또는 경찰청 보이스피싱 통합신고·상담센터(1394)로 진위 여부를 반드시 확인해야 합니다.`,
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

const getTodayFormatted = () => {
  const d = new Date();
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}. ${String(d.getDate()).padStart(2, "0")}`;
};

// 원본 스플래시 이미지(/splash.jpg) 표시 컴포넌트
const SplashScreen = ({
  fadingOut,
  onSkip,
}: {
  fadingOut: boolean;
  onSkip: () => void;
}) => {
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

      <div
        className="w-full h-[23.8%] relative overflow-hidden shrink-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 35%, #323232 0%, #242424 55%, #111111 92%, #050505 100%)",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent via-black/75 to-black" />
      </div>

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
          >
            피싱
          </text>
          <text x="530" y="141" fill="#DC0609" fontSize="92" fontWeight="900">
            X
          </text>
        </svg>
      </div>

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
          <span className="text-white text-[14px] sm:text-[15px] tracking-tight font-bold">
            서울경찰청 형사과
          </span>
        </div>
      </div>
    </div>
  );
};

// 상단 로고 컴포넌트
const SeoulPhishingXLogo = ({
  size = "md",
  darkText = false,
}: {
  size?: string;
  darkText?: boolean;
}) => {
  const isLarge = size === "lg";
  return (
    <span
      className="inline-flex items-baseline select-none antialiased"
      aria-label="서울형사 피싱X"
    >
      <span
        className={`${
          darkText ? "text-slate-600" : "text-[#CBD5E1]"
        } tracking-tight ${
          isLarge ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
        }`}
        style={{ fontWeight: 800 }}
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
          isLarge ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
        }`}
        style={{ fontWeight: 900 }}
      >
        X
      </span>
    </span>
  );
};

// [붙임5·6] 악성앱 추출 및 삭제 통합 매뉴얼 상세페이지 컴포넌트
const ExtractionDeletionGuideDetail = ({ manualData }: { manualData?: any }) => {
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
                악성앱 추출 프로그램 개요
              </div>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                {data.extractOverview}
              </p>
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
                  <span className="text-[11px] font-black bg-rose-600 text-white px-2.5 py-0.5 rounded-lg">
                    STEP 2 (중요)
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
                  ② ‘무시하고 설치하기’ 선택 후 검사·전송
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
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs font-extrabold text-emerald-900">
                🛡 {data.deleteVaccineNotice}
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-black text-rose-900 border-b border-rose-200 pb-2">
                  주요 의심 악성앱 명칭 예시 (즉시 삭제)
                </div>
                <div>
                  <div className="text-[11px] font-black text-rose-700 mb-1.5">
                    ■ 숨겨진 악성앱 (시스템 앱 표시 활성화 필수)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hiddenList.map((name: string, i: number) => (
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
                    ■ 주요 사칭 악성앱 (바탕화면 노출)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {impersonationList.map((name: string, i: number) => (
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
                    ② 다운로드 · 설치파일(APK) 확인
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold">
                    카테고리에서{" "}
                    <span className="text-rose-600 font-black">[다운로드]</span>{" "}
                    및{" "}
                    <span className="text-rose-600 font-black">
                      [설치 파일(APK)]
                    </span>
                    로 들어가 의심 파일을 확인합니다.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <div className="text-xs font-black text-slate-900 mb-1">
                    ③ 악성앱 설치파일(.apk) 완전 삭제
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold">
                    목록에 남아 있는 모든 악성 설치파일을 길게 눌러 삭제하고
                    휴지통까지 비웁니다.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5">
                  <div className="text-xs font-black text-blue-900 mb-1">
                    ④ 백신 앱으로 최종 악성코드 검사
                  </div>
                  <p className="text-[11px] text-blue-800 font-bold">
                    V3 Mobile Plus 또는 알약M, 시티즌코난으로 최종 정밀 검사를
                    실행하여 잔여 악성코드를 확인합니다.
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
  // 스플래시 화면 상태
  const [showSplash, setShowSplash] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  // 탭 상태: stats(통계) | manual(매뉴얼) | report(조치보고) | qr(추출도구) | board(소통방) | account(계정관리)
  const [activeTab, setActiveTab] = useState("stats");

  // 사용자 및 관리자 권한 상태
  const [currentUser, setCurrentUser] = useState({
    name: "경사 강석준",
    dept: "서울청 강력계 악성앱담당자",
    isAdmin: true,
  });

  // 통계 상태
  const [stats, setStats] = useState({
    todayTargetCount: 9,
    diffFromYesterday: 4,
    actionRate: "98.9%",
    preventedAmountText: "4.86억",
  });
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [editStats, setEditStats] = useState(stats);

  // 최근 보이스피싱 보도 사례 상태
  const [newsList, setNewsList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("phishingx_news");
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    tag: "",
    title: "",
    press: "",
    url: "",
  });

  // 매뉴얼 상태
  const [manuals, setManuals] = useState<any[]>(INITIAL_MANUALS);
  const [selectedManual, setSelectedManual] = useState<any>(null);
  const [manualSearch, setManualSearch] = useState("");

  // 조치보고 상태
  const [reports, setReports] = useState<any[]>(INITIAL_REPORTS);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    serialNumber: "",
    victimName: "",
    team: "",
    officer: "",
    crimeType: "주민센터사칭",
    preventedAmount: "",
    summary: "",
  });

  // 소통방 상태
  const [posts, setPosts] = useState<any[]>(INITIAL_POSTS);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("신종APK");

  // 스플래시 타이머
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), 1400);
    const hideTimer = setTimeout(() => setShowSplash(false), 1900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Firebase 실시간 동기화 (뉴스 및 통계)
  useEffect(() => {
    if (!db) return;
    try {
      if (auth) {
        signInAnonymously(auth).catch(() => {});
      }
      const statsRef = doc(db, "app_settings", "dashboard_stats");
      const unsubStats = onSnapshot(
        statsRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as any;
            setStats((prev) => ({ ...prev, ...data }));
          }
        },
        () => {}
      );

      const newsCol = collection(db, "phishing_news");
      const unsubNews = onSnapshot(
        newsCol,
        (snap) => {
          if (!snap.empty) {
            const loaded = snap.docs
              .map((d) => ({ id: d.id, ...(d.data() as any) }))
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setNewsList(loaded);
          }
        },
        () => {}
      );

      return () => {
        unsubStats();
        unsubNews();
      };
    } catch (e) {
      console.log("Firestore sync skipped", e);
    }
  }, []);

  // 통계 저장 핸들러
  const handleSaveStats = async () => {
    setStats(editStats);
    setIsStatsModalOpen(false);
    if (db) {
      try {
        await setDoc(doc(db, "app_settings", "dashboard_stats"), editStats, {
          merge: true,
        });
      } catch (e) {
        console.log("Stats save fallback", e);
      }
    }
  };

  // 보도 사례 추가 핸들러
  const handleAddNews = async () => {
    if (!newArticle.title.trim() || !newArticle.url.trim()) return;
    const item = {
      id: `news-${Date.now()}`,
      createdAt: Date.now(),
      tag: newArticle.tag.trim() || "주요보도",
      title: newArticle.title.trim(),
      press: newArticle.press.trim() || `보도자료 · ${getTodayFormatted()}`,
      url: newArticle.url.trim().startsWith("http")
        ? newArticle.url.trim()
        : `https://${newArticle.url.trim()}`,
    };

    const updated = [item, ...newsList];
    setNewsList(updated);
    localStorage.setItem("phishingx_news", JSON.stringify(updated));
    setNewArticle({ tag: "", title: "", press: "", url: "" });
    setIsNewsModalOpen(false);

    if (db) {
      try {
        await setDoc(doc(db, "phishing_news", item.id), item);
      } catch (e) {
        console.log("News save fallback", e);
      }
    }
  };

  // 보도 사례 삭제 핸들러
  const handleDeleteNews = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = newsList.filter((n) => n.id !== id);
    setNewsList(updated);
    localStorage.setItem("phishingx_news", JSON.stringify(updated));
    if (db) {
      try {
        await deleteDoc(doc(db, "phishing_news", id));
      } catch (err) {
        console.log("News delete fallback", err);
      }
    }
  };

  // 조치보고 등록 핸들러
  const handleAddReport = () => {
    if (!newReport.victimName.trim() || !newReport.summary.trim()) return;
    const item = {
      id: `REP-${Date.now()}`,
      date: getTodayFormatted(),
      serialNumber: newReport.serialNumber || "신규",
      victimName: newReport.victimName,
      team: newReport.team || "현장출동팀",
      officer: newReport.officer || currentUser.name,
      dispatchResult: "조치완료",
      faceToFace: "대면",
      contacted: "악성앱 설치",
      crimeType: newReport.crimeType,
      phoneMaker: "삼성/갤럭시",
      appExtracted: "추출 완료",
      appDeleted: "삭제 완료",
      damageAmount: "0",
      preventedAmount: newReport.preventedAmount || "0",
      summary: newReport.summary,
      status: "접수완료",
    };
    setReports([item, ...reports]);
    setNewReport({
      serialNumber: "",
      victimName: "",
      team: "",
      officer: "",
      crimeType: "주민센터사칭",
      preventedAmount: "",
      summary: "",
    });
    setIsReportModalOpen(false);
  };

  // 소통방 글 등록 핸들러
  const handleAddPost = () => {
    if (!newPostContent.trim()) return;
    const item = {
      id: Date.now(),
      author: `${currentUser.dept} ${currentUser.name}`,
      time: "방금 전",
      category: newPostCategory,
      content: newPostContent.trim(),
    };
    setPosts([item, ...posts]);
    setNewPostContent("");
  };

  const filteredManuals = manuals.filter(
    (m) =>
      m.title.toLowerCase().includes(manualSearch.toLowerCase()) ||
      m.tag.toLowerCase().includes(manualSearch.toLowerCase()) ||
      m.content.toLowerCase().includes(manualSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-24">
      {showSplash && (
        <SplashScreen
          fadingOut={fadingOut}
          onSkip={() => setShowSplash(false)}
        />
      )}

      {/* 상단 네비게이션 헤더 */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
              <SeoulPhishingXLogo size="md" />
              {currentUser.isAdmin && (
                <span className="text-[11px] text-slate-300 font-bold">
                  (관리자)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              {currentUser.name} · {currentUser.dept}
            </p>
          </div>
          <button
            onClick={() =>
              setCurrentUser((prev) => ({ ...prev, isAdmin: !prev.isAdmin }))
            }
            className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-semibold transition"
          >
            {currentUser.isAdmin ? "관리자모드" : "일반모드"}
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 컨테이너 */}
      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* ==================== 1. 통계 탭 ==================== */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            {/* 상단 다크 네이비 메인 통계 배너 */}
            <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e1b4b] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-300 font-semibold">
                    오늘의 서울청 악성앱 구제활동 대상자
                  </p>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-3xl font-black tracking-tight">
                      {stats.todayTargetCount}
                      <span className="text-lg font-bold ml-0.5">건</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                      ▲ 전일 대비 {stats.diffFromYesterday}건
                    </span>
                  </div>
                </div>
                {currentUser.isAdmin && (
                  <button
                    onClick={() => {
                      setEditStats(stats);
                      setIsStatsModalOpen(true);
                    }}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow transition"
                  >
                    <Edit2 className="w-3 h-3" />
                    통계수정
                  </button>
                )}
              </div>
            </div>

            {/* 중단 2열 핵심 지표 카드 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <p className="text-[11px] text-slate-400 font-bold">
                  서울경찰청 악성앱 구제활동 조치율
                </p>
                <p className="text-2xl font-black text-emerald-600 mt-1.5">
                  {stats.actionRate}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <p className="text-[11px] text-slate-400 font-bold">
                  누적 피해 예방액
                </p>
                <p className="text-2xl font-black text-blue-900 mt-1.5">
                  {stats.preventedAmountText}
                </p>
              </div>
            </div>

            {/* 신규 교체 영역: 최근 보이스피싱 주요 보도 사례 */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">📰</span>
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    최근 보이스피싱 주요 보도 사례
                  </h3>
                </div>
                {currentUser.isAdmin && (
                  <button
                    onClick={() => setIsNewsModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    보도 추가
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {newsList.map((news) => (
                  <div
                    key={news.id}
                    onClick={() =>
                      window.open(news.url, "_blank", "noopener,noreferrer")
                    }
                    className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 cursor-pointer transition flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[11px] font-extrabold rounded-md">
                          {news.tag}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {news.press}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 leading-snug flex items-center gap-1">
                        <span>{news.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 inline" />
                      </p>
                    </div>
                    {currentUser.isAdmin && (
                      <button
                        onClick={(e) => handleDeleteNews(news.id, e)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                        title="보도 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. 매뉴얼 탭 ==================== */}
        {activeTab === "manual" && (
          <div className="space-y-3">
            {selectedManual ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedManual(null)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-200 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    목록으로 돌아가기
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-[11px] font-bold">
                    {selectedManual.tag}
                  </span>
                </div>

                {selectedManual.isSpecialGuide ? (
                  <ExtractionDeletionGuideDetail manualData={selectedManual} />
                ) : (
                  <div className="p-5 space-y-4">
                    <h2 className="text-base font-black text-slate-900 leading-snug">
                      {selectedManual.title}
                    </h2>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 font-semibold whitespace-pre-line leading-relaxed">
                      {selectedManual.content}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="수법, 키워드(행정복지센터, 악성앱 등) 검색..."
                    value={manualSearch}
                    onChange={(e) => setManualSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold shadow-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2.5">
                  {filteredManuals.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedManual(m)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        m.isSpecialGuide
                          ? "bg-gradient-to-r from-slate-900 to-blue-950 text-white border-slate-800 shadow-md"
                          : "bg-white hover:bg-slate-50 border-slate-200 shadow-sm"
                      }`}
                    >
                      <div className="space-y-1 pr-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            m.isSpecialGuide
                              ? "bg-rose-500 text-white"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {m.tag}
                        </span>
                        <h3
                          className={`text-sm font-extrabold leading-snug ${
                            m.isSpecialGuide ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {m.title}
                        </h3>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 shrink-0 ${
                          m.isSpecialGuide ? "text-slate-300" : "text-slate-400"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ==================== 3. 조치보고 탭 ==================== */}
        {activeTab === "report" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  현장 악성앱 구제 조치보고
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  출동 경찰관 대면 조치 및 피해예방 내역 기록
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                <Plus className="w-4 h-4" />
                보고서 작성
              </button>
            </div>

            <div className="space-y-2.5">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-md">
                      {rep.crimeType} · {rep.dispatchResult}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold">
                      {rep.date}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {rep.team} ({rep.officer}) — 피해자 {rep.victimName}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {rep.summary}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-bold pt-1 text-blue-700">
                    <span>악성앱: {rep.appExtracted} / {rep.appDeleted}</span>
                    <span>
                      예방금액:{" "}
                      {Number(rep.preventedAmount || 0).toLocaleString()}원
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. 추출도구 탭 ==================== */}
        {activeTab === "qr" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full">
              경찰청 디지털포렌식센터 공식 배포
            </span>
            <h2 className="text-lg font-black text-slate-900">
              악성앱 자동추출 프로그램 QR
            </h2>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              피해자의 안드로이드(갤럭시) 휴대전화 카메라로 아래 QR코드를
              스캔하여 추출 앱을 설치하세요.
            </p>
            <div className="flex justify-center py-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  GUIDE_MANUAL_DEFAULT.qrUrl
                )}`}
                alt="악성앱 추출 QR"
                className="w-48 h-48 border-2 border-slate-200 rounded-2xl p-3 shadow-sm"
              />
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-blue-700">
              접속 주소: {GUIDE_MANUAL_DEFAULT.qrUrl}
            </div>
          </div>
        )}

        {/* ==================== 5. 소통방 탭 ==================== */}
        {activeTab === "board" && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                {["신종APK", "현장공유", "공지"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewPostCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      newPostCategory === cat
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="현장 신종 악성앱 패키지명·수법 실시간 공유..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
                <button
                  onClick={handleAddPost}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  등록
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      {post.author}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {post.time}
                    </span>
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-extrabold rounded">
                    {post.category}
                  </span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed pt-1">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 6. 계정관리 탭 ==================== */}
        {activeTab === "account" && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {currentUser.name}
                </h2>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  {currentUser.dept}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full">
                {currentUser.isAdmin ? "관리자 승인됨" : "일반 수사관"}
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-2 font-medium">
              <p>• 플랫폼: 서울형사 피싱X (보이스피싱·악성앱 피해구제 시스템)</p>
              <p>• 운영부서: 서울특별시경찰청 형사과 강력계</p>
              <p>• 문의 및 긴급신고: 국번없이 112 / 보이스피싱 통합신고 1394</p>
            </div>
          </div>
        )}
      </main>

      {/* ==================== 모달 1: 통계 수정 모달 ==================== */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="font-black text-base text-slate-900">
              상단 통계 지표 수정
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  오늘의 구제활동 대상자 (건)
                </label>
                <input
                  type="number"
                  value={editStats.todayTargetCount}
                  onChange={(e) =>
                    setEditStats({
                      ...editStats,
                      todayTargetCount: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  전일 대비 증감 (건)
                </label>
                <input
                  type="number"
                  value={editStats.diffFromYesterday}
                  onChange={(e) =>
                    setEditStats({
                      ...editStats,
                      diffFromYesterday: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  구제활동 조치율 (예: 98.9%)
                </label>
                <input
                  type="text"
                  value={editStats.actionRate}
                  onChange={(e) =>
                    setEditStats({ ...editStats, actionRate: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  누적 피해 예방액 (예: 4.86억)
                </label>
                <input
                  type="text"
                  value={editStats.preventedAmountText}
                  onChange={(e) =>
                    setEditStats({
                      ...editStats,
                      preventedAmountText: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                취소
              </button>
              <button
                onClick={handleSaveStats}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 모달 2: 보도 사례 추가 모달 ==================== */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="font-black text-base text-slate-900">
              보이스피싱 주요 보도 사례 추가
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="수법 태그 (예: 주민센터사칭, 카드배송, 기관사칭)"
                value={newArticle.tag}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, tag: e.target.value })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <input
                type="text"
                placeholder="기사 또는 영상 제목 입력"
                value={newArticle.title}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, title: e.target.value })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <input
                type="text"
                placeholder="언론사 및 날짜 (예: KBS 뉴스 · 2026.11.18)"
                value={newArticle.press}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, press: e.target.value })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <input
                type="url"
                placeholder="기사 원문 또는 유튜브 링크 (https://...)"
                value={newArticle.url}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, url: e.target.value })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                취소
              </button>
              <button
                onClick={handleAddNews}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 모달 3: 조치보고 작성 모달 ==================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3 shadow-xl">
            <h3 className="font-black text-base text-slate-900">
              현장 구제 조치보고 작성
            </h3>
            <input
              type="text"
              placeholder="피해자 성명"
              value={newReport.victimName}
              onChange={(e) =>
                setNewReport({ ...newReport, victimName: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
            />
            <input
              type="text"
              placeholder="출동 소속/팀 (예: 송파서 피싱팀)"
              value={newReport.team}
              onChange={(e) =>
                setNewReport({ ...newReport, team: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
            />
            <input
              type="text"
              placeholder="수법 분류 (예: 주민센터사칭, 카드배송)"
              value={newReport.crimeType}
              onChange={(e) =>
                setNewReport({ ...newReport, crimeType: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
            />
            <input
              type="number"
              placeholder="피해 예방 금액 (숫자만 입력, 예: 30000000)"
              value={newReport.preventedAmount}
              onChange={(e) =>
                setNewReport({ ...newReport, preventedAmount: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
            />
            <textarea
              placeholder="조치 요약 (비행기모드 전환, 악성앱 추출·삭제, 지급정지 등)"
              rows={3}
              value={newReport.summary}
              onChange={(e) =>
                setNewReport({ ...newReport, summary: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                취소
              </button>
              <button
                onClick={handleAddReport}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                보고서 등록
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 하단 고정 네비게이션 바 ==================== */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40">
        <div className="max-w-lg mx-auto grid grid-cols-6 py-2">
          {[
            { id: "stats", label: "통계", icon: BarChart3 },
            { id: "manual", label: "매뉴얼", icon: BookOpen },
            { id: "report", label: "조치보고", icon: FileText },
            { id: "qr", label: "추출도구", icon: QrCode },
            { id: "board", label: "소통방", icon: MessageSquare },
            { id: "account", label: "계정관리", icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 gap-1 transition ${
                  active
                    ? "text-blue-600 font-extrabold"
                    : "text-slate-400 font-semibold hover:text-slate-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
