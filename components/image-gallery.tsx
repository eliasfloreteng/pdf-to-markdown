"use client"

import { useState } from "react"
import { Copy, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImageItem {
  id: string
  url: string
  alt: string
}

interface ImageGalleryProps {
  images: ImageItem[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyImage = async (image: ImageItem) => {
    // In a real implementation, this would copy the image to clipboard
    await navigator.clipboard.writeText(image.url)
    setCopiedId(image.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDownloadImage = (image: ImageItem) => {
    const a = window.document.createElement("a")
    a.href = image.url
    a.download = `image-${image.id}.png`
    a.click()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative rounded-lg overflow-hidden border border-border bg-card"
        >
          <div className="aspect-video relative bg-muted">
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleCopyImage(image)}
              className="gap-2"
            >
              {copiedId === image.id ? (
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
              onClick={() => handleDownloadImage(image)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>

          <div className="p-3">
            <p className="text-sm text-muted-foreground truncate">
              {image.alt}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
