"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

type UploadResponse = { public_id: string; secure_url: string; resource_type: "image" | "video"; format: string; bytes: number; width?: number; height?: number; duration?: number; original_filename?: string };
const maxImageBytes = 20 * 1024 * 1024;
const maxVideoBytes = 500 * 1024 * 1024;

export function CloudinaryUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return setStatus("Choose an image or video first.");
    if (!alt.trim()) return setStatus("Alt text is required.");
    const resourceType = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : "";
    if (!resourceType) return setStatus("Only image and video files are supported.");
    if (file.size > (resourceType === "video" ? maxVideoBytes : maxImageBytes)) return setStatus(`File is too large. Maximum: ${resourceType === "video" ? "500 MB" : "20 MB"}.`);
    setBusy(true); setStatus("Preparing secure upload...");
    try {
      const signatureResponse = await fetch("/api/media/cloudinary/signature", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ resourceType }) });
      const signature = await signatureResponse.json() as { uploadUrl?: string; signature?: string; apiKey?: string; timestamp?: number; folder?: string; uploadPreset?: string; error?: string };
      if (!signatureResponse.ok || !signature.uploadUrl || !signature.signature || !signature.apiKey || !signature.timestamp || !signature.folder || !signature.uploadPreset) throw new Error(signature.error || "Could not prepare upload");
      const form = new FormData(); form.set("file", file); form.set("api_key", signature.apiKey); form.set("timestamp", String(signature.timestamp)); form.set("signature", signature.signature); form.set("upload_preset", signature.uploadPreset); form.set("folder", signature.folder);
      setStatus("Uploading directly to Cloudinary...");
      const uploadResponse = await fetch(signature.uploadUrl, { method: "POST", body: form });
      const uploaded = await uploadResponse.json() as UploadResponse & { error?: { message?: string } };
      if (!uploadResponse.ok || !uploaded.public_id || !uploaded.secure_url) throw new Error(uploaded.error?.message || "Cloudinary upload failed");
      setStatus("Saving media metadata...");
      const completeResponse = await fetch("/api/media/cloudinary/complete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ publicId: uploaded.public_id, secureUrl: uploaded.secure_url, resourceType: uploaded.resource_type, format: uploaded.format, bytes: uploaded.bytes, width: uploaded.width, height: uploaded.height, duration: uploaded.duration, originalFilename: uploaded.original_filename, alt: alt.trim() }) });
      const completed = await completeResponse.json() as { error?: string };
      if (!completeResponse.ok) throw new Error(completed.error || "Could not save media metadata");
      router.push("/admin/collections/media");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Upload failed"); } finally { setBusy(false); }
  }

  return <form onSubmit={submit} style={{ display: "grid", gap: "0.65rem", maxWidth: "42rem", marginBottom: "1.5rem", padding: "1rem", border: "1px solid var(--theme-elevation-150)", borderRadius: "4px" }}><strong>Cloudinary upload</strong><label>File<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime" disabled={busy} onChange={(event) => setFile(event.target.files?.[0] || null)} /></label><label>Alt text<input type="text" value={alt} maxLength={500} disabled={busy} onChange={(event) => setAlt(event.target.value)} placeholder="Describe this media" required /></label><button type="submit" disabled={busy}>{busy ? "Uploading…" : "Upload to Cloudinary"}</button>{status && <p role="status" aria-live="polite">{status}</p>}</form>;
}
