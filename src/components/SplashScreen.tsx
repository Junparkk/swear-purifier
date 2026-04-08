import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

const LINES = [
  { text: '✦', size: '2.5rem', weight: 700, gap: 0 },
  { text: '욕도 하고 싶고,', size: '1.8rem', weight: 700, gap: 0 },
  { text: '소리도 지르고 싶고,', size: '1.8rem', weight: 700, gap: 0 },
  { text: '그냥 막 뱉어버리고 싶었던', size: '1.8rem', weight: 700, gap: 0 },
  { text: '날들이 있었잖아.', size: '1.8rem', weight: 700, gap: 40 },
  { text: '근데 이제 우리 어른이잖아.', size: '1.5rem', weight: 400, gap: 40 },
  { text: '그래도 괜찮아.', size: '2rem', weight: 700, gap: 0 },
  { text: '하고 싶은 말 여기다 써.', size: '1.8rem', weight: 700, gap: 0 },
  { text: '대신 어른답게 바꿔줄게.', size: '1.8rem', weight: 700, gap: 32 },
  { text: '✦', size: '2.5rem', weight: 700, gap: 0 },
];

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 8000);
    const doneTimer = setTimeout(() => onDone(), 9000);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      onClick={() => { setFading(true); setTimeout(onDone, 800); }}
      style={{
        background: '#5b8fff',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease',
        cursor: 'pointer',
      }}
    >
      {/* CRT 수평 스캔라인 (정적) */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,40,0.18) 3px, rgba(0,0,40,0.18) 4px)',
        zIndex: 1,
      }} />

      {/* CRT 롤링 바 — 위로 올라가는 밝은 띠 */}
      <div className="absolute left-0 right-0 pointer-events-none" style={{
        height: '18%',
        background: 'linear-gradient(transparent, rgba(255,255,255,0.07), transparent)',
        animation: 'tvRoll 3s linear infinite',
        zIndex: 2,
      }} />

      {/* CRT 비네트 */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,30,0.45) 100%)',
        zIndex: 2,
      }} />

      {/* 크레딧 롤 */}
      <div
        className="absolute left-0 right-0 text-center px-8"
        style={{ animation: 'creditRollMid 9s linear both', zIndex: 3 }}
      >
        {LINES.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Byeoljari', 'Black Han Sans', sans-serif",
              fontSize: line.size,
              fontWeight: line.weight,
              color: '#0a0a2e',
              lineHeight: 1.5,
              marginTop: line.gap,
              textShadow: '0 0 12px rgba(255,255,255,0.5), 1px 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* tap to skip */}
      <div
        className="absolute bottom-8 left-0 right-0 text-center text-[11px] tracking-widest"
        style={{ color: 'rgba(10,10,46,0.45)', fontFamily: "'Byeoljari', sans-serif", zIndex: 4 }}
      >
        tap to skip
      </div>
    </div>
  );
}
