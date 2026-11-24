// Every outgoing link and image goes through here. Customer-supplied values are never trusted.

const MAX_URL = 2048;
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const LOCAL_HOST = /(^|\.)(localhost|local|internal|lan|home|corp)$/i;

/**
 * Parses a user-supplied web URL. Accepts only http(s) with a real public-looking hostname:
 * no credentials (https://bank.com@evil.com tricks), no IP literals, no localhost/intranet names,
 * no control characters (which URL parsers silently strip: "java\nscript:").
 * "example.com" is accepted and becomes https://example.com/.
 * @returns {URL|null}
 */
export function parseWebUrl(value) {
  if (!value) return null;
  let v = String(value).trim();
  if (!v || v.length > MAX_URL || /[\u0000-\u001F\u007F]/.test(v)) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(v)) v = "https://" + v.replace(/^\/\//, "");
  let u;
  try { u = new URL(v); } catch { return null; }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  if (u.username || u.password) return null;
  const host = u.hostname.toLowerCase();
  if (!host.includes(".") || IPV4.test(host) || host.startsWith("[") || LOCAL_HOST.test(host)) return null;
  return u;
}

export const safeWebUrl = (value) => parseWebUrl(value)?.href ?? null;

/** True when the URL's host is one of `domains` or a subdomain of one (linkedin.com.evil.com does NOT match linkedin.com). */
export function hostIn(href, domains) {
  const host = parseWebUrl(href)?.hostname.toLowerCase();
  return !!host && domains.some((d) => host === d || host.endsWith("." + d));
}

/**
 * Images: a local path ("/cards/...") or an https URL. http: is refused (mixed content + tracking),
 * as are credentials, backslashes, "..", protocol-relative "//host", data: and javascript:.
 */
export function safeImageSrc(value) {
  if (!value) return null;
  const v = String(value).trim();
  if (v.startsWith("/")) {
    return !v.startsWith("//") && !/[\\\u0000-\u001F\u007F]/.test(v) && !v.split("/").includes("..") ? v : null;
  }
  const u = parseWebUrl(v);
  return u && u.protocol === "https:" ? u.href : null;
}
