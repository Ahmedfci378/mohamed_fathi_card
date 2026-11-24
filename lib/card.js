import { buildActions } from "./actions.js";
import { resolveTheme } from "./theme.js";
import { safeImageSrc } from "./url.js";
import { cleanPhone, isValidPhone } from "./phone.js";
import { isValidEmail } from "./email.js";

// The slug becomes the page URL, the QR target and the .vcf file name: keep it plain.
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SCHEMA_TYPES = ["Person", "Physician", "Dentist", "Attorney", "LegalService", "RealEstateAgent", "ProfessionalService", "LocalBusiness"];
const inRange = (v, max) => v !== null && v !== undefined && v !== "" && Math.abs(Number(v)) <= max;

/** Turns the flat customer config into the structure the components consume. */
export function normalizeCard(c) {
  if (!c?.slug || !c?.fullName) throw new Error("Card config requires `slug` and `fullName`.");
  if (!SLUG.test(c.slug)) throw new Error(`Invalid slug "${c.slug}": use lowercase letters, digits and single hyphens (e.g. "ahmed-mohamed").`);
  const locale = c.locale ?? "ar";
  const actions = buildActions(c, locale);

  // Tell the developer when a configured value was rejected (and therefore hidden).
  const expected = { phone: "call", whatsapp: "whatsapp", email: "email", website: "website" };
  for (const [field, action] of Object.entries(expected)) {
    if (c[field] && !actions[action]) console.warn(`[card:${c.slug}] "${field}" is invalid and its button is hidden.`);
  }
  for (const k of ["linkedin", "facebook", "instagram", "youtube", "twitter", "x"]) {
    const platform = k === "twitter" ? "x" : k;
    if (c[k] && !actions.socials.some((s) => s.platform === platform)) {
      console.warn(`[card:${c.slug}] "${k}" is not a valid https URL on the matching platform and its icon is hidden.`);
    }
  }

  const theme = resolveTheme(c.theme, c.slug);
  theme.warnings.forEach((w) => console.warn(w));
  const image = (field) => {
    const ok = safeImageSrc(c[field]);
    if (c[field] && !ok) console.warn(`[card:${c.slug}] "${field}" must be a /local/path or https URL. Image hidden.`);
    return ok;
  };
  const brandName = c.brandName ?? c.company;
  const schemaType = c.schemaType ?? "Person";
  if (!SCHEMA_TYPES.includes(schemaType)) console.warn(`[card:${c.slug}] "schemaType" must be one of: ${SCHEMA_TYPES.join(", ")}.`);

  return {
    slug: c.slug,
    locale,
    profile: {
      name: c.fullName, title: c.jobTitle, company: c.company, bio: c.bio,
      photo: image("profileImage"), photoAlt: c.profileImageAlt ?? c.fullName,
    },
    brand: {
      name: brandName,
      logo: image("logo"),
      logoAlt: c.logoAlt ?? brandName ?? c.fullName,
      description: c.companyDescription,
      initial: [...(brandName ?? "")][0] ?? "",
    },
    cover: image("coverImage"),
    qrLogo: image("qrLogo"),
    theme,
    about: c.about,
    services: c.services ?? [],
    location: c.address || c.addressLabel ? { label: c.addressLabel ?? c.company, address: c.address } : { label: c.company },
    actions,
    geo: inRange(c.latitude, 90) && inRange(c.longitude, 180) ? { latitude: Number(c.latitude), longitude: Number(c.longitude) } : null,
    seo: {
      title: c.seoTitle ?? `${c.fullName} | ${c.jobTitle ?? ""}`.replace(/ \| $/, ""),
      description: c.seoDescription ?? c.bio ?? c.about ?? "",
      ogImage: image("ogImage"),
      noindex: c.seoNoindex === true,
      schemaType: SCHEMA_TYPES.includes(schemaType) ? schemaType : "Person",
    },
    // Only the fields the .vcf needs. Nothing else is sent to the client component.
    vcard: {
      fullName: c.fullName,
      firstName: c.firstName ?? c.fullName,
      lastName: c.lastName ?? "",
      company: c.company, jobTitle: c.jobTitle,
      // Only values that passed validation: an invalid number or address never ends up in someone's contacts.
      phone: isValidPhone(c.phone) ? cleanPhone(c.phone) : undefined,
      whatsapp: isValidPhone(c.whatsapp) ? cleanPhone(c.whatsapp) : undefined,
      email: isValidEmail(c.email) ? c.email.trim() : undefined,
      website: actions.website ?? undefined,
      address: c.address,
    },
  };
}
