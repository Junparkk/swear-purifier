import { Slider } from '@/components/ui/slider';
import { countChars, MAX_CHARS } from '@/lib/sanitize';

const STYLES = [
  { key: 'professional', icon: '🧑‍💼', label: '직장인' },
  { key: 'gentle',       icon: '🌸', label: '점잖게' },
  { key: 'poetic',       icon: '✍️', label: '시적으로' },
  { key: 'sassy',        icon: '😏', label: '은근히 비꼬기' },
] as const;

const ANGER_DESC  = ['', '살짝 불편한', '약간 짜증난', '중간 불만', '꽤 화난', '극도로 분노한'];
const ANGER_EMOJIS = ['😤', '😠', '🤬', '💀', '☠️'];

export interface PurifyFormProps {
  text: string;
  onTextChange: (v: string) => void;
  style: string;
  onStyleChange: (v: string) => void;
  angerLevel: number;
  onAngerLevelChange: (v: number) => void;
}

export function PurifyForm({ text, onTextChange, style, onStyleChange, angerLevel, onAngerLevelChange }: PurifyFormProps) {
  const charCount = countChars(text);
  const isOver = charCount > MAX_CHARS;

  return (
    <div
      className="rounded-xl p-5 mb-3.5 relative overflow-hidden"
      style={{
        background: 'rgba(10,10,30,0.85)',
        border: '2px solid rgba(255,110,180,0.4)',
        animation: 'fadeUp 0.5s 0.15s ease both',
      }}
    >
      {/* 상단 그라디언트 라인 */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, var(--pink), var(--purple), var(--sky), var(--pink))',
          backgroundSize: '300% 100%',
          animation: 'gradMove 3s linear infinite',
        }}
      />

      {/* 입력 섹션 */}
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] uppercase mb-2.5" style={{ color: 'var(--pink)' }}>
        💢 하고 싶은 말
        <div className="flex-1 h-px" style={{ background: 'rgba(255,110,180,0.2)' }} />
      </div>

      <div
        className="rounded-[6px] p-3"
        style={{ background: 'rgba(126,200,227,0.06)', border: '2px solid rgba(126,200,227,0.25)' }}
      >
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={"예: 야 이 XX아 왜 이렇게 일을 못 해!\n진짜 너무 짜증나서 미치겠다..."}
          rows={4}
          className="w-full bg-transparent border-none outline-none resize-none text-[14px] font-normal leading-[1.7]"
          style={{
            color: '#e0f4ff',
            caretColor: 'var(--pink)',
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
        />
      </div>
      <p
        className="text-right text-[10px] mt-1 font-mono tracking-[0.05em]"
        style={{ color: isOver ? 'var(--pink)' : 'rgba(126,200,227,0.5)' }}
      >
        {charCount}/{MAX_CHARS}byte
      </p>

      {/* 분노 강도 */}
      <div
        className="mt-4 pt-4"
        style={{ borderTop: '1px dashed rgba(255,110,180,0.2)' }}
      >
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: 'rgba(255,110,180,0.8)' }}>
            ⚡ 분노 강도
          </span>
          <span
            className="text-[10px] font-bold tracking-[0.05em] px-2.5 py-0.5 rounded-[2px]"
            style={{
              background: 'rgba(255,110,180,0.15)',
              border: '1px solid rgba(255,110,180,0.4)',
              color: 'var(--pink)',
            }}
          >
            {ANGER_DESC[angerLevel]}
          </span>
        </div>
        <Slider
          min={1} max={5} step={1}
          value={[angerLevel]}
          onValueChange={([v]) => onAngerLevelChange(v)}
        />
        <div className="flex justify-between mt-1.5 text-base select-none">
          {ANGER_EMOJIS.map((e) => <span key={e}>{e}</span>)}
        </div>
      </div>

      {/* 스타일 선택 */}
      <div
        className="mt-4 pt-4"
        style={{ borderTop: '1px dashed rgba(255,110,180,0.2)' }}
      >
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] uppercase mb-2.5" style={{ color: 'var(--pink)' }}>
          🎭 순화 스타일
          <div className="flex-1 h-px" style={{ background: 'rgba(255,110,180,0.2)' }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {STYLES.map(({ key, icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onStyleChange(key)}
              className="py-2.5 px-2 rounded-[6px] text-center text-[12px] font-bold leading-snug tracking-[0.02em] transition-all hover:-translate-y-0.5"
              style={style === key ? {
                border: '2px solid var(--pink)',
                background: 'rgba(255,110,180,0.18)',
                color: 'white',
                boxShadow: '0 0 12px rgba(255,110,180,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              } : {
                border: '2px solid rgba(126,200,227,0.2)',
                background: 'rgba(126,200,227,0.05)',
                color: 'rgba(200,230,255,0.6)',
              }}
            >
              <span className="block text-lg mb-1">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
