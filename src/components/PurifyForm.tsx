import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { countChars, MAX_CHARS } from '@/lib/sanitize';

const STYLES = [
  { key: 'professional', label: '🧑‍💼 직장인' },
  { key: 'gentle',       label: '🌸 점잖게' },
  { key: 'poetic',       label: '✍️ 시적으로' },
  { key: 'sassy',        label: '😏 은근히' },
] as const;

const ANGER_DESC = ['', '살짝 불편한', '약간 짜증난', '중간 불만', '꽤 화난', '극도로 분노한'];
const ANGER_EMOJIS = ['😤', '😠', '🤬', '💀', '☠️'];

export interface PurifyFormProps {
  text: string;
  onTextChange: (v: string) => void;
  style: string;
  onStyleChange: (v: string) => void;
  angerLevel: number;
  onAngerLevelChange: (v: number) => void;
}

export function PurifyForm({
  text,
  onTextChange,
  style,
  onStyleChange,
  angerLevel,
  onAngerLevelChange,
}: PurifyFormProps) {
  const charCount = countChars(text);
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <Card className="bg-card border-border rounded-2xl">
      <CardContent className="p-7 space-y-5">
        {/* 입력 레이블 */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          💢 하고 싶은 말
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* textarea */}
        <Textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={"예: 야 이 XX아 왜 이렇게 일을 못 해!\n진짜 너무 짜증나서 미치겠다..."}
          className="min-h-[100px] bg-transparent border-none resize-none text-[15px] font-light leading-relaxed placeholder:text-[#3a3a3a] focus-visible:ring-0 p-0"
        />

        {/* 글자 수 */}
        <p className={`text-right text-[11px] transition-colors ${isOverLimit ? 'text-[hsl(var(--accent))]' : 'text-muted-foreground'}`}>
          {charCount} / {MAX_CHARS}
        </p>

        {/* 분노 강도 */}
        <div className="pt-5 border-t border-border space-y-3">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>분노 강도</span>
            <Badge
              variant="outline"
              className="bg-[rgba(255,77,0,0.15)] text-[hsl(var(--accent))] border-0 text-[11px]"
            >
              {ANGER_DESC[angerLevel]}
            </Badge>
          </div>
          <Slider
            min={1}
            max={5}
            step={1}
            value={[angerLevel]}
            onValueChange={([v]) => onAngerLevelChange(v)}
            className="[&_[role=slider]]:bg-[hsl(var(--accent))] [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-[0_0_12px_rgba(255,77,0,0.5)] [&_[data-slot=range]]:bg-[hsl(var(--accent))]"
          />
          <div className="flex justify-between text-lg select-none">
            {ANGER_EMOJIS.map((e) => <span key={e}>{e}</span>)}
          </div>
        </div>

        {/* 스타일 선택 */}
        <div className="pt-5 border-t border-border space-y-3">
          <p className="text-[12px] uppercase tracking-wider text-muted-foreground">순화 스타일</p>
          <div className="flex gap-2 flex-wrap">
            {STYLES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => onStyleChange(key)}
                className={`px-4 py-1.5 rounded-full border text-xs transition-all ${
                  style === key
                    ? 'bg-[hsl(var(--accent))] border-[hsl(var(--accent))] text-white font-medium'
                    : 'border-border text-muted-foreground font-light hover:border-[hsl(var(--accent))] hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
