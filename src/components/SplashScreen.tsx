import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

const LINES = [
  { text: '✦', size: '2rem', weight: 700, gap: 0 },
  { text: '욕도 하고 싶고,', size: '1.3rem', weight: 700, gap: 0 },
  { text: '소리도 지르고 싶고,', size: '1.3rem', weight: 700, gap: 0 },
  { text: '그냥 막 뱉어버리고 싶었던', size: '1.3rem', weight: 700, gap: 0 },
  { text: '날들이 있었잖아.', size: '1.3rem', weight: 700, gap: 32 },
  { text: '근데 이제 우리 어른이잖아.', size: '1.15rem', weight: 400, gap: 32 },
  { text: '그래도 괜찮아.', size: '1.5rem', weight: 700, gap: 0 },
  { text: '하고 싶은 말 여기다 써.', size: '1.3rem', weight: 700, gap: 0 },
  { text: '대신 어른답게 바꿔줄게.', size: '1.3rem', weight: 700, gap: 24 },
  { text: '✦', size: '2rem', weight: 700, gap: 0 },
];

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 7500);
    const doneTimer = setTimeout(() => onDone(), 8500);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden lcd-scanlines-sky"
      onClick={() => { setFading(true); setTimeout(onDone, 800); }}
      style={{
        background: 'var(--sky)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease',
        cursor: 'pointer',
      }}
    >
      {/* 배경 별 장식 */}
      {['10%', '30%', '55%', '75%', '90%'].map((left, i) => (
        <div
          key={i}
          className="absolute text-[#1a1a2e] pointer-events-none select-none"
          style={{
            left,
            top: `${15 + i * 15}%`,
            opacity: 0.12,
            fontSize: i % 2 === 0 ? '1.5rem' : '1rem',
            animation: `floatDeco ${5 + i}s infinite ease-in-out`,
          }}
        >
          {['★', '✦', '✧', '☆', '✦'][i]}
        </div>
      ))}

      {/* 크레딧 롤 */}
      <div
        className="absolute left-0 right-0 text-center px-8"
        style={{ animation: 'creditRoll 8s linear both' }}
      >
        {LINES.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Byeoljari', 'Black Han Sans', sans-serif",
              fontSize: line.size,
              fontWeight: line.weight,
              color: '#1a1a2e',
              lineHeight: 1.5,
              marginTop: line.gap,
              textShadow: '1px 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* 탭해서 건너뛰기 */}
      <div
        className="absolute bottom-8 left-0 right-0 text-center text-[11px] tracking-widest"
        style={{ color: 'rgba(26,26,46,0.4)', fontFamily: "'Byeoljari', sans-serif" }}
      >
        tap to skip
      </div>
    </div>
  );
}
