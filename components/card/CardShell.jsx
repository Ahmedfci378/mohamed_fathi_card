import { getT, getDir } from "@/lib/i18n";
import ProfileHeader from "./ProfileHeader";
import ActionBar from "./ActionBar";
import CoverVisual from "./CoverVisual";
import AboutSection from "./AboutSection";
import CompanySection from "./CompanySection";
import ServicesSection from "./ServicesSection";
import ContactList from "./ContactList";
import SocialLinks from "./SocialLinks";
import LocationCard from "./LocationCard";

/**
 * Page frame + layout. Mobile: one column. lg: profile/actions stay pinned
 * on one side, content sections flow on the other.
 */
export default function CardShell({ card }) {
  const t = getT(card.locale);
  const { actions, profile, brand, theme } = card;
  return (
    <div dir={getDir(card.locale)} className="relative fill-dvh overflow-x-clip">
      {/* Theme variables for this card (validated in lib/theme.js, contains only numbers/hex-derived values) */}
      <style>{theme.css}</style>

      <CoverVisual src={card.cover} />
      <div aria-hidden className="ambient pointer-events-none absolute inset-x-0 top-0 h-[520px]" />

      <main className="safe-x relative mx-auto w-full max-w-md pb-[max(2rem,env(safe-area-inset-bottom))]
        pt-[max(2.5rem,env(safe-area-inset-top))] [overflow-wrap:anywhere] sm:max-w-lg lg:max-w-5xl lg:pt-16">
        <div className="lg:grid lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="space-y-6 lg:sticky lg:top-12">
            <ProfileHeader profile={profile} brand={brand} avatarShape={theme.avatarShape} />
            <ActionBar card={card} t={t} />
          </div>

          <div className="stagger mt-8 space-y-5 lg:mt-0">
            <AboutSection text={card.about} t={t} />
            <CompanySection brand={brand} t={t} />
            <ServicesSection items={card.services} t={t} />
            <ContactList actions={actions} t={t} />
            <SocialLinks items={actions.socials} name={profile.name} t={t} />
            <LocationCard location={card.location} href={actions.map} t={t} />
          </div>
        </div>
      </main>
    </div>
  );
}
