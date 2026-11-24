import "../globals.css";
import { sans } from "@/lib/fonts";

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0d1117", colorScheme: "dark" };
export const metadata = { robots: { index: false } }; // "/" only redirects to a card

export default function SiteLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={sans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
