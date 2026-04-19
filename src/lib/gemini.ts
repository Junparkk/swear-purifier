export interface PurifyOptions {
  text: string;
  style: string;
  angerLevel: number;
}

// Vercel 배포: VITE_API_BASE_URL 미설정 → 상대 URL '/api/purify'
// AIT 빌드:   VITE_API_BASE_URL=https://swear-purifier.vercel.app → 절대 URL
const API_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/purify`;

export async function purifyText({ text, style, angerLevel }: PurifyOptions): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, style, angerLevel }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err?.error ?? `HTTP ${res.status}`);
  }

  const data = await res.json() as { result: string };
  if (!data.result) throw new Error('API 응답이 비어있습니다.');
  return data.result;
}
