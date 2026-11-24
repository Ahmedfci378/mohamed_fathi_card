import Section from "./Section";
export default function ServicesSection({ items, t }) {
  if (!items?.length) return null;
  return (
    <Section id="services" title={t.services}>
      <ul className="divide-y divide-white/10">
        {items.map((s, i) => (
          <li key={`${i}-${s.title}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
            <div>
              <h3 className="font-medium">{s.title}</h3>
              {s.description && <p className="mt-0.5 text-sm leading-6 text-mist">{s.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
