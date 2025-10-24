"use client"

import Image from "next/image"
import { ImageWithActions } from "./image-with-actions"

interface ImageItem {
  id: string
  url: string
  alt: string
}

interface ImageGalleryProps {
  images: ImageItem[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="rounded-lg overflow-hidden border border-border bg-card"
        >
          <div className="aspect-video relative bg-muted">
            <ImageWithActions
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
              className="object-cover w-full h-full"
            />
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
