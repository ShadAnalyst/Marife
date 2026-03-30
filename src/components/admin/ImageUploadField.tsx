"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { resizeImageToDataUrl, isDataImageUrl } from "@/lib/imageUpload";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  description?: string;
  className?: string;
};

const MAX_FILE_BYTES = 14 * 1024 * 1024;

export function ImageUploadField({ label, value, onChange, description, className }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("File is too large (max 14 MB).");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 1600, 1600, 0.82);
      onChange(dataUrl);
    } catch {
      setError("Could not process this image.");
    } finally {
      setBusy(false);
    }
  };

  const urlValue = isDataImageUrl(value) ? "" : value;

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {description && <p className="text-xs text-gray-400 -mt-0.5">{description}</p>}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative h-32 w-32 rounded-xl border border-gray-200 bg-[#F7F7F7] overflow-hidden flex-shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[11px] text-gray-400 text-center px-2">
              No image yet
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-3 w-full">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              void handleFile(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="rounded-full border-2 border-[#007791] px-5 py-2 text-sm font-semibold text-[#007791] hover:bg-[#007791] hover:text-white transition-colors disabled:opacity-50"
            >
              {busy ? "Processing…" : "Choose image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-gray-400">JPG, PNG, WebP or GIF. Large files are resized for browser storage.</p>
          <div>
            <label className="text-xs font-medium text-gray-500">Or paste image URL</label>
            <input
              type="url"
              value={urlValue}
              onChange={(e) => onChange(e.target.value.trim())}
              placeholder="https://…"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
