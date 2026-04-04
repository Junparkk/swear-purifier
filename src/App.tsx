import { useState, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import { PurifyForm } from '@/components/PurifyForm';
import { ResultCard } from '@/components/ResultCard';
import { AdBanner } from '@/components/AdBanner';
import { validateInput } from '@/lib/sanitize';
import { purifyText } from '@/lib/gemini';

export default function App() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('professional');
  const [angerLevel, setAngerLevel] = useState(3);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurify = useCallback(async () => {
    const validation = validateInput(text);
    if (!validation.ok) {
      toast.error(validation.error);
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const purified = await purifyText({
        text: validation.normalized,
        style,
        angerLevel,
      });
      setResult(purified);
    } catch (e) {
      toast.error('오류가 발생했어요. 다시 시도해주세요.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [text, style, angerLevel]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result)
      .then(() => toast.success('복사했어요 📋'))
      .catch(() => toast.error('복사에 실패했어요.'));
  }, [result]);

  const handleReset = useCallback(() => {
    setText('');
    setResult(null);
    setAngerLevel(3);
    setStyle('professional');
  }, []);

  return (
    <div className="relative z-10">
      <AdBanner position="top" />

      <div className="max-w-[680px] mx-auto px-6 py-12 pb-20 space-y-4">

        {/* 헤더 */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="inline-flex items-center gap-2.5 bg-card border border-border rounded-full px-5 py-2 text-[13px] text-muted-foreground mb-6 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
            AI POWERED
          </div>
          <h1 className="font-['Noto_Serif_KR'] text-[clamp(2rem,6vw,3.2rem)] font-black leading-tight tracking-tight">
            욕도<br />
            <span className="text-[hsl(var(--accent))]">품격있게</span> 🧼
          </h1>
          <p className="mt-3.5 text-muted-foreground text-sm font-light leading-relaxed">
            하고 싶은 말, 참지 말고 쓰세요.<br />AI가 점잖게 바꿔드립니다.
          </p>
        </header>

        {/* 입력 폼 */}
        <PurifyForm
          text={text}
          onTextChange={setText}
          style={style}
          onStyleChange={setStyle}
          angerLevel={angerLevel}
          onAngerLevelChange={setAngerLevel}
        />

        {/* 순화하기 버튼 */}
        <button
          type="button"
          onClick={handlePurify}
          disabled={isLoading}
          className="w-full py-[18px] bg-[hsl(var(--accent))] text-white rounded-2xl font-['Noto_Serif_KR'] text-[17px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,0,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
        >
          <span className="relative z-10">
            {isLoading ? '순화 중...' : '🧼 순화하기'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </button>

        {/* 결과 */}
        {result && (
          <ResultCard
            result={result}
            onCopy={handleCopy}
            onReset={handleReset}
          />
        )}

      </div>

      <AdBanner position="bottom" />
      <Toaster richColors position="bottom-center" />
    </div>
  );
}
