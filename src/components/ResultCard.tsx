import { useRef, useState, useEffect } from 'react';

function NokiaHeart({ char = '♥', delay = '0s' }: { char?: string; delay?: string }) {
  return (
    <span
      className="inline-block align-middle"
      style={{
        fontSize: 24,
        color: '#ff6eb4',
        textShadow: '2px 2px 0 #a0005a, 0 0 8px rgba(255,110,180,0.5)',
        animation: `heartbeat 1.8s ${delay} infinite`,
      }}
    >
      {char}
    </span>
  );
}

interface ResultCardProps {
  result: string;
  onCopy: () => void;
  onReset: () => void;
}

const NUMPAD = [
  [{ n: '1', s: 'oo' },   { n: '2', s: 'ABC' }, { n: '3', s: 'DEF' }],
  [{ n: '4', s: 'GHI' },  { n: '5', s: 'JKL' }, { n: '6', s: 'MNO' }],
  [{ n: '7', s: 'PQRS' }, { n: '8', s: 'TUV' }, { n: '9', s: 'WXYZ' }],
  [{ n: '* +', s: '' },   { n: '0', s: '_ @' }, { n: '♪♫ #', s: '' }],
];

const BTN: React.CSSProperties = {
  background: 'linear-gradient(180deg, #3a3a4e 0%, #2a2a3e 100%)',
  border: '2px solid #4a4a60',
  color: 'rgba(220,220,240,0.9)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.4)',
};

