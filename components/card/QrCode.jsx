// Pure SVG renderer for a model from lib/qr.js. Scales to any width, no raster blur.
// Colours are fixed (dark on white) on purpose: scanners need high contrast, so the theme never touches them.
const DARK = "#0b0f17";
const LIGHT = "#ffffff";

export default function QrCode({ model, label, logoSrc }) {
  const { size, path, logo } = model;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} shapeRendering="crispEdges" className="block h-auto w-full">
      <rect width={size} height={size} fill={LIGHT} />
      <path d={path} fill={DARK} />
      {logo && logoSrc && (
        <>
          <rect x={logo.x} y={logo.y} width={logo.size} height={logo.size} fill={LIGHT} />
          <image href={logoSrc} x={logo.x + logo.size * 0.1} y={logo.y + logo.size * 0.1}
            width={logo.size * 0.8} height={logo.size * 0.8} preserveAspectRatio="xMidYMid meet" />
        </>
      )}
    </svg>
  );
}
