export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16" style={{ animation: 'fadeUp 0.3s ease both' }}>
      <div className="text-4xl">🧼</div>
      <div className="flex gap-[5px]">
        {[0, 0.2, 0.4].map((delay, i) => (
          <span
            key={i}
            className="inline-block w-[6px] h-[6px] rounded-full bg-white"
            style={{ animation: `dotBounce 1.2s ${delay}s infinite` }}
          />
        ))}
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold tracking-wide" style={{ color: 'rgba(126,200,227,0.8)' }}>
          AI가 점잖게 바꾸는 중...
        </p>
        <p className="text-[11px]" style={{ color: 'rgba(126,200,227,0.4)' }}>
          욕을 품격으로 승화시키고 있어요
        </p>
      </div>
    </div>
  );
}
