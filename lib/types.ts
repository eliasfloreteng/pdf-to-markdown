export interface ProcessedDocument {
  id: string
  name: string
  timestamp: Date
  markdown: string
  images: ImageItem[]
}

export interface ImageItem {
  id: string
  url: string
  alt: string
}
