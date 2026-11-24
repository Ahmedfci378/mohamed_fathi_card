"use client";
import { useEffect, useRef, useState } from "react";
import { Share2, X } from "lucide-react";
import { fmt } from "@/lib/i18n";
import { currentCardUrl, shareOrCopy } from "@/lib/share";

export default function ShareButton({ name, jobTitle, company, pageTitle, t, className }) {
  const [view, setView] = useState({ kind: "idle", url: "" }); // idle | copied | manual
  const busy = useRef(false);
  const timer = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (view.kind === "manual") inputRef.current?.select(); }, [view]);

  async function onShare() {
    if (busy.current) return; // a second tap while the sheet is open would throw InvalidStateError
    busy.current = true;
    clearTimeout(timer.current);
    try {
      const url = currentCardUrl();
      const text = [name, [jobTitle, company].filter(Boolean).join(" - ")].filter(Boolean).join("\n");
      const result = await shareOrCopy({ title: pageTitle || name, text, url });

      if (result === "copied") {
        setView({ kind: "copied", url });
        timer.current = setTimeout(() => setView({ kind: "idle", url: "" }), 2200);
      } else if (result === "manual") {
        setView({ kind: "manual", url });
      }
      // "shared" and "cancelled": nothing to show.
    } finally {
      busy.current = false;
    }
  }

  const box = "fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-20 mx-auto w-fit rounded-full border border-accent/40 bg-surface/95";

  return (
    <>
      <button type="button" onClick={onShare} className={className} aria-label={fmt(t.shareAria, { name })}>
        <Share2 aria-hidden size={20} className="text-accent2" />
        {t.share}
      </button>

      {/* Success message: polite live region, no focus change */}
      <p role="status" aria-live="polite"
        className={`${box} px-5 py-2.5 text-sm text-accent2 transition-[transform,opacity] duration-300 ${
          view.kind === "copied" ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
        {view.kind === "copied" ? t.copied : ""}
      </p>

      {/* Last resort when neither sharing nor clipboard is possible: show the link to copy by hand */}
      {view.kind === "manual" && (
        <div role="group" aria-label={t.copyManual}
          className={`${box} flex w-[min(92vw,24rem)] items-center gap-2 !rounded-control p-2 ps-3 focus-within:border-accent2`}>
          <input ref={inputRef} readOnly dir="ltr" value={view.url} aria-label={t.copyManual}
            onFocus={(e) => e.target.select()}
            className="min-w-0 flex-1 bg-transparent text-base text-white/90 outline-none" />
          <button type="button" aria-label={t.close} onClick={() => setView({ kind: "idle", url: "" })}
            className="tap grid h-11 w-11 shrink-0 place-items-center rounded-tile text-mist hover:bg-white/10 active:bg-white/15">
            <X aria-hidden size={18} />
          </button>
        </div>
      )}
    </>
  );
}
