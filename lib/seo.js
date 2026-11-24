const OG_LOCALE = { ar: "ar_AR", en: "en_US" };

const clip = (text, max) => {
  const t = String(text ?? "").replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
};
const absolute = (siteUrl, path) => (path ? new URL(path, siteUrl + "/").toString() : undefined);

/** Next.js metadata for a card: title, description, canonical, Open Graph, Twitter, robots. */
export function buildMetadata(card, siteUrl) {
  const { seo, profile, brand, slug, locale, cover } = card;
  const url = `${siteUrl}/${slug}`;
  const description = clip(seo.description, 160);

  // A dedicated 1200x630 image is best. Otherwise fall back to the cover, then the portrait.
  const imagePath = seo.ogImage ?? cover ?? profile.photo;
  const images = imagePath
    ? [{ url: absolute(siteUrl, imagePath), alt: profile.name, ...(seo.ogImage && { width: 1200, height: 630 }) }]
    : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: seo.title },
    description,
    alternates: { canonical: url },
    robots: seo.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "profile", url, title: seo.title, description, images,
      siteName: brand.name ?? profile.name, locale: OG_LOCALE[locale] ?? "ar_AR",
      firstName: card.vcard.firstName, lastName: card.vcard.lastName,
    },
    twitter: {
      card: seo.ogImage || cover ? "summary_large_image" : "summary",
      title: seo.title, description, images: images?.map((i) => i.url),
    },
  };
}

/** schema.org JSON-LD string (already safe to inline in a <script>), or null when the card is noindex. */
export function buildJsonLd(card, siteUrl) {
  const { seo, profile, brand, actions, location, geo, slug } = card;
  if (seo.noindex) return null;

  const isPerson = seo.schemaType === "Person";
  const sameAs = [...actions.socials.map((s) => s.url), actions.website].filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@type": seo.schemaType,
    name: profile.name,
    description: clip(seo.description, 300) || undefined,
    url: `${siteUrl}/${slug}`,
    image: absolute(siteUrl, profile.photo),
    telephone: actions.display.phone ?? undefined,
    email: actions.display.email ?? undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    address: location?.address ? { "@type": "PostalAddress", streetAddress: location.address } : undefined,
    ...(isPerson
      ? { jobTitle: profile.title, worksFor: brand.name ? { "@type": "Organization", name: brand.name } : undefined }
      : { geo: geo ? { "@type": "GeoCoordinates", ...geo } : undefined }),
  };
  // "<" is escaped so config text can never close the <script> tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
