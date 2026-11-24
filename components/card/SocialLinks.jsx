import { Instagram, Linkedin, Facebook, Twitter, Youtube } from "lucide-react";
import Section from "./Section";
import { fmt } from "@/lib/i18n";

// lucide-react is pinned to 0.469 because it still ships brand icons.
// Later, swap these for small inline SVGs (as planned in the architecture).
const ICONS = { linkedin: Linkedin, facebook: Facebook, instagram: Instagram, youtube: Youtube, x: Twitter };

/** `items` come from lib/actions.js: already validated, ordered, and empty when nothing is configured. */
export default function SocialLinks({ items, name, t }) {
  if (!items?.length) return null;
  return (
    <Section id="social" title={t.social}>
      <ul className="flex flex-wrap gap-3">
        {items.map((s) => {
          const Icon = ICONS[s.platform];
          return (
            <li key={s.platform}>
              <a href={s.url} target="_blank" rel="noopener noreferrer"
                aria-label={`${fmt(t.socialAria, { platform: s.label, name })} (${t.newTab})`}
                className="tap grid h-12 w-12 place-items-center rounded-control border border-white/10 bg-white/[0.05]
                  hover:border-accent/50 hover:bg-accent/10 active:bg-accent/20">
                <Icon aria-hidden size={21} className="text-accent2" />
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
