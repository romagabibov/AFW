import React, { useRef, useMemo, useEffect, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import BlotFormatter from 'quill-blot-formatter';
import 'react-quill-new/dist/quill.snow.css'; // Add this to main.tsx or here

if (Quill) {
  Quill.register('modules/blotFormatter', BlotFormatter);
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*,video/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const sessionCountStr = sessionStorage.getItem("uploadCount") || "0";
      const sessionCount = parseInt(sessionCountStr);
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
          alert('Cloudinary not configured correctly');
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.api_key);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);

        const isVideo = file.type.startsWith("video/");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/${isVideo ? "video" : "image"}/upload`, {
          method: "POST",
          body: formData,
        });
        
        const data = await res.json();
        if (data.secure_url) {
          const quill = quillRef.current?.getEditor();
          let range = quill?.getSelection();
          if (!range) {
            // fallback if no selection
            range = { index: quill?.getLength() || 0, length: 0 };
          }
          if (quill && range) {
            quill.insertEmbed(range.index, isVideo ? 'video' : 'image', data.secure_url);
            quill.setSelection({ index: range.index + 1, length: 0 });
          }
        } else {
          alert('Upload failed');
        }
      } catch (err) {
        console.error(err);
        alert('Upload completely failed');
      } finally {
        setIsUploading(false);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, { 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        video: imageHandler, // use same handler for video
      }
    },
    blotFormatter: {}
  }), []);

  return (
    <div className="bg-white relative">
      {mounted && (
        <ReactQuill 
          // @ts-expect-error - react-quill-new types have an issue with ref
          ref={quillRef}
          theme="snow" 
          value={value} 
          onChange={onChange} 
          modules={modules}
        />
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="text-sm uppercase tracking-widest animate-pulse font-medium">Uploading Media...</div>
        </div>
      )}
    </div>
  );
}
