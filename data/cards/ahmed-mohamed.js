/**
 * Customer card configuration. To create a new customer:
 *   1. Copy this file, rename it to the customer's slug.
 *   2. Change the values. Delete any line you don't need.
 *   3. Register it in data/cards/index.js.
 *
 * Phone numbers: international format with "+" (e.g. +12025550143).
 * Social fields: full URLs starting with https://
 */
const card = {
  slug: "ahmed-mohamed",       // becomes the URL: /ahmed-mohamed
  locale: "en",                // "ar" | "en"

  // Identity
  fullName: "Eng. Mohamed Fathi",
  firstName: "Mohamed",
  lastName: "Fathi",
  jobTitle: "Localization Engineer",
  company: "Kaiyi Motors Egypt",
  profileImage: "/images/Mfathi.png",          // "/cards/ahmed-mohamed/avatar.webp" (portrait ~4:5, 400px+). null = initials
  profileImageAlt: null,       // optional; defaults to fullName

  // Branding
  brandName: "Kaiyi Motors Egypt",    // shown under the title; falls back to `company`
  logo: null,                  // "/cards/ahmed-mohamed/logo.svg" - square or icon-style works best (shown in a 40px tile)
  qrLogo: null,                // optional small logo in the QR centre (square, simple). Leave null for the most reliable scan
  coverImage: null,            // optional faded backdrop, e.g. "/cards/ahmed-mohamed/cover.webp" (wide, ~1600px)
  companyDescription:
    "KAIYI Motors Egypt is the official dealer and representative of KAIYI vehicles in Egypt, providing modern mobility solutions with advanced technology and premium quality.  The company offers vehicle sales, after-sales services, maintenance, genuine spare parts, and customer care through its growing network.  KAIYI Motors Egypt is focused on expanding its presence in Egypt while delivering professional, innovative, and customer-focused automotive services.",

  // Visual identity. Dark backgrounds only. Everything below is optional.
  theme: {
    accent: "#C9A24B",
    accentSecondary: "#E6CB85",  // used for small text/icons; auto-lightened if contrast is too low
    background: "#0D1117",
    glassOpacity: 0.045,         // 0.02 - 0.15
    borderRadius: 24,            // px, 8 - 32
    avatarShape: "arch",         // "arch" | "circle"
  },

  // Text
  bio: "Localization Engineer at Kaiyi Motors Egypt, specializing in automotive localization, supplier coordination, local content development, BOM analysis, and cost evaluation.",
  about:
    "Localization Engineer at KAIYI Motors Egypt (KME), with a background in Automotive Mechanics Engineering from Helwan University.  Experienced in automotive localization, supplier coordination, supplier development, and local content.  Skilled in BOM analysis, technical evaluation, cost analysis, and quotation evaluation.",
  // services: [
  //   { title: "جراحات المناظير", description: "الركبة والكتف بأقل تدخل جراحي" },
  //   { title: "تبديل المفاصل", description: "الركبة والحوض بأحدث التقنيات" },
  //   { title: "إصابات الملاعب", description: "تشخيص وخطة تأهيل متكاملة" },
  // ],

  // SEO / sharing
  schemaType: "Physician",     // Person | Physician | Dentist | Attorney | LegalService | RealEstateAgent | ProfessionalService | LocalBusiness
  ogImage: "/cards/ahmed-mohamed/og.jpg", // 1200x630, under ~300KB: the preview shown on WhatsApp/Facebook/X
  seoNoindex: false,           // true = hide from Google (also removed from the sitemap)
  // seoTitle / seoDescription: optional overrides (defaults come from name, title and bio)

  
  // Contact
phone: "+201101613345",
whatsapp: "+201101613345",
whatsappMessage: "السلام عليكم بشمهندس محمد",
email: "ckd@kaiyimotorsegypt.com",
emailSubject: "From Digital Card",
emailBody: "Dear, Eng. Mohamed,",
website: "kaiyimotorsegypt.com",
  

  // Location
  addressLabel: "6 october City", // optional; defaults to `address`
  address: "1st Industrial Zone, 6th of October City, Giza Governorate, Egypt",
  latitude: 29.9209175,
  longitude: 30.914896,
  mapsUrl: "https://www.google.com/maps?q=29.9209175,30.914896",               // optional fallback, used only when latitude/longitude are missing

  // Social
  linkedin: "https://www.linkedin.com/in/eng-mohamed-fathi",
  instagram: "https://www.instagram.com/eng_mohamed_fathi22?cnvx=MTEwcTU4dDE2NHc2ZA==",
facebook: "https://www.facebook.com/mohamed.fathi.372018",
  youtube: null,
  twitter: null,               // X / Twitter
};

export default card;
