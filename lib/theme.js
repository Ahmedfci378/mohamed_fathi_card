// Turns the customer's `theme` config into CSS variables. No UI for customers: it's config only.
// Every colour is validated; the output string contains only hex-derived numbers, so it is safe to inline.

const THEME_DEFAULTS = Object.freeze({
  accent: "#C9A24B",
  accentSecondary: "#E6CB85",
  background: "#0D1117",
  glassOpacity: 0.045,
  borderRadius: 24,
  avatarShape: "arch", // "arch" | "circle"
});

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const WHITE = [255, 255, 255];
const DARK = [17, 19, 24];

const toRgb = (hex) => {
  let h = hex.slice(1);
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const lum = ([r, g, b]) => {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
export const contrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const clamp = (v, min, max, fallback) => {
  const n = Number(v);
  return v === null || v === undefined || !Number.isFinite(n) ? fallback : Math.min(max, Math.max(min, n));
};

/** @returns {{css:string, themeColor:string, avatarShape:"arch"|"circle", warnings:string[]}} */
export function resolveTheme(input = {}, label = "card") {
  const warnings = [];
  const warn = (m) => warnings.push(`[theme:${label}] ${m}`);
  const color = (key) => {
    const v = input[key];
    if (v === undefined || v === null) return null;
    if (typeof v === "string" && HEX.test(v.trim())) return toRgb(v.trim());
    warn(`"${key}" must be a hex colour like #C9A24B. Using the default.`);
    return null;
  };

  let bg = color("background") ?? toRgb(THEME_DEFAULTS.background);
  if (lum(bg) > 0.2) {
    warn('"background" must be a dark colour (text is light). Using the default.');
    bg = toRgb(THEME_DEFAULTS.background);
  }
  const accentIn = color("accent");
  const accent = accentIn ?? toRgb(THEME_DEFAULTS.accent);
  let accent2 = color("accentSecondary")
    ?? (accentIn ? mix(accent, WHITE, 0.35) : toRgb(THEME_DEFAULTS.accentSecondary));

  // accent2 is used for small text and icons: keep it readable (WCAG AA 4.5:1) on the background.
  let steps = 0;
  while (contrast(accent2, bg) < 4.5 && steps++ < 12) accent2 = mix(accent2, WHITE, 0.12);
  if (steps > 0) warn('"accentSecondary" was lightened to stay readable on the background.');

  // Text on the CTA: whichever of dark/white is more readable across the whole accent gradient.
  const worst = (t) => Math.min(contrast(t, accent), contrast(t, accent2));
  const onAccent = worst(DARK) >= worst(WHITE) ? DARK : WHITE;

  let avatarShape = THEME_DEFAULTS.avatarShape;
  if (input.avatarShape === "circle" || input.avatarShape === "arch") avatarShape = input.avatarShape;
  else if (input.avatarShape != null) warn('"avatarShape" must be "arch" or "circle".');

  for (const k of ["borderRadius", "glassOpacity"]) {
    if (input[k] != null && !Number.isFinite(Number(input[k]))) warn(`"${k}" must be a number. Using the default.`);
  }
  const radius = Math.round(clamp(input.borderRadius, 8, 32, THEME_DEFAULTS.borderRadius));
  const glass = clamp(input.glassOpacity, 0.02, 0.15, THEME_DEFAULTS.glassOpacity);
  const ch = (rgb) => rgb.join(" ");

  const vars = {
    "--ink-rgb": ch(bg),
    "--surface-rgb": ch(mix(bg, WHITE, 0.035)),
    "--accent-rgb": ch(accent),
    "--accent2-rgb": ch(accent2),
    "--accent-deep-rgb": ch(mix(accent, [0, 0, 0], 0.22)),
    "--mist-rgb": ch(mix(bg, WHITE, 0.66)),
    "--on-accent-rgb": ch(onAccent),
    "--glass": String(glass),
    "--radius-card": `${radius}px`,
    "--radius-control": `${Math.round(radius * 0.67)}px`,
    "--radius-tile": `${Math.round(radius * 0.5)}px`,
  };
  const css = `:root{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(";")}}`;
  return { css, themeColor: toHex(bg), avatarShape, warnings };
}
