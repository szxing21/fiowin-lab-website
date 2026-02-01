import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onUploadMultiple?: (urls: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
}

export function ImageUpload({
  onUpload,
  onUploadMultiple,
  multiple = false,
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const uploadMutation = trpc.upload.uploadImage.useMutation();
  const uploadMultipleMutation = trpc.upload.uploadImages.useMutation();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      if (multiple && files.length > 1) {
        // Upload multiple files
        const fileDataArray = await Promise.all(
          Array.from(files).map(async (file) => {
            const base64 = await fileToBase64(file);
            return {
              file: base64,
              filename: file.name,
              contentType: file.type || "image/jpeg",
            };
          })
        );

        const result = await uploadMultipleMutation.mutateAsync({
          files: fileDataArray,
        });

        if (result.success && onUploadMultiple) {
          onUploadMultiple(result.urls);
          // Show preview of first image
          const firstFile = files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreview(e.target?.result as string);
          };
          reader.readAsDataURL(firstFile);
        }
      } else {
        // Upload single file
        const file = files[0];
        const base64 = await fileToBase64(file);

        const result = await uploadMutation.mutateAsync({
          file: base64,
          filename: file.name,
          contentType: file.type || "image/jpeg",
        });

        if (result.success) {
          onUpload(result.url);
          // Show preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("上传失败，请重试");
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-2">
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled || isLoading}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isLoading}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        {isLoading ? "上传中..." : "选择图片"}
      </Button>
      {preview && (
        <div className="relative w-full max-w-xs">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
