import { cleanPhone, isValidPhone } from "./phone.js";
import { whatsappUrl } from "./whatsapp.js";
import { mailtoUrl } from "./email.js";
import { mapsUrl } from "./maps.js";
import { safeWebUrl, hostIn } from "./url.js";

const SOCIAL_ORDER = ["linkedin", "facebook", "instagram", "youtube", "x"];
// A "linkedin" field must point to LinkedIn, etc. Catches pasted-wrong-link mistakes and look-alike domains.
export const SOCIAL_HOSTS = {
  linkedin: ["linkedin.com", "lnkd.in"],
  facebook: ["facebook.com", "fb.com", "fb.me"],
  instagram: ["instagram.com", "instagr.am"],
  youtube: ["youtube.com", "youtu.be"],
  x: ["x.com", "twitter.com"],
};
const SOCIAL_LABELS = {
  ar: { linkedin: "لينكدإن", facebook: "فيسبوك", instagram: "إنستجرام", youtube: "يوتيوب", x: "إكس" },
  en: { linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram", youtube: "YouTube", x: "X" },
};

/**
 * The single place where every outgoing link is produced from the flat card config.
 * A link that can't be built safely is `null`, and components render nothing for it.
 */
export function buildActions(c, locale = "ar") {
  const website = safeWebUrl(c.website);
  const socialValues = { ...c, x: c.x ?? c.twitter };
  return {
    call: isValidPhone(c.phone) ? `tel:${cleanPhone(c.phone)}` : null,
    whatsapp: whatsappUrl(c.whatsapp, c.whatsappMessage),
    email: mailtoUrl(c.email, { subject: c.emailSubject, body: c.emailBody }),
    website,
    map: mapsUrl(c),
    socials: SOCIAL_ORDER
      .map((platform) => ({
        platform,
        url: ((u) => (u && hostIn(u, SOCIAL_HOSTS[platform]) ? u : null))(safeWebUrl(socialValues[platform])),
        label: SOCIAL_LABELS[locale]?.[platform] ?? platform,
      }))
      .filter((s) => s.url),
    display: {
      phone: isValidPhone(c.phone) ? cleanPhone(c.phone) : null,
      email: c.email?.trim() || null,
      website: website ? website.replace(/^https?:\/\//, "").replace(/\/$/, "") : null,
    },
  };
}
