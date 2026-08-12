"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Link } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  value: string;           // current image URL
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  label?: string;
  hint?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "marqet",
  label = "Image",
  hint,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        onChange(data.data.url, data.data.publicId);
        toast.success("Image uploaded!");
      } else {
        toast.error(data.error ?? "Upload failed");
      }
    } catch {
      toast.error("Upload failed. Check your connection.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    // Simulate file input change
    const dt = new DataTransfer();
    dt.items.add(file);
    if (inputRef.current) {
      inputRef.current.files = dt.files;
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function handleUrlSave() {
    if (!urlInput.trim()) { toast.error("Enter a valid URL"); return; }
    onChange(urlInput.trim());
  }

  function handleRemove() {
    onChange("");
    setUrlInput("");
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-neutral-700">
        {label}
        {hint && <span className="ml-1 text-xs text-neutral-400 font-normal">({hint})</span>}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-lg border border-neutral-200 overflow-hidden text-sm">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2 font-medium transition-colors ${
            tab === "upload" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          <Upload size={13} />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2 font-medium transition-colors ${
            tab === "url" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          <Link size={13} />
          Paste URL
        </button>
      </div>

      {/* Upload tab */}
      {tab === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-6 cursor-pointer hover:border-neutral-400 hover:bg-neutral-100 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-neutral-400" />
              <p className="text-sm text-neutral-500">Uploading...</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200">
                <ImageIcon size={20} className="text-neutral-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-700">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  JPG, PNG, WebP, GIF — Max 5MB
                </p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}

      {/* URL tab */}
      {tab === "url" && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSave()}
            placeholder="https://example.com/image.jpg"
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
          />
          <button
            type="button"
            onClick={handleUrlSave}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
}
