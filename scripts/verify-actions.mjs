// Run: npm run verify
// Checks that every action is generated from the card config, and that bad values are rejected.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeCard } from "../lib/card.js";

const src = readFileSync(new URL("../data/cards/ahmed-mohamed.js", import.meta.url), "utf8");
const cfg = (await import("data:text/javascript;base64," + Buffer.from(src).toString("base64"))).default;
const enc = encodeURIComponent;
const warns = [];
console.warn = (m) => warns.push(m);
let n = 0;
const check = (name, actual, expected) => { assert.deepEqual(actual, expected, name); n++; console.log("ok  ", name); };
const A = (over = {}) => normalizeCard({ ...cfg, ...over }).actions;

// 1. Real config -> every link, computed independently from the config values
const a = A();
check("call", a.call, `tel:${cfg.phone}`);
check("whatsapp (+message)", a.whatsapp, `https://wa.me/${cfg.whatsapp.slice(1)}?text=${enc(cfg.whatsappMessage)}`);
check("email (+subject/body)", a.email, `mailto:${cfg.email}?subject=${enc(cfg.emailSubject)}&body=${enc(cfg.emailBody.trim())}`);
check("website", a.website, new URL(cfg.website).href);
check("map uses lat/lng", a.map, `https://www.google.com/maps/search/?api=1&query=${cfg.latitude},${cfg.longitude}`);
check("socials only configured, fixed order", a.socials.map((s) => s.platform), ["linkedin", "facebook", "instagram"]);
check("social urls", a.socials.map((s) => s.url), [cfg.linkedin, cfg.facebook, cfg.instagram].map((u) => new URL(u).href));

// 2. Nothing configured -> nothing rendered
const empty = normalizeCard({ slug: "x", fullName: "X" }).actions;
check("empty config hides everything",
  [empty.call, empty.whatsapp, empty.email, empty.website, empty.map, empty.socials.length], [null, null, null, null, null, 0]);

// 3. Optional parts
check("whatsapp without message has no ?text", A({ whatsappMessage: undefined }).whatsapp, `https://wa.me/${cfg.whatsapp.slice(1)}`);
check("email without subject/body", A({ emailSubject: undefined, emailBody: undefined }).email, `mailto:${cfg.email}`);
check("email body newline -> CRLF", A({ emailBody: "a\nb" }).email.endsWith("body=a%0D%0Ab"), true);
check("x via twitter alias", A({ twitter: "https://x.com/a" }).socials.at(-1), { platform: "x", url: "https://x.com/a", label: "إكس" });
check("youtube appears when set", A({ youtube: "https://youtube.com/@a" }).socials.map((s) => s.platform), ["linkedin", "facebook", "instagram", "youtube"]);

// 4. Maps priority: coordinates -> Maps URL -> address
const noCoords = { latitude: null, longitude: null };
check("maps: coords win over mapsUrl", A({ mapsUrl: "https://maps.app.goo.gl/abc" }).map.includes("query=29.9602,31.2569"), true);
check("maps: mapsUrl when no coords", A({ ...noCoords, mapsUrl: "https://maps.app.goo.gl/abc" }).map, "https://maps.app.goo.gl/abc");
check("maps: address when nothing else", A({ ...noCoords, mapsUrl: null }).map, `https://www.google.com/maps/search/?api=1&query=${enc(cfg.address)}`);
check("maps: out-of-range coords ignored", A({ latitude: 999, longitude: 31, mapsUrl: null, address: null }).map, null);

// 5. Unsafe / malformed values are rejected (and reported)
warns.length = 0;
const bad = A({ website: "javascript:alert(1)", instagram: "data:text/html,x", email: "not-an-email", phone: "0100123", whatsapp: "0100123" });
check("javascript: website rejected", bad.website, null);
check("data: social rejected", bad.socials.some((s) => s.platform === "instagram"), false);
check("bad email rejected", bad.email, null);
check("local (non-E.164) phone rejected", [bad.call, bad.whatsapp], [null, null]);
check("developer warnings emitted", warns.length >= 5, true);
check("scheme-less website fixed", A({ website: "example.com" }).website, "https://example.com/");
check("00-prefix phone accepted", A({ phone: "0020 100 123 4567" }).call, "tel:+201001234567");

console.log(`\nAll ${n} checks passed.`);
