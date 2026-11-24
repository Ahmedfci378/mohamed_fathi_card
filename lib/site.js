let warned = false;

function toOrigin(value, source) {
  // Hosting env vars (VERCEL_URL, CF_PAGES_URL...) come without a scheme.
  const v = /^https?:\/\//i.test(String(value).trim()) ? String(value).trim() : `https://${String(value).trim()}`;
  try {
    return new URL(v).origin; // origin only: a path here would break every canonical URL
  } catch {
    throw new Error(`${source} is not a valid URL: "${value}". Expected something like https://card.example.com`);
  }
}

/**
 * Public origin used for canonical URLs, Open Graph and the sitemap.
 * Set NEXT_PUBLIC_SITE_URL for a custom domain. Falls back to the host's own production URL
 * (Vercel, Netlify, Cloudflare Pages). A malformed value fails the build instead of shipping bad URLs.
 */
export function getSiteUrl() {
  const env = process.env;
  let origin = null;
  if (env.NEXT_PUBLIC_SITE_URL) origin = toOrigin(env.NEXT_PUBLIC_SITE_URL, "NEXT_PUBLIC_SITE_URL");
  else {
    const host = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL || (env.NETLIFY && env.URL) || env.CF_PAGES_URL;
    if (host) origin = toOrigin(host, "the hosting provider URL variable");
  }

  if (env.NODE_ENV === "production" && !warned && (!origin || origin.startsWith("http://") || /localhost/.test(origin))) {
    warned = true;
    console.warn(`[site] Canonical URLs, Open Graph and the sitemap use "${origin ?? "http://localhost:3000"}". Set NEXT_PUBLIC_SITE_URL to your public https URL before deploying.`);
  }
  return origin ?? "http://localhost:3000"; // local dev only
}
