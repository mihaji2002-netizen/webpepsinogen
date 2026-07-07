/** Small formatting/normalization helpers shared across the app. */

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Convert any number (or numeric string) to Persian digits. */
export function toFa(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/**
 * Normalize Persian/Arabic text for search: unify ی/ك, strip diacritics,
 * fold Persian digits to ASCII, and collapse whitespace. Makes instant search
 * forgiving of the many ways Persian text can be typed.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u064B-\u0652\u0670]/g, '') // harakat/diacritics
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/\u200c/g, ' ') // ZWNJ -> space
    .replace(/\s+/g, ' ')
    .trim();
}
