import { IBM_Plex_Sans_Arabic } from "next/font/google";

// next/font self-hosts the files (no request to Google at runtime), adds `font-display: swap`,
// preloads them, and generates a size-adjusted fallback so the swap doesn't move the layout.
export const sans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"], // "latin" is needed even for Arabic text: digits, ".", "(", "«" live there
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-sans",
});
