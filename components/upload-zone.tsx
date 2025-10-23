"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, FileText, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void
}

export function UploadZone({ onFilesSelected }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type === "application/pdf" || file.type.startsWith("image/")
      )

      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [onFilesSelected]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [onFilesSelected]
  )

  return (
    <div className="w-full max-w-2xl">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200",
          isDragging
            ? "border-accent bg-accent/10 scale-[1.02]"
            : "border-border hover:border-accent/50 hover:bg-accent/5"
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="sr-only"
          accept=".pdf,image/*"
          multiple
          onChange={handleFileInput}
        />

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
              isDragging
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-2">
            Drop your files here
          </h3>

          <p className="text-muted-foreground mb-6 text-center">
            or click to browse from your computer
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Images</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span>Multiple files supported</span>
          </div>
        </label>

        {isDragging && (
          <div className="absolute inset-0 rounded-2xl bg-accent/5 pointer-events-none" />
        )}
      </div>
    </div>
  )
}
