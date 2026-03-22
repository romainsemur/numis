"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  currentUrl: string | null;
  userId: string;
  onUploaded: (url: string | null) => void;
}

export default function ImageUpload({
  currentUrl,
  userId,
  onUploaded,
}: ImageUploadProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("coin-images")
      .upload(path, file, { upsert: true });

    if (!error) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("coin-images").getPublicUrl(path);
      setPreview(publicUrl);
      onUploaded(publicUrl);
    }

    setUploading(false);
  }

  function handleRemove() {
    setPreview(null);
    onUploaded(null);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Photo
      </label>
      {preview ? (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Apercu"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700"
          >
            &times;
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-400 transition-colors">
          <div className="text-center">
            {uploading ? (
              <span className="text-sm text-gray-400">Envoi...</span>
            ) : (
              <>
                <span className="text-2xl text-gray-300 block">+</span>
                <span className="text-xs text-gray-400">Ajouter une photo</span>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
