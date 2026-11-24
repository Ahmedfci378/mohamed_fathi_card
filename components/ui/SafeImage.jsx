"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * next/image that never breaks the layout:
 * - no src, or the file fails to load -> renders `fallback` instead
 * - remote URLs are allowed without configuring domains (served as-is, unoptimized)
 * Callers must give a fixed-size parent (or width/height) so nothing shifts when the image arrives.
 */
export default function SafeImage({ src, alt, fallback = null, ...props }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);

  // An image can fail before React attaches onError (during hydration): check once on mount.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (!src || failed) return fallback;
  return (
    <Image ref={ref} src={src} alt={alt} unoptimized={/^https?:\/\//.test(src)} onError={() => setFailed(true)} {...props} />
  );
}
