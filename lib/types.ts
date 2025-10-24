export interface ProcessedDocument {
  id: string
  name: string
  timestamp: Date
  markdown: string
  images: ImageItem[]
  imageMap?: Record<string, string>
}

export interface ImageItem {
  id: string
  url: string
  alt: string
}
