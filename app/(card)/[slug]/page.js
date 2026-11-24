import { notFound } from "next/navigation";
import { getCardBySlug, getAllSlugs } from "@/data/cards";
import { getSiteUrl } from "@/lib/site";
import { buildMetadata, buildJsonLd } from "@/lib/seo";
import CardShell from "@/components/card/CardShell";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  return card ? buildMetadata(card, getSiteUrl()) : {};
}

export async function generateViewport({ params }) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  return card ? { themeColor: card.theme.themeColor } : {};
}

export default async function CardPage({ params }) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();
  const jsonLd = buildJsonLd(card, getSiteUrl());
  return (
    <>
      <CardShell card={card} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
    </>
  );
}
