
import { Phone, Mail, Globe, MessageCircle } from "lucide-react";
import Section from "./Section";

function Row({ icon: Icon, label, value, href, external, newTab }) {
  return (
    <li>
      <a
        href={href}
        {...(external && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        className="tap -mx-2 flex items-center gap-3 rounded-control px-2 py-2 hover:bg-white/[0.05] active:bg-white/[0.09]"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-tile border border-accent/30 bg-accent/10">
          <Icon aria-hidden size={19} className="text-accent2" />
        </span>

        <span className="min-w-0">
          <span className="block text-xs text-mist">{label}</span>
          <bdi dir="ltr" className="block truncate text-[0.95rem] text-white/90">
            {value}
          </bdi>
          {external && <span className="sr-only">{newTab}</span>}
        </span>
      </a>
    </li>
  );
}

export default function ContactList({ actions, t }) {
  const { call, whatsapp, email, website, display } = actions;

  if (!call && !whatsapp && !email && !website) return null;

  return (
    <Section id="contact" title={t.contact}>
      <address className="not-italic">
        <ul className="space-y-1">
          {call && (
            <Row icon={Phone} label={t.call} value={display.phone} href={call} />
          )}

          {whatsapp && (
            <Row
              icon={MessageCircle}
              label="WhatsApp"
              value={display.phone}
              href={whatsapp}
              external
              newTab={t.newTab}
            />
          )}

          {email && (
            <Row icon={Mail} label={t.email} value={display.email} href={email} />
          )}

          {website && (
            <Row
              icon={Globe}
              label={t.website}
              value={display.website}
              href={website}
              external
              newTab={t.newTab}
            />
          )}
        </ul>
      </address>
    </Section>
  );
}
