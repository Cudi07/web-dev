"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "~/utils/uploadthing";
import { toast } from "sonner";

interface FileUploadProps {
  onUploadComplete?: () => void;
  metadata?: {
    documentType?: string;
    purpose?: string;
    status?: string;
    requestType?: string;
  };
}

export function FileUpload({ onUploadComplete, metadata }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing("documentUploader");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      try {
        setIsUploading(true);
        const defaultMetadata = {
          fullName: "",
          address: "",
          documentType: metadata?.documentType ?? "",
          purpose: metadata?.purpose ?? "",
          email: "",
          phone: "",
          requestType: metadata?.requestType ?? "document",
          status: metadata?.status ?? "approved",
        };
        const res = await startUpload(acceptedFiles, defaultMetadata);
        if (res?.[0]) {
          toast.success("Document uploaded successfully!");
          onUploadComplete?.();
        } else {
          toast.error("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="mt-1 cursor-pointer rounded-md border-2 border-dashed border-gray-400 p-4 text-center"
    >
      <input {...getInputProps()} />
      <p>Upload Here</p>
      <p className="mt-1 text-sm text-gray-500">
        Supported formats: Images (PNG, JPG, GIF) and PDF
      </p>
      {isUploading && (
        <div className="mt-4 text-sm text-gray-500">
          Uploading...
        </div>
      )}
    </div>
  );
} 