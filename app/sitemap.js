import { getAllCards } from "@/data/cards";
import { getSiteUrl } from "@/lib/site";

export default function sitemap() {
  const site = getSiteUrl();
  return getAllCards()
    .filter((c) => !c.seo?.noindex)
    .map((c) => ({ url: `${site}/${c.slug}`, changeFrequency: "monthly" }));
}