import "../../globals.css";
import { sans } from "@/lib/fonts";
import { getCardBySlug } from "@/data/cards";
import { getDir } from "@/lib/i18n";

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", colorScheme: "dark" }; // themeColor: see page.js
export const metadata = { formatDetection: { telephone: false, email: false, address: false } };

/** Root layout for card pages: <html lang/dir> come from the card's own locale. */
export default async function CardLayout({ children, params }) {
  const { slug } = await params;
  const locale = getCardBySlug(slug)?.locale ?? "ar";
  return (
    <html lang={locale} dir={getDir(locale)} className={sans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