export function ResultCard({ result, onCopy, onReset }: ResultCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setHasMore(el.scrollHeight > el.clientHeight + 4);
    check();
    el.addEventListener('scroll', check);
    window.addEventListener('resize', check);
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [result]);

  return (
    <div
      className="h-full flex flex-col rounded-[28px] px-3 pt-5 pb-3 mx-auto w-full max-w-[400px]"
      style={{
        background: 'linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 100%)',
        border: '4px solid #3a3a50',
        boxShadow: '0 0 40px rgba(179,102,255,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
        animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both',
      }}
    >
      {/* NOKIA 타이틀 */}
      <div
        className="text-center font-['Black_Han_Sans'] text-[16px] tracking-[0.3em] mb-2 mt-1 shrink-0"
        style={{ color: 'white', textShadow: '0 0 10px rgba(255,110,180,0.8), 0 0 20px rgba(255,110,180,0.4)' }}
      >
        <NokiaHeart />{' '}YOKIA{' '}<NokiaHeart char="❣" delay="0.4s" />
      </div>

      {/* LCD 화면 */}
      <div
        className="lcd-noise lcd-scanlines flex-1 min-h-0 rounded-lg p-3 mb-2 flex flex-col"
        style={{
          background: 'rgba(130, 170, 255, 0.18)',
          border: '2px solid rgba(160, 195, 255, 0.35)',
          boxShadow: 'inset 0 2px 12px rgba(120,160,255,0.12), inset 0 0 30px rgba(100,140,255,0.06)',
        }}
      >
        {/* 상태바 */}
        <div className="flex justify-between items-center mb-1.5 shrink-0 relative z-[2]">
          <div className="flex items-end gap-[2px]">
            {[6, 9, 12, 14].map((h, i) => (
              <div key={i} className="w-[3px] rounded-sm" style={{ height: h, background: i < 3 ? 'rgba(180,210,255,0.8)' : 'rgba(180,210,255,0.2)' }} />
            ))}
          </div>
          <span className="text-[10px] font-bold font-mono tracking-widest" style={{ color: 'rgba(180,210,255,0.7)' }}>
            [ 메시지 수신 ]
          </span>
          <div className="w-[18px] h-[9px] rounded-[2px] relative" style={{ border: '1px solid rgba(180,210,255,0.5)' }}>
            <div className="absolute inset-[1px] rounded-[1px]" style={{ background: 'rgba(180,210,255,0.7)', width: '65%' }} />
          </div>
        </div>

        {/* 발신자 */}
        <p className="text-[11px] mb-2 font-mono shrink-0 relative z-[2]" style={{ color: 'rgba(180,210,255,0.6)' }}>
          발신 : AI순화기 🌸
        </p>

        {/* 스크롤 영역 */}
        <div className="flex-1 min-h-0 relative z-[2]">
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(150,180,255,0.3) transparent' }}
          >
            <p
              className="text-[14px] leading-[1.8] font-bold whitespace-pre-wrap"
              style={{ color: 'rgba(220,235,255,0.95)', fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              {result}
            </p>
          </div>

          {/* 스크롤 더 있음 인디케이터 */}
          {hasMore && (
            <div
              className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1 pointer-events-none"
              style={{ background: 'linear-gradient(transparent, rgba(10,20,60,0.85))' }}
            >
              <span className="text-[18px]" style={{ animation: 'dotBounce 1.2s infinite', color: 'rgba(180,210,255,0.8)' }}>↓</span>
            </div>
          )}
        </div>

        {/* 하단 메뉴 */}
        <div
          className="flex justify-between text-[10px] font-bold font-mono mt-2 pt-1.5 shrink-0 relative z-[2]"
          style={{ color: 'rgba(180,210,255,0.5)', borderTop: '1px solid rgba(150,180,255,0.15)' }}
        >
          <span>메뉴</span><span>OK</span><span>한글</span>
        </div>
      </div>

      {/* 복사하기 / 다시하기 — 메인 액션, 튀게 */}
      <div className="grid grid-cols-2 gap-1.5 mb-1.5 shrink-0">
        <button type="button" onClick={onCopy}
          className="py-2.5 rounded-xl text-[13px] font-bold tracking-wide transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, var(--pink), var(--purple))',
            border: '2px solid rgba(255,110,180,0.5)',
            color: 'white',
            boxShadow: '0 0 12px rgba(255,110,180,0.4), 0 2px 0 rgba(0,0,0,0.3)',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}>
          📋 복사하기
        </button>
        <button type="button" onClick={onReset}
          className="py-2.5 rounded-xl text-[13px] font-bold tracking-wide transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, var(--sky), var(--purple))',
            border: '2px solid rgba(126,200,227,0.5)',
            color: 'white',
            boxShadow: '0 0 12px rgba(126,200,227,0.35), 0 2px 0 rgba(0,0,0,0.3)',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}>
          🔄 다시 하기
        </button>
      </div>

      {/* 나비 + 파란 줄 + 통화/종료 소형 버튼 */}
      <div className="flex items-center gap-2 mb-1.5 shrink-0 px-1">
        {/* 통화 버튼 */}
        <button type="button" onClick={onCopy}
          className="px-4 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all active:scale-95"
          style={BTN}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#4cd964">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
        </button>

        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(126,200,227,0.6))' }} />
          <div className="w-10 h-8 rounded-lg flex items-center justify-center text-base shrink-0" style={BTN}>
            🦋
          </div>
          <div className="flex-1 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, rgba(126,200,227,0.6), transparent)' }} />
        </div>

        {/* 종료 버튼 */}
        <button type="button" onClick={onReset}
          className="px-4 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all active:scale-95"
          style={BTN}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff4444">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)"/>
          </svg>
        </button>
      </div>

      {/* 숫자 키패드 */}
      <div className="space-y-1 shrink-0">
        {NUMPAD.map((row, ri) => (
          <div key={ri} className="grid grid-cols-3 gap-1">
            {row.map(({ n, s }) => (
              <div key={n} className="py-1.5 rounded-lg flex items-center justify-center select-none" style={BTN}>
                {s ? (
                  <div className="flex items-center gap-1">
                    <div className="w-6 text-right text-[14px] font-bold leading-none" style={{ color: 'rgba(220,220,240,0.9)' }}>{n}</div>
                    <div className="w-8 text-left text-[8px] tracking-wider" style={{ color: 'rgba(150,150,180,0.6)' }}>{s}</div>
                  </div>
                ) : (
                  <div className="text-[14px] font-bold leading-none" style={{ color: 'rgba(220,220,240,0.9)' }}>{n}</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
