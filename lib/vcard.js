import { safeWebUrl } from "./url.js";
import { cleanPhone } from "./phone.js";

const encoder = new TextEncoder();

/** vCard 3.0 TEXT escaping. Backslash MUST be first. */
function escapeText(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // raw control chars are illegal in vCard text
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

/** Fold to max 75 octets per line, never splitting a multi-byte (Arabic) character. */
function fold(line) {
  if (encoder.encode(line).length <= 75) return line;
  const parts = [];
  let cur = "", bytes = 0, limit = 75;
  for (const ch of line) {                       // iterates by code point
    const size = encoder.encode(ch).length;
    if (bytes + size > limit) { parts.push(cur); cur = ""; bytes = 0; limit = 74; } // 74 + leading space
    cur += ch; bytes += size;
  }
  parts.push(cur);
  return parts.join("\r\n ");
}

const cleanLine = (v) => String(v ?? "").replace(/[\r\n\s]+/g, "");

/**
 * @param {{fullName:string, firstName?:string, lastName?:string, company?:string, jobTitle?:string,
 *          phone?:string, whatsapp?:string, email?:string, website?:string, address?:string}} d
 * @returns {string} vCard 3.0 text with CRLF line endings
 */
export function buildVCard(d) {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  lines.push(`FN:${escapeText(d.fullName)}`);
  lines.push(`N:${escapeText(d.lastName)};${escapeText(d.firstName)};;;`);
  if (d.company) lines.push(`ORG:${escapeText(d.company)}`);
  if (d.jobTitle) lines.push(`TITLE:${escapeText(d.jobTitle)}`);

  const phone = cleanPhone(d.phone);
  const wa = cleanPhone(d.whatsapp);
  if (phone) lines.push(`TEL;TYPE=CELL,VOICE:${phone}`);
  if (wa && wa !== phone) lines.push(`TEL;TYPE=CELL:${wa}`);

  if (d.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${cleanLine(d.email)}`);
  const site = safeWebUrl(d.website);
  if (site) lines.push(`URL:${cleanLine(site)}`);
  // ADR = PO box; extended; street; city; region; zip; country. Free-text goes in "street".
  if (d.address) lines.push(`ADR;TYPE=WORK:;;${escapeText(d.address)};;;;`);

  lines.push("END:VCARD");
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function vcardFileName(slug) {
  const safe = String(slug ?? "").replace(/[^a-z0-9_-]/gi, "-").replace(/^-+|-+$/g, "");
  return `${safe || "contact"}.vcf`;
}
