import { normalizeCard } from "@/lib/card";
import ahmed from "./ahmed-mohamed";

// The ONLY file that knows where card data comes from.
const cards = [ahmed].map(normalizeCard);

export const getAllSlugs = () => cards.map((c) => c.slug);
export const getCardBySlug = (slug) => cards.find((c) => c.slug === slug) ?? null;
