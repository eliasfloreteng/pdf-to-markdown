"use client"

import { useState } from "react"
import { Copy, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageWithActionsProps {
  src: string
  alt: string
  className?: string
}

export function ImageWithActions({
  src,
  alt,
  className = "",
}: ImageWithActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyImage = async () => {
    try {
      // Convert base64 data URL to blob
      const response = await fetch(src)
      const blob = await response.blob()

      // Clipboard API only supports PNG for images, so convert if needed
      let blobToCopy = blob
      if (blob.type !== "image/png") {
        // Convert to PNG using canvas
        const img = new Image()
        img.src = src
        await new Promise((resolve) => {
          img.onload = resolve
        })

        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0)

        blobToCopy = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/png")
        })
      }

      // Copy PNG blob to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blobToCopy,
        }),
      ])

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy image:", error)
      // Fallback to copying the URL
      await navigator.clipboard.writeText(src)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadImage = () => {
    const a = window.document.createElement("a")
    a.href = src
    // Remove any existing extension from alt and add appropriate one
    const cleanAlt = alt.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "")
    // Detect image type from data URL
    const imageType = src.match(/data:image\/(\w+);/)?.[1] || "png"
    a.download = `${cleanAlt || "image"}.${imageType}`
    a.click()
  }

  return (
    <span className="group relative inline-block rounded-lg overflow-hidden">
      <img src={src} alt={alt} className={className} />
      <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCopyImage}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleDownloadImage}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </span>
    </span>
  )
}
