"use client";
import { useEffect, useRef, useState } from "react";
import { UserPlus } from "lucide-react";
import { buildVCard, vcardFileName } from "@/lib/vcard";
import { makeVCardFile, triggerDownload, isInAppBrowser, canShareFile } from "@/lib/download";

export default function SaveContactButton({ data, slug, className, t }) {
  const [status, setStatus] = useState("idle"); // idle | done | error
  const [fileUrl, setFileUrl] = useState(null);
  const [shareable, setShareable] = useState(false);
  const [inApp, setInApp] = useState(false);
  const fileRef = useRef(null);
  const timer = useRef(null);

  const release = () => {
    clearTimeout(timer.current);
    if (fileUrl) URL.revokeObjectURL(fileUrl);
  };
  useEffect(() => release, []); // eslint-disable-line react-hooks/exhaustive-deps

  function onSave() {
    try {
      release();
      const name = vcardFileName(slug);
      const { file, url } = makeVCardFile(buildVCard(data), name);
      fileRef.current = file;
      setFileUrl(url);
      setShareable(canShareFile(file));
      setInApp(isInAppBrowser());
      triggerDownload(url, name);
      setStatus("done");
      timer.current = setTimeout(() => URL.revokeObjectURL(url), 5 * 60 * 1000);
    } catch (e) {
      console.warn("vCard failed", e);
      setStatus("error");
    }
  }

  async function onShareFile() {
    try {
      await navigator.share({ files: [fileRef.current], title: data.fullName });
    } catch (e) {
      if (e?.name !== "AbortError") setStatus("error");
    }
  }

  const link = "inline-flex min-h-[44px] items-center underline underline-offset-4 text-accent2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent2";

  return (
    <div>
      <button type="button" onClick={onSave} className={className}>
        <UserPlus aria-hidden size={20} strokeWidth={2.2} />
        {t.save}
      </button>

      <div role="status" aria-live="polite" className={status === "idle" ? "" : "mt-3 text-center text-xs leading-6 text-mist"}>
        {status === "done" && (
          <>
            <p>{inApp ? t.saveInApp : t.saveDone}</p>
            <p className="mt-1 flex flex-wrap justify-center gap-x-4">
              <a href={fileUrl} target="_blank" rel="noopener" className={link}>{t.saveOpen}</a>
              {shareable && <button type="button" onClick={onShareFile} className={link}>{t.saveShare}</button>}
            </p>
          </>
        )}
        {status === "error" && <p>{t.saveError}</p>}
      </div>
    </div>
  );
}
