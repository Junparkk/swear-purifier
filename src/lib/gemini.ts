const STYLE_MAP: Record<string, string> = {
  professional: '직장인 말투로, 정중하고 전문적이게',
  gentle:       '매우 부드럽고 따뜻하게, 상대방을 배려하는 말투로',
  poetic:       '시적이고 문학적인 표현으로, 은유를 활용해서',
  sassy:        '겉으로는 점잖지만 은근히 비꼬는 느낌으로',
};

const ANGER_DESC = ['', '살짝 불편한', '약간 짜증난', '중간 불만', '꽤 화난', '극도로 분노한'];

const _envMax = Number(import.meta.env.VITE_MAX_CHARS);
const MAX_CHARS = _envMax > 0 ? _envMax : 300;

export interface PurifyOptions {
  text: string;
  style: string;
  angerLevel: number;
}

/**
 * Gemini 2.0 Flash Lite API로 텍스트를 순화.
 * API 키는 import.meta.env.VITE_GEMINI_API_KEY에서 읽음.
 */
export async function purifyText({ text, style, angerLevel }: PurifyOptions): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

  const styleDesc = STYLE_MAP[style] ?? STYLE_MAP.professional;
  const anger = ANGER_DESC[angerLevel] || '중간 불만';

  // 방어적 truncate: validateInput 이후에도 API 전송 직전 최종 상한
  const safeText = [...text].slice(0, MAX_CHARS).join('');

  const prompt =
    `다음은 한국어로 쓴 ${anger} 감정의 글입니다. ` +
    `욕설이나 거친 표현을 모두 제거하고, ${styleDesc} 순화해주세요. ` +
    `원래 의미와 감정은 최대한 살리되, 점잖고 세련된 표현으로 바꿔주세요. ` +
    `순화된 문장만 바로 출력하고, 설명이나 부연은 절대 하지 마세요.\n\n원문: ${safeText}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 500, temperature: 0.5 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  const result = (data.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined)?.trim();
  if (!result) throw new Error('API 응답이 비어있습니다.');
  return result;
}
