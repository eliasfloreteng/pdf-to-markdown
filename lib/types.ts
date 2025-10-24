export interface ProcessedDocument {
  id: string
  name: string
  timestamp: Date
  markdown: string
  images: ImageItem[]
  imageMap?: Record<string, string>
  pageCount?: number
  fileSize?: number
}

export interface ImageItem {
  id: string
  url: string
  alt: string
}
