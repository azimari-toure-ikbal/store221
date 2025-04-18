"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import React from "react";
import { toast } from "sonner";

type FileUploadProps = {
  disabled?: boolean;
  onMultipleChange?: (
    files: {
      url: string;
      name: string;
    }[],
  ) => void;
  onChange?: (url?: string) => void;
  endPoint: keyof typeof ourFileRouter;
};

const FileUpload: React.FC<FileUploadProps> = ({
  endPoint,
  onChange,
  onMultipleChange,
  disabled,
}) => {
  return (
    <UploadDropzone
      config={{ mode: "auto" }}
      disabled={disabled}
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        if (onChange) {
          onChange(res?.[0].url);
        }

        if (onMultipleChange) {
          onMultipleChange(
            res.map((file) => {
              return {
                name: file.name,
                url: file.url,
              };
            }),
          );
        }
      }}
      onUploadError={(err) => {
        if (err.code === "FILE_LIMIT_EXCEEDED") {
          toast.error("Vous avez dépassé la limite de fichiers");
          return;
        }

        if (err.code === "TOO_LARGE") {
          toast.error("Le ou les fichiers sont trop volumineux");
          return;
        }

        if (err.code === "TOO_MANY_FILES") {
          toast.error("Vous ne pouvez pas ajouter plus de fichiers");
          return;
        }

        if (err.message.includes("FileCountMismatch")) {
          toast.error("Vous ne pouvez pas ajouter plus de fichiers");
          return;
        }

        toast.error(err?.message);
      }}
    />
  );
};

export default FileUpload;
