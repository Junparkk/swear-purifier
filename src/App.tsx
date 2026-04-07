import { useState, useCallback, useEffect, useRef } from 'react';
import { toast, Toaster } from 'sonner';
import { PurifyForm } from '@/components/PurifyForm';
import { ResultCard } from '@/components/ResultCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { validateInput } from '@/lib/sanitize';
import { purifyText } from '@/lib/gemini';

type Step = 'form' | 'loading' | 'result';

const MARQUEE_TEXT = ['나는 화가났지만 어른이니까', '★', '욕도 품격있게', '★', 'AI 순화기', '★'];
const DECO = [
  { char: '★', style: 'top:15%;left:5%;', dur: '7s' },
  { char: '✦', style: 'top:30%;right:6%;', dur: '5s' },
  { char: '♡', style: 'top:60%;left:3%;', dur: '8s' },
  { char: '✧', style: 'top:75%;right:4%;', dur: '6s' },
  { char: '☆', style: 'top:45%;right:7%;', dur: '9s' },
];

function Stars() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('div');
      s.className = 'star';
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
  return <div ref={ref} className="fixed inset-0 z-0 overflow-hidden pointer-events-none" />;
}

export default function App() {
  const [step, setStep] = useState<Step>('form');
  const [text, setText] = useState('');
  const [style, setStyle] = useState('professional');
  const [angerLevel, setAngerLevel] = useState(3);
  const [result, setResult] = useState<string | null>(null);

  const handlePurify = useCallback(async () => {
    const validation = validateInput(text);
    if (!validation.ok) { toast.error(validation.error); return; }

    setStep('loading');

    try {
      const purified = await purifyText({ text: validation.normalized, style, angerLevel });
      setResult(purified);
      setStep('result');
    } catch (e) {
      toast.error('오류가 발생했어요. 다시 시도해주세요.');
      console.error(e);
      setStep('form');
    }
  }, [text, style, angerLevel]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result)
      .then(() => toast.success('복사했어요 📋'))
      .catch(() => toast.error('복사에 실패했어요.'));
  }, [result]);

  const handleReset = useCallback(() => {
    setStep('form');
    setResult(null);
  }, []);

  const marqueeItems = [...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT];

  return (
    <>
      <Stars />

      {/* 데코 */}
      {DECO.map(({ char, style: s, dur }) => (
        <div
          key={char + s}
          className="fixed pointer-events-none z-0 text-sm"
          style={{
            ...Object.fromEntries(s.split(';').filter(Boolean).map(p => {
              const [k, v] = p.split(':');
              return [k.trim(), v.trim()];
            })),
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
          background: 'linear-gradient(90deg, #ff6eb4, #b366ff, #7ec8e3, #ff6eb4)',
          backgroundSize: '300% 100%',
          animation: 'gradMove 4s linear infinite',
        }}
      >
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 36s linear infinite' }}>
          {marqueeItems.map((t, i) => (
            <span key={i} className="text-[11px] font-bold text-white px-5 tracking-widest" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div className="relative z-10 max-w-[520px] mx-auto px-4 pt-[52px] pb-20">

        {/* 피처폰 헤더 */}
        <div className="mb-5 mt-4" style={{ animation: 'fadeUp 0.5s ease both' }}>
          <div
            className="rounded-lg p-4 relative"
            style={{
              background: 'var(--sky)',
              border: '4px solid #3a3a4a',
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -2px 0 rgba(0,0,0,0.3), 4px 4px 0 #1a1a2e, 6px 6px 0 rgba(0,0,0,0.3)',
            }}
          >
            {/* 상태바 */}
            <div className="flex justify-between items-center mb-3">
              {/* 신호 */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a2e">
                <rect x="2" y="14" width="3" height="6" rx="1"/>
                <rect x="7" y="10" width="3" height="10" rx="1"/>
                <rect x="12" y="6" width="3" height="14" rx="1"/>
                <rect x="17" y="2" width="3" height="18" rx="1" opacity="0.3"/>
              </svg>
              {/* 메일 */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a2e">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <polyline points="2,5 12,14 22,5" fill="none" stroke="#7ec8e3" strokeWidth="2"/>
              </svg>
              {/* 배터리 */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a2e">
                <rect x="1" y="7" width="18" height="10" rx="2"/>
                <rect x="19" y="10" width="4" height="4" rx="1"/>
                <rect x="3" y="9" width="5" height="6" rx="1" fill="#7ec8e3"/>
                <rect x="10" y="9" width="5" height="6" rx="1" fill="#7ec8e3"/>
              </svg>
            </div>
            {/* 타이틀 */}
            <div className="font-['Black_Han_Sans'] text-[#1a1a2e] leading-tight tracking-tight" style={{ fontSize: 'clamp(1.1rem,5vw,1.5rem)' }}>
              나는 화가났지만<br />
              <span
                className="inline-block mt-1 rotate-[-1deg]"
                style={{ background: '#1a1a2e', color: 'var(--sky)', padding: '0 6px' }}
              >
                어른이니까
              </span>
            </div>
            <div className="flex justify-end mt-2.5">
              <div
                className="text-[13px] font-bold px-3.5 py-[3px] rounded-[3px]"
                style={{ background: '#1a1a2e', color: 'var(--sky)' }}
              >
                전송
              </div>
            </div>
          </div>
        </div>

        {step === 'form' && (
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
              className="w-full py-[16px] rounded-lg font-['Black_Han_Sans'] text-[18px] tracking-[0.05em] text-white relative overflow-hidden mb-3.5 transition-all hover:-translate-y-1 active:translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, var(--pink), var(--purple))',
                boxShadow: '0 4px 20px rgba(255,110,180,0.35), 0 2px 0 rgba(0,0,0,0.3)',
                textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
                animation: 'fadeUp 0.5s 0.2s ease both',
              }}
            >
              <span className="relative z-10">🧼 순화하기</span>
              <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            </button>
          </>
        )}

        {step === 'loading' && <LoadingScreen />}

        {step === 'result' && result && (
          <ResultCard result={result} onCopy={handleCopy} onReset={handleReset} />
        )}

        {/* 하단 서명 */}
        <div className="text-center mt-7" style={{ animation: 'fadeUp 0.5s 0.35s ease both' }}>
          <span
            className="inline-block text-[11px] tracking-[0.15em] uppercase pt-2.5"
            style={{
              color: 'rgba(126,200,227,0.3)',
              borderTop: '1px solid rgba(255,110,180,0.15)',
            }}
          >
            나는 화가났지만{' '}
            <span style={{ color: 'var(--pink)', animation: 'heartbeat 1.5s infinite', display: 'inline-block' }}>♥</span>
            {' '}어른이니까
          </span>
        </div>

      </div>

      <Toaster richColors position="bottom-center" />
    </>
  );
}
