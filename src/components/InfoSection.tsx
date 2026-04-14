import { useState } from 'react';

const STEPS = [
  {
    icon: '💢',
    title: '하고 싶은 말을 입력',
    desc: '욕이든, 거친 표현이든, 속으로만 삭이던 말이든 뭐든 OK. 솔직하게 써주세요.',
  },
  {
    icon: '⚡',
    title: '분노 강도와 스타일 선택',
    desc: '얼마나 화가 났는지, 어떤 톤으로 바꿀지 고르면 AI가 상황에 맞게 순화해 드립니다.',
  },
  {
    icon: '🧼',
    title: '순화하기 버튼 클릭',
    desc: '잠깐 기다리면 품격 있는 표현으로 변환 완료! 복사해서 어디서든 바로 쓸 수 있어요.',
  },
];

const FAQS = [
  {
    q: '어떤 말을 넣을 수 있나요?',
    a: '욕설, 거친 표현, 감정적인 메시지 등 뭐든 입력 가능합니다. AI가 내용의 감정과 의도를 파악해 품격 있는 표현으로 바꿔드립니다.',
  },
  {
    q: '어떤 AI를 사용하나요?',
    a: 'Google Gemini AI를 활용합니다. 입력한 내용은 저장되지 않으며, 순화 결과 생성 후 즉시 처리됩니다.',
  },
  {
    q: '직장 상사에게 보낼 메시지도 순화해줄 수 있나요?',
    a: '물론입니다. 직장인 스타일을 선택하면 비즈니스 상황에 맞는 정중하고 프로페셔널한 표현으로 바꿔드립니다.',
  },
  {
    q: '순화된 결과가 마음에 안 들면요?',
    a: '다시 하기 버튼으로 다시 시도하거나, 분노 강도나 스타일을 바꿔서 새로운 결과를 받아볼 수 있습니다. 매번 다른 표현이 나올 수 있어요.',
  },
];

export function InfoSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div style={{ animation: 'fadeUp 0.5s 0.3s ease both' }}>
      {/* 사용법 */}
      <div
        className="rounded-xl p-5 mb-3.5 relative overflow-hidden"
        style={{
          background: 'rgba(10,10,30,0.85)',
          border: '2px solid rgba(126,200,227,0.3)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: 'linear-gradient(90deg, var(--sky), var(--purple), var(--pink), var(--sky))',
            backgroundSize: '300% 100%',
            animation: 'gradMove 3s linear infinite',
          }}
        />

        <div
          className="flex items-center gap-2 text-[13px] font-bold tracking-[0.12em] uppercase mb-4"
          style={{ color: 'var(--sky)' }}
        >
          📖 사용법
          <div className="flex-1 h-px" style={{ background: 'rgba(126,200,227,0.2)' }} />
        </div>

        <div className="space-y-3.5">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-mono mt-0.5"
                style={{
                  background: 'rgba(126,200,227,0.1)',
                  border: '1.5px solid rgba(126,200,227,0.35)',
                  color: 'var(--sky)',
                }}
              >
                {i + 1}
              </div>
              <div>
                <p
                  className="text-[13px] font-bold mb-0.5"
                  style={{ color: 'rgba(220,235,255,0.9)', fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  {s.icon} {s.title}
                </p>
                <p
                  className="text-[12px] leading-[1.65]"
                  style={{ color: 'rgba(180,200,230,0.5)', fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div
        className="rounded-xl p-5 mb-3.5 relative overflow-hidden"
        style={{
          background: 'rgba(10,10,30,0.85)',
          border: '2px solid rgba(179,102,255,0.3)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: 'linear-gradient(90deg, var(--purple), var(--pink), var(--sky), var(--purple))',
            backgroundSize: '300% 100%',
            animation: 'gradMove 3s linear infinite',
          }}
        />

        <div
          className="flex items-center gap-2 text-[13px] font-bold tracking-[0.12em] uppercase mb-4"
          style={{ color: 'var(--purple)' }}
        >
          💬 자주 묻는 질문
          <div className="flex-1 h-px" style={{ background: 'rgba(179,102,255,0.2)' }} />
        </div>

        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden"
              style={{
                border: openIdx === i
                  ? '1.5px solid rgba(179,102,255,0.5)'
                  : '1.5px solid rgba(179,102,255,0.15)',
                background: openIdx === i ? 'rgba(179,102,255,0.07)' : 'transparent',
                transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              <button
                type="button"
                className="w-full px-3.5 py-2.5 text-left flex justify-between items-center"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span
                  className="text-[13px] font-bold pr-2 leading-snug"
                  style={{ color: 'rgba(220,220,255,0.85)', fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  {f.q}
                </span>
                <span
                  className="text-[11px] shrink-0"
                  style={{
                    color: 'rgba(179,102,255,0.7)',
                    transition: 'transform 0.2s',
                    transform: openIdx === i ? 'rotate(180deg)' : 'none',
                    display: 'inline-block',
                  }}
                >
                  ▾
                </span>
              </button>

              {openIdx === i && (
                <div className="px-3.5 pb-3">
                  <p
                    className="text-[12px] leading-[1.7]"
                    style={{ color: 'rgba(180,200,230,0.55)', fontFamily: "'Noto Sans KR', sans-serif" }}
                  >
                    {f.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
