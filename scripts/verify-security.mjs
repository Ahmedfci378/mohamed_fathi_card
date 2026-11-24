// Run: npm run verify:security
// Hostile-input checks for every place a customer-supplied value becomes a link, image, file or page URL.
import assert from "node:assert/strict";
import { buildActions } from "../lib/actions.js";
import { buildVCard } from "../lib/vcard.js";
import { safeImageSrc, safeWebUrl } from "../lib/url.js";
import { normalizeCard } from "../lib/card.js";
import { buildJsonLd } from "../lib/seo.js";

console.warn = () => {};
let n = 0;
const eq = (name, actual, expected) => { assert.deepEqual(actual, expected, name); n++; process.stdout.write(`ok   ${name}\n`); };
const A = (o) => buildActions(o, "ar");

// --- web URLs
for (const bad of ["javascript:alert(1)", "java\nscript:alert(1)", "java\tscript:alert(1)", "data:text/html,<script>1</script>", "file:///etc/passwd", "vbscript:x",
  "https://user:pass@evil.com/x", "https://bank.com@evil.com", "http://127.0.0.1/admin", "https://10.0.0.5/x", "https://[::1]/x", "https://localhost:3000",
  "https://printer.local/x", "https://intranet/x", "https://" + "a".repeat(2100) + ".com"])
  eq(`website rejected: ${JSON.stringify(bad).slice(0, 40)}`, A({ website: bad }).website, null);
eq("website: protocol-relative is read as a plain https host", A({ website: "//example.org" }).website, "https://example.org/");
eq("website: scheme-less accepted", A({ website: " example.com/page " }).website, "https://example.com/page");
eq("website: quotes are percent-encoded", A({ website: 'https://example.com/"onmouseover="x' }).website, "https://example.com/%22onmouseover=%22x");

// --- email / mailto
for (const bad of ["a@b.com?bcc=x@y.com", "a@b.com?body=spam", "a@b.com&cc=x", "a@b.com#x", "a@b.com%0ABcc:x@y.com", "a b@c.com", "a@b", '"a"@b.com', "a@b.com,c@d.com", "<a@b.com>"])
  eq(`email rejected: ${JSON.stringify(bad)}`, A({ email: bad }).email, null);
eq("email: subject newlines flattened (no header injection)", A({ email: "a@b.com", emailSubject: "Hi\r\nBcc: x@y.com" }).email, "mailto:a@b.com?subject=Hi%20Bcc%3A%20x%40y.com");
eq("email: control chars stripped from body", A({ email: "a@b.com", emailBody: "a\u0000b" }).email, "mailto:a@b.com?body=ab");

// --- phone / WhatsApp
for (const bad of ["0100123", "+201001234567;ext=1", "tel:+201001234567", "+0100123456", "+2010012345678901234", "abc"]) {
  const a = A({ phone: bad, whatsapp: bad });
  eq(`phone rejected: ${bad}`, [a.call, a.whatsapp], [null, null]);
}
eq("phone: separators and Arabic-Indic digits accepted", A({ phone: "+٢٠ (100) 123-4567" }).call, "tel:+201001234567");
eq("whatsapp: message is encoded once, controls stripped", A({ whatsapp: "+201001234567", whatsappMessage: "a&b=c\u0007 #1" }).whatsapp, "https://wa.me/201001234567?text=a%26b%3Dc%20%231");

// --- social links must match the platform
eq("social: wrong host rejected", A({ instagram: "https://evil.example/phish" }).socials, []);
eq("social: look-alike suffix rejected", A({ linkedin: "https://linkedin.com.evil.com/in/x" }).socials, []);
eq("social: another platform's link rejected", A({ facebook: "https://instagram.com/x" }).socials, []);
eq("social: subdomain accepted", A({ linkedin: "https://www.linkedin.com/in/x" }).socials.map((s) => s.platform), ["linkedin"]);
eq("social: x.com and twitter.com both accepted", [A({ x: "https://x.com/a" }).socials.length, A({ twitter: "https://twitter.com/a" }).socials.length], [1, 1]);

// --- maps
const noCoords = { latitude: null, longitude: null, address: null };
eq("maps: non-Google URL ignored", A({ ...noCoords, mapsUrl: "https://evil.example/fake-map" }).map, null);
eq("maps: google.com/url redirect ignored", A({ ...noCoords, mapsUrl: "https://www.google.com/url?q=https://evil.com" }).map, null);
eq("maps: google.com non-maps path ignored", A({ ...noCoords, mapsUrl: "https://www.google.com/search?q=x" }).map, null);
eq("maps: share links accepted", ["https://maps.app.goo.gl/abc", "https://www.google.com/maps/place/x", "https://goo.gl/maps/abc", "https://maps.google.com.eg/?q=x"].map((u) => !!A({ ...noCoords, mapsUrl: u }).map), [true, true, true, true]);

// --- images
eq("image: unsafe sources rejected", ["http://t.example/p.png", "https://u:p@cdn.example/a.png", "//cdn.example/a.png", "data:image/png;base64,AA", "javascript:1", "/a/../../etc/passwd", "/a\\b.png", "https://127.0.0.1/a.png"].map(safeImageSrc), Array(8).fill(null));
eq("image: local + https accepted", ["/cards/a.webp", "https://cdn.example.com/a.png"].map(safeImageSrc), ["/cards/a.webp", "https://cdn.example.com/a.png"]);

// --- slug
for (const bad of ["../etc", "Ahmed", "ahmed mohamed", "a/b", "أحمد", "-a", "a--b", ""]) {
  assert.throws(() => normalizeCard({ slug: bad, fullName: "X" }), /slug|requires/); n++; process.stdout.write(`ok   slug rejected: ${JSON.stringify(bad)}\n`);
}

// --- vCard
const v = buildVCard({ fullName: "A\u0000B\u0007C", firstName: "A", lastName: "B", website: "mailto:x@y.com" });
eq("vcard: control chars removed", /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(v), false);
eq("vcard: non-web URL not written", /URL:/.test(v), false);
const c = normalizeCard({ slug: "s", fullName: "X", phone: "0100123", email: "bad", website: "javascript:1", address: "Street" });
eq("vcard fields: only validated values", [c.vcard.phone, c.vcard.email, c.vcard.website], [undefined, undefined, undefined]);

// --- hostile text in free-form fields cannot break out of the JSON-LD <script>
const h = normalizeCard({ slug: "s", fullName: "</script><script>alert(1)</script>", bio: "<!-- x -->", jobTitle: "\u2028" });
const ld = buildJsonLd(h, "https://x.com");
eq("json-ld: no raw '<' anywhere", ld.includes("<"), false);
eq("json-ld: still valid JSON, text preserved", JSON.parse(ld).name, "</script><script>alert(1)</script>");
eq("webUrl helper is the only URL gate", typeof safeWebUrl, "function");

process.stdout.write(`\nAll ${n} checks passed.\n`);
