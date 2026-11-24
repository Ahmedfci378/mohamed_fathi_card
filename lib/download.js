const VCARD_TYPE = "text/vcard";

/** Create the in-memory file. Nothing is uploaded anywhere. */
export function makeVCardFile(text, fileName) {
  const blob = new Blob([text], { type: `${VCARD_TYPE};charset=utf-8` });
  const file = typeof File === "function" ? new File([blob], fileName, { type: VCARD_TYPE }) : null;
  return { blob, file, url: URL.createObjectURL(blob) };
}

export function triggerDownload(url, fileName) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Instagram / Facebook / TikTok / LINE / WeChat etc. often block downloads. */
export function isInAppBrowser() {
  return /FBAN|FBAV|Instagram|Snapchat|TikTok|musical_ly|Line\/|MicroMessenger|Twitter/i.test(navigator.userAgent);
}

export function canShareFile(file) {
  try {
    return !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
  } catch {
    return false;
  }
}
