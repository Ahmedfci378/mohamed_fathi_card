import { parseWebUrl } from "./url.js";

const num = (v) => (v === null || v === undefined || v === "" ? NaN : Number(v));

/** A configured "maps URL" must really be a Google Maps link (not any website, not google.com/url redirects). */
function isGoogleMapsLink(href) {
  const u = parseWebUrl(href);
  if (!u || u.pathname.startsWith("/url")) return false;
  const h = u.hostname.toLowerCase();
  if (h === "maps.app.goo.gl" || h === "g.page" || h.endsWith(".g.page")) return true;
  if (h === "goo.gl") return u.pathname.startsWith("/maps");
  if (/^maps\.google\.[a-z.]{2,6}$/.test(h)) return true;
  return /^(www\.)?google\.[a-z.]{2,6}$/.test(h) && u.pathname.startsWith("/maps");
}

/** Priority: latitude/longitude → configured Google Maps URL → address text. Takes the flat card config. */
export function mapsUrl({ latitude, longitude, mapsUrl: direct, address } = {}) {
  const lat = num(latitude), lng = num(longitude);
  if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  if (direct && isGoogleMapsLink(direct)) return parseWebUrl(direct).href;
  const text = address?.trim();
  return text ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text.slice(0, 300))}` : null;
}
