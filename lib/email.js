// Strict on purpose: the address ends up inside a mailto: link, so characters that mailto treats
// specially (? & # % , ;) must never be present, or a value could add Bcc/Cc/body parameters.
const EMAIL = /^[A-Za-z0-9._+-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;

export const isValidEmail = (v) => {
  const s = String(v ?? "").trim();
  return s.length <= 254 && EMAIL.test(s);
};

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g; // everything except \t \n \r

export function mailtoUrl(email, { subject, body } = {}) {
  if (!isValidEmail(email)) return null;
  const params = [];
  // Subject is single-line: CR/LF would let text pose as extra mail headers in some clients.
  const s = String(subject ?? "").replace(/[\r\n]+/g, " ").replace(CONTROL, "").trim().slice(0, 200);
  const b = String(body ?? "").replace(CONTROL, "").trim().slice(0, 1000);
  if (s) params.push(`subject=${encodeURIComponent(s)}`);
  if (b) params.push(`body=${encodeURIComponent(b.replace(/\r?\n/g, "\r\n"))}`);
  return `mailto:${String(email).trim()}${params.length ? "?" + params.join("&") : ""}`;
}
