import Section from "./Section";
import { fmt } from "@/lib/i18n";

export default function CompanySection({ brand, t }) {
  if (!brand?.description) return null;
  const title = brand.name ? fmt(t.aboutCompany, { name: brand.name }) : t.aboutCompanyDefault;
  return (
    <Section id="company" title={title}>
      <p className="max-w-[62ch] leading-8 text-white/80">{brand.description}</p>
    </Section>
  );
}
