import { AdBanner } from '@/components/AdBanner';

interface ResultCardProps {
  result: string;
  onCopy: () => void;
  onReset: () => void;
}

export function ResultCard({ result, onCopy, onReset }: ResultCardProps) {
  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden"
      style={{
        background: 'rgba(10,10,30,0.9)',
        border: '2px solid rgba(102,255,179,0.4)',
        animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both',
      }}
    >
      {/* 상단 그라디언트 라인 */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, var(--green), var(--sky), var(--green))',
          backgroundSize: '300% 100%',
          animation: 'gradMove 3s linear infinite',
        }}
      />

      {/* 라벨 */}
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: 'var(--green)' }}>
        ✨ 순화된 말
        <div className="flex-1 h-px" style={{ background: 'rgba(102,255,179,0.2)' }} />
      </div>

      {/* 말풍선 */}
      <div
        className="result-bubble rounded-[4px_12px_12px_12px] p-3.5"
        style={{
          background: 'rgba(102,255,179,0.07)',
          border: '1px solid rgba(102,255,179,0.2)',
        }}
      >
        <p
          className="text-[15px] leading-[1.8] font-normal min-h-[50px] whitespace-pre-wrap"
          style={{ color: '#e0ffe8' }}
        >
          {result}
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="grid grid-cols-2 gap-2 mt-3.5">
        {[
          { label: '📋 복사하기', onClick: onCopy },
          { label: '🔄 다시 하기', onClick: onReset },
        ].map(({ label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="py-2.5 rounded-[6px] text-[12px] font-bold tracking-[0.03em] transition-all hover:-translate-y-0.5 hover:text-white"
            style={{
              border: '2px solid rgba(102,255,179,0.25)',
              background: 'transparent',
              color: 'rgba(102,255,179,0.7)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--green)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(102,255,179,0.12)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(102,255,179,0.25)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* AdSense 배너 (웹 전용) */}
      <AdBanner />
    </div>
  );
}
