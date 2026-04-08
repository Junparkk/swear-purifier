import { useState, useCallback, useEffect, useRef } from "react";
import { toast, Toaster } from "sonner";
import { PurifyForm } from "@/components/PurifyForm";
import { ResultCard } from "@/components/ResultCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SplashScreen } from "@/components/SplashScreen";
import { validateInput } from "@/lib/sanitize";
import { purifyText } from "@/lib/gemini";

type Step = "form" | "loading" | "result";

const MARQUEE_TEXT = [
  "화가났지만 나는 어른이니까",
  "★",
  "욕도 품격있게",
  "★",
  "AI 순화기",
  "★",
];
const DECO = [
  { char: "★", style: "top:15%;left:5%;", dur: "7s" },
  { char: "✦", style: "top:30%;right:6%;", dur: "5s" },
  { char: "♡", style: "top:60%;left:3%;", dur: "8s" },
  { char: "✧", style: "top:75%;right:4%;", dur: "6s" },
  { char: "☆", style: "top:45%;right:7%;", dur: "9s" },
];

function Stars() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    for (let i = 0; i < 60; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const size = Math.random() * 2 + 1;
      s.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        --d:${(Math.random() * 4 + 2).toFixed(1)}s;
        animation-delay:${(Math.random() * 4).toFixed(1)}s;
      `;
      el.appendChild(s);
    }
  }, []);
  return (
    <div
      ref={ref}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    />
  );
}

export default function App() {
  const [splash, setSplash] = useState(true);
  const [step, setStep] = useState<Step>("form");
  const [text, setText] = useState("");
  const [style, setStyle] = useState("professional");
  const [angerLevel, setAngerLevel] = useState(3);
  const [result, setResult] = useState<string | null>(null);

  const handlePurify = useCallback(async () => {
    const validation = validateInput(text);
    if (!validation.ok) {
      toast.error(validation.error);
      return;
    }

    setStep("loading");

    try {
      const purified = await purifyText({
        text: validation.normalized,
        style,
        angerLevel,
      });
      setResult(purified);
      setStep("result");
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (e) {
      toast.error("오류가 발생했어요. 다시 시도해주세요.");
      console.error(e);
      setStep("form");
    }
  }, [text, style, angerLevel]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard
      .writeText(result)
      .then(() => toast.success("복사했어요 📋"))
      .catch(() => toast.error("복사에 실패했어요."));
  }, [result]);

  const handleReset = useCallback(() => {
    setStep("form");
    setResult(null);
  }, []);

  const marqueeItems = [
    ...MARQUEE_TEXT,
    ...MARQUEE_TEXT,
    ...MARQUEE_TEXT,
    ...MARQUEE_TEXT,
  ];

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
      <Stars />

      {/* 데코 */}
      {DECO.map(({ char, style: s, dur }) => (
        <div
          key={char + s}
          className="fixed pointer-events-none z-0 text-sm"
          style={{
            ...Object.fromEntries(
              s
                .split(";")
                .filter(Boolean)
                .map((p) => {
                  const [k, v] = p.split(":");
                  return [k.trim(), v.trim()];
                }),
            ),
            animation: `floatDeco ${dur} infinite ease-in-out`,
            opacity: 0.15,
          }}
        >
          {char}
        </div>
      ))}

      {/* 마퀴 띠 */}
      <div
        className="fixed top-0 left-0 right-0 z-50 overflow-hidden py-[4px] border-b border-white/20"
        style={{
          background:
            "linear-gradient(90deg, #ff6eb4, #b366ff, #7ec8e3, #ff6eb4)",
          backgroundSize: "300% 100%",
          animation: "gradMove 4s linear infinite",
        }}
      >
        <div
          className="whitespace-nowrap"
          style={{
            display: "flex",
            width: "max-content",
            animation: "marquee 36s linear infinite",
            willChange: "transform",
          }}
        >
          {marqueeItems.map((t, i) => (
            <span
              key={i}
              className="text-[11px] font-bold text-white px-5 tracking-widest"
              style={{ fontFamily: "'Byeoljari', sans-serif", textShadow: "1px 1px 0 rgba(0,0,0,0.4)" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div
        className={`relative z-10 max-w-[520px] mx-auto px-2 pt-[28px] ${
          step === "result"
            ? "h-[calc(100svh-28px)] flex flex-col px-4 pb-4"
            : "pb-4 px-4"
        }`}
      >
        {/* 피처폰 헤더 — 결과 화면에서는 숨김 */}
        <div
          className="mb-5 mt-4"
          style={{
            display: step === "result" ? "none" : undefined,
            animation: "fadeUp 0.5s ease both",
          }}
        >
          <div
            className="lcd-scanlines-sky rounded-lg p-4 relative overflow-hidden"
            style={{
              background: "var(--sky)",
              border: "4px solid #3a3a4a",
              boxShadow:
                "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -2px 0 rgba(0,0,0,0.3), 4px 4px 0 #1a1a2e, 6px 6px 0 rgba(0,0,0,0.3)",
            }}
          >
            {/* 상태바 */}
            <div className="relative overflow-hidden rounded-t-lg px-4 pt-2 pb-2 mb-3 -mx-4 -mt-4">
              <div className="flex justify-between items-center relative z-[2]">
                {/* 안테나 + 신호 + 봉투 */}
                <div className="flex items-center gap-2">
                  {/* T자 안테나 */}
                  <svg width="10" height="20" viewBox="0 0 10 20" fill="#1a1a2e">
                    <rect x="0" y="0" width="10" height="2" />
                    <rect x="0" y="2" width="2" height="4" />
                    <rect x="8" y="2" width="2" height="4" />
                    <rect x="4" y="0" width="2" height="20" />
                  </svg>
                  {/* 신호 막대 5칸 */}
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="#1a1a2e">
                    <rect x="0"  y="11" width="2" height="3" />
                    <rect x="4"  y="8"  width="2" height="6" />
                    <rect x="8"  y="5"  width="2" height="9" />
                    <rect x="12" y="2"  width="2" height="12" opacity="0.4"/>
                    <rect x="16" y="0"  width="2" height="14" opacity="0.2"/>
                  </svg>
                  {/* 봉투 */}
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="#1a1a2e" strokeWidth="1.5">
                    <rect x="1" y="1" width="16" height="12" rx="1" fill="#1a1a2e" fillOpacity="0.15"/>
                    <polyline points="1,1 9,8 17,1" fill="none"/>
                    <line x1="1" y1="13" x2="6" y2="7"/>
                    <line x1="17" y1="13" x2="12" y2="7"/>
                  </svg>
                </div>
                {/* 시간 + 배터리 */}
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono font-bold tracking-widest"
                    style={{ color: "#1a1a2e", fontSize: 15 }}
                  >
                    {new Date().toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                  {/* 배터리: 세로막대 4칸 + 오른쪽 nub */}
                  <svg width="26" height="14" viewBox="0 0 26 14" fill="#1a1a2e">
                    {/* 외곽 */}
                    <rect x="0" y="0" width="22" height="14" rx="1" fill="none" stroke="#1a1a2e" strokeWidth="1.5"/>
                    {/* nub */}
                    <rect x="22" y="4" width="4" height="6" rx="1"/>
                    {/* 세로막대 4칸 */}
                    <rect x="3"  y="3" width="3" height="8"/>
                    <rect x="8"  y="3" width="3" height="8"/>
                    <rect x="13" y="3" width="3" height="8"/>
                    <rect x="18" y="3" width="1.5" height="8" opacity="0.25"/>
                  </svg>
                </div>
              </div>
            </div>
            {/* 타이틀 */}
            <div className="text-center mt-1">
              <div
                className="leading-[1.1] tracking-tight text-[#1a1a2e] relative z-[2]"
                style={{
                  fontFamily:
                    "'Byeoljari', 'Black Han Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.6rem,8vw,2.4rem)",
                }}
              >
                화ㄱr났ズl口ざ
              </div>
              <div
                className="leading-[1.2] tracking-tight text-[#1a1a2e] mt-1 relative z-[2]"
                style={{
                  fontFamily:
                    "'Byeoljari', 'Black Han Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.6rem,8vw,2.4rem)",
                }}
              >
                ㄴr는 øł른○lLI까
              </div>
              <div
                className="mt-3 tracking-wide relative z-[2]"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(0.65rem,3vw,0.85rem)",
                  color: "rgba(26,26,46,0.6)",
                }}
              >
                ✧˖°.《★~ Yok hago sipda ~( ; ⌓ ; )
              </div>
            </div>
          </div>
        </div>

        {step === "form" && (
          <>
            <PurifyForm
              text={text}
              onTextChange={setText}
              style={style}
              onStyleChange={setStyle}
              angerLevel={angerLevel}
              onAngerLevelChange={setAngerLevel}
            />
            <button
              type="button"
              onClick={handlePurify}
              className="w-full py-[16px] rounded-lg text-[18px] tracking-[0.05em] text-white relative overflow-hidden mb-3.5 transition-all hover:-translate-y-1 active:translate-y-0.5"
              style={{
                fontFamily:
                  "'Byeoljari', 'Black Han Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, var(--pink), var(--purple))",
                boxShadow:
                  "0 4px 20px rgba(255,110,180,0.35), 0 2px 0 rgba(0,0,0,0.3)",
                textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                animation: "fadeUp 0.5s 0.2s ease both",
              }}
            >
              <span className="relative z-10">🧼 순화하기</span>
              <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            </button>
          </>
        )}

        {step === "loading" && <LoadingScreen />}

        {step === "result" && result && (
          <div className="flex-1 min-h-0 mt-4">
            <ResultCard
              result={result}
              onCopy={handleCopy}
              onReset={handleReset}
            />
          </div>
        )}
      </div>

      {/* 푸터 */}
      {step === "form" && (
        <div className="relative z-10 max-w-[520px] mx-auto px-4 pb-4 text-center">
          <a
            href="/privacy.html"
            className="text-[11px] text-white/30 hover:text-white/50 transition-colors inline-block"
          >
            개인정보처리방침
          </a>
        </div>
      )}

      <Toaster richColors position="bottom-center" />
    </>
  );
}
