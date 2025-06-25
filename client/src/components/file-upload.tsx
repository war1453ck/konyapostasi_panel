import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  className?: string;
}

export function FileUpload({ 
  onFileUpload, 
  accept = { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }, 
  maxFiles = 1, 
  className 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileUpload(acceptedFiles);
    setIsDragOver(false);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false)
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "file-upload-zone",
        isDragActive && "dragover",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <i className="fas fa-cloud-upload-alt text-3xl text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {isDragActive
            ? "Dosyaları buraya bırakın..."
            : "Dosyaları buraya sürükleyin veya seçmek için tıklayın"
          }
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Maksimum {maxFiles} dosya
        </p>
      </div>
    </div>
  );
}
