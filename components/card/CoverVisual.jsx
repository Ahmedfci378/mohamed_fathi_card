import SafeImage from "@/components/ui/SafeImage";

/** Optional decorative backdrop. Fixed height, so it never shifts the layout; hidden if it fails. */
export default function CoverVisual({ src }) {
  if (!src) return null;
  return (
    <div aria-hidden className="cover-fade pointer-events-none absolute inset-x-0 top-0 h-[340px] overflow-hidden">
      <SafeImage src={src} alt="" fill quality={60} loading="eager" fetchPriority="low"
        sizes="(min-width: 1024px) 1280px, 100vw" className="object-cover opacity-40" />
    </div>
  );
}
