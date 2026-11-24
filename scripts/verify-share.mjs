// Run: npm run verify:share
import assert from "node:assert/strict";
import { shareOrCopy, currentCardUrl, copyText } from "../lib/share.js";

const logs = [];
for (const k of ["log", "warn", "error"]) console[k] = (...a) => logs.push([k, ...a]);
const set = (k, v) => Object.defineProperty(globalThis, k, { value: v, configurable: true, writable: true });
let n = 0;
const ok = (name, actual, expected) => { assert.deepEqual(actual, expected, name); n++; process.stdout.write(`ok   ${name}\n`); };

function env({ share, canShare, clipboard, secure = true, exec }) {
  const calls = { share: [], clip: [], exec: 0 };
  set("navigator", {
    ...(share && { share: async (d) => { calls.share.push(d); return share(d); } }),
    ...(canShare && { canShare }),
    ...(clipboard && { clipboard: { writeText: async (t) => { calls.clip.push(t); return clipboard(t); } } }),
  });
  set("window", { isSecureContext: secure });
  set("document", {
    body: { appendChild() {} },
    createElement: () => ({ style: {}, setAttribute() {}, select() {}, setSelectionRange() {}, remove() {} }),
    execCommand: () => { calls.exec++; return exec ? exec() : false; },
  });
  return calls;
}
const data = { title: "T", text: "Name\nJob - Co", url: "https://x.com/a" };
const err = (name) => Object.assign(new Error(name), { name });

let c = env({ share: () => {}, clipboard: () => {} });
ok("native share used with name/job/url", [await shareOrCopy(data), c.share[0], c.clip.length], ["shared", data, 0]);

c = env({ share: () => { throw err("AbortError"); }, clipboard: () => {} });
logs.length = 0;
ok("cancel -> cancelled, no copy, no console output", [await shareOrCopy(data), c.clip.length, logs.length], ["cancelled", 0, 0]);

c = env({ share: () => { throw err("NotAllowedError"); }, clipboard: () => {} });
ok("share failure -> clipboard fallback", [await shareOrCopy(data), c.clip[0]], ["copied", data.url]);

c = env({ share: () => {}, canShare: () => false, clipboard: () => {} });
ok("canShare=false -> skips native, copies", [await shareOrCopy(data), c.share.length, c.clip.length], ["copied", 0, 1]);

c = env({ clipboard: () => {} });
ok("no navigator.share -> clipboard copy", [await shareOrCopy(data), c.clip[0]], ["copied", data.url]);

c = env({ clipboard: () => { throw err("NotAllowedError"); }, exec: () => true });
ok("clipboard rejects -> execCommand copy", [await shareOrCopy(data), c.exec], ["copied", 1]);

c = env({ clipboard: () => {}, secure: false, exec: () => true });
ok("insecure context skips Clipboard API", [await shareOrCopy(data), c.clip.length, c.exec], ["copied", 0, 1]);

c = env({ exec: () => false });
ok("everything fails -> manual", await shareOrCopy(data), "manual");

c = env({ exec: () => { throw new Error("x"); } });
ok("execCommand throws -> manual, no throw", await copyText("u"), false);

ok("url: strips hash + utm/fbclid/gclid, keeps others",
  currentCardUrl("https://a.com/ahmed?utm_source=wa&ref=qr&fbclid=1&gclid=2#top"), "https://a.com/ahmed?ref=qr");
ok("url: plain page unchanged", currentCardUrl("https://a.com/ahmed"), "https://a.com/ahmed");

process.stdout.write(`\nAll ${n} checks passed.\n`);
