import React, { useCallback, useState } from "react";
import { UploadCloud, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  acceptType?: "image" | "video" | "pdf" | "any";
}

export function ImageUpload({ value, onChange, label, acceptType = "image" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"file" | "url">("file");
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    let isValid = true;
    if (acceptType === "image" && !file.type.startsWith("image/")) isValid = false;
    else if (acceptType === "video" && !file.type.startsWith("video/") && !file.name.toLowerCase().endsWith(".mov")) isValid = false;
    else if (acceptType === "pdf" && file.type !== "application/pdf") isValid = false;

    if (!isValid && acceptType !== "any") {
      alert(`Please upload a valid ${acceptType} file`);
      return;
    }

    const sessionCount = parseInt(sessionStorage.getItem("uploadCount") || "0");
    sessionStorage.setItem("uploadCount", (sessionCount + 1).toString());

    setIsUploading(true);
    try {
      const sigRes = await fetch("/api/admin/cloudinary/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadCount: sessionCount })
      });
      const sigData = await sigRes.json();

      if (!sigData.signature) {
        throw new Error(sigData.error || "Missing signature");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.api_key);
      formData.append("timestamp", sigData.timestamp);
      formData.append("signature", sigData.signature);
      
      const isVideo = file.type.startsWith("video/") || file.name.toLowerCase().endsWith(".mov");
      const isPdf = file.type === "application/pdf";
      let resourceType = "auto";
      if (acceptType === "image" || (acceptType === "any" && file.type.startsWith("image/"))) resourceType = "image";
      if (acceptType === "video" || (acceptType === "any" && isVideo)) resourceType = "video";
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/${resourceType}/upload`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        alert("Upload to Cloudinary failed.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Upload to Cloudinary failed: ${err.message || "Unknown error"}. Please check your Cloudinary API keys.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs uppercase tracking-widest text-gray-500">{label}</label>}
      
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode("file")}
          className={cn("text-xs uppercase tracking-widest px-3 py-1 border transition-colors", mode === "file" ? "bg-black text-white border-black" : "border-black/20 text-gray-500")}
        >
          <UploadCloud size={14} className="inline mr-1" /> File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={cn("text-xs uppercase tracking-widest px-3 py-1 border transition-colors", mode === "url" ? "bg-black text-white border-black" : "border-black/20 text-gray-500")}
        >
          <LinkIcon size={14} className="inline mr-1" /> URL
        </button>
      </div>

      {mode === "file" ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed p-8 flex flex-col items-center justify-center gap-4 transition-colors relative cursor-pointer",
            isDragging ? "border-brand-cyan bg-brand-cyan/5" : "border-black/20 hover:border-black/40 bg-gray-50",
            value ? "h-auto" : "h-48"
          )}
        >
          <input
            type="file"
            accept={acceptType === "image" ? "image/*" : acceptType === "video" ? "video/*" : acceptType === "pdf" ? ".pdf" : "image/*,video/*,.pdf"}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {value && value.trim() !== "" ? (
            <div className="w-full flex justify-center flex-col items-center gap-2">
              {acceptType === "pdf" || value.match(/\.pdf($|\?)/i) ? (
                <div className="text-3xl">📄</div>
              ) : acceptType === "video" || value.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video src={value} className="max-h-48 object-contain" muted playsInline />
              ) : (
                <img src={value || undefined} alt="Preview" className="max-h-48 object-contain" />
              )}
            </div>
          ) : (
            <>
              <UploadCloud size={32} className="text-gray-400" />
              <div className="text-center">
                {isUploading ? (
                  <span className="text-sm font-medium text-gray-600 block animate-pulse">Uploading...</span>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-600 block">Drag & drop a {acceptType === "any" ? "file" : acceptType} here</span>
                    <span className="text-xs text-gray-400 mt-1 block">or click to select</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="border border-black/20 p-3 bg-gray-50 flex-1 w-full"
          />
          {value && value.trim() !== "" && <img src={value || undefined} alt="Preview" className="h-12 w-12 object-cover border border-black/10" />}
        </div>
      )}
    </div>
  );
}
