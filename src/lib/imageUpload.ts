/** True when src is an inline data URL for an image (from uploads). */
export function isDataImageUrl(src: string | undefined | null): boolean {
  return typeof src === "string" && src.startsWith("data:image/");
}

/**
 * Read an image file, resize to fit within max dimensions, return JPEG or PNG data URL.
 */
export function resizeImageToDataUrl(
  file: File,
  maxWidth: number,
  maxHeight: number,
  jpegQuality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new globalThis.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w < 1 || h < 1) {
        reject(new Error("Invalid image dimensions"));
        return;
      }
      if (w > maxWidth || h > maxHeight) {
        const r = Math.min(maxWidth / w, maxHeight / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unsupported"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        const usePng = file.type === "image/png" || file.type === "image/webp" || file.type === "image/gif";
        const mime = usePng ? "image/png" : "image/jpeg";
        const out = usePng
          ? canvas.toDataURL("image/png")
          : canvas.toDataURL("image/jpeg", jpegQuality);
        resolve(out);
      } catch {
        reject(new Error("Encode failed"));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Load failed"));
    };
    img.src = objectUrl;
  });
}
