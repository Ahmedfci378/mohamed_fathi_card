const security = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Blocks <object>/<embed>, injected <base>, and form posts to other sites. script-src is left open on purpose: Next injects inline bootstrap scripts.
  { key: "Content-Security-Policy", value: "object-src 'none'; base-uri 'self'; form-action 'self'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // optimized images are reused, not re-generated
  },
  async headers() {
    return [
      { source: "/:path*", headers: security },
      {
        // Customer assets: cached a day, then served stale while revalidating (safe if a file is replaced).
        source: "/cards/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};
