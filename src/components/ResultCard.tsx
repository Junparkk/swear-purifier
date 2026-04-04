import { Card, CardContent } from '@/components/ui/card';

interface ResultCardProps {
  result: string;
  onCopy: () => void;
  onReset: () => void;
}

export function ResultCard({ result, onCopy, onReset }: ResultCardProps) {
  return (
    <Card className="bg-[hsl(var(--clean) / 0.05)] border-[hsl(var(--clean) / 0.2)] rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardContent className="p-7 space-y-5">
        {/* 결과 레이블 */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[hsl(var(--clean))]">
          ✨ 순화된 말
          <div className="flex-1 h-px bg-[hsl(var(--clean) / 0.2)]" />
        </div>

        {/* 결과 텍스트 */}
        <p className="text-[16px] font-light leading-relaxed min-h-[60px]">{result}</p>

        {/* 액션 버튼 */}
        <div className="flex gap-2.5 pt-4 border-t border-[hsl(var(--clean) / 0.1)]">
          <button
            type="button"
            onClick={onCopy}
            className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-light transition-all hover:border-[hsl(var(--clean))] hover:text-[hsl(var(--clean))]"
          >
            📋 복사
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-light transition-all hover:border-[hsl(var(--clean))] hover:text-[hsl(var(--clean))]"
          >
            🔄 다시 하기
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
