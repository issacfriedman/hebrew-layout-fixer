// What each key on an English QWERTY keyboard types on the standard Israeli
// (SI-1452) Hebrew layout. Some punctuation keys are included because they
// produce Hebrew letters: ; → ף, , → ת, . → ץ.
export const EN_TO_HE = {
  q: '/', w: "'", e: 'ק', r: 'ר', t: 'א', y: 'ט', u: 'ו', i: 'ן', o: 'ם', p: 'פ',
  a: 'ש', s: 'ד', d: 'ג', f: 'כ', g: 'ע', h: 'י', j: 'ח', k: 'ל', l: 'ך', ';': 'ף', "'": ',',
  z: 'ז', x: 'ס', c: 'ב', v: 'ה', b: 'נ', n: 'מ', m: 'צ', ',': 'ת', '.': 'ץ', '/': '.',
};

// Uppercase is converted too, so text typed with Caps Lock on still works.
// Anything that isn't mapped (digits, spaces, Hebrew, emoji) is left unchanged.
export function toHebrew(text, map = EN_TO_HE) {
  return Array.from(text, (ch) => map[ch.toLowerCase()] ?? ch).join('');
}
