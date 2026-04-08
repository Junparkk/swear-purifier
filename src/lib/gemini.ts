export interface PurifyOptions {
  text: string;
  style: string;
  angerLevel: number;
}

export async function purifyText({ text, style, angerLevel }: PurifyOptions): Promise<string> {
  const res = await fetch('/api/purify', {
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
