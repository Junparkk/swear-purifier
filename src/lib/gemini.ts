import { MAX_CHARS } from './sanitize';

const STYLE_MAP: Record<string, string> = {
  professional: '직장인 말투로, 정중하고 전문적이게',
  gentle:       '매우 부드럽고 따뜻하게, 상대방을 배려하는 말투로',
  poetic:       '반드시 시(poem) 형식으로. 제목을 첫 줄에 쓰고 빈 줄 하나 띄운 뒤, 운율과 리듬이 느껴지는 짧은 행들로 구성하세요. 각 행은 줄바꿈(\\n)으로 구분하고, 연(stanza)이 바뀔 때는 빈 줄(\\n\\n)을 넣어주세요. 제목은 꺾쇠나 따옴표 없이 그냥 쓰세요.',
  sassy:        '겉으로는 점잖지만 은근히 비꼬는 느낌으로',
};

const ANGER_DESC = ['', '살짝 불편한', '약간 짜증난', '중간 불만', '꽤 화난', '극도로 분노한'];

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
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  const styleDesc = STYLE_MAP[style] ?? STYLE_MAP.professional;
  const anger = ANGER_DESC[angerLevel] || '중간 불만';

  // 방어적 truncate: validateInput 이후에도 API 전송 직전 최종 상한
  const safeText = [...text].slice(0, MAX_CHARS).join('');

  const prompt =
    `당신은 한국어 감정 표현의 달인입니다. ` +
    `아래 원문은 ${anger} 감정을 담은 글로, 욕설이나 거친 표현이 포함되어 있을 수 있습니다.\n\n` +
    `다음 규칙을 반드시 지켜주세요:\n` +
    `1. 욕설·비속어·거친 표현을 전부 제거하되, 말하려는 핵심 의도와 감정 강도는 반드시 보존하세요.\n` +
    `2. ${styleDesc} 스타일로 표현하세요.\n` +
    `3. 위트 있고 재치 넘치게 써주세요. 읽는 사람이 피식 웃을 수 있을 정도의 유머 감각을 담아도 좋습니다.\n` +
    `4. 너무 딱딱하거나 교과서적인 표현은 피하고, 살아있는 자연스러운 문장으로 써주세요.\n` +
    `5. 순화된 결과 문장만 출력하고, 설명·주석·인용부호는 절대 붙이지 마세요.\n\n` +
    `원문: ${safeText}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 500, temperature: 0.9 },
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
