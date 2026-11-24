// Run: npm run verify:theme
import assert from "node:assert/strict";
import { resolveTheme, contrast } from "../lib/theme.js";
import { normalizeCard } from "../lib/card.js";

const warns = [];
console.warn = (m) => warns.push(m);
let n = 0;
const check = (name, actual, expected) => { assert.deepEqual(actual, expected, name); n++; process.stdout.write(`ok   ${name}\n`); };
const get = (css, v) => css.match(new RegExp(`${v}:([^;}]+)`))[1];
const rgb = (s) => s.split(" ").map(Number);

// defaults reproduce the original gold look
let t = resolveTheme();
check("defaults: accent/background", [get(t.css, "--accent-rgb"), get(t.css, "--ink-rgb"), t.themeColor], ["201 162 75", "13 17 23", "#0d1117"]);
check("defaults: radius + glass + shape", [get(t.css, "--radius-card"), get(t.css, "--glass"), t.avatarShape], ["24px", "0.045", "arch"]);

// accent only -> secondary is derived from it, not the default gold
t = resolveTheme({ accent: "#1F6FEB" });
check("accent only: accent2 derived", [get(t.css, "--accent-rgb"), get(t.css, "--accent2-rgb") !== "230 203 133"], ["31 111 235", true]);

// invalid input
warns.length = 0;
t = resolveTheme({ accent: "red", background: "#FFFFFF", glassOpacity: "x", avatarShape: "star" });
check("invalid values -> defaults", [get(t.css, "--accent-rgb"), get(t.css, "--ink-rgb"), get(t.css, "--glass"), t.avatarShape], ["201 162 75", "13 17 23", "0.045", "arch"]);
check("invalid values -> 4 warnings", t.warnings.length, 4);

// readability
t = resolveTheme({ accentSecondary: "#222222" });
check("dark accent2 is lightened to AA contrast", contrast(rgb(get(t.css, "--accent2-rgb")), rgb(get(t.css, "--ink-rgb"))) >= 4.5, true);
check("text on light accent is dark", get(resolveTheme({ accent: "#F5D77A", accentSecondary: "#FFF1BF" }).css, "--on-accent-rgb"), "17 19 24");
check("text on dark accent is white", get(resolveTheme({ accent: "#0B3D91", accentSecondary: "#9DB8FF" }).css, "--on-accent-rgb"), "255 255 255");

// clamping
t = resolveTheme({ glassOpacity: 5, borderRadius: 100 });
check("clamp max", [get(t.css, "--glass"), get(t.css, "--radius-card"), get(t.css, "--radius-control"), get(t.css, "--radius-tile")], ["0.15", "32px", "21px", "16px"]);
t = resolveTheme({ glassOpacity: 0, borderRadius: 1, avatarShape: "circle" });
check("clamp min + circle", [get(t.css, "--glass"), get(t.css, "--radius-card"), t.avatarShape], ["0.02", "8px", "circle"]);
check("css contains only safe characters", /^:root\{[\w\-: ;.]*\}$/.test(resolveTheme({ accent: "#abc" }).css), true);

// card-level: images + brand
const base = { slug: "s", fullName: "Dr X", company: "Acme Clinic" };
let c = normalizeCard({ ...base, profileImage: "javascript:alert(1)", logo: "data:image/png;base64,AA", coverImage: "//evil.com/a.png" });
check("unsafe image sources rejected", [c.profile.photo, c.brand.logo, c.cover], [null, null, null]);
c = normalizeCard({ ...base, profileImage: "/cards/s/a.webp", logo: "https://cdn.example.com/l.svg", coverImage: "/cards/s/c.webp" });
check("local + https images accepted", [c.profile.photo, c.brand.logo, c.cover], ["/cards/s/a.webp", "https://cdn.example.com/l.svg", "/cards/s/c.webp"]);
check("brand falls back to company", [c.brand.name, c.brand.initial], ["Acme Clinic", "A"]);
c = normalizeCard({ ...base, brandName: "Acme", companyDescription: "About us", profileImageAlt: "Portrait" });
check("brandName/description/alt", [c.brand.name, c.brand.description, c.profile.photoAlt], ["Acme", "About us", "Portrait"]);
check("no theme -> default theme", normalizeCard(base).theme.css, resolveTheme().css);

process.stdout.write(`\nAll ${n} checks passed.\n`);
