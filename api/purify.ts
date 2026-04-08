import type { VercelRequest, VercelResponse } from '@vercel/node';

const STYLE_MAP: Record<string, string> = {
  professional: '직장인 말투로, 정중하고 전문적이게',
  gentle:       '매우 부드럽고 따뜻하게, 상대방을 배려하는 말투로',
  poetic:       '반드시 시(poem) 형식으로. 제목을 첫 줄에 쓰고 빈 줄 하나 띄운 뒤, 운율과 리듬이 느껴지는 짧은 행들로 구성하세요. 각 행은 줄바꿈(\\n)으로 구분하고, 연(stanza)이 바뀔 때는 빈 줄(\\n\\n)을 넣어주세요. 제목은 꺾쇠나 따옴표 없이 그냥 쓰세요.',
  sassy:        '극도로 신랄하고 독설적인 비꼬기 스타일. 겉으로는 칭찬하고 공감하는 척하면서 실제로는 상대방을 완전히 조롱하고 깎아내리는 표현으로. 읽는 사람이 처음엔 칭찬인 줄 알았다가 다시 읽으면 완전한 비꼬기임을 깨닫게 해야 함. 아이러니, 반어법, 과장된 칭찬을 총동원하고, 정중한 어투 안에 날카로운 독침을 숨겨서 끝까지 품격 있게 조롱해줘. 진짜 미친듯이 비꼬되 욕설 없이.',
};

const ANGER_DESC = ['', '살짝 불편한', '약간 짜증난', '중간 불만', '꽤 화난', '극도로 분노한'];
const MAX_CHARS = 300;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, style, angerLevel } = req.body as { text: string; style: string; angerLevel: number };

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: '텍스트가 필요합니다.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '서버 설정 오류입니다.' });
  }

  const safeText = [...text].slice(0, MAX_CHARS).join('');
  const styleDesc = STYLE_MAP[style] ?? STYLE_MAP.professional;
  const anger = ANGER_DESC[Math.min(Math.max(angerLevel, 1), 5)] || '중간 불만';

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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  const geminiRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 500, temperature: 0.9 },
    }),
  });

  if (!geminiRes.ok) {
    const err = await geminiRes.json().catch(() => ({})) as { error?: { message?: string } };
    return res.status(geminiRes.status).json({ error: err?.error?.message ?? `HTTP ${geminiRes.status}` });
  }

  const data = await geminiRes.json();
  const result = (data.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined)?.trim();

  if (!result) {
    return res.status(500).json({ error: 'API 응답이 비어있습니다.' });
  }

  return res.status(200).json({ result });
}
