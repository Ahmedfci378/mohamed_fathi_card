// Run after `npm install`: npm run verify:qr
import assert from "node:assert/strict";
import { buildQr, QR_QUIET_ZONE as Q, MAX_LOGO_RATIO } from "../lib/qr.js";

let n = 0;
const check = (name, actual, expected) => { assert.deepEqual(actual, expected, name); n++; console.log("ok  ", name); };
const rects = (path) => [...path.matchAll(/M(\d+) (\d+)h(\d+)v1h-\d+z/g)].map((m) => ({ x: +m[1], y: +m[2], w: +m[3] }));

const url = "https://digital-card.example.com/ahmed-mohamed";
const m = buildQr(url);
check("default: ECC M, 4-module quiet zone in size", [m.ecc, m.size - m.modules], ["M", 2 * Q]);
check("no logo box by default", m.logo, null);

const all = rects(m.path);
check("quiet zone stays empty on all sides",
  all.every((r) => r.x >= Q && r.y >= Q && r.x + r.w <= m.size - Q && r.y < m.size - Q), true);
check("three finder patterns present (corner modules dark)",
  [[0, 0], [m.modules - 1, 0], [0, m.modules - 1]].every(([c, r]) => all.some((k) => k.y === r + Q && c + Q >= k.x && c + Q < k.x + k.w)), true);

const longUrl = url + "/" + "x".repeat(150);
check("longer URL -> larger symbol", buildQr(longUrl).modules > m.modules, true);
check("percent-encoded Arabic slug works", buildQr("https://a.com/%D8%A3%D8%AD%D9%85%D8%AF").modules > 0, true);

// logo support: ECC forced to H, centred and capped box, nothing drawn inside it
const L = buildQr(url, { logoRatio: 0.9 });
check("logo: ECC H", L.ecc, "H");
check("logo: size capped", L.logo.size <= Math.floor(L.modules * MAX_LOGO_RATIO), true);
check("logo: centred", L.logo.x - Q + L.logo.size + (L.logo.x - Q), L.modules);
check("logo: area is empty",
  rects(L.path).some((r) => r.y >= L.logo.y && r.y < L.logo.y + L.logo.size && r.x < L.logo.x + L.logo.size && r.x + r.w > L.logo.x), false);
check("logo: well under 30% of symbol area", (L.logo.size / L.modules) ** 2 <= 0.1, true);

assert.throws(() => buildQr(""), /required/); n++; console.log("ok   empty text rejected");
console.log(`\nAll ${n} checks passed.`);
