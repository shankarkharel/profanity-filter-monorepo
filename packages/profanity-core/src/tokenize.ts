export interface Token {
  value: string;
  start: number; // index in string
  end: number;   // exclusive
}

export function tokenizeWords(text: string): Token[] {
  // Split on whitespace; indices computed best-effort
  const tokens: Token[] = [];
  let i = 0;
  while (i < text.length) {
    while (i < text.length && text[i] === " ") i++;
    const start = i;
    while (i < text.length && text[i] !== " ") i++;
    const end = i;
    if (end > start) {
      tokens.push({ value: text.slice(start, end), start, end });
    }
  }
  return tokens;
}
