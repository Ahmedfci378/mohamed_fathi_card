/**
 * Normalises a phone number typed by a person. Accepts spaces, dots, hyphens and parentheses as separators and
 * Arabic-Indic digits; ANY other character (letters, ";", "=", ":") makes it invalid, so "+2010..;ext=1" can never
 * silently turn into a different number. A leading 00 becomes +. Returns "" when invalid.
 */
export function cleanPhone(value) {
  const s = String(value ?? "")
    .trim()
    .replace(/[\u0660-\u0669]/g, (d) => d.charCodeAt(0) - 0x0660)  // ٠-٩
    .replace(/[\u06F0-\u06F9]/g, (d) => d.charCodeAt(0) - 0x06f0); // ۰-۹
  if (/[^\d+\s().\-\u00A0]/.test(s)) return "";
  const t = s.replace(/[\s().\-\u00A0]/g, "");
  return t.startsWith("00") ? "+" + t.slice(2) : t;
}
/** E.164: + then 8–15 digits, no leading zero. A local "010..." number is invalid on purpose. */
export const isValidPhone = (value) => /^\+[1-9]\d{7,14}$/.test(cleanPhone(value));
export const phoneDigits = (value) => cleanPhone(value).replace(/\D/g, "");
