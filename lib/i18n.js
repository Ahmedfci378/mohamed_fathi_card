// UI strings only. Customer content lives in data/cards.
// Strings only (no functions) so the object can be passed to client components.
const dict = {
  ar: {
    save: "حفظ جهة الاتصال", whatsapp: "واتساب", call: "اتصال", email: "إيميل", share: "مشاركة",
    about: "نبذة", services: "الخدمات", contact: "بيانات التواصل", social: "تابعني",
    location: "الموقع", openMap: "افتح في الخرائط", website: "الموقع الإلكتروني",
    copied: "تم نسخ الرابط", actions: "إجراءات سريعة", newTab: "يفتح في نافذة جديدة",
    shareAria: "مشاركة كارت {name}", copyManual: "انسخ الرابط يدويًا", close: "إغلاق",
    qrOpen: "عرض رمز QR", qrTitle: "امسح لحفظ جهة اتصالي",
    qrHint: "وجّه كاميرا الموبايل نحو الكود لفتح الكارت، ثم اضغط «حفظ جهة الاتصال».",
    qrAria: "رمز QR يفتح كارت {name}", qrLoading: "جاري تجهيز الرمز", qrError: "تعذّر إنشاء الرمز. يمكنك نسخ الرابط أدناه.",
    aboutCompany: "عن {name}", aboutCompanyDefault: "عن الشركة",
    callAria: "اتصال بـ {name}", whatsappAria: "مراسلة {name} على واتساب",
    emailAria: "إرسال إيميل إلى {name}", socialAria: "{platform} - {name}",
    saveDone: "تم تجهيز الملف. أكّد الإضافة من الشاشة التي تظهر، أو افتحه من التنزيلات.",
    saveInApp: "هذا المتصفح قد يمنع التنزيل. افتح الصفحة في Safari أو Chrome ثم أعد المحاولة.",
    saveOpen: "لم يظهر شيء؟ افتح الملف", saveShare: "مشاركة الملف",
    saveError: "تعذّر إنشاء الملف. حاول مرة أخرى أو افتح الصفحة في متصفح آخر.",
  },
  en: {
    save: "Save contact", whatsapp: "WhatsApp", call: "Call", email: "Email", share: "Share",
    about: "About", services: "Services", contact: "Contact", social: "Follow",
    location: "Location", openMap: "Open in Maps", website: "Website",
    copied: "Link copied", actions: "Quick actions", newTab: "opens in a new tab",
    shareAria: "Share {name}'s card", copyManual: "Copy the link manually", close: "Close",
    qrOpen: "Show QR code", qrTitle: "Scan to save my contact",
    qrHint: "Point your phone camera at the code to open the card, then tap \"Save contact\".",
    qrAria: "QR code that opens {name}'s card", qrLoading: "Preparing the code", qrError: "Couldn't create the code. You can copy the link below.",
    aboutCompany: "About {name}", aboutCompanyDefault: "About the company",
    callAria: "Call {name}", whatsappAria: "Message {name} on WhatsApp",
    emailAria: "Email {name}", socialAria: "{platform} - {name}",
    saveDone: "File ready. Confirm on the screen that appears, or open it from Downloads.",
    saveInApp: "This in-app browser may block downloads. Open this page in Safari or Chrome and try again.",
    saveOpen: "Nothing happened? Open the file", saveShare: "Share the file",
    saveError: "Couldn't create the file. Try again or open this page in another browser.",
  },
};
export const getT = (locale = "ar") => dict[locale] ?? dict.ar;
export const getDir = (locale = "ar") => (locale === "ar" ? "rtl" : "ltr");
export const fmt = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
