"use client";
import { useEffect, useId, useRef, useState } from "react";
import { QrCode as QrIcon, X } from "lucide-react";
import { fmt } from "@/lib/i18n";
import { currentCardUrl } from "@/lib/share";
import QrCode from "./QrCode";

/**
 * Trigger + modal. Uses the native <dialog>: focus trap, Esc to close, inert background and
 * focus restore come from the browser. The QR library is loaded only when the modal is opened.
 */
export default function QRModal({ name, logoSrc, t }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [qr, setQr] = useState({ url: "", model: null, failed: false });

  // Lock page scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => { el.style.overflow = prev; };
  }, [open]);

  function show() {
    const d = dialogRef.current;
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", ""); // very old browsers: still visible, just not modal
    setOpen(true);
    setEverOpened(true);
  }
  function hide() {
    const d = dialogRef.current;
    if (typeof d.close === "function") d.close();
    else d.removeAttribute("open");
    setOpen(false);
  }

  async function onOpen() {
    const url = currentCardUrl(); // the page's real URL at this moment: works on any deployment
    show();
    if (qr.model && qr.url === url) return;
    setQr({ url, model: null, failed: false });
    try {
      const { buildQr } = await import("@/lib/qr");
      setQr({ url, model: buildQr(url, { logoRatio: logoSrc ? 0.22 : 0 }), failed: false });
    } catch {
      setQr({ url, model: null, failed: true });
    }
  }

  return (
    <div>
      <button type="button" onClick={onOpen} aria-haspopup="dialog"
        className="tap mx-auto flex w-full items-center justify-center gap-2 rounded-control px-4 text-sm font-medium
          text-accent2 hover:bg-white/[0.06] active:bg-white/[0.1]">
        <QrIcon aria-hidden size={18} />
        {t.qrOpen}
      </button>

      <dialog ref={dialogRef} aria-labelledby={titleId} onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) hide(); }} // click on the dimmed area
        className="m-0 full-dvh max-h-none w-full max-w-none items-end justify-center border-0 bg-transparent p-0 text-white
          open:flex sm:items-center backdrop:bg-black/70 backdrop:backdrop-blur-sm">
        {everOpened && (
        <div className="sheet-in sheet-max w-full max-w-sm overflow-y-auto rounded-t-card border border-white/10
          bg-surface/95 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 text-center backdrop-blur-xl sm:rounded-card sm:pb-6">
          <div className="flex items-start justify-between gap-3">
            <span className="w-11" aria-hidden />
            <div className="pt-2">
              <h2 id={titleId} className="text-lg font-bold text-accent2">{t.qrTitle}</h2>
              <p className="mt-0.5 text-sm text-mist">{name}</p>
            </div>
            <button type="button" onClick={hide} aria-label={t.close}
              className="tap grid h-11 w-11 shrink-0 place-items-center rounded-tile text-mist hover:bg-white/10 active:bg-white/15">
              <X aria-hidden size={20} />
            </button>
          </div>

          {/* White plate = guaranteed contrast. The QR itself carries a 4-module quiet zone; the padding adds more. */}
          <div className="avatar-glow mx-auto mt-4 w-[min(72vw,19rem)] rounded-tile bg-white p-2.5 ring-1 ring-accent/50">
            {qr.model ? (
              <QrCode model={qr.model} label={fmt(t.qrAria, { name })} logoSrc={logoSrc} />
            ) : (
              <div className="aspect-square w-full rounded-[6px] bg-black/[0.06]" role="status">
                <span className="sr-only">{qr.failed ? t.qrError : t.qrLoading}</span>
              </div>
            )}
          </div>

          <p className="mx-auto mt-4 max-w-[30ch] text-sm leading-6 text-white/80">{qr.failed ? t.qrError : t.qrHint}</p>
          {qr.url && <bdi dir="ltr" className="mt-3 block select-all break-all text-xs text-mist">{qr.url}</bdi>}
        </div>
        )}
      </dialog>
    </div>
  );
}
