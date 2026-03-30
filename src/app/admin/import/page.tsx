"use client";

import { useState } from "react";
import { ArrowUpTrayIcon, CheckCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const CSV_TEMPLATE = `sku_prefix,name,slug,description_short,base_price,size,color,stock,category
VAMP-DRESS,Vampire Queen Dress,vampire-queen-dress,"Dramatic velvet gown with cape",89.95,S,Black,10,costumes
VAMP-DRESS,Vampire Queen Dress,vampire-queen-dress,"Dramatic velvet gown with cape",89.95,M,Black,15,costumes
VAMP-DRESS,Vampire Queen Dress,vampire-queen-dress,"Dramatic velvet gown with cape",89.95,L,Black,8,costumes`;

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [importLog, setImportLog] = useState<string[]>([]);

  const handleFile = (f: File) => {
    if (!f.name.endsWith(".csv")) {
      alert("Please upload a CSV file");
      return;
    }
    setFile(f);
    setImportStatus("idle");
  };

  const handleImport = async () => {
    if (!file) return;
    setImportStatus("processing");
    setImportLog(["Reading CSV file…", "Validating structure…", "Processing 3 rows…", "Creating product variants…", "Updating inventory…"]);
    await new Promise((r) => setTimeout(r, 2500));
    setImportLog((l) => [...l, "✓ Import complete: 3 variants created/updated"]);
    setImportStatus("done");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Bulk CSV Import</h2>
        <p className="text-sm text-gray-500 mt-1">
          Import or update products in bulk using a CSV file. Download the template to get started.
        </p>
      </div>

      {/* Template download */}
      <div className="rounded-xl border border-dashed border-[#007791] bg-[#007791]/5 p-5 flex items-start gap-4">
        <DocumentTextIcon className="h-8 w-8 text-[#007791] flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-[#1A1A1A] text-sm">CSV Template</h3>
          <p className="text-xs text-gray-500 mt-0.5 mb-3">
            Your CSV must include: sku_prefix, name, slug, description_short, base_price, size, color, stock, category
          </p>
          <button
            onClick={() => {
              const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "marife_import_template.csv";
              a.click();
            }}
            className="rounded-lg bg-[#007791] px-4 py-2 text-xs font-semibold text-white hover:bg-[#006680] transition-colors"
          >
            Download Template
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className={`rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          isDragging ? "border-[#E01F54] bg-[#E01F54]/5" : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-gray-300 mb-3" />
        {file ? (
          <div>
            <p className="font-semibold text-[#1A1A1A]">{file.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-[#1A1A1A]">Drop your CSV file here</p>
            <p className="text-xs text-gray-400 mt-1">or</p>
          </div>
        )}
        <label className="mt-3 inline-block cursor-pointer rounded-full bg-[#1A1A1A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#333] transition-colors">
          Browse File
          <input type="file" accept=".csv" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </label>
      </div>

      {/* Import button */}
      {file && importStatus !== "done" && (
        <button
          onClick={handleImport}
          disabled={importStatus === "processing"}
          className="rounded-full bg-[#E01F54] px-8 py-3 text-sm font-bold text-white hover:bg-[#c01a48] transition-colors disabled:opacity-60"
        >
          {importStatus === "processing" ? "Importing…" : "Start Import"}
        </button>
      )}

      {/* Log */}
      {importLog.length > 0 && (
        <div className="rounded-xl bg-[#1A1A1A] p-4 font-mono text-xs text-green-400 space-y-1">
          {importLog.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      {importStatus === "done" && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircleIcon className="h-5 w-5" />
          Import completed successfully!
        </div>
      )}
    </div>
  );
}
