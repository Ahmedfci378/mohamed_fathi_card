import { MapPin, ExternalLink } from "lucide-react";
import Section from "./Section";

export default function LocationCard({ location, href, t }) {
  if (!href) return null; // no coordinates, Maps URL, or address configured
  return (
    <Section id="location" title={t.location}>
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-tile border border-accent/30 bg-accent/10">
          <MapPin aria-hidden size={19} className="text-accent2" />
        </span>
        <div>
          {location?.label && <p className="font-medium">{location.label}</p>}
          {location?.address && <p className="mt-0.5 text-sm leading-6 text-mist">{location.address}</p>}
        </div>
      </div>
      {/* No iframe: keeps the page fast. A link opens the native Maps app. */}
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-control border border-accent/40 px-4 text-sm font-medium
          text-accent2 hover:bg-accent/10 active:bg-accent/20">
        {t.openMap}
        <ExternalLink aria-hidden size={16} />
        <span className="sr-only">{t.newTab}</span>
      </a>
    </Section>
  );
}
