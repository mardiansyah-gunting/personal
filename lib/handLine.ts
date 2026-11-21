/**
 * Generates a seeded, hand-drawn looking underline as an SVG data URI.
 * Used as a CSS mask (so the colour can follow the theme tokens).
 */
export function handLine(seed = 11, width = 240, height = 6): string {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  let y = height / 2;
  const pts: string[] = [];
  for (let x = 0; x <= width; x += 3) {
    y += (rnd() - 0.5) * 0.9;
    y = Math.max(1.4, Math.min(height - 1.4, y));
    pts.push(`${x} ${y.toFixed(2)}`);
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<path d="M${pts.join(" L")}" fill="none" stroke="#000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/%22/g, "%27")}")`;
}
