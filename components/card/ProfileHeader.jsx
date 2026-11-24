import SafeImage from "@/components/ui/SafeImage";

function initials(name = "") {
  return name.replace(/^(د\.|dr\.?)\s*/i, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
}

// Fixed boxes = no layout shift. Image intrinsic size is 2x for sharp screens.
const SHAPES = {
  arch:   { box: "h-[148px] w-[118px]", round: "rounded-t-[999px] rounded-b-card", w: 236, h: 296, sizes: "118px" },
  circle: { box: "h-[132px] w-[132px]",  round: "rounded-full",                     w: 264, h: 264, sizes: "132px" },
};

export default function ProfileHeader({ profile, brand, avatarShape = "arch" }) {
  const { name, title, bio, photo, photoAlt } = profile;
  const shape = SHAPES[avatarShape] ?? SHAPES.arch;
  const hasLogo = !!brand?.logo;

  return (
    <header className="rise-soft flex flex-col items-center text-center">
      {/* Gradient ring + soft glow, both from the theme accent */}
      <div className={`avatar-glow bg-gradient-to-b from-accent2 via-accent to-accent-deep/30 p-[1.5px] ${shape.round}`}>
        <div className={`grid place-items-center overflow-hidden bg-surface ${shape.box} ${shape.round}`}>
          <SafeImage
            src={photo} alt={photoAlt || name} width={shape.w} height={shape.h} sizes={shape.sizes} priority
            className="h-full w-full object-cover"
            fallback={<span aria-hidden className="accent-text text-4xl font-bold">{initials(name)}</span>}
          />
        </div>
      </div>

      <h1 className="mt-5 text-balance text-[1.75rem] font-bold leading-tight tracking-tight">{name}</h1>
      {title && <p className="mt-1.5 text-balance text-base font-medium text-accent2">{title}</p>}

      {/* Brand: logo tile + name. With no logo, just the name; the layout stays balanced. */}
      {(hasLogo || brand?.name) && (
        <div className={`flex items-center justify-center gap-2.5 text-mist ${hasLogo ? "mt-3" : "mt-0.5"}`}>
          {hasLogo && (
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-tile border border-white/10 bg-white/[0.06] p-1.5">
              <SafeImage
                src={brand.logo} alt={brand.name ? "" : brand.logoAlt} width={80} height={80} sizes="40px"
                className="h-full w-full object-contain"
                fallback={<span aria-hidden className="accent-text text-base font-bold">{brand.initial}</span>}
              />
            </span>
          )}
          {brand?.name && <p className="text-sm">{brand.name}</p>}
        </div>
      )}

      {bio && <p className="mt-4 max-w-[34ch] text-[0.95rem] leading-7 text-white/80">{bio}</p>}
    </header>
  );
}
