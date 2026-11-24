/** Current page URL without hash and tracking params (utm_*, fbclid, gclid). */
export function currentCardUrl(href = window.location.href) {
  const u = new URL(href);
  u.hash = "";
  [...u.searchParams.keys()]
    .filter((k) => /^(utm_|fbclid$|gclid$)/i.test(k))
    .forEach((k) => u.searchParams.delete(k));
  return u.toString();
}

/** Clipboard API first, then the legacy execCommand route (older/non-secure contexts). */
export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.setAttribute("aria-hidden", "true");
    Object.assign(ta.style, { position: "fixed", top: "0", left: "0", opacity: "0", fontSize: "16px" }); // 16px: no iOS zoom
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    ta.remove();
    return !!ok;
  } catch {
    return false;
  }
}

function canUseNativeShare(data) {
  try {
    return typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare(data));
  } catch {
    return false;
  }
}

/**
 * @returns {Promise<"shared"|"cancelled"|"copied"|"manual">}
 *   shared    - native sheet completed
 *   cancelled - user closed the sheet (not an error, nothing to show)
 *   copied    - URL is on the clipboard
 *   manual    - nothing worked; UI should show the URL so the user can copy it by hand
 */
export async function shareOrCopy({ title, text, url }) {
  if (canUseNativeShare({ title, text, url })) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (e) {
      if (e?.name === "AbortError") return "cancelled";
      // Any other failure (NotAllowedError, in-app browser quirks...) -> use the copy fallback.
    }
  }
  return (await copyText(url)) ? "copied" : "manual";
}
