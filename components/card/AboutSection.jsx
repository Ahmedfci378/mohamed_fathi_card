import Section from "./Section";
export default function AboutSection({ text, t }) {
  if (!text) return null;
  return (
    <Section id="about" title={t.about}>
      <p className="max-w-[62ch] leading-8 text-white/80">{text}</p>
    </Section>
  );
}
