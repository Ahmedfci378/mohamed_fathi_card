import { Phone, Mail, MessageCircle } from "lucide-react";
import { fmt } from "@/lib/i18n";
import ShareButton from "./ShareButton";
import SaveContactButton from "./SaveContactButton";
import QRModal from "./QRModal";

const secondary =
  "tap glass-flat flex flex-col items-center justify-center gap-1.5 rounded-control px-1 py-3 text-xs font-medium text-white/90 " +
  "hover:bg-white/[0.09] active:bg-white/[0.16]";

const primary =
  "tap flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-control " +
  "bg-gradient-to-b from-accent2 to-accent px-6 text-base font-bold text-on-accent " +
  "cta-glow hover:brightness-105 active:brightness-90";

const COLS = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };

export default function ActionBar({ card, t }) {
  const { actions, slug, profile } = card;
  const name = profile.name;
  // Share is always present; the others only exist when their link was built.
  const count = [actions.whatsapp, actions.call, actions.email].filter(Boolean).length + 1;

  return (
    <section aria-label={t.actions} className="rise-soft space-y-3 [animation-delay:0.08s]">
      <SaveContactButton data={card.vcard} slug={slug} t={t} className={primary} />

      <div className={`grid gap-2.5 ${COLS[count]}`}>
        {actions.whatsapp && (
          <a href={actions.whatsapp} target="_blank" rel="noopener noreferrer" className={secondary}
            aria-label={`${fmt(t.whatsappAria, { name })} (${t.newTab})`}>
            <MessageCircle aria-hidden size={20} className="text-accent2" />
            {t.whatsapp}
          </a>
        )}
        {actions.call && (
          <a href={actions.call} className={secondary} aria-label={fmt(t.callAria, { name })}>
            <Phone aria-hidden size={20} className="text-accent2" />
            {t.call}
          </a>
        )}
        {actions.email && (
          <a href={actions.email} className={secondary} aria-label={fmt(t.emailAria, { name })}>
            <Mail aria-hidden size={20} className="text-accent2" />
            {t.email}
          </a>
        )}
        <ShareButton name={name} jobTitle={profile.title} company={profile.company} pageTitle={card.seo?.title} t={t} className={secondary} />
      </div>

      <QRModal name={name} logoSrc={card.qrLogo} t={t} />
    </section>
  );
}
