import qrcode from "qrcode-generator";

// URLs are ASCII, but encode as UTF-8 anyway so any text scans correctly.
if (qrcode.stringToBytesFuncs?.["UTF-8"]) qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];

export const QR_QUIET_ZONE = 4;     // modules of empty margin required by the QR spec
export const MAX_LOGO_RATIO = 0.3;  // logo box side <= 30% of the symbol (~9% of its area)

/**
 * Builds a render-ready QR model: a single SVG path in module units (viewBox 0 0 size size).
 * - Quiet zone is part of the model, so it survives any CSS.
 * - With `logoRatio > 0` the error correction is raised to H and a centred box is left empty
 *   for a logo. That box is capped, so the code stays within what H can recover.
 *
 * @param {string} text
 * @param {{ecc?: "L"|"M"|"Q"|"H", logoRatio?: number}} [opts]
 * @returns {{size:number, modules:number, ecc:string, path:string, logo:null|{x:number,y:number,size:number}}}
 */
export function buildQr(text, { ecc = "M", logoRatio = 0 } = {}) {
  if (!text || typeof text !== "string") throw new Error("buildQr: text is required");
  const level = logoRatio > 0 ? "H" : ecc;
  const qr = qrcode(0, level); // 0 = smallest version that fits
  qr.addData(text, "Byte");
  qr.make();

  const n = qr.getModuleCount();
  const Q = QR_QUIET_ZONE;

  let clear = null;
  if (logoRatio > 0) {
    let side = Math.floor(n * Math.min(logoRatio, MAX_LOGO_RATIO));
    if ((n - side) % 2 !== 0) side -= 1; // keep it exactly centred
    if (side > 0) clear = { start: (n - side) / 2, side };
  }
  const inClear = (r, c) =>
    clear && r >= clear.start && r < clear.start + clear.side && c >= clear.start && c < clear.start + clear.side;

  let path = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; ) {
      if (qr.isDark(r, c) && !inClear(r, c)) {
        let run = 1;
        while (c + run < n && qr.isDark(r, c + run) && !inClear(r, c + run)) run++;
        path += `M${c + Q} ${r + Q}h${run}v1h-${run}z`; // horizontal runs keep the path small
        c += run;
      } else c++;
    }
  }

  return {
    size: n + 2 * Q, modules: n, ecc: level, path,
    logo: clear ? { x: clear.start + Q, y: clear.start + Q, size: clear.side } : null,
  };
}
