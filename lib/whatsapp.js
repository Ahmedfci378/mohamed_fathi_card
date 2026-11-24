import { isValidPhone, phoneDigits } from "./phone.js";

export function whatsappUrl(phone, message) {
  if (!isValidPhone(phone)) return null;
  // Single encode of plain text; control characters removed; capped (very long ?text= values get truncated by WhatsApp).
  const text = String(message ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, 1000);
  return `https://wa.me/${phoneDigits(phone)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
