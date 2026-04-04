// 제거할 눈에 안 보이는 문자들 (zero-width, BOM, soft hyphen, private use area 등)
// U+180E, U+2800 도 포함 (알려진 bypass 문자)
const INVISIBLE_RE = /[\u180E\u200B-\u200F\u2028-\u202F\u205F-\u206F\u2800\uFEFF\u00AD\uE000-\uF8FF]/g;

const _envMax = Number(import.meta.env.VITE_MAX_CHARS);
export const MAX_CHARS = _envMax > 0 ? _envMax : 300;

/**
 * 입력 텍스트에서 invisible 문자를 제거하고 공백을 정규화.
 */
export function normalizeText(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(INVISIBLE_RE, '')
    .normalize('NFC')
    .replace(/[^\S\n]+/g, ' ')
    .trim();
}

/**
 * 정규화 후 실제 글자 수. spread로 surrogate pair 올바르게 카운트.
 */
export function countChars(raw: string): number {
  return [...normalizeText(raw)].length;
}

export type ValidationResult =
  | { ok: true; normalized: string }
  | { ok: false; error: string };

/**
 * 입력 검증. 통과하면 { ok: true, normalized } 반환.
 */
export function validateInput(raw: string, maxChars = MAX_CHARS): ValidationResult {
  const normalized = normalizeText(raw);
  if (!normalized) return { ok: false, error: '할 말을 입력해주세요 😅' };
  if ([...normalized].length > maxChars) return { ok: false, error: `${maxChars}자 이내로 입력해주세요.` };
  return { ok: true, normalized };
}
